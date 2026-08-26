import { describe, expect, it } from 'vitest'
import {
  COLOR_MODE_OPTIONS,
  COLOR_VISION_OPTIONS,
  DEFAULT_FADE_OUT_SECONDS,
  DURATION_MARKS,
  FADE_OUT_STEP_SECONDS,
  INFINITE_DURATION,
  MAX_FADE_OUT_SECONDS,
  MIN_FADE_OUT_SECONDS,
} from './constants'

describe('constants', () => {
  it('uses -1 to represent an infinite duration', () => {
    expect(INFINITE_DURATION).toBe(-1)
  })

  it('defines a duration mark for infinite at value 0', () => {
    expect(DURATION_MARKS[0]).toEqual({ value: 0, label: '∞' })
  })

  it('defines duration marks in ascending order', () => {
    const values = DURATION_MARKS.map((mark) => mark.value)
    const sorted = [...values].sort((a, b) => a - b)
    expect(values).toEqual(sorted)
  })

  it('defines exactly 5 duration marks', () => {
    expect(DURATION_MARKS).toHaveLength(5)
  })

  it('keeps the fade-out default within its min/max bounds', () => {
    expect(DEFAULT_FADE_OUT_SECONDS).toBeGreaterThanOrEqual(MIN_FADE_OUT_SECONDS)
    expect(DEFAULT_FADE_OUT_SECONDS).toBeLessThanOrEqual(MAX_FADE_OUT_SECONDS)
  })

  it('keeps the fade-out step smaller than the min/max range', () => {
    expect(FADE_OUT_STEP_SECONDS).toBeLessThanOrEqual(MAX_FADE_OUT_SECONDS - MIN_FADE_OUT_SECONDS)
  })

  it('offers exactly 3 color mode options', () => {
    expect(COLOR_MODE_OPTIONS).toHaveLength(3)
  })

  it('includes system, light, and dark color mode values', () => {
    const values = COLOR_MODE_OPTIONS.map((option) => option.value)
    expect(values).toEqual(['system', 'light', 'dark'])
  })

  it('offers exactly 3 color vision options', () => {
    expect(COLOR_VISION_OPTIONS).toHaveLength(3)
  })

  it('gives every color mode and color vision option a non-empty label', () => {
    for (const option of [...COLOR_MODE_OPTIONS, ...COLOR_VISION_OPTIONS]) {
      expect(option.label.length).toBeGreaterThan(0)
    }
  })
})
