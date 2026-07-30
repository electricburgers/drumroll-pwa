import useMediaQuery from '@mui/material/useMediaQuery'
import { useState, type ReactNode } from 'react'
import {
  COLOR_MODE_STORAGE_KEY,
  COLOR_VISION_STORAGE_KEY,
  DEFAULT_FADE_OUT_SECONDS,
  DEFAULT_GRID_SPACING,
  DURATION_STORAGE_KEY,
  ENTRIES_STORAGE_KEY,
  FADE_OUT_STORAGE_KEY,
  INFINITE_DURATION,
  MAX_FADE_OUT_SECONDS,
  MIN_FADE_OUT_SECONDS,
  SPIN_WHEEL_STORAGE_KEY,
  type ColorModeSetting,
  type ColorVision,
} from '../constants'
import {
  readStoredColorMode,
  readStoredColorVision,
  resolveColorMode,
} from '../lib/themePreferences'
import { AppContext, type AppContextValue } from './appContextInstance'

function readStoredDuration(): number {
  if (typeof window === 'undefined') return INFINITE_DURATION
  const stored = window.localStorage.getItem(DURATION_STORAGE_KEY)
  if (stored === null) return INFINITE_DURATION
  const parsed = Number(stored)
  return Number.isNaN(parsed) ? INFINITE_DURATION : parsed
}

function readStoredFadeOutSeconds(): number {
  if (typeof window === 'undefined') return DEFAULT_FADE_OUT_SECONDS
  const stored = window.localStorage.getItem(FADE_OUT_STORAGE_KEY)
  if (stored === null) return DEFAULT_FADE_OUT_SECONDS
  const parsed = Number(stored)
  if (Number.isNaN(parsed)) return DEFAULT_FADE_OUT_SECONDS
  return Math.min(MAX_FADE_OUT_SECONDS, Math.max(MIN_FADE_OUT_SECONDS, parsed))
}

function readStoredEntriesText(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(ENTRIES_STORAGE_KEY) ?? ''
}

function readStoredSpinWheelEnabled(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(SPIN_WHEEL_STORAGE_KEY) === 'true'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [duration, setDurationState] = useState<number>(readStoredDuration)
  const [fadeOutSeconds, setFadeOutSecondsState] = useState<number>(readStoredFadeOutSeconds)
  const [entriesText, setEntriesTextState] = useState<string>(readStoredEntriesText)
  const [spinWheelEnabled, setSpinWheelEnabledState] = useState<boolean>(readStoredSpinWheelEnabled)
  const [openSettings, setOpenSettings] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [colorMode, setColorModeState] = useState<ColorModeSetting>(readStoredColorMode)
  const [colorVision, setColorVisionState] = useState<ColorVision>(readStoredColorVision)

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const resolvedColorMode = resolveColorMode(colorMode, prefersDark)

  const setDuration: AppContextValue['setDuration'] = (value) => {
    setDurationState((prev) => {
      const next = typeof value === 'function' ? (value as (prev: number) => number)(prev) : value
      window.localStorage.setItem(DURATION_STORAGE_KEY, String(next))
      return next
    })
  }

  const setFadeOutSeconds: AppContextValue['setFadeOutSeconds'] = (value) => {
    setFadeOutSecondsState((prev) => {
      const next = typeof value === 'function' ? (value as (prev: number) => number)(prev) : value
      window.localStorage.setItem(FADE_OUT_STORAGE_KEY, String(next))
      return next
    })
  }

  const setEntriesText: AppContextValue['setEntriesText'] = (value) => {
    setEntriesTextState((prev) => {
      const next = typeof value === 'function' ? (value as (prev: string) => string)(prev) : value
      window.localStorage.setItem(ENTRIES_STORAGE_KEY, next)
      return next
    })
  }

  const setSpinWheelEnabled: AppContextValue['setSpinWheelEnabled'] = (value) => {
    setSpinWheelEnabledState((prev) => {
      const next = typeof value === 'function' ? (value as (prev: boolean) => boolean)(prev) : value
      window.localStorage.setItem(SPIN_WHEEL_STORAGE_KEY, String(next))
      return next
    })
  }

  const setColorMode: AppContextValue['setColorMode'] = (value) => {
    setColorModeState((prev) => {
      const next = typeof value === 'function' ? (value as (prev: ColorModeSetting) => ColorModeSetting)(prev) : value
      window.localStorage.setItem(COLOR_MODE_STORAGE_KEY, next)
      return next
    })
  }

  const setColorVision: AppContextValue['setColorVision'] = (value) => {
    setColorVisionState((prev) => {
      const next = typeof value === 'function' ? (value as (prev: ColorVision) => ColorVision)(prev) : value
      window.localStorage.setItem(COLOR_VISION_STORAGE_KEY, next)
      return next
    })
  }

  return (
    <AppContext.Provider
      value={{
        duration,
        setDuration,
        fadeOutSeconds,
        setFadeOutSeconds,
        entriesText,
        setEntriesText,
        spinWheelEnabled,
        setSpinWheelEnabled,
        openSettings,
        setOpenSettings,
        isRolling,
        setIsRolling,
        defaultGridSpacing: DEFAULT_GRID_SPACING,
        colorMode,
        setColorMode,
        resolvedColorMode,
        colorVision,
        setColorVision,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
