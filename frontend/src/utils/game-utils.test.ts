import { describe, it, expect } from 'vitest'
import { formatAttributeValue } from './game-utils'

describe('formatAttributeValue', () => {
  describe('mass attribute', () => {
    it('should format valid mass value with kg', () => {
      expect(formatAttributeValue(77, 'mass')).toBe('77 kg')
      expect(formatAttributeValue(136, 'mass')).toBe('136 kg')
      expect(formatAttributeValue(0, 'mass')).toBe('0 kg')
    })

    it('should handle large mass values with thousand separators', () => {
      // toLocaleString() adds thousand separators
      expect(formatAttributeValue(1000000, 'mass')).toMatch(/1.000.000 kg|1,000,000 kg/)
    })

    it('should handle string mass values', () => {
      expect(formatAttributeValue('77', 'mass')).toBe('77 kg')
      expect(formatAttributeValue('136', 'mass')).toBe('136 kg')
    })

    it('should return string as-is for non-numeric strings', () => {
      expect(formatAttributeValue('unknown', 'mass')).toBe('unknown')
      expect(formatAttributeValue('N/A', 'mass')).toBe('N/A')
    })
  })

  describe('crew attribute', () => {
    it('should format valid crew value', () => {
      expect(formatAttributeValue(4, 'crew')).toBe('4 crew')
      expect(formatAttributeValue(1, 'crew')).toBe('1 crew')
      expect(formatAttributeValue(0, 'crew')).toBe('0 crew')
    })

    it('should handle large crew values with thousand separators', () => {
      expect(formatAttributeValue(47060, 'crew')).toMatch(/47.060 crew|47,060 crew/)
      expect(formatAttributeValue(1000000, 'crew')).toMatch(/1.000.000 crew|1,000,000 crew/)
    })

    it('should handle string crew values', () => {
      expect(formatAttributeValue('4', 'crew')).toBe('4 crew')
      expect(formatAttributeValue('100', 'crew')).toBe('100 crew')
    })
  })

  describe('no attribute specified', () => {
    it('should format numbers without units', () => {
      expect(formatAttributeValue(100)).toBe('100')
      expect(formatAttributeValue(42)).toBe('42')
    })

    it('should add thousand separators', () => {
      expect(formatAttributeValue(1000000)).toMatch(/1.000.000|1,000,000/)
    })
  })

  describe('edge cases', () => {
    it('should handle zero values correctly', () => {
      expect(formatAttributeValue(0, 'mass')).toBe('0 kg')
      expect(formatAttributeValue(0, 'crew')).toBe('0 crew')
      expect(formatAttributeValue(0)).toBe('0')
    })

    it('should handle negative values', () => {
      expect(formatAttributeValue(-50, 'mass')).toBe('-50 kg')
      expect(formatAttributeValue(-10, 'crew')).toBe('-10 crew')
    })

    it('should return non-numeric strings as-is', () => {
      expect(formatAttributeValue('abc')).toBe('abc')
      expect(formatAttributeValue('unknown')).toBe('unknown')
    })

    it('should parse partial numeric strings', () => {
      // parseInt('123abc') returns 123
      expect(formatAttributeValue('123abc', 'mass')).toBe('123 kg')
    })

    it('should handle strings that start with non-numeric characters', () => {
      // parseInt('abc123') returns NaN, so string is returned as-is
      expect(formatAttributeValue('abc123')).toBe('abc123')
    })
  })
})