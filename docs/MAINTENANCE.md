# Maintenance Notes

32 Visualisations is intentionally small and direct, but the Android car player
has a few rules that should stay boring.

## Android car mode

- Keep transport controls fixed at the bottom of the screen.
- Do not let visualiser changes alter the car deck height, button order or
  button count.
- Treat the car deck as a physical control panel: consistency beats novelty.
- Keep all Android audio and folder access offline-first.
- Run `tools/build-android-debug.ps1` before installing a new APK.

## Performance profile

The desktop app keeps the full visual population and high-DPI canvas scaling.
Android car mode deliberately caps both:

- Canvas pixel ratio is capped to reduce WebView fill-rate pressure.
- Population-heavy visualisations use a lower effective count.

This keeps the visuals lively while protecting the transport controls from
stutters during driving.

## Future refactor

`app.js` still carries playback, persistence, Android bridge code, controls and
all visualisers in one file. That is acceptable for the current scale, but the
next structural cleanup should extract:

- player and playlist state
- Android bridge and folder loading
- car controls
- session persistence
- visualiser registry and drawing helpers

Do that in staged commits so each extraction can be tested against desktop and
Android behaviour.

## Collection model

See [ARCANA.md](ARCANA.md) for the live four-suit catalogue and [SEASONS.md](SEASONS.md) for the historical Summer/Autumn design record. The Arcana control occupies Shuffle's former slot: preserve the same slot and button count, and verify both desktop and Android assets when changing it. The internal source-family flag still chooses the correct renderer; it is not a listener-facing collection. Develop on `master`; branch hotfixes from the verified release baseline.
