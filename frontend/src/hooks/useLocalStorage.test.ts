import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Reset localStorage mock
    localStorage.getItem = vi.fn()
    localStorage.setItem = vi.fn()
    localStorage.removeItem = vi.fn()
    localStorage.clear = vi.fn()
  })

  it('should initialize with the initial value when localStorage is empty', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { count: 0 })
    )

    expect(result.current[0]).toEqual({ count: 0 })
    expect(localStorage.getItem).toHaveBeenCalledWith('test-key')
  })

  it('should initialize with the stored value from localStorage', () => {
    const storedValue = { count: 42, name: 'test' }
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(storedValue))

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { count: 0 })
    )

    expect(result.current[0]).toEqual(storedValue)
    expect(localStorage.getItem).toHaveBeenCalledWith('test-key')
  })

  it('should update localStorage when value changes', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { count: 0 })
    )

    act(() => {
      result.current[1]({ count: 5 })
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify({ count: 5 })
    )
    expect(result.current[0]).toEqual({ count: 5 })
  })

  it('should handle function updates', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify({ count: 10 }))

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { count: 0 })
    )

    act(() => {
      result.current[1]((prev: { count: number }) => ({ count: prev.count + 1 }))
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify({ count: 11 })
    )
    expect(result.current[0]).toEqual({ count: 11 })
  })

  it('should handle invalid JSON in localStorage gracefully', () => {
    vi.mocked(localStorage.getItem).mockReturnValue('invalid json')
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { fallback: true })
    )

    expect(result.current[0]).toEqual({ fallback: true })
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error reading localStorage'),
      expect.any(Error)
    )

    consoleWarnSpy.mockRestore()
  })

  it('should handle localStorage.setItem errors gracefully', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => 
      useLocalStorage('test-key', { count: 0 })
    )

    act(() => {
      result.current[1]({ count: 100 })
    })

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error setting localStorage'),
      expect.any(Error)
    )
    // Value should still update in state even if localStorage fails
    expect(result.current[0]).toEqual({ count: 100 })

    consoleWarnSpy.mockRestore()
  })

  it('should work with primitive values', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify('hello'))

    const { result } = renderHook(() => 
      useLocalStorage('string-key', 'default')
    )

    expect(result.current[0]).toBe('hello')

    act(() => {
      result.current[1]('world')
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'string-key',
      JSON.stringify('world')
    )
    expect(result.current[0]).toBe('world')
  })

  it('should work with arrays', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify([1, 2, 3]))

    const { result } = renderHook(() => 
      useLocalStorage('array-key', [] as number[])
    )

    expect(result.current[0]).toEqual([1, 2, 3])

    act(() => {
      result.current[1]([4, 5, 6])
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'array-key',
      JSON.stringify([4, 5, 6])
    )
    expect(result.current[0]).toEqual([4, 5, 6])
  })

  it('should persist the same reference when value does not change', () => {
    const initialValue = { count: 0 }
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(initialValue))

    const { result, rerender } = renderHook(() => 
      useLocalStorage('test-key', initialValue)
    )

    const firstReference = result.current[0]
    
    rerender()
    
    const secondReference = result.current[0]
    
    expect(firstReference).toBe(secondReference)
  })

  it('should handle null values', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(null))

    const { result } = renderHook(() => 
      useLocalStorage('null-key', null as string | null)
    )

    expect(result.current[0]).toBeNull()

    act(() => {
      result.current[1]('not null')
    })

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'null-key',
      JSON.stringify('not null')
    )
  })
})