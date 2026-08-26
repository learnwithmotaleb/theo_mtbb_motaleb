# Gestlio — Project Notes (Handoff Doc)

Last updated: 2026-08-26

This doc exists so work can resume cleanly after a fresh `git clone`, on
this machine or a Mac (for iOS). Read this before touching build config.

---

## 1. App identity

| Field | Value |
|---|---|
| App name | **Gestlio** |
| Slug (EAS project slug) | `theo_mtbb` (unchanged — renaming would create a new EAS project) |
| Android package | `com.gestlio.app` |
| iOS bundle identifier | `com.gestlio.app` |
| URL scheme | `theomtbb` |
| EAS project ID | `09dd4d71-33a9-43fb-b494-e55e3e0c1cc7` |
| EAS account | `learnwithmotaleb` (team alt: `learnwithmotalebs-team`) |
| GitHub repo | `https://github.com/learnwithmotaleb/theo_mtbb_motaleb.git` |

Config lives in **`app.json`** (static) + **`app.config.js`** (dynamic
overlay — injects the Google Maps API key into the Android manifest and
iOS config; do not delete `app.config.js`, `app.json` alone is not the
full config).

⚠️ Once this app is uploaded to Google Play once, `com.gestlio.app` and
the signing keystore (see §3) are **permanent** — never change them.

---

## 2. App icon

- Source file: `assets/images/icon1.png` — **must stay square** (currently
  2080×2080, padded with transparent margins; Expo's config validator
  (`expo-doctor`) rejects non-square icons).
- Wired into `app.json` in four places: top-level `icon`, `ios.icon`,
  `android.icon`, `android.adaptiveIcon.foregroundImage`
  (`adaptiveIcon.backgroundColor` = `#F5F5F5`).
- The old `assets/expo.icon/` bundle (Expo's default placeholder icon —
  the teal grid + Android-bot mark) is **no longer referenced** anywhere.
  It's still on disk but unused; safe to delete later.
- Other logo assets, not wired as the app icon:
  - `assets/images/homeLogo.png` — full horizontal logo (used on splash
    screen via the `expo-splash-screen` plugin config).
  - `assets/images/icon.png` — transparent, unrounded mark. Not currently
    referenced. Would be the *correct* choice for
    `android.adaptiveIcon.foregroundImage` instead of `icon1.png` if you
    want a cleaner adaptive-icon mask (icon1.png already has its own
    rounded-square + background baked in, so Android's own mask ends up
    rounding an already-rounded image — minor cosmetic double-rounding,
    not a functional bug).

---

## 3. Android signing (JKS / keystore)

Signing is **fully managed by EAS** (remote credentials) — there is no
local `.jks`/`.keystore` file in this repo, and there shouldn't be one.

- Keystore label: **`gBE5WorZJk`** (the "default" Build Credential for
  this project, created automatically on the first `eas build`).
- View / manage it: `eas credentials` → Android → select a build profile
  → Keystore. From there you can also **download** the keystore file if
  you ever need it outside EAS (e.g. manual Play Console signing key
  rotation, or migrating off EAS).
- Every `production`/`preview` build profile in `eas.json` currently
  reuses this same keystore automatically — do not run `eas credentials`
  → "Set up a new keystore" for this project unless you specifically
  intend to replace it (Play Store will reject app updates signed with a
  different key than the first upload).
- **Back up the keystore** (download it via `eas credentials`) somewhere
  safe outside EAS. If EAS access is ever lost, there is no other copy.

---

## 4. Build profiles (`eas.json`)

| Profile | Output | Distribution | Notes |
|---|---|---|---|
| `development` | dev client | internal | for `expo-dev-client` workflow |
| `preview` | `.apk` | internal | quick install/testing via link or QR |
| `production` | `.aab` | — | **for Google Play upload**; `autoIncrement: true` bumps `versionCode` each build |

Commands used so far:
```bash
npx eas-cli build --platform android --profile preview     # APK
npx eas-cli build --platform android --profile production  # AAB
```

Both were run **non-interactively from this Windows machine** — EAS
builds run on Expo's own cloud infrastructure, so none of the local
Windows build problems (below) affect EAS builds. Prefer EAS builds over
local Gradle builds unless you specifically need a fast local
iteration loop.

Latest known-good builds (may have been superseded — check
`https://expo.dev/accounts/learnwithmotaleb/projects/theo_mtbb/builds`
for the current list):
- Preview APK: `https://expo.dev/accounts/learnwithmotaleb/projects/theo_mtbb/builds/5d3eb5e5-4f10-40f5-a360-3aba6d915eb4`
- Production AAB (`versionCode: 2`): `https://expo.dev/artifacts/eas/0uXt_9Cp2C8LBgcDtgpeRQq0jB-zjFpjGtp3WuiyzK0.aab`

### Submitting to Play Store
Not yet automated. Either:
1. Manually upload the `.aab` in Play Console → your app → a release track, or
2. Set up `eas submit` (needs a Google Play **service account JSON key**
   with API access to the Play Console — not created yet).

---

## 5. ⚠️ Known gaps / TODO

1. **`EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` is not set anywhere EAS can see
   it.** `app.config.js` injects this into the Android manifest
   (`com.google.android.geo.API_KEY`) and iOS (`googleMapsApiKey`), but:
   - it's **not** in EAS Environment Variables (`eas env:list`) for any
     environment, and
   - it's **not** in the local `.env` file either.
   Every build so far has shipped with this key effectively empty —
   **Google Maps will not work in the built app.** Fix: add the real key
   via `eas env:create` (or the expo.dev dashboard → project →
   Environment variables) for `preview` and `production`, and to local
   `.env` for dev.
2. **npm audit**: `npm install` currently reports `14 vulnerabilities
   (10 moderate, 3 high, 1 critical)`. Not investigated yet — run `npm
   audit` for details before shipping to Play Store.
3. Local Windows Gradle builds (`./gradlew assembleDebug` from
   `android/`) need the fix in §6 or they fail with `Filename longer
   than 260 characters` — this was never fully verified as fixed on this
   machine (registry value was still `0` as of last check). Not a
   blocker since EAS builds work fine.

---

## 6. Local Windows build environment (only needed for local Gradle builds)

Only relevant if you run `./gradlew ...` directly on this Windows
machine instead of `eas build`.

- **Path-length fix (not yet applied on this machine):**
  ```powershell
  # Run PowerShell as Administrator:
  Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -Type DWord
  git config --system core.longpaths true
  # then restart the PC
  ```
  Without this, native modules with long paths (`react-native-safe-area-context`,
  `react-native-screens`, etc.) fail Ninja/CMake compilation.
- **`android/local.properties`** is gitignored and gets **deleted** every
  time you run `npx expo prebuild --clean`. It must contain:
  ```
  sdk.dir=C:\\Users\\Tanjim\\AppData\\Local\\Android\\Sdk
  ```
  Recreate it after every `prebuild --clean` if a local build is needed.
- Android SDK location: `C:\Users\Tanjim\AppData\Local\Android\Sdk`
- NDK version pinned by the Expo Gradle plugin: `27.1.12297006`.

---

## 7. iOS status — next session's work

- **No local `ios/` folder exists** — `npx expo prebuild` cannot generate
  it on Windows (needs CocoaPods/Xcode, macOS-only). This is expected
  and fine.
- `ios.bundleIdentifier` and `ios.icon` are already correctly configured
  in `app.json` (see §1–2), so:
  - **`eas build --platform ios`** should work even from this Windows
    machine — EAS runs `prebuild` and the actual build on their own
    macOS servers. **No local Mac is required just to trigger a build.**
  - A local Mac (with Xcode) is only required for `npx expo run:ios`
    (running directly on a simulator/device from this repo) or manual
    Xcode work.
- **Not yet set up for iOS:**
  - No Apple Developer account credentials configured in EAS yet (Apple
    ID / Team ID / provisioning profile / distribution certificate).
    First `eas build --platform ios` will prompt for these — have the
    Apple Developer account ready (needs an active $99/yr membership).
  - App Store Connect app record not created.
  - `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` gap in §5 applies to iOS too.

**Plan for next session:** fresh `git clone` from GitHub (this repo is
now up to date on `main`), `npm install`, then start the iOS credentials
setup via `eas build --platform ios` (interactively, so it can prompt
for Apple credentials).

---

## 8. Git

- Everything in this doc is merged into **`main`** as of this commit.
- The rebrand work landed via branch `feat/gestlio-rebrand` (fast-forward
  merged into `main`, not deleted from origin — delete it once you've
  confirmed `main` looks right on GitHub).
