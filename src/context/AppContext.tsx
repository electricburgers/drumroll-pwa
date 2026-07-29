import useMediaQuery from '@mui/material/useMediaQuery'
import { useState, type ReactNode } from 'react'
import {
  COLOR_MODE_STORAGE_KEY,
  COLOR_VISION_STORAGE_KEY,
  DEFAULT_GRID_SPACING,
  DURATION_STORAGE_KEY,
  INFINITE_DURATION,
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [duration, setDurationState] = useState<number>(readStoredDuration)
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
