import { useState, useEffect } from 'react'
import { Container, Box, Button, Typography, Card, CardContent, CircularProgress, Paper, Chip, Alert } from '@mui/material'
import { PlayArrow, Replay } from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { Navbar } from '@/components'
import { useBattleCards } from '@/hooks'
import type { Person, Starship } from '@/types/graphql'
import { formatAttributeValue } from '@/utils/game-utils'
import { graphqlClient } from '@/config/graphql-client'
import { SAVE_BATTLE_RESULT } from '@/graphql/queries'

type ResourceType = 'people' | 'starships'
type GameState = 'idle' | 'loading' | 'playing' | 'showingWinner'
type Winner = 'left' | 'right' | 'tie' | null

function App() {
  const [resourceType, setResourceType] = useState<ResourceType>('people')
  const [gameState, setGameState] = useState<GameState>('idle')
  const [scores, setScores] = useState({ left: 0, right: 0 })
  const [winner, setWinner] = useState<Winner>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  
  const { leftCard, rightCard, isLoading, refetchBoth } = useBattleCards(resourceType, hasStarted)

  const saveBattleMutation = useMutation({
    mutationFn: async (variables: {
      winner: string
      resourceType: string
      players: Array<{ id: number; name: string; value: string }>
    }) => {
      return await graphqlClient.request(SAVE_BATTLE_RESULT, variables)
    },
    onSuccess: () => {
      setSaveError(null)
    },
    onError: (error) => {
      console.error('Failed to save battle result:', error)
      setSaveError('Failed to save battle result, but you can continue playing')
    },
  })
  
  // Calculate winner when cards are loaded
  useEffect(() => {
    if (leftCard.data && rightCard.data && gameState === 'playing') {
      const leftValue = resourceType === 'people' 
        ? (leftCard.data as Person).mass 
        : (leftCard.data as Starship).crew
      const rightValue = resourceType === 'people'
        ? (rightCard.data as Person).mass
        : (rightCard.data as Starship).crew
      
      let newWinner: Winner = null
      if (leftValue > rightValue) newWinner = 'left'
      else if (rightValue > leftValue) newWinner = 'right'
      else newWinner = 'tie'
      
      setWinner(newWinner)
      setGameState('showingWinner')
      
      // Update local scores for display
      if (newWinner === 'left') {
        setScores(prev => ({ ...prev, left: prev.left + 1 }))
      } else if (newWinner === 'right') {
        setScores(prev => ({ ...prev, right: prev.right + 1 }))
      }

      // Save battle result to database
      const battleWinner = newWinner === 'left' ? 'player' : newWinner === 'right' ? 'computer' : 'draw'
      
      const players = [
        {
          id: 1, // Left player (player)
          name: leftCard.data.name,
          value: formatAttributeValue(leftValue, resourceType === 'people' ? 'mass' : 'crew')
        },
        {
          id: 2, // Right player (computer)
          name: rightCard.data.name,
          value: formatAttributeValue(rightValue, resourceType === 'people' ? 'mass' : 'crew')
        }
      ]

      saveBattleMutation.mutate({
        winner: battleWinner,
        resourceType,
        players
      })
    }
  }, [leftCard.data, rightCard.data, gameState, resourceType, saveBattleMutation])
  
  const playGame = () => {
    setHasStarted(true)
    setGameState('loading')
    setWinner(null)
    refetchBoth()
    setTimeout(() => setGameState('playing'), 500)
  }
  
  const startOver = () => {
    setScores({ left: 0, right: 0 })
    setGameState('idle')
    setWinner(null)
    setResourceType('people')
    setHasStarted(false)
  }
  
  const isGameLoading = gameState === 'loading' || isLoading
  const attribute = resourceType === 'people' ? 'mass' : 'crew'
  
  return (
    <>
      <Navbar onStartOver={startOver} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Score Display */}
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Score</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box>
                <Typography variant="h4" color="primary">{scores.left}</Typography>
                <Typography variant="body2" color="text.secondary">Player 1</Typography>
              </Box>
              <Typography variant="h4" sx={{ mx: 2 }}>:</Typography>
              <Box>
                <Typography variant="h4" color="primary">{scores.right}</Typography>
                <Typography variant="body2" color="text.secondary">Player 2</Typography>
              </Box>
            </Box>
          </Paper>
          
          {/* Resource Selector */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Choose Resource Type</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant={resourceType === 'people' ? 'contained' : 'outlined'}
                onClick={() => setResourceType('people')}
                disabled={isGameLoading}
                size="large"
              >
                People
              </Button>
              <Button
                variant={resourceType === 'starships' ? 'contained' : 'outlined'}
                onClick={() => setResourceType('starships')}
                disabled={isGameLoading}
                size="large"
              >
                Starships
              </Button>
            </Box>
          </Box>
          
          {/* Error State */}
          {(leftCard.isError || rightCard.isError) && (
            <Alert severity="error">Error loading data. Please try again.</Alert>
          )}
          
          {/* Save Error State */}
          {saveError && (
            <Alert severity="warning" onClose={() => setSaveError(null)}>
              {saveError}
            </Alert>
          )}
          
          {/* Battle Cards */}
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Left Card */}
            <Card sx={{ 
              minWidth: 300, 
              minHeight: 200,
              border: winner === 'left' ? '2px solid' : '1px solid',
              borderColor: winner === 'left' ? 'success.main' : winner === 'tie' ? 'warning.main' : 'divider',
            }}>
              <CardContent>
                {gameState === 'showingWinner' && (winner === 'left' || winner === 'tie') && (
                  <Chip 
                    label={winner === 'left' ? 'WINNER!' : 'TIE'} 
                    color={winner === 'left' ? 'success' : 'warning'}
                    size="small"
                    sx={{ float: 'right' }}
                  />
                )}
                {isGameLoading || leftCard.isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
                    <CircularProgress />
                  </Box>
                ) : leftCard.data ? (
                  <>
                    <Typography variant="h5" gutterBottom>{leftCard.data.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {resourceType === 'people' ? 'Person' : 'Starship'}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" color="primary">
                        {formatAttributeValue(
                          resourceType === 'people' 
                            ? (leftCard.data as Person).mass 
                            : (leftCard.data as Starship).crew,
                          attribute
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                      </Typography>
                    </Box>
                  </>
                ) : null}
              </CardContent>
            </Card>
            
            {/* VS */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" color="text.secondary">VS</Typography>
            </Box>
            
            {/* Right Card */}
            <Card sx={{ 
              minWidth: 300, 
              minHeight: 200,
              border: winner === 'right' ? '2px solid' : '1px solid',
              borderColor: winner === 'right' ? 'success.main' : winner === 'tie' ? 'warning.main' : 'divider',
            }}>
              <CardContent>
                {gameState === 'showingWinner' && (winner === 'right' || winner === 'tie') && (
                  <Chip 
                    label={winner === 'right' ? 'WINNER!' : 'TIE'} 
                    color={winner === 'right' ? 'success' : 'warning'}
                    size="small"
                    sx={{ float: 'right' }}
                  />
                )}
                {isGameLoading || rightCard.isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
                    <CircularProgress />
                  </Box>
                ) : rightCard.data ? (
                  <>
                    <Typography variant="h5" gutterBottom>{rightCard.data.name}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {resourceType === 'people' ? 'Person' : 'Starship'}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" color="primary">
                        {formatAttributeValue(
                          resourceType === 'people' 
                            ? (rightCard.data as Person).mass 
                            : (rightCard.data as Starship).crew,
                          attribute
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
                      </Typography>
                    </Box>
                  </>
                ) : null}
              </CardContent>
            </Card>
          </Box>
          
          {/* Action Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {gameState === 'idle' ? (
              <Button
                variant="contained"
                size="large"
                onClick={playGame}
                disabled={isGameLoading}
                startIcon={<PlayArrow />}
                sx={{ minWidth: 200 }}
              >
                Play Game
              </Button>
            ) : gameState === 'showingWinner' ? (
              <Button
                variant="contained"
                size="large"
                onClick={playGame}
                disabled={isGameLoading}
                startIcon={<Replay />}
                sx={{ minWidth: 200 }}
              >
                Play Again
              </Button>
            ) : null}
          </Box>
          
        </Box>
      </Container>
    </>
  )
}

export default App