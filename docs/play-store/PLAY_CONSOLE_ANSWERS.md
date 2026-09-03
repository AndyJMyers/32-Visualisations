# 32 Visualisations Play Console Answers

Use this as the working sheet while completing Google Play Console. If the Console wording changes, answer according to the same underlying facts rather than treating this as a magic incantation.

## Core App Details

- **App name:** 32 Visualisations
- **Default language:** English
- **App or game:** App
- **Free or paid:** Paid
- **Target price:** GBP 4.99
- **Contains ads:** No
- **Privacy policy URL:** https://andyjmyers.substack.com/p/32-visualisations-privacy-policy

## Store Listing

### Short Description

Your music. Local. Offline. Alive in motion.

### Full Description

32 Visualisations is a boutique Android music player and audio visualizer for people who still own their music and want it to look as good as it sounds.

Play local audio from your Android device, choose your own music folder, and watch your files come alive through 32 vivid, responsive music visualisations. Once installed and pointed at music, it is built to work offline: no streaming account, no subscription, no rented library.

Built for road trips, big stereos, and locally owned music libraries, 32 Visualisations keeps the controls simple: play or pause, skip track, cycle visualisation, shuffle, and invoke a little alchemical adjustment when the moment calls for something stranger.

The app is designed for atmosphere: glowing waveforms, kinetic motion, rich colour, and a cockpit-like interface that feels more like a custom instrument than a standard Android music player.

The purpose is simple and old-fashioned in the best way: choose your own local music folder and let your files drive the visuals. The app does not bundle a music catalogue or upload your library.

Pay once, keep playing. No streaming account. No subscription. No algorithmic sermon. No disposable wallpaper pretending to be a music experience. Just your files, your speakers, and a screen full of motion.

32 Visualisations also avoids the usual in-app nagging. There are no rating popups, feedback prompts, engagement traps, or social sharing interruptions inside the player. If you enjoy it, the recommendation mechanism is pleasingly ancient: tell someone.

You do not have to be entirely normal to enjoy this player, and that is rather the point.

### Feature Bullets

- Play local audio from folders on your Android device.
- Works without internet access once installed.
- Explore a fixed set of 32 vivid music visualisations.
- Simple portrait interface designed for quick, familiar control.
- Shuffle, track skip, forward-only Visual, Speed, and Alchemy controls.
- Audio-reactive visuals built for colour, movement, and atmosphere.
- No in-app rating nags, social prompts, ads, accounts, or subscription hooks.
- Paid once through Google Play, with no subscription.

### ASO Keywords

Use naturally rather than as a stuffed paragraph:

Music player, local music player, offline music player, audio visualizer, audio visualiser, music visualisations, music visualizations, Android music player, play your own music, local audio player, road trip music player, no subscription music player.

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

**IARC Global Rating ID:** `3b9343e0-20ca-8323-8dd0-3f89fd7ab665`
**Issued:** 3 September 2026

This identifier can be reused when onboarding 32 Visualisations to other
IARC-licensed digital storefronts. It is a public store-onboarding reference,
not a signing key or other secret.

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

Current closed testing state:

- **Active track:** Closed testing - Alpha
- **Current Play build:** version `1.0.3`, version code `6`
- **Package:** `com.thirtytwovisualisations.app`
- **Target SDK:** Android API 36
- **Tester gate:** Play Console shows the closed testing release published and at least 12 testers opted in.
- **Remaining gate:** Run the closed test with at least 12 opted-in testers for 14 continuous days, then apply for production access.

Recommended first release path:

1. Upload the signed release `.aab` to internal testing.
2. Install through Play testing.
3. Verify folder selection, playback, forward-only visualisation cycling, shuffle, `Alchemy`, `Speed`, and button feedback.
4. Move to closed testing if Google requires it.
5. Prepare production release after the required testing gate is satisfied.

## Production Access Answers

Use these as honest starting points for the production access questionnaire.
Do not claim that we implemented features that remain intentionally absent.

### How Did You Recruit Users For Your Closed Test?

We used a paid testing provider to ensure the app was installed and exercised
across multiple devices during the closed testing period. We also reviewed the
app ourselves on real Android hardware, with the product's intended use case in
mind: local music playback, offline use, and a simple car-friendly control
surface.

### How Easy Was It To Recruit Testers?

Answer: Neutral

Recruitment was achievable through a paid testing provider, but organic tester
recruitment was more difficult than expected for a niche paid local music
player before public launch.

### Describe The Engagement You Received From Testers

The testers installed and used the app during the closed test. Their report
found no critical crashes or blocking bugs and confirmed that the app performed
well across tested devices. They also suggested several common app growth and
onboarding improvements, including store listing optimisation, onboarding,
ratings, sharing, and feedback options.

### Summary Of Feedback Received

Feedback was received through the testing provider's written report. The main
positive finding was that the app performed well, with no critical issues
identified during testing. Suggested improvements included ASO/store listing
optimisation, onboarding guidance for first-time users, rating prompts, sharing
features, and ongoing performance monitoring.

Manual testing also resurfaced two related playback regressions. On Android,
the first press of Play after startup could select a track without starting it,
requiring a skip before music began. Separately, after one track finished, the
player could pause instead of continuing to the next track in the selected
folder. These were treated as genuine playback bugs rather than product
preferences.

We accepted the ASO/store listing feedback and improved the Play listing copy
to better describe the app as a local/offline Android music player and audio
visualizer. Other UI suggestions were considered but not added at this stage
because the app is deliberately designed around a quiet, simple, car-friendly
interface. We do not want rating prompts, feedback nags, or sharing prompts to
interrupt music playback or visualisation.

### Who Is The Intended Audience?

32 Visualisations is for people who own local music files and want a vivid,
offline Android music player with responsive visualisations. It is especially
suited to listeners who prefer a simple, tactile interface for road trips, big
speakers, and personal music collections rather than streaming accounts,
subscriptions, adverts, or recommendation algorithms.

### How Does The App Provide Value?

The app turns local audio files into 32 responsive visual experiences while
keeping playback simple and private. Users choose their own music folder, play
their own files, and enjoy an ad-free, account-free, subscription-free music
player that works offline once installed. The value is a focused listening and
visual atmosphere rather than a social platform or streaming service.

### Expected First-Year Installs

Answer: 0 - 10k

This is a niche paid app for local music listeners rather than a mass-market
streaming product.

### What Changes Did You Make Based On Closed Testing?

We reviewed the tester report and made low-risk public-facing improvements to
the Play listing and project documentation. In particular, we improved ASO
wording around local music playback, offline use, audio visualisation, no ads,
and no subscription.

We also fixed playback bugs found during manual testing. The first Play press
now loads the first available track quietly and starts it only from that
explicit button action. The app also treats Android WebView pausing at the
natural end of a track as equivalent to the normal `ended` event, so continuous
folder playback advances to the next track instead of stopping after a single
song.

Some suggested UI additions, such as rating prompts, share prompts, and
walkthrough-style onboarding, were considered but not incorporated into the app
at this stage. This was a product decision: 32 Visualisations is designed to
remain simple, unobtrusive, and suitable for quick use while listening to music.
We will continue to act on tester feedback that identifies crashes, playback
problems, device compatibility issues, or genuine usability blockers.

## Play Console Release Notes

Paste-ready release notes for the next closed testing build:

```text
<en-GB>
Added Android landscape support for in-car use: the app now rotates into a dedicated landscape cockpit layout with the visualisation on the left and the core playback controls on the right. Also keeps the existing playback fixes for first-track start, continuous folder playback, and clean Android startup.
</en-GB>
```

### How Did You Decide The App Is Ready For Production?

The closed testing report found no critical crashes or blocking bugs, and the
core app functions are stable: selecting a folder, playing local audio,
skipping tracks, shuffling, cycling visualisations, adjusting Speed, and using
Alchemy. The app also has a published privacy policy, clear Play listing copy,
and a focused product scope. Remaining improvements are incremental rather
than blockers to production readiness.

### What Did You Do Differently This Time?

We focused on keeping the app honest and simple. Instead of adding generic app
growth mechanisms that would clutter the music player, we improved the store
description and documentation, preserved the minimal playback interface, and
kept the app free of ads, subscriptions, accounts, rating popups, and social
sharing prompts.

## Assets

- App icon: `docs/play-store/assets/icon-512.png`
- Feature graphic: `docs/play-store/assets/feature-graphic-wow-1024x500.png`
- Phone screenshots for Play: `docs/play-store/pitch/panels/`
- Curated raw visualisation screenshots: `docs/play-store/screenshots/curated/`
- Pitch overview: `docs/play-store/pitch/pitch-contact-sheet.png`

## Release Build

Fresh signed release artifacts should be generated with:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-android-release.ps1
```

Expected outputs:

- `android/app/build/outputs/bundle/release/app-release.aab`
- `android/app/build/outputs/apk/release/app-release.apk`

Current alpha label:

- `google-play-alpha-release`

If the Gradle bundle signing task fails, do not treat the release process as complete until the generated `.aab` has been signed and verified, and Play Console accepts the upload. Keep the signing path boring and repeatable before wider release.
