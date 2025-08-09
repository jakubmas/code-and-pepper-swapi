import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { graphqlClient } from '@/config/graphql-client'
import { GET_BATTLE_HISTORY } from '@/graphql/queries'

type BattleResult = {
  id: string
  winner: string
  resourceType: string
  players: Array<{
    id: number
    name: string
    value: string
  }>
  createdAt: string
}

type BattleHistoryResponse = {
  items: BattleResult[]
  pageInfo: {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    totalCount: number
  }
}

export function Results() {
  const [page, setPage] = useState(1)
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('')
  const [winnerFilter, setWinnerFilter] = useState<string>('')
  const limit = 10

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['battleHistory', page, resourceTypeFilter, winnerFilter],
    queryFn: async () => {
      const variables = {
        page,
        limit,
        ...(resourceTypeFilter && { resourceType: resourceTypeFilter }),
        ...(winnerFilter && { winner: winnerFilter }),
      }
      
      const response = await graphqlClient.request<{ getBattleHistory: BattleHistoryResponse }>(
        GET_BATTLE_HISTORY,
        variables
      )
      return response.getBattleHistory
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    refetchOnMount: true, // Refetch when component first mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  })


  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleResourceTypeChange = (value: string) => {
    setResourceTypeFilter(value)
    setPage(1) // Reset to first page when filtering
  }

  const handleWinnerChange = (value: string) => {
    setWinnerFilter(value)
    setPage(1) // Reset to first page when filtering
  }

  const clearFilters = () => {
    setResourceTypeFilter('')
    setWinnerFilter('')
    setPage(1)
  }

  const getWinnerColor = (winner: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (winner) {
      case 'player': return 'success'
      case 'computer': return 'error'
      case 'draw': return 'warning'
      default: return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading battle history. Please try again.
        <Button onClick={() => refetch()} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Battle History
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Resource Type</InputLabel>
            <Select
              value={resourceTypeFilter}
              label="Resource Type"
              onChange={(e) => handleResourceTypeChange(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="people">People</MenuItem>
              <MenuItem value="starships">Starships</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Winner</InputLabel>
            <Select
              value={winnerFilter}
              label="Winner"
              onChange={(e) => handleWinnerChange(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="player">Player</MenuItem>
              <MenuItem value="computer">Computer</MenuItem>
              <MenuItem value="draw">Draw</MenuItem>
            </Select>
          </FormControl>

          <Button 
            variant="outlined" 
            size="small" 
            onClick={clearFilters}
            disabled={!resourceTypeFilter && !winnerFilter}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Statistics */}
      {data && (
        <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Statistics
          </Typography>
          <Typography variant="body1">
            Total Battles: <strong>{data.pageInfo.totalCount}</strong>
            {(resourceTypeFilter || winnerFilter) && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                (filtered results)
              </Typography>
            )}
          </Typography>
        </Paper>
      )}

      {/* Battle History Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date/Time</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Player</TableCell>
              <TableCell align="center">VS</TableCell>
              <TableCell>Computer</TableCell>
              <TableCell align="center">Winner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 4 }}>
                    No battles found
                    {(resourceTypeFilter || winnerFilter) && ' with current filters'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data?.items.map((battle) => (
                <TableRow key={battle.id} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(battle.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={battle.resourceType.charAt(0).toUpperCase() + battle.resourceType.slice(1)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {battle.players[0]?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {battle.players[0]?.value}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      VS
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {battle.players[1]?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {battle.players[1]?.value}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={battle.winner.toUpperCase()}
                      color={getWinnerColor(battle.winner)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {data && data.pageInfo.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={data.pageInfo.totalPages}
            page={data.pageInfo.currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  )
}