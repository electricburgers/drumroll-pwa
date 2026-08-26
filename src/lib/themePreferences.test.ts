import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { COLOR_MODE_STORAGE_KEY, COLOR_VISION_STORAGE_KEY } from '../constants'
import { readStoredColorMode, readStoredColorVision, resolveColorMode } from './themePreferences'

/**
 * A minimal `Storage`-compatible stand-in for `window.localStorage`. This
 * project has no DOM test environment configured, so `window` is stubbed
 * with just enough surface for these pure functions to exercise.
 */
class FakeStorage {
  private store = new Map<string, string>()

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  clear(): void {
    this.store.clear()
  }
}

function stubWindowWithStorage() {
  vi.stubGlobal('window', { localStorage: new FakeStorage() })
}

describe('readStoredColorMode', () => {
  beforeEach(() => {
    stubWindowWithStorage()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('defaults to "system" when nothing is stored', () => {
    expect(readStoredColorMode()).toBe('system')
  })

  it('reads "light" from storage', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light')
    expect(readStoredColorMode()).toBe('light')
  })

  it('reads "dark" from storage', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark')
    expect(readStoredColorMode()).toBe('dark')
  })

  it('reads "system" from storage', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'system')
    expect(readStoredColorMode()).toBe('system')
  })

  it('falls back to "system" for an invalid stored value', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'neon')
    expect(readStoredColorMode()).toBe('system')
  })

  it('falls back to "system" for an empty stored value', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, '')
    expect(readStoredColorMode()).toBe('system')
  })

  it('is case-sensitive and rejects "Light"', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'Light')
    expect(readStoredColorMode()).toBe('system')
  })
})

describe('readStoredColorVision', () => {
  beforeEach(() => {
    stubWindowWithStorage()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('defaults to "default" when nothing is stored', () => {
    expect(readStoredColorVision()).toBe('default')
  })

  it('reads "redGreen" from storage', () => {
    window.localStorage.setItem(COLOR_VISION_STORAGE_KEY, 'redGreen')
    expect(readStoredColorVision()).toBe('redGreen')
  })

  it('reads "blueYellow" from storage', () => {
    window.localStorage.setItem(COLOR_VISION_STORAGE_KEY, 'blueYellow')
    expect(readStoredColorVision()).toBe('blueYellow')
  })

  it('reads "default" from storage', () => {
    window.localStorage.setItem(COLOR_VISION_STORAGE_KEY, 'default')
    expect(readStoredColorVision()).toBe('default')
  })

  it('falls back to "default" for an invalid stored value', () => {
    window.localStorage.setItem(COLOR_VISION_STORAGE_KEY, 'monochrome')
    expect(readStoredColorVision()).toBe('default')
  })

  it('falls back to "default" for an empty stored value', () => {
    window.localStorage.setItem(COLOR_VISION_STORAGE_KEY, '')
    expect(readStoredColorVision()).toBe('default')
  })

  it('does not confuse color mode keys with color vision keys', () => {
    window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark')
    expect(readStoredColorVision()).toBe('default')
  })
})

describe('resolveColorMode', () => {
  it('resolves "light" as-is regardless of system preference', () => {
    expect(resolveColorMode('light', true)).toBe('light')
    expect(resolveColorMode('light', false)).toBe('light')
  })

  it('resolves "dark" as-is regardless of system preference', () => {
    expect(resolveColorMode('dark', true)).toBe('dark')
    expect(resolveColorMode('dark', false)).toBe('dark')
  })

  it('resolves "system" to "dark" when the OS prefers dark', () => {
    expect(resolveColorMode('system', true)).toBe('dark')
  })

  it('resolves "system" to "light" when the OS does not prefer dark', () => {
    expect(resolveColorMode('system', false)).toBe('light')
  })
})

describe('themePreferences without a window', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('readStoredColorMode falls back to "system" when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(readStoredColorMode()).toBe('system')
  })

  it('readStoredColorVision falls back to "default" when window is undefined', () => {
    vi.stubGlobal('window', undefined)
    expect(readStoredColorVision()).toBe('default')
  })
})
