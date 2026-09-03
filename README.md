# 32 Visualisations

**Your music. Local. Offline. One fair price. Turned all the way up.**

![32 Visualisations hero artwork](docs/play-store/pitch/github-hero-1600x600.png)

32 Visualisations is a boutique Android music player for people who still own their music and want it to look as good as it sounds.

It plays local audio from your device, works without an internet connection once installed, and turns your files into 32 vivid audio-reactive visualisations. It began as a desktop local music player with a taste for **Mental. Saturation. Overstimulation.** It has grown into an Android road-trip music player built for big stereos, strange colour, and cockpit-simple controls.

No streaming account. No subscription. No bundled catalogue pretending to know your taste. Just your files, your device, your speakers, and thirty-two vivid ways to make sound visible.

## The Story

Streaming made music convenient, but it also made listening feel rented, flattened, and strangely disposable. 32 Visualisations goes the other way.

You choose a folder of local audio files. The app plays them. The controls stay large, familiar, and car-friendly. The screen becomes part equaliser, part theatre, part questionable private cinema for waveforms. Some visualisations are elegant. Some are ridiculous. Some behave as if the music has been left alone with a chemistry set.

The guiding idea is simple:

> Add lightness. Add horsepower. Remove nonsense.

That means few controls, large targets, no account ceremony, no fiddly in-car settings, and enough visual excess to make a track feel like an event.

## Engineering Log

| | |
|---|---|
| ![Engineering log quote card: boshing with vim and verve](docs/engineering-log/boshing-vim-verve.svg)<br>**Andy J Myers, Lead Engineer** | ![Engineering log quote card: taste gives the first spark](docs/engineering-log/strangeness-steering-wheel.svg)<br>**Codex, Collaborating Engineer** |

More attributed engineering log entries live in [docs/engineering-log/](docs/engineering-log/).

## What It Does

- Plays local audio files from a folder on your Android device.
- Works without internet connectivity once installed.
- Supports `.wav`, `.mp3`, `.m4a`, `.aac`, `.flac`, `.ogg`, and `.opus`.
- Provides a fixed set of **32** audio-reactive visualisations.
- Runs as a desktop browser app or an offline-first Android WebView app.
- Offers car-style Android controls for play/pause, previous/next track, next visualisation, shuffle, `Alchemy`, and `Speed`.
- Uses `Alchemy` to apply artistically chosen visual settings.
- Uses `Speed` to cycle visual agitation through five colour-coded steps.
- Keeps your music local.

The number is fixed. Thirty-two is binary, balanced, mellow in its intonation and just faintly occult. New visualisations may therefore require ceremonial retirement of old ones.

## A Glimpse

![Play pitch overview](docs/play-store/pitch/pitch-contact-sheet.png)

![Cathedral Organism: a living stained-glass procession](docs/images/cathedral-organism.png)

| | |
|---|---|
| ![The Chimaera of Snake and Conga-line in hybrid form](docs/images/chimaera-hybrid.png)<br>**Chimaera of Snake and Conga-line** | ![Midnight Kaleidoscope](docs/images/kaleidoscope.png)<br>**Kaleidoscope: Midnight rabbit** |
| ![Figures fleeing monsters in Hypnotic Flight](docs/images/hypnotic-flight.png)<br>**Hypnotic Flight: Prismatic fever** | ![Flower armies in War of the Roses](docs/images/war-of-the-roses.png)<br>**War of the Roses: Crown melee** |

![Bob Ross Garden roulette](docs/images/bob-ross-garden.png)

**Bob Ross Garden**

### Desktop Fullscreen Gallery

| | |
|---|---|
| ![Chimaera of Snake and Conga-line: neon procession](docs/images/desktop-gallery/chimaera-neon-procession.png)<br>**Chimaera: Neon procession** | ![Chimaera of Snake and Conga-line: Mercury Bloom](docs/images/desktop-gallery/chimaera-mercury-bloom.png)<br>**Chimaera: Mercury Bloom** |

### Snake / Conga Transition

| Snake | Conga-line |
|---|---|
| ![The Chimaera near the Snake end of its transition](docs/images/chimaera-snake.png) | ![The Chimaera near the Conga-line end of its transition](docs/images/chimaera-conga.png) |

### Controls With Opinions

| | |
|---|---|
| ![Turtle River with Grievance, Hunger and Munchiness controls](docs/images/controls-turtle-river.png)<br>**Grievance. Hunger. Munchiness.** | ![Oyster Pearls with Tide, Shell size and Pearl making controls](docs/images/controls-oyster-pearls.png)<br>**Tide. Shell size. Pearl making.** |

## The 32

| | | | |
|---|---|---|---|
| Equaliser | Fireworks | Pac Dance | Branch Hands |
| Swamp Bubbles | Arrow Storm | Cephalopod Mind | Disco Jive |
| Glitter Fall | Butterfly Host | Knife Thunk | Octopus Occlusion |
| Lizard Louche | Goddess Kisses | Climbing Garden | Tipu's Tiger |
| Mandelbrot Set | Eyes | Lightning | Asteroids |
| Interzone Oracles | Sunflower Smiles | War of the Roses | Turtle River |
| Cathedral Organism | Hypnotic Flight | Kaleidoscope | Bob Ross Garden |
| Oil Slide | Oyster Pearls | Lingerie | Chimaera of Snake and Conga-line |

Some are contemplative. Some are playable. Some should possibly be discussed with a responsible adult.

## Android Road-Trip Player

The Android app is the mobile-first version of the same visualisation world. It is designed for in-car use: portrait layout, large controls at the bottom, familiar transport actions, and a little visual theatre when buttons are pressed.

The app opens ready for your own local music. Use Android's folder picker to choose a music folder, then play offline from files already on the device. Bluetooth routing is handled by Android itself.

## Optional Sample Audio

The repository includes three original WAV files in [sample-music/](sample-music/) for desktop/server demonstration and automated tests. They are not packaged inside the Android app. The Play build stays lean and expects the listener to bring their own music library.

Current Play preparation lives in:

- [Play Console answers](docs/play-store/PLAY_CONSOLE_ANSWERS.md)
- [Tester QA checklist](docs/play-store/TESTER_QA_CHECKLIST.md)
- [Privacy policy](docs/play-store/PRIVACY_POLICY.md)
- [Play pitch pack](docs/play-store/pitch/PLAY_PITCH.md)

Public privacy policy:

[32 Visualisations Privacy Policy](https://andyjmyers.substack.com/p/32-visualisations-privacy-policy)

## Testing

We are preparing for Google Play testing. The tester process is deliberately lightweight: install through a Play test link, choose a music folder, play a few tracks, try the main controls, and report anything strange.

The human-friendly test plan is here:

[Tester QA Checklist](docs/play-store/TESTER_QA_CHECKLIST.md)

Google may require 14 continuous days of closed testing for new personal developer accounts. That does not mean heavy testing every day. It means a real group of testers opting in, installing, and giving the app a fair try while the release path matures.

Automated system tests can be run from the repository root with:

```powershell
node tools/system-test.js
```

The system tests start a temporary local server against repository test audio, then verify the web app loads, tracks are discovered, ranged audio is served, and unsafe audio requests are blocked.

After a release build, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\verify-android-release.ps1
```

The release build script also runs this verification after Gradle finishes.

## Running Locally

### Requirements

- A current version of Node.js
- A directory containing supported audio files
- A modern browser

### Start

Set the library directory and run the server from the repository root.

PowerShell:

```powershell
$env:WAVE_DECK_LIBRARY = "D:\Music\Road Trip"
node server.js
```

macOS or Linux:

```bash
WAVE_DECK_LIBRARY="/path/to/music-library" node server.js
```

Then open [http://127.0.0.1:4173/](http://127.0.0.1:4173/).

If `WAVE_DECK_LIBRARY` is not set, the local server looks for `C:\TVR Playlist`.

The **Open folder** control can also select a different local directory in browsers that support the File System Access API.

### Run With Codex

Clone the repository, open its folder in the [Codex app](https://developers.openai.com/codex/app), and select **Local**. Then give Codex the location of your music library:

```text
Start 32 Visualisations using my music library at "D:\Music\Road Trip". Keep the
server running at http://127.0.0.1:4173/, verify that the page and track
library load, and give me the link.
```

Use the equivalent `/path/to/music-library` on macOS or Linux. Codex will set the library environment variable, start the local Node.js server, and check that it is reachable. It may ask for approval before launching a persistent local process.

## Building Android

The `android/` project bundles the shared web app into an Android WebView wrapper.

Debug build:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-android-debug.ps1
```

Debug APK:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Signed release build for Google Play:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-android-release.ps1
```

Release outputs:

```text
android/app/build/outputs/bundle/release/app-release.aab
android/app/build/outputs/apk/release/app-release.apk
```

Signing secrets are intentionally not committed.

## Controls

Desktop:

- `Play`, `Stop`, `Prev`, `Next`, and `Shuffle` handle the library.
- `Up` and `Down` move through visualisations.
- `Left` and `Right` move through tracks.
- `F` or `F4` toggles the visual stage.
- `W`, `A`, `S`, and `D` adjust expression dials and operate certain interactive scenes.

Android car mode:

- `Dir` chooses a folder.
- `Visual` advances to the next visualisation.
- `Alchemy` applies alchemical adjustment.
- `Speed` changes the visual agitation step.
- Shuffle switches between order and shuffle.
- The transport row handles previous, play/pause, and next.

## Project Notes

- Android maintenance rules: [docs/MAINTENANCE.md](docs/MAINTENANCE.md)
- Play Store materials: [docs/play-store/](docs/play-store/)

## Status

This project is still under active development, so any hallucinations you experience may not be entirely your own fault this time.

The Android app is in Google Play closed testing. Version `1.0.3` / build `6` targets Android API 36 and is available to selected testers while the 14-day closed-test gate runs.

If you enjoyed this, why not gain merit in this life by [buying this holy man a pint of mead or ale](https://buy.stripe.com/5kQ5kDcX8cwc52J70rds400), according to your purse?

## Direction

**Artistic Director:** AndyJMyers  
**Engineering:** developed in collaboration with OpenAI Codex

The governing principle is simple: saturation without sludge, overstimulation without indifference, and enough mental movement to make a waveform feel briefly alive.
