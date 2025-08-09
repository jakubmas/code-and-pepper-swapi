import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Navbar } from './Navbar'

vi.mock('@/hooks', () => ({
  useIsSmallScreen: vi.fn(() => false),
}))

describe('Navbar', () => {
  const mockOnStartOver = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the title', () => {
    render(<Navbar onStartOver={mockOnStartOver} />)
    
    expect(screen.getByText('⚔️')).toBeInTheDocument()
    expect(screen.getByText('Star Wars Battle')).toBeInTheDocument()
  })

  it('should render Start Over button', () => {
    render(<Navbar onStartOver={mockOnStartOver} />)
    
    const startOverButton = screen.getByRole('button', { name: /start over/i })
    expect(startOverButton).toBeInTheDocument()
  })

  it('should show full text on large screens', async () => {
    const { useIsSmallScreen } = await import('@/hooks')
    vi.mocked(useIsSmallScreen).mockReturnValue(false)
    
    render(<Navbar onStartOver={mockOnStartOver} />)
    
    // Should show full "Start Over" text
    expect(screen.getByText('Start Over')).toBeInTheDocument()
  })

  it('should have correct styling', () => {
    render(<Navbar onStartOver={mockOnStartOver} />)
    
    const appBar = screen.getByRole('banner')
    expect(appBar).toBeInTheDocument()
  })

  it('should render with proper accessibility attributes', () => {
    render(<Navbar onStartOver={mockOnStartOver} />)
    
    const startOverButton = screen.getByRole('button', { name: /start over/i })
    expect(startOverButton).toHaveAttribute('type', 'button')
  })
})