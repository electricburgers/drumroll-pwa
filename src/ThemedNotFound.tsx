import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useMemo } from 'react'
import { readStoredColorMode, readStoredColorVision, resolveColorMode } from './lib/themePreferences'
import NotFound from './NotFound'
import { getTheme } from './theme'

export function ThemedNotFound() {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const resolvedColorMode = resolveColorMode(readStoredColorMode(), prefersDark)
  const colorVision = readStoredColorVision()
  const theme = useMemo(() => getTheme(resolvedColorMode, colorVision), [resolvedColorMode, colorVision])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotFound />
    </ThemeProvider>
  )
}
