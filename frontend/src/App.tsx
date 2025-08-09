import { useState, useEffect } from 'react'
import { Container, Box, Button, Typography, Card, CardContent, CircularProgress, Paper, Chip, Alert } from '@mui/material'
import { PlayArrow, Replay } from '@mui/icons-material'
import { Navbar } from '@/components'
import { useBattleCards, useLocalStorage } from '@/hooks'
import type { Person, Starship } from '@/types/graphql'
import { formatAttributeValue } from '@/utils/game-utils'

type ResourceType = 'people' | 'starships'
type GameState = 'idle' | 'loading' | 'playing' | 'showingWinner'
type Winner = 'left' | 'right' | 'tie' | null

function App() {
  const [resourceType, setResourceType] = useState<ResourceType>('people')
  const [gameState, setGameState] = useState<GameState>('idle')
  const [scores, setScores] = useLocalStorage('starwars-battle-scores', { left: 0, right: 0 })
  const [winner, setWinner] = useState<Winner>(null)
  const [hasStarted, setHasStarted] = useState(false)
  
  const { leftCard, rightCard, isLoading, refetchBoth } = useBattleCards(resourceType, hasStarted)
  
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
      
      // Update scores
      if (newWinner === 'left') {
        setScores(prev => ({ ...prev, left: prev.left + 1 }))
      } else if (newWinner === 'right') {
        setScores(prev => ({ ...prev, right: prev.right + 1 }))
      }
    }
  }, [leftCard.data, rightCard.data, gameState, resourceType, setScores])
  
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