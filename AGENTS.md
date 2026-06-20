# Project Horizon

A Vite + React 19 + TypeScript single-page app ("Project Horizon") — an accessible sports
streaming UI with player POV cameras. It runs entirely client-side on mock / pre-generated
data (`src/data/mockData.ts`, `public/bruno_tracks.json`); there is no live backend service.

The `backend/track_video.py` and `preprocessing/*.py` scripts are offline, one-off ML/AWS
video-preprocessing tools (YOLO tracking, boto3) that were used to generate the committed
tracking JSON. They are NOT a runtime dependency of the web app and do not need to run to
develop or test the frontend.

## Cursor Cloud specific instructions

### Commands (see `package.json` scripts)
- Dev server: `npm run dev -- --host` (Vite, serves on port 5173).
- Build: `npm run build` (`tsc -b && vite build`).
- Lint: `npm run lint` (ESLint).

### Required workaround: missing video assets block the dev server
The three POV video assets `src/assets/goalie_pov.mov`, `src/assets/goalie_upper.mov`, and
`src/assets/ref_pov.mov` are **gitignored** (`.gitignore` ignores `*.mov`) and are NOT present
in a fresh checkout. Because `App.tsx` eagerly imports `StreamPage` -> `PlayerCard` /
`POVVideoOverlay`, which statically import these files, their absence makes Vite throw a
fatal full-screen error overlay on **every** route (including the homepage) and breaks
`npm run build`.

Before running the dev server or building, create placeholder files for the missing assets:

```
touch src/assets/goalie_pov.mov src/assets/goalie_upper.mov src/assets/ref_pov.mov
```

These empty placeholders let the entire app boot, build, and run. The main stream video
(`src/assets/bruno.mov`) and several others ARE committed-present, so the core stream page
(video playback, penalty overlay, LIVE badge, controls, POV stat cards) works fully. Only the
secondary per-player POV video clips that use the placeholder files will be blank. For full
fidelity, replace the placeholders with the real footage if available.

This step is intentionally NOT in the startup update script (it works around missing media,
not dependencies). Run it manually each session if the files are absent.

### Known pre-existing lint failures (not environment issues)
`npm run lint` currently reports 8 `react-hooks/set-state-in-effect` errors in existing source
(e.g. `src/pages/ProcessingPage.tsx`, `src/pages/StreamPage.tsx`). These are pre-existing code
issues, unrelated to environment setup — do not treat them as setup breakage.

### App flow for manual testing
Home (`/`, games grid) -> click a match card -> `/processing/:gameId` (30s neural-network
animation, then auto-navigates) -> `/stream/:gameId` (live stream). To skip the 30s wait during
testing, navigate directly to a stream URL, e.g. `http://localhost:5173/stream/mun-ars-facup`.
