import { Close as CloseIcon } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import {
  APP_VERSION,
  COLOR_MODE_OPTIONS,
  COLOR_VISION_OPTIONS,
  DURATION_OPTIONS,
  FADE_OUT_STEP_SECONDS,
  MAX_FADE_OUT_SECONDS,
  MIN_FADE_OUT_SECONDS,
  ORIGINAL_AUTHOR,
} from '../constants'
import { useAppContext } from '../context/useAppContext'

export function SettingsDrawer() {
  const {
    openSettings,
    setOpenSettings,
    duration,
    setDuration,
    fadeOutSeconds,
    setFadeOutSeconds,
    entriesText,
    setEntriesText,
    spinWheelEnabled,
    setSpinWheelEnabled,
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
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            flexShrink: 0,
            bgcolor: 'background.paper',
            px: defaultGridSpacing,
            py: defaultGridSpacing,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h4">Settings</Typography>
          <IconButton onClick={() => setOpenSettings(false)} aria-label="Close settings">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            overflowY: 'auto',
            flex: 1,
            p: defaultGridSpacing,
            pb: `calc(${defaultGridSpacing * 8}px + env(safe-area-inset-bottom))`,
          }}
        >
        <Typography variant="h5" gutterBottom>
          Drumroll
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
            aria-label="Default drumroll duration"
            sx={{ flexWrap: 'wrap', mt: 1 }}
          >
            {DURATION_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Stack spacing={1} sx={{ mt: defaultGridSpacing }}>
          <Typography variant="subtitle1">Fade-out duration</Typography>
          <Typography variant="body2" color="text.secondary">
            Sets how long the Fade Out stop button takes to fade the drumroll to silence.
          </Typography>

          <Slider
            value={fadeOutSeconds}
            onChange={(_event, value) => {
              if (typeof value === 'number') setFadeOutSeconds(value)
            }}
            min={MIN_FADE_OUT_SECONDS}
            max={MAX_FADE_OUT_SECONDS}
            step={FADE_OUT_STEP_SECONDS}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}s`}
            getAriaValueText={(value) => `${value} seconds`}
            disabled={isRolling}
            aria-label="Fade-out duration"
            sx={{ mt: 1 }}
          />
        </Stack>

        <Divider sx={{ my: defaultGridSpacing }} />
        <Typography variant="h5" gutterBottom>
          Winner drawing
        </Typography>

        <Stack spacing={1} sx={{ mt: defaultGridSpacing }}>
          <Typography variant="subtitle1">Random pick list</Typography>
          <Typography variant="body2" color="text.secondary">
            Enter entries separated by commas or one per line. The first entry is the craft
            partner name and the second is the craft partner location; every entry after that
            is a name in the drawing. When you press Stop or Fade Out, one of those names is
            randomly picked and announced with a gift card reveal for that craft partner.
          </Typography>

          <TextField
            multiline
            minRows={5}
            fullWidth
            value={entriesText}
            onChange={(event) => setEntriesText(event.target.value)}
            placeholder={'Man Skirt Brewing\nHackettstown\nSalty Dogs, Alice, Bob'}
            aria-label="Random pick list entries"
          />
        </Stack>

        <Stack spacing={1} sx={{ mt: defaultGridSpacing }}>
          <Typography variant="subtitle1">Spin wheel visualizer</Typography>
          <Typography variant="body2" color="text.secondary">
            Optional. Shows the pick list's drawing pool above as a spinning wheel that lands
            on the name picked when you press Stop or Fade Out, instead of the eyes and drum.
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={spinWheelEnabled}
                onChange={(event) => setSpinWheelEnabled(event.target.checked)}
              />
            }
            label="Show spin wheel"
          />
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
            aria-label="Theme"
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
            aria-label="Color vision"
            sx={{ mt: 1, alignSelf: 'stretch' }}
          >
            {COLOR_VISION_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value} sx={{ justifyContent: 'flex-start' }}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Divider sx={{ my: defaultGridSpacing }} />
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            drumroll v{APP_VERSION}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Originally created by {ORIGINAL_AUTHOR}
          </Typography>
        </Stack>
        </Box>
      </Box>
    </Drawer>
  )
}
