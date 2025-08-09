import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useIsSmallScreen } from './useIsSmallScreen'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { createElement } from 'react'
import type { ReactNode } from 'react'

vi.mock('@mui/material', () => ({
  useMediaQuery: vi.fn(),
}))

const theme = createTheme()

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(ThemeProvider, { theme }, children)

describe('useIsSmallScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return false for large screens', async () => {
    const { useMediaQuery } = await import('@mui/material')
    vi.mocked(useMediaQuery).mockReturnValue(false)

    const { result } = renderHook(() => useIsSmallScreen(), { wrapper })

    expect(result.current).toBe(false)
    expect(useMediaQuery).toHaveBeenCalledWith(expect.any(String))
  })

  it('should return true for small screens', async () => {
    const { useMediaQuery } = await import('@mui/material')
    vi.mocked(useMediaQuery).mockReturnValue(true)

    const { result } = renderHook(() => useIsSmallScreen(), { wrapper })

    expect(result.current).toBe(true)
    expect(useMediaQuery).toHaveBeenCalledWith(expect.any(String))
  })

  it('should use theme breakpoint down sm', async () => {
    const { useMediaQuery } = await import('@mui/material')
    vi.mocked(useMediaQuery).mockReturnValue(false)

    renderHook(() => useIsSmallScreen(), { wrapper })

    // MUI's theme.breakpoints.down('sm') typically generates a media query like "(max-width:599.95px)"
    expect(useMediaQuery).toHaveBeenCalledWith(expect.stringContaining('max-width'))
  })

  it('should update when screen size changes', async () => {
    const { useMediaQuery } = await import('@mui/material')
    
    // Start with large screen
    vi.mocked(useMediaQuery).mockReturnValue(false)
    
    const { result, rerender } = renderHook(() => useIsSmallScreen(), { wrapper })
    expect(result.current).toBe(false)
    
    // Change to small screen
    vi.mocked(useMediaQuery).mockReturnValue(true)
    rerender()
    
    expect(result.current).toBe(true)
  })
})