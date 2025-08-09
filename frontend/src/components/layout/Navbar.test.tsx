import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './Navbar'

vi.mock('@/hooks', () => ({
  useIsSmallScreen: vi.fn(() => false),
}))

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the title', () => {
    renderNavbar()
    
    expect(screen.getByText('⚔️')).toBeInTheDocument()
    expect(screen.getByText('Star Wars Battle')).toBeInTheDocument()
  })

  it('should render navigation buttons', () => {
    renderNavbar()
    
    const gameButton = screen.getByRole('link', { name: /game/i })
    const resultsButton = screen.getByRole('link', { name: /results/i })
    
    expect(gameButton).toBeInTheDocument()
    expect(resultsButton).toBeInTheDocument()
  })

  it('should show full text on large screens', async () => {
    const { useIsSmallScreen } = await import('@/hooks')
    vi.mocked(useIsSmallScreen).mockReturnValue(false)
    
    renderNavbar()
    
    // Should show full "Game" and "Results" text
    expect(screen.getByText('Game')).toBeInTheDocument()
    expect(screen.getByText('Results')).toBeInTheDocument()
  })

  it('should have correct styling', () => {
    renderNavbar()
    
    const appBar = screen.getByRole('banner')
    expect(appBar).toBeInTheDocument()
  })

  it('should render navigation links with correct hrefs', () => {
    renderNavbar()
    
    const gameLink = screen.getByRole('link', { name: /game/i })
    const resultsLink = screen.getByRole('link', { name: /results/i })
    
    expect(gameLink).toHaveAttribute('href', '/')
    expect(resultsLink).toHaveAttribute('href', '/results')
  })
})