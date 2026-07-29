import {
  COLOR_MODE_STORAGE_KEY,
  COLOR_VISION_STORAGE_KEY,
  type ColorModeSetting,
  type ColorVision,
  type ResolvedColorMode,
} from '../constants'

const COLOR_MODE_VALUES = ['light', 'dark', 'system'] as const
const COLOR_VISION_VALUES = ['default', 'redGreen', 'blueYellow'] as const

function readStoredEnum<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof window === 'undefined') return fallback
  const stored = window.localStorage.getItem(key)
  return (allowed as readonly string[]).includes(stored ?? '') ? (stored as T) : fallback
}

export function readStoredColorMode(): ColorModeSetting {
  return readStoredEnum(COLOR_MODE_STORAGE_KEY, COLOR_MODE_VALUES, 'system')
}

export function readStoredColorVision(): ColorVision {
  return readStoredEnum(COLOR_VISION_STORAGE_KEY, COLOR_VISION_VALUES, 'default')
}

export function resolveColorMode(setting: ColorModeSetting, prefersDark: boolean): ResolvedColorMode {
  return setting === 'system' ? (prefersDark ? 'dark' : 'light') : setting
}
