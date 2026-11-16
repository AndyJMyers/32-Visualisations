# Development Archive

This page keeps the project's local-run, test and Android-build notes out of the product introduction. It is a contributor reference, not a promise that every command or Play Console screen still matches the current toolchain. For historical context, release 1.0.18 (version code 18) brought the Summer and Autumn collections to Google Play on 29 October 2026 and targeted Android 16 (API 36).

## Run Locally

Requirements: Node.js, a modern browser and a directory containing supported audio files. From the repository root, set the library location and start the local server.

PowerShell:

```powershell
$env:WAVE_DECK_LIBRARY = "D:\Music\Road Trip"
node server.js
```

macOS or Linux:

```bash
WAVE_DECK_LIBRARY="/path/to/music-library" node server.js
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/). If `WAVE_DECK_LIBRARY` is not set, the local server looks for `C:\TVR Playlist`. In browsers that support the File System Access API, the **Open folder** control can select another directory.

### Run With Codex

Open the repository in the [Codex app](https://developers.openai.com/codex/app), select **Local**, then ask it to start the player with a library path, for example:

```text
Start 32 Visualisations using my music library at "D:\Music\Road Trip". Keep the
server running at http://127.0.0.1:4173/, verify that the page and track
library load, and give me the link.
```

Use `/path/to/music-library` on macOS or Linux. The app may request approval before starting a persistent local process.

## Testing

The original release completed Google Play closed testing and the required 14-day test period. Real-device checks remain useful for future changes: choose a music folder, play tracks, exercise the main controls, and check playback in the background and over Bluetooth.

Manual checklist: [Tester QA Checklist](../play-store/TESTER_QA_CHECKLIST.md).

Run automated system tests from the repository root:

```powershell
node tools/system-test.js
```

The system test starts a temporary server against sample audio, then checks that the app loads, tracks are discovered, ranged audio is served and unsafe audio requests are rejected.

After building a release, verify the artifact:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\verify-android-release.ps1
```

The Android release build script also runs this verification.

## Android Builds

The `android/` project packages the shared web app in an Android WebView wrapper.

Debug APK:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-android-debug.ps1
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

Signed Google Play release:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-android-release.ps1
```

Outputs:

- `android/app/build/outputs/bundle/release/app-release.aab`
- `android/app/build/outputs/apk/release/app-release.apk`

Signing secrets are intentionally not committed. Check the current Play target API requirements and increment `versionCode` before every upload.

## Project References

- Current Android maintenance guidance: [MAINTENANCE.md](../MAINTENANCE.md)
- Seasonal design and development history: [SEASONS.md](../SEASONS.md)
- Play Console answers: [PLAY_CONSOLE_ANSWERS.md](../play-store/PLAY_CONSOLE_ANSWERS.md)
- Play listing copy: [LISTING.md](../play-store/LISTING.md)
- Privacy policy: [PRIVACY_POLICY.md](../play-store/PRIVACY_POLICY.md)
- Store pitch pack: [PLAY_PITCH.md](../play-store/pitch/PLAY_PITCH.md)
- Engineering log: [engineering-log/](../engineering-log/)
- Sample WAV files for local/server demonstrations and tests: [sample-music/](../../sample-music/)

Public privacy policy: [32 Visualisations Privacy Policy](https://andyjmyers.substack.com/p/32-visualisations-privacy-policy).
