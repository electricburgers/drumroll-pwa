// Verifies every theme color combination meets WCAG 2.1 AA:
//   - 4.5:1 for text (button labels, body text)
//   - 3:1 for non-text UI component contrast (SC 1.4.11), e.g. a filled
//     button's surface against the page background
//
// Run with: node scripts/check-contrast.mjs

function srgbToLin(c) {
  const cs = c / 255
  return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4)
}
function relLum([r, g, b]) {
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b)
}
function hexToRgb(hex) {
  const n = hex.replace('#', '')
  return [parseInt(n.substring(0, 2), 16), parseInt(n.substring(2, 4), 16), parseInt(n.substring(4, 6), 16)]
}
function ratio(hex1, hex2) {
  const l1 = relLum(hexToRgb(hex1))
  const l2 = relLum(hexToRgb(hex2))
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

let failures = 0
function check(label, fg, bg, threshold) {
  const r = ratio(fg, bg)
  const pass = r >= threshold
  if (!pass) failures++
  console.log(`${pass ? 'PASS' : 'FAIL'} ${label}: ${r.toFixed(2)} (need ${threshold})`)
}

const backgrounds = {
  light: { default: '#F5F5F5', paper: '#FFFFFF' },
  dark: { default: '#000000', paper: '#050505' },
}

// text.primary / text.secondary as rendered (MUI defaults, alpha-blended over each background)
const text = {
  light: { primary: '#212121', secondary: '#666666' }, // ~rgba(0,0,0,.87) / ~rgba(0,0,0,.6) over white-ish bg
  dark: { primary: '#FFFFFF', secondary: '#B3B3B3' }, // #fff / ~rgba(255,255,255,.7) over black
}

// Each color-vision family provides a primary/secondary per light/dark mode.
// Primary and secondary sometimes need a mode-specific shade because the
// same hex can pass against one background (light or dark) but not the
// other at the 3:1 non-text threshold.
const palettes = {
  default: {
    light: { primary: '#A1000A', primaryText: '#FFFFFF', secondary: '#FA5050', secondaryText: '#000000' },
    dark: { primary: '#CC2936', primaryText: '#FFFFFF', secondary: '#FA5050', secondaryText: '#000000' },
  },
  redGreen: {
    light: { primary: '#0072B2', primaryText: '#FFFFFF', secondary: '#946000', secondaryText: '#FFFFFF' },
    dark: { primary: '#0072B2', primaryText: '#FFFFFF', secondary: '#E69F00', secondaryText: '#000000' },
  },
  blueYellow: {
    light: { primary: '#007A63', primaryText: '#FFFFFF', secondary: '#A6446E', secondaryText: '#FFFFFF' },
    dark: { primary: '#007A63', primaryText: '#FFFFFF', secondary: '#CC79A7', secondaryText: '#000000' },
  },
}

for (const [visionName, modes] of Object.entries(palettes)) {
  for (const [modeName, p] of Object.entries(modes)) {
    const bg = backgrounds[modeName]
    const t = text[modeName]
    console.log(`\n-- ${visionName}/${modeName} --`)
    check('text.primary vs background.default', t.primary, bg.default, 4.5)
    check('text.secondary vs background.default', t.secondary, bg.default, 4.5)
    check('primary button label', p.primaryText, p.primary, 4.5)
    check('primary surface vs background (non-text)', p.primary, bg.default, 3)
    check('secondary button label', p.secondaryText, p.secondary, 4.5)
    check('secondary surface vs background (non-text)', p.secondary, bg.default, 3)
  }
}

console.log(failures === 0 ? '\nAll combinations pass WCAG AA.' : `\n${failures} check(s) FAILED.`)
process.exit(failures === 0 ? 0 : 1)
