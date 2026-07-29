import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { useEffect, useMemo, type ReactNode } from 'react'
import { useAppContext } from './context/useAppContext'
import { getTheme } from './theme'

export function ThemedApp({ children }: { children: ReactNode }) {
  const { resolvedColorMode, colorVision } = useAppContext()
  const theme = useMemo(() => getTheme(resolvedColorMode, colorVision), [resolvedColorMode, colorVision])

  useEffect(() => {
    document.querySelector('#theme-color-meta')?.setAttribute('content', theme.palette.primary.main)
    document
      .querySelector('#apple-status-bar-meta')
      ?.setAttribute('content', resolvedColorMode === 'dark' ? 'black-translucent' : 'default')
  }, [theme, resolvedColorMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
