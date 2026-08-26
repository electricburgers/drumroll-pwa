import { version as packageVersion } from '../package.json'

export const APP_VERSION = packageVersion
export const APP_DATE = '25 Aug 2026'

export const ORIGINAL_AUTHOR = 'heystevegray'
export const ORIGINAL_AUTHOR_URL = 'https://github.com/heystevegray/drumroll'

export const INFINITE_DURATION = -1

export const DURATION_STORAGE_KEY = 'drumroll-duration'

export const DEFAULT_GRID_SPACING = 2

export const DURATION_MARKS: { value: number; label: string }[] = [
  { value: 0, label: '∞' },
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
  { value: 20, label: '20s' },
  { value: 30, label: '30s' },
]

export const FADE_OUT_STORAGE_KEY = 'drumroll-fade-out-seconds'

export const DEFAULT_FADE_OUT_SECONDS = 2.5
export const MIN_FADE_OUT_SECONDS = 0.5
export const MAX_FADE_OUT_SECONDS = 5
export const FADE_OUT_STEP_SECONDS = 0.5

export type ColorModeSetting = 'light' | 'dark' | 'system'
export type ResolvedColorMode = 'light' | 'dark'
export type ColorVision = 'default' | 'redGreen' | 'blueYellow'

export const COLOR_MODE_STORAGE_KEY = 'drumroll-color-mode'
export const COLOR_VISION_STORAGE_KEY = 'drumroll-color-vision'

export const COLOR_MODE_OPTIONS: { label: string; value: ColorModeSetting }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

export const COLOR_VISION_OPTIONS: { label: string; value: ColorVision }[] = [
  { label: 'Default', value: 'default' },
  { label: 'Protanopia / Deuteranopia friendly', value: 'redGreen' },
  { label: 'Tritanopia friendly', value: 'blueYellow' },
]

export const ENTRIES_STORAGE_KEY = 'drumroll-entries'

export const SPIN_WHEEL_STORAGE_KEY = 'drumroll-spin-wheel-enabled'
