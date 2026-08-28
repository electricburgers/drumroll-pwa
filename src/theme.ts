import { createTheme, type Theme } from '@mui/material/styles'
import type { ColorVision, ResolvedColorMode } from './constants'

interface AccentPalette {
  primary: { main: string; contrastText: string }
  secondary: { main: string; contrastText: string }
}

// Every combination below is verified against WCAG 2.1 AA in scripts/check-contrast.mjs:
// 4.5:1 for button label text, 3:1 for the button surface against the page background.
// Primary/secondary sometimes need a mode-specific shade because the same hex can pass
// against one background (light or dark) but not the other at the 3:1 threshold.
export const ACCENTS: Record<ColorVision, Record<ResolvedColorMode, AccentPalette>> = {
  default: {
    light: {
      primary: { main: '#A1000A', contrastText: '#FFFFFF' },
      secondary: { main: '#FA5050', contrastText: '#000000' },
    },
    dark: {
      primary: { main: '#CC2936', contrastText: '#FFFFFF' },
      secondary: { main: '#FA5050', contrastText: '#000000' },
    },
  },
  redGreen: {
    light: {
      primary: { main: '#0072B2', contrastText: '#FFFFFF' },
      secondary: { main: '#946000', contrastText: '#FFFFFF' },
    },
    dark: {
      primary: { main: '#0072B2', contrastText: '#FFFFFF' },
      secondary: { main: '#E69F00', contrastText: '#000000' },
    },
  },
  blueYellow: {
    light: {
      primary: { main: '#007A63', contrastText: '#FFFFFF' },
      secondary: { main: '#A6446E', contrastText: '#FFFFFF' },
    },
    dark: {
      primary: { main: '#007A63', contrastText: '#FFFFFF' },
      secondary: { main: '#CC79A7', contrastText: '#000000' },
    },
  },
}

const BACKGROUNDS: Record<ResolvedColorMode, { default: string; paper: string }> = {
  light: { default: '#F5F5F5', paper: '#FFFFFF' },
  dark: { default: '#000000', paper: '#050505' },
}

export interface PictographPalette {
  /** Drum shell + party-popper cone. Audited >= 3:1 vs the page background. */
  red: string
  /** Drumsticks + party-popper streamer. Audited >= 3:1 vs the page background. */
  wood: string
  /** Trophy + confetti. Audited >= 3:1 vs the page background. */
  gold: string
  /** Waving hand. Audited >= 3:1 vs the page background. */
  skin: string
  /** Drum batter head — a decorative interior fill, sits inside the red rim. */
  drumHead: string
  /** Eye whites — a decorative interior fill, sits inside a currentColor outline. */
  eyeSclera: string
  /** Eye pupils — painted on the (light) sclera, so kept dark in both modes. */
  eyePupil: string
}

// Named object colours for the drawn pictographs (Pictograph.tsx). Each theme
// gets its own set: no single hex clears the 3:1 non-text threshold against
// both the near-white light background and the black dark one, so the primary
// colours (red / wood / gold / skin) are verified per mode in
// scripts/check-contrast.mjs. The interior fills (drumHead, eyeSclera) are
// decorative — enclosed by an outline — and are not part of that audit.
export const PICTOGRAPH_PALETTE: Record<ResolvedColorMode, PictographPalette> = {
  light: {
    red: '#BC3A1E',
    wood: '#7A5230',
    gold: '#8A6400',
    skin: '#96592E',
    drumHead: '#E8CDAD',
    eyeSclera: '#FFFFFF',
    eyePupil: '#2E2118',
  },
  dark: {
    red: '#FF8A66',
    wood: '#D7A56E',
    gold: '#F0B62E',
    skin: '#E6AB7C',
    drumHead: '#4A3A2A',
    eyeSclera: '#ECECEC',
    eyePupil: '#2E2118',
  },
}

const MIN_TOUCH_TARGET = 44

export function getTheme(mode: ResolvedColorMode, colorVision: ColorVision): Theme {
  const accent = ACCENTS[colorVision][mode]
  const background = BACKGROUNDS[mode]

  return createTheme({
    palette: {
      mode,
      primary: accent.primary,
      secondary: accent.secondary,
      background,
    },
    components: {
      MuiIconButton: {
        styleOverrides: {
          root: { minWidth: MIN_TOUCH_TARGET, minHeight: MIN_TOUCH_TARGET },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { minHeight: MIN_TOUCH_TARGET },
          // Outlined/text buttons render the accent color directly as
          // freestanding text, which only clears the 3:1 non-text threshold
          // (verified above), not the 4.5:1 text threshold. Force these to
          // the already-verified text.primary color instead.
          outlined: ({ theme }) => ({
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.primary,
          }),
          text: ({ theme }) => ({ color: theme.palette.text.primary }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: MIN_TOUCH_TARGET,
            // Same freestanding-text issue as outlined/text buttons above.
            '&.Mui-selected': { color: theme.palette.text.primary },
          }),
        },
      },
    },
  })
}
