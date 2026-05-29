# UStack — Mobile Setup Guide

UStack ships as both a **web app** (TanStack Start / Vite) and a **native mobile app** (iOS + Android) via Capacitor. The same React codebase powers both — the mobile build is a client-side SPA bundled into a WebView.

---

## How it works

```
Web (Vite dev server + SSR)     → bun run dev / npm run build
Mobile (Vite SPA + Capacitor)  → npm run cap:sync → Xcode / Android Studio
```

The mobile build uses **hash-based routing** so it works from the local filesystem inside a WebView (`file://`). No server required on-device.

---

## Prerequisites (on your local machine)

> **Note:** All `cap:*` commands must run on your **local machine**, not on Replit. They require Android Studio (Android) or Xcode (iOS). The `npm run build:mobile` command works fine on Replit for CI/CD.

| Tool | Where to get it |
|------|----------------|
| **Node 22+** | [nodejs.org](https://nodejs.org) — Capacitor CLI requires v22+ |
| Java 17+ | [adoptium.net](https://adoptium.net) — for Android |
| Android Studio | [developer.android.com](https://developer.android.com/studio) — for Android |
| Xcode 15+ | Mac App Store — for iOS (macOS only) |
| CocoaPods | `sudo gem install cocoapods` — for iOS |

---

## First-time local setup

Clone the project to your local machine, then:

```bash
# 1. Install dependencies
npm install

# 2. Add native platforms (one time only)
npx cap add android
npx cap add ios        # macOS only

# 3. Build web assets and sync to native
npm run cap:sync
```

---

## Daily development workflow

### Android
```bash
npm run cap:android
# Opens Android Studio → press the green Play ▶ button
```

### iOS (macOS only)
```bash
npm run cap:ios
# Opens Xcode → press the Play ▶ button or Cmd+R
```

### Live reload during development
```bash
# Start the web dev server first
npm run dev

# Then in a second terminal, set the server URL for live reload
# Edit capacitor.config.ts temporarily:
#   server: { url: "http://YOUR_LOCAL_IP:5000", cleartext: true }
npx cap sync
```

---

## All available commands

| Command | What it does |
|---------|-------------|
| `npm run build:mobile` | Build the mobile SPA bundle → `dist/mobile/` |
| `npm run cap:sync` | Build + sync web assets to both platforms |
| `npm run cap:android` | Build + sync + open in Android Studio |
| `npm run cap:ios` | Build + sync + open in Xcode |
| `npm run cap:run:android` | Run directly on connected Android device |
| `npm run cap:run:ios` | Run directly on connected iPhone/Simulator |

---

## Native features available

The app uses these Capacitor plugins (already installed):

| Plugin | Used for |
|--------|---------|
| `@capacitor/status-bar` | Dark status bar matching app theme |
| `@capacitor/splash-screen` | Dark splash screen on launch |
| `@capacitor/haptics` | Haptic feedback on buttons and confirmations |
| `@capacitor/keyboard` | Keyboard resize handling for input fields |

All native calls are wrapped in `src/lib/native.ts` and safely no-op on web.

---

## Publishing to stores

### Google Play Store
1. In Android Studio: Build → Generate Signed Bundle/APK
2. Upload the `.aab` to [play.google.com/console](https://play.google.com/console)

### Apple App Store
1. In Xcode: Product → Archive
2. Upload via Organizer or `xcrun altool`

### App identifiers
- **Bundle ID (iOS)**: `app.ustack.bitcoin`
- **Application ID (Android)**: `app.ustack.bitcoin`

Change these in `capacitor.config.ts` before publishing.

---

## Project structure (mobile-relevant files)

```
capacitor.config.ts       ← Capacitor config (app ID, plugins, webDir)
vite.mobile.config.ts     ← Vite config for mobile SPA build
index.mobile.html         ← HTML entry for the mobile bundle
src/main.mobile.tsx       ← React entry — client-only, hash routing
src/lib/native.ts         ← Capacitor plugin wrappers (haptics, status bar…)
dist/mobile/              ← Built web assets (synced into Android/iOS)
android/                  ← Native Android project (generated locally)
ios/                      ← Native iOS project (generated locally)
```
