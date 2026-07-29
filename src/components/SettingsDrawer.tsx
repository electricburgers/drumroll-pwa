import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { COLOR_MODE_OPTIONS, COLOR_VISION_OPTIONS, DURATION_OPTIONS } from '../constants'
import { useAppContext } from '../context/useAppContext'

export function SettingsDrawer() {
  const {
    openSettings,
    setOpenSettings,
    duration,
    setDuration,
    isRolling,
    defaultGridSpacing,
    colorMode,
    setColorMode,
    colorVision,
    setColorVision,
  } = useAppContext()

  return (
    <Drawer
      anchor="right"
      open={openSettings}
      onClose={() => setOpenSettings(false)}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 340 } } }}
    >
      <Box
        sx={{
          p: defaultGridSpacing,
          pb: `calc(${defaultGridSpacing * 8}px + env(safe-area-inset-bottom))`,
          overflowY: 'auto',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Settings</Typography>
          <IconButton onClick={() => setOpenSettings(false)} aria-label="Close settings">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ my: defaultGridSpacing }} />
        <Typography variant="h5" gutterBottom>
          General
        </Typography>

        <Stack spacing={1} sx={{ mt: defaultGridSpacing }}>
          <Typography variant="subtitle1">Default drumroll duration</Typography>
          <Typography variant="body2" color="text.secondary">
            Sets the default drumroll duration in seconds. If Infinite is selected, you will have
            to stop the drumroll manually with the Stop button.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can also use the Stop button to stop the drumroll before the duration has expired.
          </Typography>

          <ToggleButtonGroup
            exclusive
            value={duration}
            onChange={(_event, value) => {
              if (value !== null) setDuration(value)
            }}
            disabled={isRolling}
            sx={{ flexWrap: 'wrap', mt: 1 }}
          >
            {DURATION_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Divider sx={{ my: defaultGridSpacing }} />
        <Typography variant="h5" gutterBottom>
          Appearance
        </Typography>

        <Stack spacing={1} sx={{ mt: defaultGridSpacing }}>
          <Typography variant="subtitle1">Theme</Typography>
          <Typography variant="body2" color="text.secondary">
            Choose Light or Dark, or follow your device's setting automatically.
          </Typography>

          <ToggleButtonGroup
            exclusive
            value={colorMode}
            onChange={(_event, value) => {
              if (value !== null) setColorMode(value)
            }}
            sx={{ flexWrap: 'wrap', mt: 1 }}
          >
            {COLOR_MODE_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Stack spacing={1} sx={{ mt: defaultGridSpacing }}>
          <Typography variant="subtitle1">Color vision</Typography>
          <Typography variant="body2" color="text.secondary">
            Adjusts the Play/Stop button colors to palettes verified for color vision
            deficiency, while keeping WCAG AA contrast.
          </Typography>

          <ToggleButtonGroup
            exclusive
            value={colorVision}
            onChange={(_event, value) => {
              if (value !== null) setColorVision(value)
            }}
            orientation="vertical"
            sx={{ mt: 1, alignSelf: 'stretch' }}
          >
            {COLOR_VISION_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value} sx={{ justifyContent: 'flex-start' }}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Box>
    </Drawer>
  )
}
