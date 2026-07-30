# Changelog

All notable changes to this project will be documented in this file.

This is a rebuild of the original drumroll app by **heystevegray** as a
client-only static PWA (Vite + React + TypeScript + MUI + howler).

## [1.3.0] - 2026-07-30

### Changed

- Settings drawer header ("Settings" title and close button) is now
  sticky, staying visible while the rest of the panel scrolls.
- Settings reorganized into a more logical order: Drumroll (duration,
  fade-out) → Winner drawing (pick list, spin wheel — promoted out of
  the old catch-all "Advanced" section, since it's a core feature) →
  Appearance (theme, color vision).
- Spin wheel labels no longer use a fixed 25-character cutoff — the
  wheel is now a constant, mobile-safe size and each label is truncated
  to whatever width actually fits its slice (measured, not guessed),
  which was overflowing past the wheel's center and overlapping other
  labels for longer names.

## [1.2.0] - 2026-07-30

### Changed

- Spin wheel labels are truncated to 25 characters with an ellipsis
  instead of wrapping/shrinking to fit — the full name still appears in
  the congratulations message, only the wheel's label is shortened.
- Wheel label font size is now fixed (15px) and never scaled down for
  long names or large lists, fixing text that had gotten too small to
  read comfortably.
- Slice fill lightness is now searched per-hue to guarantee at least
  7:1 contrast with its label (WCAG AAA for normal text), up from the
  previous 4.5:1 (AA) guarantee.
- Wheel diameter is capped to fit comfortably on a 375px-wide viewport
  (iPhone SE 2020 and up) alongside the page's padding and button row;
  verified with no horizontal overflow at that width in Chrome.

## [1.1.0] - 2026-07-30

### Added

- The pick list now reserves its first two entries as the craft partner
  name and location; every entry after that is the drawing pool. Winning
  now shows "Congratulations to {name}! You've won a craft beer gift card
  to {craft partner} in {location}. Cheers!" instead of a plain name
  reveal, and the spin wheel (when enabled) only spins over the pool.

## [1.0.0] - 2026-07-30

### Changed

- Spin wheel visualizer rework: the wheel's size now adapts to its
  content (more entries and longer names grow the wheel, up to a cap;
  very long lists fall back to shrinking the font rather than growing
  forever) instead of staying a fixed size with truncated labels.
- Long names (up to 60 characters) wrap onto two lines instead of being
  truncated with an ellipsis.
- Labels are laid out as straight (non-curved) radial text, left edge
  toward the rim and reading in toward center — flipped to read
  center-to-rim on the half of the wheel where that would otherwise
  render upside down.
- Each slice's label color (black or white) is now chosen per-slice by
  computing actual WCAG contrast ratios against the slice's fill, which
  guarantees at least 4.58:1 (above the 4.5:1 AA threshold for normal
  text) for any hue, independent of the app's light/dark theme.

## [0.9.0] - 2026-07-30

### Added

- Optional spin wheel visualizer (Settings → Advanced): shows the random
  pick list as a colored spinning wheel in place of the eyes and drum, and
  lands on the entry picked when you press Stop or Fade Out.

## [0.8.0] - 2026-07-29

### Changed

- The 👀 emoji now snaps between its normal and mirrored orientation
  instead of animating the flip, giving the effect of eyes darting left
  and right rather than the whole emoji rotating.

## [0.7.0] - 2026-07-29

### Added

- Fade Out now also picks and announces a random entry from the pick list,
  matching the reveal behavior of the regular Stop button, instead of
  silently clearing any previous pick.

## [0.6.0] - 2026-07-29

### Fixed

- Fade Out no longer gets undone if it's triggered while the drumroll intro
  sound is still playing: the intro's completion handler (which starts the
  looping drumroll sound) was still firing after a fade-out had begun,
  snapping the volume back up instead of finishing the fade to silence.

## [0.5.0] - 2026-07-29

### Added

- Random pick list in Settings → Advanced: paste a comma- or
  newline-separated list, and pressing Stop randomly picks one entry and
  shows/announces it alongside the reveal.
- Screen-reader support: a live status region announces Rolling / Stopped /
  Celebrating (and the picked entry) without spamming per-second countdown
  updates; Settings toggle groups and the fade-out slider now have proper
  accessible names.

### Changed

- Countdown progress bar now animates smoothly (1s linear transition
  matching the tick interval) instead of snapping every second.
- The in-app drum illustration is now the native 🥁 emoji instead of the
  generated `logo.svg` image (the PWA icon set still uses `logo.svg`).
- Outlined/text buttons and selected toggle buttons now always use
  `text.primary` for their label color instead of the raw accent color,
  fixing WCAG AA text-contrast failures found in dark mode (and one in
  light mode) across all three color-vision palettes.

## [0.4.0] - 2026-07-29

### Added

- Visual progress bar that shrinks as the drumroll timer counts down (shown
  only for numbered durations, not Infinite).

## [0.3.0] - 2026-07-29

### Added

- Second stop control, "Fade Out", which stops only the drumroll with a
  configurable fade-out (default 2.5s) and never plays the end/horn sound.
- Fade-out duration slider in Settings.

### Fixed

- App version in Settings now reads directly from `package.json` at build
  time, so it stays in sync instead of being frozen to whatever version was
  set when the dev server last started.

### Changed

- The standalone Horn button is now disabled while the drumroll is rolling.

## [0.2.0] - 2026-07-29

### Added

- Horn button to play an air-horn sound on demand, independent of the
  drumroll — Stop only halts the drumroll and never triggers the horn.

### Changed

- Idle-state emoji changed from 😐 to ⏸️.

## [0.1.0] - 2026-07-29

### Added

- App version and original author attribution in the Settings drawer.
- This changelog.

### Changed

- Removed the GitHub source-code link from the top app bar.

### Fixed

- Rendering and drumroll playback issues.

## [0.0.0] - 2026-07-29

### Added

- Initial rebuild of the original Next.js/Vercel drumroll app as a
  client-only static PWA.
