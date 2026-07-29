# Changelog

All notable changes to this project will be documented in this file.

This is a rebuild of the original drumroll app by **heystevegray** as a
client-only static PWA (Vite + React + TypeScript + MUI + howler).

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
