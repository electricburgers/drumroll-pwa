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
import Slider from '@mui/material/Slider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../context/useAppContext'
import { DURATION_MARKS, INFINITE_DURATION } from '../constants'
import { useDrumroll } from '../hooks/useDrumroll'
import { parseEntries } from '../lib/parseEntries'
import { Pictograph } from './Pictograph'
import { PICK_LIST_ANCHOR_ID, QuickPickList } from './QuickPickList'
import { SpinWheel } from './SpinWheel'

export function Drumroll() {
  const {
    duration,
    setDuration,
    entriesText,
    spinWheelEnabled,
    setOpenSettings,
    defaultGridSpacing,
    setPickListOpen,
  } = useAppContext()
  const {
    play,
    stop,
    stopFadeOut,
    playHorn,
    timer,
    face,
    flip,
    isRolling,
    pickedEntry,
    celebrationMessage,
    statusMessage,
  } = useDrumroll()

  const editPickList = useCallback(() => {
    setPickListOpen(true)
    // Wait for the Collapse to mount/lay out its textarea before scrolling to
    // it and moving focus there for editing.
    window.setTimeout(() => {
      const anchor = document.getElementById(PICK_LIST_ANCHOR_ID)
      anchor?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      anchor?.querySelector('textarea')?.focus({ preventScroll: true })
    }, 150)
  }, [setPickListOpen])

  // The pick list's first two entries are reserved for the craft partner
  // name and location; the rest are the pool of names to draw from.
  const pool = useMemo(() => parseEntries(entriesText).slice(2), [entriesText])
  const showSpinWheel = spinWheelEnabled && pool.length > 0

  const [cyclingName, setCyclingName] = useState(() => (pool.length > 0 ? pool[0] : ''))

  useEffect(() => {
    if (pool.length === 0) return
    setCyclingName((prev) => (pool.includes(prev) ? prev : pool[0]))

    const intervalTime = isRolling ? 600 : 1500
    const timerId = setInterval(() => {
      setCyclingName((prev) => {
        if (pool.length <= 1) return pool[0]
        let next = prev
        while (next === prev) {
          next = pool[Math.floor(Math.random() * pool.length)]
        }
        return next
      })
    }, intervalTime)

    return () => clearInterval(timerId)
  }, [pool, isRolling])

  const helperText = isRolling
    ? duration === INFINITE_DURATION
      ? 'Drumroll rolling continuously'
      : `Rolling for ${timer} seconds`
    : duration === INFINITE_DURATION
      ? 'Drumroll duration set to Infinite. Let the good times roll.'
      : `Ready to roll for ${duration} second${duration === 1 ? '' : 's'}`

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

        {showSpinWheel ? (
          <SpinWheel entries={pool} isRolling={isRolling} pickedEntry={pickedEntry} />
        ) : (
          <>
            <Box
              aria-hidden="true"
              sx={{ color: 'text.primary', lineHeight: 1 }}
            >
              <Pictograph name={face} size="clamp(3.5rem, 18vw, 5rem)" flip={isRolling && flip} />
            </Box>

            <Box sx={{ color: 'text.primary', lineHeight: 1 }}>
              <Pictograph name="drum" size="5rem" label="Drum" />
            </Box>

            {pool.length > 0 && (
              <Box
                component="button"
                type="button"
                onClick={editPickList}
                aria-label="Edit the pick list"
                sx={{
                  width: '100%',
                  maxWidth: 320,
                  p: 1.5,
                  font: 'inherit',
                  color: 'inherit',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: pickedEntry && !isRolling ? 'primary.main' : 'divider',
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="span"
                  sx={{
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    mb: 0.5,
                  }}
                >
                  {pickedEntry && !isRolling ? (
                    <>
                      <Pictograph name="trophy" size="1.1em" />
                      Winner
                    </>
                  ) : (
                    'Drawing Pool · tap to edit'
                  )}
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    color: pickedEntry && !isRolling ? 'primary.main' : 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pickedEntry && !isRolling ? pickedEntry : cyclingName}
                </Typography>
              </Box>
            )}
          </>
        )}

        <Typography variant="body1" color="text.secondary">
          {helperText}
        </Typography>

        {celebrationMessage && (
          <Typography variant="h5" component="div" aria-hidden="true">
            {celebrationMessage}
          </Typography>
        )}

        {!isRolling ? (
          <Box sx={{ width: '100%', maxWidth: 360, px: 2, my: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {duration === INFINITE_DURATION ? 'Infinite' : `${duration}s`}
              </Typography>
            </Stack>
            <Slider
              value={duration === INFINITE_DURATION ? 0 : duration}
              onChange={(_event, value) => {
                if (typeof value === 'number') {
                  setDuration(value === 0 ? INFINITE_DURATION : value)
                }
              }}
              min={0}
              max={30}
              step={1}
              marks={DURATION_MARKS}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => (val === 0 ? 'Infinite' : `${val}s`)}
              getAriaValueText={(val) => (val === 0 ? 'Infinite duration' : `${val} seconds`)}
              aria-label="Drumroll duration"
            />
          </Box>
        ) : (
          duration !== INFINITE_DURATION && (
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
          )
        )}

        <Button variant="text" onClick={() => setOpenSettings(true)}>
          Configure Settings
        </Button>

        <Typography variant="caption" color="text.secondary">
          Note: Not hearing sound? Make sure your device isn't on Silent Mode.
        </Typography>

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

        <QuickPickList />
      </Stack>
    </Box>
  )
}
