import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { mockPerson, mockPerson2 } from './test/mocks'

// Mock the graphql-request module
vi.mock('graphql-request', () => ({
  GraphQLClient: vi.fn(() => ({
    request: vi.fn(),
  })),
  gql: (str: TemplateStringsArray) => str[0],
}))

// Mock the hooks
let mockScores = { left: 0, right: 0 }

vi.mock('@/hooks', () => ({
  useBattleCards: vi.fn(() => ({
    leftCard: { data: null, isLoading: false, isError: false, refetch: vi.fn() } as any,
    rightCard: { data: null, isLoading: false, isError: false, refetch: vi.fn() } as any,
    isLoading: false,
    isError: false,
    refetchBoth: vi.fn(),
  })),
  useLocalStorage: vi.fn(() => {
    return [mockScores, (newValue: any) => { mockScores = newValue }]
  }),
  useIsSmallScreen: vi.fn(() => false),
}))

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render initial idle state with Play Game button', () => {
    renderApp()
    
    expect(screen.getByText('Play Game')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Choose Resource Type')).toBeInTheDocument()
  })

  it('should display score counter with initial values', () => {
    renderApp()
    
    expect(screen.getByText('Player 1')).toBeInTheDocument()
    expect(screen.getByText('Player 2')).toBeInTheDocument()
    // Initial scores should be 0:0
    const scores = screen.getAllByText('0')
    expect(scores).toHaveLength(2)
  })

  it('should allow switching between People and Starships', async () => {
    const user = userEvent.setup()
    renderApp()
    
    const peopleButton = screen.getByRole('button', { name: /people/i })
    const starshipsButton = screen.getByRole('button', { name: /starships/i })
    
    // Both buttons should be present
    expect(peopleButton).toBeInTheDocument()
    expect(starshipsButton).toBeInTheDocument()
    
    // Click on Starships
    await user.click(starshipsButton)
    
    // Buttons should still be present (testing that they work without errors)
    expect(peopleButton).toBeInTheDocument()
    expect(starshipsButton).toBeInTheDocument()
  })

  it('should show VS text between cards area', () => {
    renderApp()
    
    expect(screen.getByText('VS')).toBeInTheDocument()
  })

  it('should start game when Play Game button is clicked', async () => {
    const { useBattleCards } = await import('@/hooks')
    const mockRefetchBoth = vi.fn()
    
    vi.mocked(useBattleCards).mockReturnValue({
      leftCard: { 
        data: mockPerson, 
        isLoading: false, 
        isError: false,
        refetch: vi.fn()
      } as any,
      rightCard: { 
        data: mockPerson2, 
        isLoading: false, 
        isError: false,
        refetch: vi.fn()
      } as any,
      isLoading: false,
      isError: false,
      refetchBoth: mockRefetchBoth,
    })
    
    const user = userEvent.setup()
    renderApp()
    
    const playButton = screen.getByRole('button', { name: /play game/i })
    await user.click(playButton)
    
    // Should call refetchBoth to get new data
    expect(mockRefetchBoth).toHaveBeenCalled()
    
    // Should display the cards with data
    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
      expect(screen.getByText('Darth Vader')).toBeInTheDocument()
    })
  })

  it('should show Play Again button after game is played', async () => {
    const { useBattleCards } = await import('@/hooks')
    
    vi.mocked(useBattleCards).mockReturnValue({
      leftCard: { 
        data: mockPerson, 
        isLoading: false, 
        isError: false,
        refetch: vi.fn()
      } as any,
      rightCard: { 
        data: mockPerson2, 
        isLoading: false, 
        isError: false,
        refetch: vi.fn()
      } as any,
      isLoading: false,
      isError: false,
      refetchBoth: vi.fn(),
    })
    
    const user = userEvent.setup()
    renderApp()
    
    const playButton = screen.getByRole('button', { name: /play game/i })
    await user.click(playButton)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /play again/i })).toBeInTheDocument()
    })
  })

  it('should display error state when there is an error', async () => {
    const { useBattleCards } = await import('@/hooks')
    
    vi.mocked(useBattleCards).mockReturnValue({
      leftCard: { data: null, isLoading: false, isError: true, refetch: vi.fn() } as any,
      rightCard: { data: null, isLoading: false, isError: false, refetch: vi.fn() } as any,
      isLoading: false,
      isError: true,
      refetchBoth: vi.fn(),
    })
    
    renderApp()
    
    expect(screen.getByText(/error loading data/i)).toBeInTheDocument()
  })

  it('should show loading state when fetching data', async () => {
    const { useBattleCards } = await import('@/hooks')
    
    vi.mocked(useBattleCards).mockReturnValue({
      leftCard: { data: null, isLoading: true, isError: false, refetch: vi.fn() } as any,
      rightCard: { data: null, isLoading: true, isError: false, refetch: vi.fn() } as any,
      isLoading: true,
      isError: false,
      refetchBoth: vi.fn(),
    })
    
    renderApp()
    
    // Should show loading spinners
    const spinners = screen.getAllByRole('progressbar')
    expect(spinners.length).toBeGreaterThan(0)
  })
})