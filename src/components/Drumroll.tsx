import {
  Campaign as CampaignIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  VolumeDown as VolumeDownIcon,
} from '@mui/icons-material'
import { visuallyHidden } from '@mui/utils'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAppContext } from '../context/useAppContext'
import { INFINITE_DURATION } from '../constants'
import { useDrumroll } from '../hooks/useDrumroll'

export function Drumroll() {
  const { duration, setOpenSettings, defaultGridSpacing } = useAppContext()
  const { play, stop, stopFadeOut, playHorn, timer, emoji, flip, isRolling, pickedEntry, statusMessage } =
    useDrumroll()

  const helperText =
    duration === INFINITE_DURATION
      ? 'Drumroll duration set to Infinite. Configure the settings below or let the good times roll.'
      : `Rolling for ${timer} seconds`

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        textAlign: 'center',
        px: defaultGridSpacing,
        py: { xs: 4, sm: 6 },
        pb: `calc(${defaultGridSpacing * 8}px + env(safe-area-inset-bottom))`,
      }}
    >
      <Stack spacing={defaultGridSpacing} alignItems="center" sx={{ width: '100%', maxWidth: 420 }}>
        <Box component="span" sx={visuallyHidden} role="status" aria-live="polite">
          {statusMessage}
        </Box>

        <Typography
          component="div"
          aria-hidden="true"
          sx={{
            fontSize: 'clamp(3.5rem, 18vw, 5rem)',
            lineHeight: 1,
            transform: `scale(${isRolling && flip ? -1 : 1}, 1)`,
            transition: 'transform 0.15s ease-in-out',
          }}
        >
          {emoji}
        </Typography>

        <Typography
          component="div"
          aria-label="Drum"
          sx={{ fontSize: '5rem', lineHeight: 1 }}
        >
          🥁
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {helperText}
        </Typography>

        {pickedEntry && (
          <Typography variant="h4" component="div" aria-hidden="true">
            🎉 {pickedEntry} 🎉
          </Typography>
        )}

        {duration !== INFINITE_DURATION && (
          <LinearProgress
            variant="determinate"
            value={(timer / duration) * 100}
            aria-hidden="true"
            sx={{
              width: '100%',
              height: 8,
              borderRadius: 4,
              '& .MuiLinearProgress-bar': { transition: 'transform 1s linear' },
            }}
          />
        )}

        <Button variant="text" onClick={() => setOpenSettings(true)}>
          Configure Settings
        </Button>

        <Stack
          direction="row"
          spacing={defaultGridSpacing}
          flexWrap="wrap"
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={play}
            disabled={isRolling}
          >
            Play
          </Button>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            startIcon={<StopIcon />}
            onClick={stop}
            disabled={!isRolling}
          >
            Stop
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="secondary"
            startIcon={<VolumeDownIcon />}
            onClick={stopFadeOut}
            disabled={!isRolling}
          >
            Fade Out
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<CampaignIcon />}
            onClick={playHorn}
            disabled={isRolling}
          >
            Horn
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
