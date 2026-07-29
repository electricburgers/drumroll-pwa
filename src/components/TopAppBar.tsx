import {
  DarkMode as DarkModeIcon,
  GitHub as GitHubIcon,
  LightMode as LightModeIcon,
  Settings as SettingsIcon,
  SettingsBrightness as SettingsBrightnessIcon,
} from '@mui/icons-material'
import AppBar from '@mui/material/AppBar'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { ColorModeSetting } from '../constants'
import { useAppContext } from '../context/useAppContext'

const SOURCE_REPO_URL = 'https://github.com/heystevegray/drumroll-pwa'

const NEXT_COLOR_MODE: Record<ColorModeSetting, ColorModeSetting> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const COLOR_MODE_ICON: Record<ColorModeSetting, React.ReactNode> = {
  system: <SettingsBrightnessIcon />,
  light: <LightModeIcon />,
  dark: <DarkModeIcon />,
}

const COLOR_MODE_LABEL: Record<ColorModeSetting, string> = {
  system: 'Theme: System',
  light: 'Theme: Light',
  dark: 'Theme: Dark',
}

export function TopAppBar() {
  const { setOpenSettings, defaultGridSpacing, colorMode, setColorMode } = useAppContext()

  return (
    <AppBar position="static" sx={{ pt: 'env(safe-area-inset-top)' }}>
      <Toolbar>
        <Grid container spacing={defaultGridSpacing} alignItems="center">
          <Grid item xs>
            <Typography variant="h6" noWrap component="div">
              drumroll
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title={`${COLOR_MODE_LABEL[colorMode]} (tap to change)`}>
              <IconButton
                color="inherit"
                onClick={() => setColorMode(NEXT_COLOR_MODE[colorMode])}
                aria-label="Toggle color theme"
              >
                {COLOR_MODE_ICON[colorMode]}
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Source Code">
              <IconButton
                color="inherit"
                component="a"
                href={SOURCE_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Source Code"
              >
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Settings">
              <IconButton
                color="inherit"
                onClick={() => setOpenSettings(true)}
                aria-label="Settings"
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
