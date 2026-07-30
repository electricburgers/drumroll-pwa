import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useEffect, useMemo, useRef, useState } from 'react'

const SPIN_STEP_DEG = 9
const SPIN_INTERVAL_MS = 40
const LANDING_SPINS = 4
const LANDING_TRANSITION = 'transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)'
const SPINNING_TRANSITION = `transform ${SPIN_INTERVAL_MS}ms linear`

// Fixed and never scaled down, so labels stay legible regardless of entry
// count.
const FONT_SIZE = 15
// Fixed diameter (280px) chosen to fit comfortably within an iPhone SE
// (2020, 375px CSS viewport) alongside the page's padding and button row.
const RADIUS = 140
const STROKE_MARGIN = 4
// Labels sit on a ring starting near the rim (START_FRACTION * radius) and
// are truncated with an ellipsis to whatever width actually fits before
// MIN_INNER_FRACTION * radius, so long names never run into the hub or
// overlap their neighbors.
const START_FRACTION = 0.88
const MIN_INNER_FRACTION = 0.16
const SATURATION = 0.68
// WCAG AAA normal-text contrast threshold (1.4.6).
const AAA_CONTRAST = 7

let measureCtx: CanvasRenderingContext2D | null = null
function getMeasureContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d')
  return measureCtx
}

function measureWidth(ctx: CanvasRenderingContext2D | null, text: string): number {
  return ctx ? ctx.measureText(text).width : text.length * FONT_SIZE * 0.55
}

// Finds the longest prefix of `text` (plus an ellipsis) that measures
// within maxWidth, so a label never overflows its slice's available space.
function fitLabel(ctx: CanvasRenderingContext2D | null, text: string, maxWidth: number): string {
  if (measureWidth(ctx, text) <= maxWidth) return text

  let lo = 0
  let hi = text.length
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2)
    const candidate = `${text.slice(0, mid)}…`
    if (measureWidth(ctx, candidate) <= maxWidth) lo = mid
    else hi = mid - 1
  }
  return `${text.slice(0, lo)}…`
}

function polarToCartesian(center: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return { x: center + radius * Math.cos(angleRad), y: center + radius * Math.sin(angleRad) }
}

function describeSlice(center: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(center, radius, endAngle)
  const end = polarToCartesian(center, radius, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

function normalizeAngle(deg: number): number {
  let a = deg % 360
  if (a > 180) a -= 360
  if (a <= -180) a += 360
  return a
}

// WCAG relative luminance / contrast ratio (sRGB, per WCAG 2.1).
function relativeLuminance(r: number, g: number, b: number): number {
  const toLinear = (c: number) => {
    const cs = c / 255
    return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function contrastRatio(l1: number, l2: number): number {
  const [a, b] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (a + 0.05) / (b + 0.05)
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let rgb: [number, number, number]
  if (h < 60) rgb = [c, x, 0]
  else if (h < 120) rgb = [x, c, 0]
  else if (h < 180) rgb = [0, c, x]
  else if (h < 240) rgb = [0, x, c]
  else if (h < 300) rgb = [x, 0, c]
  else rgb = [c, 0, x]
  return [(rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255]
}

function luminanceAt(hue: number, l: number): number {
  return relativeLuminance(...hslToRgb(hue, SATURATION, l))
}

// For a given hue, searches outward from mid-lightness for the closest
// lightness that clears AAA_CONTRAST with white text (going darker) and
// with black text (going lighter), then keeps whichever needed the
// smaller adjustment — this stays as vivid as possible while guaranteeing
// 7:1 contrast for every hue, independent of the app's light/dark theme
// (slice fills are painted pixels, not theme-driven).
function findAAALightness(hue: number): { l: number; textColor: string } {
  let darkL = 0.5
  while (darkL > 0 && contrastRatio(luminanceAt(hue, darkL), 1) < AAA_CONTRAST) {
    darkL = Math.max(0, darkL - 0.01)
  }
  let lightL = 0.5
  while (lightL < 1 && contrastRatio(luminanceAt(hue, lightL), 0) < AAA_CONTRAST) {
    lightL = Math.min(1, lightL + 0.01)
  }

  return 0.5 - darkL <= lightL - 0.5 ? { l: darkL, textColor: '#FFFFFF' } : { l: lightL, textColor: '#000000' }
}

function sliceStyle(index: number, total: number): { fill: string; textColor: string } {
  const hue = (360 * index) / total
  const { l, textColor } = findAAALightness(hue)
  const [r, g, b] = hslToRgb(hue, SATURATION, l)
  return { fill: `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`, textColor }
}

interface SpinWheelProps {
  entries: string[]
  isRolling: boolean
  pickedEntry: string | null
}

export function SpinWheel({ entries, isRolling, pickedEntry }: SpinWheelProps) {
  const theme = useTheme()
  const [rotation, setRotation] = useState(0)
  const rotationRef = useRef(0)
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRolling) {
      spinIntervalRef.current = setInterval(() => {
        rotationRef.current += SPIN_STEP_DEG
        setRotation(rotationRef.current)
      }, SPIN_INTERVAL_MS)
    } else if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current)
      spinIntervalRef.current = null
    }

    return () => {
      if (spinIntervalRef.current) clearInterval(spinIntervalRef.current)
      spinIntervalRef.current = null
    }
  }, [isRolling])

  useEffect(() => {
    if (!pickedEntry || entries.length === 0) return
    const index = entries.indexOf(pickedEntry)
    if (index === -1) return

    const segment = 360 / entries.length
    // Land the middle of the picked slice under the pointer at the top (0deg).
    const pointerTarget = 360 - (index * segment + segment / 2)
    const currentMod = ((rotationRef.current % 360) + 360) % 360
    const delta = (((pointerTarget - currentMod) % 360) + 360) % 360

    rotationRef.current += delta + LANDING_SPINS * 360
    setRotation(rotationRef.current)
  }, [pickedEntry, entries])

  const labels = useMemo(() => {
    if (entries.length === 0) return []

    const ctx = getMeasureContext()
    if (ctx) ctx.font = `${FONT_SIZE}px ${theme.typography.fontFamily}`

    // The point where a slice's tangential clearance drops below the text
    // height caps how far in a label can run without touching its neighbor.
    const tangentialInner =
      entries.length > 1 ? FONT_SIZE / (2 * Math.sin(Math.PI / entries.length)) : 0
    const innerRadius = Math.max(tangentialInner, RADIUS * MIN_INNER_FRACTION)
    const availableWidth = Math.max(0, RADIUS * START_FRACTION - innerRadius)

    return entries.map((entry) => fitLabel(ctx, entry, availableWidth))
  }, [entries, theme.typography.fontFamily])

  if (entries.length === 0) return null

  const center = RADIUS + STROKE_MARGIN
  const size = center * 2
  const segment = 360 / entries.length
  const textRadius = RADIUS * START_FRACTION

  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'relative',
        width: size,
        height: size,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
      }}
    >
      <Box
        component="svg"
        viewBox={`0 0 ${size} ${size}`}
        sx={{
          width: '100%',
          height: '100%',
          transform: `rotate(${rotation}deg)`,
          transition: isRolling ? SPINNING_TRANSITION : LANDING_TRANSITION,
        }}
      >
        {entries.map((entry, index) => {
          const startAngle = index * segment
          const endAngle = startAngle + segment
          const midAngle = startAngle + segment / 2
          const point = polarToCartesian(center, textRadius, midAngle)

          const rawRotation = normalizeAngle(midAngle + 90)
          const flipped = rawRotation > 90 || rawRotation < -90
          const textRotation = flipped ? normalizeAngle(rawRotation - 180) : rawRotation
          const anchor = flipped ? 'end' : 'start'

          const { fill, textColor } = sliceStyle(index, entries.length)

          return (
            <g key={`${entry}-${index}`}>
              <path
                d={describeSlice(center, RADIUS, startAngle, endAngle)}
                fill={fill}
                stroke={theme.palette.background.paper}
                strokeWidth={1}
              />
              <text
                x={point.x}
                y={point.y}
                fill={textColor}
                fontSize={FONT_SIZE}
                textAnchor={anchor}
                dominantBaseline="middle"
                transform={`rotate(${textRotation} ${point.x} ${point.y})`}
              >
                {labels[index]}
              </text>
            </g>
          )
        })}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: `16px solid ${theme.palette.text.primary}`,
        }}
      />
    </Box>
  )
}
