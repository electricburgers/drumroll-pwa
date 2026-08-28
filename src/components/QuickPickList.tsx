import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  FormatListBulleted as FormatListBulletedIcon,
} from '@mui/icons-material'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useLayoutEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/useAppContext'

const PANEL_ID = 'quick-pick-list-panel'

/** id on the outer container, so other components can scroll it into view. */
export const PICK_LIST_ANCHOR_ID = 'quick-pick-list'

/**
 * A collapsible copy of Settings → Winner drawing → Random pick list, docked
 * under the drumroll buttons so the list can be pasted without opening
 * Settings. On mobile it becomes a fixed bottom dock; a spacer reserves its
 * height so nothing hides behind it. Expanded by default. Open state lives in
 * the app context so tapping the drawing pool can open it for editing.
 */
export function QuickPickList() {
  const { entriesText, setEntriesText, defaultGridSpacing, pickListOpen, setPickListOpen } =
    useAppContext()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const dockRef = useRef<HTMLDivElement>(null)
  const [dockHeight, setDockHeight] = useState(0)

  useLayoutEffect(() => {
    if (!isMobile || !dockRef.current) {
      setDockHeight(0)
      return
    }
    const element = dockRef.current
    const update = () => setDockHeight(element.offsetHeight)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [isMobile])

  const body = (
    <Box sx={{ px: defaultGridSpacing, pb: defaultGridSpacing }}>
      <Stack
        component="button"
        type="button"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setPickListOpen((value) => !value)}
        aria-expanded={pickListOpen}
        aria-controls={PANEL_ID}
        aria-label={pickListOpen ? 'Hide pick list' : 'Show pick list'}
        sx={{
          width: '100%',
          font: 'inherit',
          color: 'text.primary',
          bgcolor: 'transparent',
          border: 0,
          cursor: 'pointer',
          py: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <FormatListBulletedIcon fontSize="small" color="action" />
          <Typography variant="subtitle2">Pick list</Typography>
        </Stack>
        {pickListOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Stack>

      <Collapse in={pickListOpen} id={PANEL_ID}>
        <TextField
          multiline
          minRows={3}
          maxRows={isMobile ? 4 : 8}
          fullWidth
          size="small"
          value={entriesText}
          onChange={(event) => setEntriesText(event.target.value)}
          placeholder={'[Craft partner name here]\n[Location here]\n[Names here]'}
          aria-label="Random pick list entries"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          First line is the craft partner, second is the location, the rest are names in the
          draw. Same list as the Winner drawing section in Settings.
        </Typography>
      </Collapse>
    </Box>
  )

  if (isMobile) {
    return (
      <>
        <Box aria-hidden sx={{ flexShrink: 0, width: '100%', height: dockHeight }} />
        <Paper
          ref={dockRef}
          id={PICK_LIST_ANCHOR_ID}
          square
          elevation={8}
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: (t) => t.zIndex.appBar,
            borderTop: 1,
            borderColor: 'divider',
            pl: 'env(safe-area-inset-left)',
            pr: 'env(safe-area-inset-right)',
            pb: 'env(safe-area-inset-bottom)',
          }}
        >
          {body}
        </Paper>
      </>
    )
  }

  return (
    <Box
      id={PICK_LIST_ANCHOR_ID}
      sx={{
        width: '100%',
        maxWidth: 420,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      {body}
    </Box>
  )
}
