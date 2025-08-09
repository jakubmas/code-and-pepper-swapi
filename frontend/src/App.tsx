import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container, Box, CircularProgress } from '@mui/material'
import { Navbar } from '@/components'
import Game from './Game'

const Results = lazy(() => import('@/components').then(module => ({ default: module.Results })))

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
    <CircularProgress />
  </Box>
)

function App() {
  return (
    <Router>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Game />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </Suspense>
      </Container>
    </Router>
  )
}

export default App