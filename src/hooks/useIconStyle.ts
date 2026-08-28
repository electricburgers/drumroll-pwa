import { useContext } from 'react'
import type { IconStyle } from '../constants'
import { AppContext } from '../context/appContextInstance'
import { readStoredIconStyle } from '../lib/themePreferences'

/**
 * Resolve the active icon style. Reads the app context when it is available
 * (the main app) and falls back to localStorage otherwise (the standalone 404
 * page, which has no provider). `useContext` returns `undefined` rather than
 * throwing when there is no provider, so this is safe to call anywhere.
 */
export function useIconStyle(): IconStyle {
  return useContext(AppContext)?.iconStyle ?? readStoredIconStyle()
}
