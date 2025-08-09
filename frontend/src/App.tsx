import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'
import { Navbar } from '@/components'
import Game from './Game'
import { Results } from '@/components'

function App() {
  return (
    <Router>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App