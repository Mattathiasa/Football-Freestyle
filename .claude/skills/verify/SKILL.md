---
name: verify
description: Build, launch, and drive this Vite+React portfolio site to verify changes end-to-end in a real browser.
---

# Verifying Football-Freestyle changes

Vite 6 + React 19 SPA (no router, one page assembled in `App.tsx`). Tailwind via CDN in `index.html`. React StrictMode is ON.

## Build / launch

```bash
npx tsc --noEmit          # vite build does NOT typecheck
npm run dev               # serves http://localhost:3000 (background it)
```

The `/index.css doesn't exist` build warning is pre-existing and harmless.

## Drive (Playwright)

Install once per environment: `npx playwright install chromium` (headless shell). Playwright must be npm-installed in the script's cwd — it is not a repo dependency.

Key drive facts learned the hard way:
- Wait for `#highlights` selector — the `LoadingScreen` delays app mount, so `window.load` may fire long before React renders.
- Section anchors: `#journey` (700vh football canvas scrollytelling — regression-check by scrolling through it down AND back up, and sampling canvas pixels for non-black content), `#highlights` (GSAP-pinned featured reel + archive grid), `#connect`, `#footer`.
- The reel pin: assert `.pin-spacer` exists on desktop ≥768px, absent on mobile/reduced-motion. Simulate scrolling with `page.mouse.wheel` loops, not instant `scrollTo`, when testing the snap behavior — snap needs scroll-velocity settling.
- Snap correctness check: after settling, one `[data-reel-card]`'s `getBoundingClientRect()` center should be ≈0px from viewport center.
- Watch `page.on('response')` for 4xx: **Cloudinary rejects `g_auto` on video transforms (400)** — only `g_center` works on `.mp4` URLs; `g_auto` is fine on `.jpg`. `videoCache.getOptimizedUrl(url, ctx, 'auto')` produces `g_auto` video URLs — avoid the `'auto'` aspect for videos.
- Videos won't render frames in headless Chromium (codec-less shell) — assert `video.paused === false` counts instead of pixels; the VideoPlayer modal shows "LOADING..." forever there, which is expected in headless only.
- Test 3 profiles: desktop 1440x900, mobile 390x844 (`isMobile, hasTouch`), and `reducedMotion: 'reduce'` (expect: no pin-spacer, no autoplaying videos, archive cards opacity 1 immediately).
