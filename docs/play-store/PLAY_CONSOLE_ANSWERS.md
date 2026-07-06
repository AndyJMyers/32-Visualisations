# 32 Visualisations Play Console Answers

Use this as the working sheet while completing Google Play Console. If the Console wording changes, answer according to the same underlying facts rather than treating this as a magic incantation.

## Core App Details

- **App name:** 32 Visualisations
- **Default language:** English
- **App or game:** App
- **Free or paid:** Paid
- **Target price:** GBP 2.99
- **Contains ads:** No
- **Privacy policy URL:** https://andyjmyers.substack.com/p/32-visualisations-privacy-policy

## Store Listing

### Short Description

Own your music. Pay once. Watch it come alive.

### Full Description

32 Visualisations is a boutique music player for people who want their own music to look as good as it sounds, without signing up to another rented library.

Play local audio from your Android device and watch it come alive through a collection of vivid, responsive visualisations. The app is designed for atmosphere: glowing waveforms, kinetic motion, rich colour, and a cockpit-like interface that feels more like a custom instrument than a standard player.

Built for road trips, big stereos, and locally owned music libraries, 32 Visualisations keeps the controls simple: play or pause, skip track, change visualisation, shuffle, and invoke a little alchemical adjustment when the moment calls for something stranger.

Pay once, keep playing. No streaming account. No subscription. No algorithmic sermon. No disposable wallpaper pretending to be a music experience. Just your files, your speakers, and a screen full of motion.

You do not have to be an insane freak to enjoy this player, but it is not contra-indicated.

## App Content

### Data Safety

Recommended answer: the app does not collect or share user data.

Reasoning:

- Local audio files are selected by the user and played on the device.
- The app does not upload the user's music library.
- The app does not use analytics SDKs.
- The app does not include advertising SDKs.
- Local playback and visualisation preferences may be stored on the device for functionality, but are not sent to the developer.
- Google Play handles purchase/payment processing.

### Privacy Policy

Use the Substack URL above. The policy states that user music stays on the device, explains local preferences/session data, and notes Google Play payment handling.

### Ads

Answer: No, the app does not contain ads.

### App Access

Answer: No special login credentials or restricted access should be required.

Reasoning: the app does not require an account.

### Content Rating

Expected category: music/audio player or entertainment utility.

Likely answers:

- No user-generated content sharing.
- No online interaction between users.
- No gambling.
- No in-app purchases beyond the paid app purchase, unless Google asks about the paid app itself separately.
- No advertising.
- No location sharing.

The app may display colourful, abstract, and occasionally surreal visualisations. It should still be presented as a music player/visualisation app, not as violent or adult content.

### Target Audience

Recommended target: adults/general audience, not specifically designed for children.

Reasoning: the app is a paid local music player intended for people managing their own audio files and using a car/road-trip style interface.

### News Apps

Answer: No.

### COVID-19 / Health

Answer: No.

### Financial Features

Answer: No.

### Government

Answer: No.

### Permissions

Declared permissions:

- `android.permission.INTERNET`
- `android.permission.WAKE_LOCK`

Explanation if asked:

- Internet permission supports the packaged local WebView/audio bridge architecture. The app is designed to work offline and does not use this permission to upload music, track listening, serve ads, or send analytics.
- Wake lock supports continuous playback/visualisation while the player is active.
- User audio is selected through Android's folder/file picker flow rather than broad storage permissions.

## Release Track

Recommended first release path:

1. Upload the signed release `.aab` to internal testing.
2. Install through Play testing.
3. Verify folder selection, playback, visualisation cycling, shuffle, `A++`, `G++`, and button feedback.
4. Move to closed testing if Google requires it.
5. Prepare production release after the required testing gate is satisfied.

## Assets

- App icon: `docs/play-store/assets/icon-512.png`
- Feature graphic: `docs/play-store/assets/feature-graphic-1024x500.png`
- Curated screenshots: `docs/play-store/screenshots/curated/`
- Pitch panels: `docs/play-store/pitch/panels/`
- Pitch overview: `docs/play-store/pitch/pitch-contact-sheet.png`

## Release Build

Fresh signed release artifacts should be generated with:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-android-release.ps1
```

Expected outputs:

- `android/app/build/outputs/bundle/release/app-release.aab`
- `android/app/build/outputs/apk/release/app-release.apk`
