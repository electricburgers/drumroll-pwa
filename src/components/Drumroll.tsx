import { PlayArrow as PlayArrowIcon, Stop as StopIcon } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useAppContext } from '../context/useAppContext'
import { INFINITE_DURATION } from '../constants'
import { useDrumroll } from '../hooks/useDrumroll'

export function Drumroll() {
  const { duration, setOpenSettings, defaultGridSpacing } = useAppContext()
  const { play, stop, timer, emoji, flip, isRolling } = useDrumroll()

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
        <Typography
          component="div"
          sx={{
            fontSize: 'clamp(3.5rem, 18vw, 5rem)',
            lineHeight: 1,
            transform: `scale(${isRolling && flip ? -1 : 1}, 1)`,
            transition: 'transform 0.15s ease-in-out',
          }}
          aria-label="drumroll status emoji"
        >
          {emoji}
        </Typography>

        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}logo.svg`}
          alt="Drum"
          sx={{ width: 100, height: 100 }}
        />

        <Typography variant="body1" color="text.secondary">
          {helperText}
        </Typography>

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
        </Stack>
      </Stack>
    </Box>
  )
}
