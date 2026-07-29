# drumroll

A one-page drumroll-on-demand tool: press Play, a drum roll sound plays and
loops, an emoji reacts, an optional countdown ticks down, and Stop (or
timeout) plays a cymbal-crash end sound.

This is a rebuild of the original Next.js/Vercel app as a **client-only
static PWA** for GitHub Pages: Vite + React 18 + TypeScript + MUI v5 +
howler, with a real offline-capable service worker via `vite-plugin-pwa`
(the original shipped a stub service worker that did no caching at all —
this is a deliberate upgrade).

## Asset placeholders — replace before shipping publicly

The three audio files in `public/audio/` and the icons in `public/` are
**synthesized/generated placeholders**, not the original assets (no rights
to redistribute those here):

- `public/audio/drumroll-start.wav`, `drumroll-loop.wav`, `drumroll-end.wav`
  — currently short noise bursts generated with `ffmpeg`, just enough to
  exercise the start → loop → stop sequencing. Swap in real drum roll /
  cymbal crash recordings with the same filenames.
- `public/logo.svg` — a hand-built vector drum illustration used as the
  **single source image** for every generated PWA icon (favicon, Android/PWA
  icons, maskable icon, Apple touch icon, and all iOS splash screens — see
  below) *and* as the in-app 100×100 illustration. Swap this one file for
  your own artwork and re-run `npm run build` to regenerate the entire icon
  set from it.

Nothing else needs to change — paths are wired into `index.html`,
`vite.config.ts`, and `src/components/Drumroll.tsx`.

## Cross-platform PWA installability

This targets installability on desktop Safari, iOS/iPadOS Safari ("Add to
Home Screen"), and Android Chrome, with a real custom icon everywhere:

- **Icon + splash screen generation**: `vite.config.ts` uses
  `@vite-pwa/assets-generator`'s `minimal-2023` preset combined with
  `combinePresetAndAppleSplashScreens`, run from the single `public/logo.svg`
  source at every `npm run build`. This produces the favicon, Android/PWA
  icons (64/192/512), a maskable 512 icon, the 180×180 Apple touch icon, and
  a full set of light **and** dark Apple splash screens for every iPhone/iPad
  size — all injected as `<link>` tags automatically (see the generated
  `<head>` of `dist/index.html`). Nothing here needs to be hand-maintained.
- **iOS/Safari meta tags** (`index.html`): `apple-mobile-web-app-capable`,
  `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`, and
  `viewport-fit=cover` (for safe-area support on notched devices).
- **theme-color**: a single `<meta id="theme-color-meta" name="theme-color">`
  tag, kept in sync with the current accent color at runtime by
  `src/ThemedApp.tsx` (it changes with the color-vision setting; light/dark
  mode doesn't change the accent color, only the background).
- Manifest `start_url`/`scope`/`id` are all scoped to the `/drumroll-pwa/`
  base path.

## Appearance: light/dark + colorblind-safe modes

Settings → **Appearance** has two independent controls, both persisted to
`localStorage`:

- **Theme** (`drumroll-color-mode`): System / Light / Dark. "System" follows
  `prefers-color-scheme` live. There's also a quick-toggle icon in the top
  app bar that cycles System → Light → Dark.
- **Color vision** (`drumroll-color-vision`): Default / Protanopia &
  Deuteranopia-friendly / Tritanopia-friendly. This swaps the Play/Stop
  button accent colors for palettes distinguishable under the corresponding
  color vision deficiency (Okabe-Ito-derived blue/amber for red-green CVD;
  a teal/magenta pair for blue-yellow CVD) — it doesn't touch light/dark.

Every (color vision × light/dark) combination — 6 total — is verified against
WCAG 2.1 AA in `scripts/check-contrast.mjs` (4.5:1 for text and button
labels, 3:1 for a filled button's surface against the page background):

```bash
npm run check:contrast
```

If you change any palette value in `src/theme.ts`, re-run this script before
shipping — it exits non-zero on any failing pair.

## Mobile-first

Layout defaults to the small-screen case first (MUI's `sx` breakpoint object
syntax is `theme.breakpoints.up()`-based, i.e. mobile-first already): the
Settings drawer goes full-width below the `sm` breakpoint, buttons and icon
buttons have a 44px minimum touch target, the emoji uses `clamp()` for
responsive sizing, and safe-area insets (`env(safe-area-inset-*)`) pad the
app bar top and the main content / drawer bottom so nothing sits under a
notch or the iOS home indicator. `100svh` is used instead of `100vh` to avoid
mobile browser toolbar resize jumps.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Deploying to GitHub Pages

This repo is configured for `https://<user>.github.io/drumroll-pwa/`
(`base: '/drumroll-pwa/'` in `vite.config.ts`, and matching `start_url` /
`scope` in the PWA manifest). If you deploy under a different repo name or
to a `<user>.github.io` root repo, update `base` in `vite.config.ts`
accordingly.

1. Push to `main` — `.github/workflows/deploy.yml` builds and deploys
   automatically via `actions/upload-pages-artifact` +
   `actions/deploy-pages`.
2. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

### Why there's a top-level `404.html`

GitHub Pages natively serves a top-level `404.html` for any unmatched route.
Since this app has no client-side router, `404.html` is a second real Vite
HTML entry point (see `build.rollupOptions.input` in `vite.config.ts`),
built alongside `index.html` rather than relying on a JS redirect trick.

## Tech stack

- Vite + React 18 + TypeScript
- MUI v5 (`@mui/material`, `@mui/icons-material`)
- `howler` for audio playback/sequencing
- `vite-plugin-pwa` (Workbox) for the manifest + offline-capable service
  worker
- `@vite-pwa/assets-generator` for generating the full icon + Apple splash
  screen set from `public/logo.svg`
