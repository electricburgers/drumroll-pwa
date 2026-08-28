import {
  COLOR_MODE_STORAGE_KEY,
  COLOR_VISION_STORAGE_KEY,
  DEFAULT_ICON_STYLE,
  ICON_STYLE_STORAGE_KEY,
  type ColorModeSetting,
  type ColorVision,
  type IconStyle,
  type ResolvedColorMode,
} from '../constants'

const COLOR_MODE_VALUES = ['light', 'dark', 'system'] as const
const COLOR_VISION_VALUES = ['default', 'redGreen', 'blueYellow'] as const
const ICON_STYLE_VALUES = ['pictograph', 'emoji'] as const

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

export function readStoredIconStyle(): IconStyle {
  return readStoredEnum(ICON_STYLE_STORAGE_KEY, ICON_STYLE_VALUES, DEFAULT_ICON_STYLE)
}

export function resolveColorMode(setting: ColorModeSetting, prefersDark: boolean): ResolvedColorMode {
  return setting === 'system' ? (prefersDark ? 'dark' : 'light') : setting
}
