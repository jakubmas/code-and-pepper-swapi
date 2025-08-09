import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBattleCards } from './useBattleCards'
import { createElement } from 'react'
import type { ReactNode } from 'react'

vi.mock('graphql-request', () => ({
  GraphQLClient: vi.fn().mockImplementation(() => ({
    request: vi.fn(),
  })),
  gql: (str: TemplateStringsArray) => str[0],
}))

vi.mock('@/config/graphql-client', () => ({
  graphqlClient: {
    request: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        gcTime: 0,
      },
    },
  })
  
  return ({ children }: { children: ReactNode }) => 
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useBattleCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with null data and not loading', () => {
    const { result } = renderHook(
      () => useBattleCards('people', false),
      { wrapper: createWrapper() }
    )

    expect(result.current.leftCard.data).toBeUndefined()
    expect(result.current.rightCard.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('should fetch people data when enabled and resource type is people', async () => {
    const { graphqlClient } = await import('@/config/graphql-client')
    
    const mockPerson1 = { name: 'Luke Skywalker', mass: 77 }
    const mockPerson2 = { name: 'Darth Vader', mass: 136 }
    
    vi.mocked(graphqlClient.request)
      .mockResolvedValueOnce({ getRandomPerson: mockPerson1 })
      .mockResolvedValueOnce({ getRandomPerson: mockPerson2 })

    const { result } = renderHook(
      () => useBattleCards('people', true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.leftCard.data).toEqual(mockPerson1)
    expect(result.current.rightCard.data).toEqual(mockPerson2)
  })

  it('should fetch starship data when resource type is starships', async () => {
    const { graphqlClient } = await import('@/config/graphql-client')
    
    const mockStarship1 = { name: 'Millennium Falcon', crew: 4 }
    const mockStarship2 = { name: 'Star Destroyer', crew: 47060 }
    
    vi.mocked(graphqlClient.request)
      .mockResolvedValueOnce({ getRandomStarship: mockStarship1 })
      .mockResolvedValueOnce({ getRandomStarship: mockStarship2 })

    const { result } = renderHook(
      () => useBattleCards('starships', true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.leftCard.data).toEqual(mockStarship1)
    expect(result.current.rightCard.data).toEqual(mockStarship2)
  })

  it('should handle loading state correctly', async () => {
    const { graphqlClient } = await import('@/config/graphql-client')
    
    vi.mocked(graphqlClient.request).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ getRandomPerson: {} }), 100))
    )

    const { result } = renderHook(
      () => useBattleCards('people', true),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should handle error state correctly', async () => {
    const { graphqlClient } = await import('@/config/graphql-client')
    
    vi.mocked(graphqlClient.request).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(
      () => useBattleCards('people', true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.leftCard.isError).toBe(true)
    expect(result.current.rightCard.isError).toBe(true)
  })

  it('should refetch both cards when refetchBoth is called', async () => {
    const { graphqlClient } = await import('@/config/graphql-client')
    
    const mockPerson1 = { name: 'Luke Skywalker', mass: 77 }
    const mockPerson2 = { name: 'Darth Vader', mass: 136 }
    
    vi.mocked(graphqlClient.request)
      .mockResolvedValueOnce({ getRandomPerson: mockPerson1 })
      .mockResolvedValueOnce({ getRandomPerson: mockPerson2 })

    const { result } = renderHook(
      () => useBattleCards('people', true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const mockPerson3 = { name: 'Leia Organa', mass: 49 }
    const mockPerson4 = { name: 'Han Solo', mass: 80 }
    
    vi.mocked(graphqlClient.request)
      .mockResolvedValueOnce({ getRandomPerson: mockPerson3 })
      .mockResolvedValueOnce({ getRandomPerson: mockPerson4 })

    result.current.refetchBoth()

    await waitFor(() => {
      expect(result.current.leftCard.data).toEqual(mockPerson3)
    })

    expect(result.current.rightCard.data).toEqual(mockPerson4)
  })

  it('should not fetch data when enabled is false', async () => {
    const { graphqlClient } = await import('@/config/graphql-client')

    const { result } = renderHook(
      () => useBattleCards('people', false),
      { wrapper: createWrapper() }
    )

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(graphqlClient.request).not.toHaveBeenCalled()
    expect(result.current.leftCard.data).toBeUndefined()
    expect(result.current.rightCard.data).toBeUndefined()
  })

  it('should only fetch people data when resource type is people', async () => {
    const { graphqlClient } = await import('@/config/graphql-client')
    
    const mockPerson = { name: 'Luke Skywalker', mass: 77 }
    
    vi.mocked(graphqlClient.request).mockResolvedValue({ getRandomPerson: mockPerson })

    const { result } = renderHook(
      () => useBattleCards('people', true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should have called request for people query
    expect(graphqlClient.request).toHaveBeenCalledWith(
      expect.stringContaining('GetRandomPerson')
    )
  })

  it('should only fetch starship data when resource type is starships', async () => {
    const { graphqlClient } = await import('@/config/graphql-client')
    
    const mockStarship = { name: 'X-Wing', crew: 1 }
    
    vi.mocked(graphqlClient.request).mockResolvedValue({ getRandomStarship: mockStarship })

    const { result } = renderHook(
      () => useBattleCards('starships', true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Should have called request for starship query
    expect(graphqlClient.request).toHaveBeenCalledWith(
      expect.stringContaining('GetRandomStarship')
    )
  })
})