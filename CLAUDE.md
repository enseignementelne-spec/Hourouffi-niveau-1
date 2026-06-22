# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LearnHub Kids / Hurûfî** — A React PWA for teaching Arabic to young children (ages 5–8) in French-speaking environments. The app is entirely in Arabic/French, with content organized around letters, phonemes, syllables, vocabulary, songs, and geography of Arab countries.

## Commands

All commands run from the `app/` directory:

```bash
cd app

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Check for missing media files
npm run media:check

# Audio generation (requires ElevenLabs API key in .env)
npm run generate-audio
npm run generate-geographie-audio
npm run generate-geographie-audio:force   # regenerate even existing files
```

Audio generation scripts are also available individually in `app/scripts/` and can be run directly with `node scripts/<script>.js`.

## Architecture

**Stack:** React 18 + Vite + Tailwind CSS 3 + Zustand (state) + React Router 6 (HashRouter) + Framer Motion + PWA (vite-plugin-pwa)

The app uses **`HashRouter`** — all routes are hash-based (`/#/ecoute`, `/#/memory`, etc.), important when debugging navigation or generating links.

### Directory Layout

```
app/
├── public/
│   └── audio/              # Pre-generated MP3 files served statically
│       ├── lettres/
│       ├── phonemes/
│       ├── syllabes/
│       ├── vocabulaire/
│       └── comptines/      # couleurs/, nombres/, animaux/
├── src/
│   ├── App.jsx             # Route definitions (single source of truth for routes)
│   ├── pages/              # One file per route/exercise
│   ├── components/
│   │   ├── layout/         # MainLayout.jsx (wraps all pages)
│   │   ├── ui/             # Reusable: ArabicLetter, AudioButton, PremiumAudioPlayer…
│   │   └── dashboard/      # TeacherAuth.jsx
│   ├── data/               # Static JS data files (no backend)
│   │   ├── alphabet.js     # 28 Arabic letters with metadata
│   │   ├── comptines.js    # Thematic songs with per-line audio paths
│   │   ├── phonemes.js     # Phoneme pairs
│   │   ├── syllabes.js
│   │   ├── vocabulaire.js
│   │   ├── conversations.js
│   │   ├── paysArabes.js   # Geography data
│   │   ├── fetesReligieuses.js
│   │   ├── letterPaths.js  # SVG paths for letter tracing
│   │   └── badges.js
│   ├── store/              # Zustand stores (persisted to localStorage)
│   │   ├── useAppStore.js  # Global settings: darkMode, soundEnabled
│   │   ├── useGameStore.js # Per-profile stats, badges, streaks, daily quests
│   │   ├── useProfileStore.js  # Child profiles (multi-profile support)
│   │   └── useSRSStore.js  # Spaced Repetition System for flashcards
│   ├── services/
│   │   ├── audioService.js # Unified audio: file playback + TTS fallback, Chrome workarounds
│   │   └── googleSttService.js  # Speech-to-text (microphone exercises)
│   ├── hooks/
│   │   ├── useRobustAudio.js    # React hook wrapping audioService
│   │   └── usePreloadAudios.js
│   └── utils/
└── scripts/                # Node.js scripts for audio generation (ElevenLabs API)
```

### Pages / Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | `Accueil` | Home / profile selector |
| `/modules` | `Modules` | Module grid navigation |
| `/ecoute` | `EcouteReconnaissance` | Listen & identify letters |
| `/memory` | `MemoryLettres` | Memory card game |
| `/phonemes` | `DistinctionPhonemes` | Phoneme pair discrimination |
| `/tracage` | `TracageLettres` | Letter tracing (SVG paths) |
| `/flashcards` | `FlashcardsVocabulaire` | Vocabulary flashcards with SRS |
| `/syllabes` | `Syllabes` | Syllable reading |
| `/conversation` | `Conversation` | Guided conversation practice |
| `/chanson` | `ChansonAlphabet` | Alphabet song (YouTube embed) |
| `/comptines` | `ComptinesThematiques` | Thematic songs (colors, numbers, animals) |
| `/geographie` | `GeographiePaysArabes` | Interactive map of Arab countries |
| `/fetes` | `FetesReligieuses` | Religious holidays |
| `/evaluation` | `EvaluationNiveau` | Level assessment |
| `/dashboard-enfant` | `DashboardEnfant` | Child progress dashboard |
| `/badges` | `BadgesPage` | Badge collection |
| `/maitresse` | `DashboardMaitresse` | Teacher dashboard (password-protected) |

### Audio System

Audio has two layers with automatic fallback:
1. **Static MP3 files** from `public/audio/` — primary source, referenced by relative path in data files (e.g., `audio/comptines/couleurs/couleurs_1.mp3`)
2. **Browser TTS** (`window.speechSynthesis`) — fallback when MP3 is absent

Key behavior in `audioService.js`:
- Paths starting with `http`, `blob:`, or `/` are used as-is; relative paths get a `/` prepended
- Chrome has a ~200-utterance TTS bug → the service resets `speechSynthesis` periodically
- `useRobustAudio(url, fallbackText)` is the main hook for components needing audio

### State Management

All state persists to **localStorage** via Zustand `persist` middleware. Keys:
- `hurufi-settings` — sound/dark mode
- `hurufi-profiles` — child profiles
- `hurufi-game` — stats, badges, streaks per profile
- `hurufi-srs` — spaced repetition state for flashcards

### Data Files

All content is **static JS** — no backend or API at runtime. Data files in `src/data/` export arrays/objects directly. Audio paths in data files are relative (without leading slash); `audioService.js` normalizes them at runtime.

### Audio Generation Scripts

Scripts in `app/scripts/` call the **ElevenLabs API** to generate MP3s and write them to `public/audio/`. They require a `.env` file at `app/.env` with `VITE_ELEVENLABS_API_KEY`. Scripts are idempotent by default (skip existing files); use `--force` to regenerate.
