import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { type ReactElement } from 'react'
import { useIconStyle } from '../hooks/useIconStyle'
import { PICTOGRAPH_PALETTE, type PictographPalette } from '../theme'

export type PictographName = 'drum' | 'trophy' | 'tada' | 'eyes' | 'pause' | 'wave'

const EMOJI: Record<PictographName, string> = {
  drum: '🥁',
  trophy: '🏆',
  tada: '🎉',
  eyes: '👀',
  pause: '⏸️',
  wave: '👋',
}

// Lucide-family geometry (the same set scorekeeper draws its drum and trophy
// from), sized to a 24x24 viewBox. Object colours come from the per-theme
// PICTOGRAPH_PALETTE (src/theme.ts) — no platform emoji can be themed, and a
// mid grey that a single hex would need to clear 3:1 on both a near-white and a
// black background is neither. pause and eyes' outlines stay `currentColor`:
// they are monochrome symbols, not pictures of coloured objects, so they take
// the already-audited surrounding text colour (the rationale scorekeeper
// applies to its play/stop glyphs).
const PICT: Record<PictographName, (p: PictographPalette) => ReactElement> = {
  drum: (p) => (
    <>
      <path d="M2 9v8a10 5 0 0 0 20 0V9" stroke={p.red} />
      <ellipse cx="12" cy="9" rx="10" ry="5" stroke={p.red} fill={p.drumHead} />
      <path d="m2 2 6 6" stroke={p.wood} />
      <path d="m22 2-6 6" stroke={p.wood} />
    </>
  ),
  trophy: (p) => (
    <g stroke={p.gold}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </g>
  ),
  tada: (p) => (
    <>
      <path d="M5.8 11.3 2 22l10.7-3.79" stroke={p.red} />
      <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" stroke={p.red} />
      <g stroke={p.gold}>
        <path d="M4 3h.01" />
        <path d="M22 8h.01" />
        <path d="M15 2h.01" />
        <path d="M22 20h.01" />
      </g>
      <path
        d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L15 10"
        stroke={p.wood}
      />
      <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11a1.69 1.69 0 0 1-1.4 1.22" stroke={p.wood} />
      <path d="M11 2 9.67 2.09A1.69 1.69 0 0 0 8.5 3.3l-.33.82" stroke={p.wood} />
    </>
  ),
  eyes: (p) => (
    <>
      <ellipse cx="8" cy="12" rx="4" ry="5" fill={p.eyeSclera} />
      <ellipse cx="16" cy="12" rx="4" ry="5" fill={p.eyeSclera} />
      <circle cx="9" cy="12.5" r="1.7" fill={p.eyePupil} stroke="none" />
      <circle cx="17" cy="12.5" r="1.7" fill={p.eyePupil} stroke="none" />
    </>
  ),
  pause: () => (
    <>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </>
  ),
  wave: (p) => (
    <g stroke={p.skin}>
      <path d="M18 11V6a2 2 0 0 0-4 0" />
      <path d="M14 10V4a2 2 0 0 0-4 0v2" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </g>
  ),
}

export interface PictographProps {
  name: PictographName
  /** Rendered size (any CSS length). Defaults to `1em` so it tracks font size. */
  size?: number | string
  /** Accessible label. Omit for decorative use (the default, `aria-hidden`). */
  label?: string
  flip?: boolean
  className?: string
}

export function Pictograph({ name, size = '1em', label, flip = false, className }: PictographProps) {
  const iconStyle = useIconStyle()
  const mode = useTheme().palette.mode
  const decorative = label === undefined

  if (iconStyle === 'emoji') {
    return (
      <Box
        component="span"
        className={className}
        role={decorative ? undefined : 'img'}
        aria-label={label}
        aria-hidden={decorative || undefined}
        sx={{
          display: 'inline-block',
          lineHeight: 1,
          fontSize: size,
          transform: flip ? 'scaleX(-1)' : undefined,
        }}
      >
        {EMOJI[name]}
      </Box>
    )
  }

  return (
    <Box
      component="svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={decorative ? undefined : 'img'}
      aria-label={label}
      aria-hidden={decorative || undefined}
      sx={{
        display: 'inline-block',
        verticalAlign: 'middle',
        width: size,
        height: size,
        flexShrink: 0,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    >
      {PICT[name](PICTOGRAPH_PALETTE[mode === 'dark' ? 'dark' : 'light'])}
    </Box>
  )
}
