# Mission To Mars 1.0

**Light. Lens. Illusion.** A ninety-second portrait promo for three photographic visualisations and their twelve alchemies, accompanied by **Mission to Mars**.

[Watch or download the portrait film](https://github.com/AndyJMyers/32-Visualisations/raw/refs/heads/master/docs/marketing/mission-to-mars-1.0-portrait.mp4).

## Schlieren Photography

Schlieren photography makes the normally invisible visible, revealing changes in air density around heat, movement and shock waves. Our interpretation turns those disturbances into a musical medium: muzzle blasts send out pressure fronts, dancers trail coloured body heat, horses gallop through golden wakes and racing cars stir turbulent air. Rather than attempting a scientific simulation, it combines crisp, stylised subjects with a shifting density-gradient field, allowing the music to shape the surrounding atmosphere.

## Anamorphic Squeeze

Inspired by anamorphic cinema and the glamour, danger and visual wit of James Bond, this visualisation treats the lens as part of the performance. Four original spy-film tableaux move from gun-barrel theatrics to casino elegance, an Alpine pursuit and an underwater escape. The picture breathes between compressed and expanded widescreen proportions, accompanied by oval highlights, horizontal flares and animated titles. Music modulates the lighting, giving the familiar language of the cinematic thriller a fluid, dreamlike character.

## Bipack Processing

Bipack's inspiration is the physical pairing of film strips, reimagined here as a meeting of two apparently incompatible worlds: a neon-lit cabaret and a cathedral celebrating High Mass. Both scenes remain independently animated, with pole choreography on one strip and candlelight, incense and ceremonial movement on the other. Four alchemies combine them through luminous double exposures, Gothic travelling masks, drifting overlaps and a silver-toned print. Music alters exposure and registration, letting the two worlds merge, compete and unexpectedly rhyme without resolving their contradiction.

## Film And Credits

- **Andy J Myers:** concept, art direction and original music.
- **OpenAI Codex:** code, visual engineering and creative collaboration.
- **Soundtrack:** the original `Mission to Mars.wav`, excerpt 00:24-01:54, with opening and closing fades.
- **Picture:** 1080 x 1920 portrait, 60 fps, 90 seconds; H.264 video, stereo AAC audio and fast-start MP4.
- **Sources:** `schlieren-v1.0`, `anamorphic-v1.0` and `bipack-v1.0`. Fresh music-reactive animation throughout, not a slideshow.
- **Presentation:** all twelve alchemies, animated titles, sliding credits and a portrait composition that retains the full widescreen artwork.

These visualisations are approved development checkpoints. Their inclusion in this film does not mean they are already in the current Google Play build.

## Reproduce

With the Canvas dependency available through `NODE_PATH`, run `node tools/render-photographic-trilogy.js`, followed by `node tools/verify-photographic-trilogy.js`. Set `PHOTO_MUSIC` to the original WAV and, if needed, `FFMPEG_PATH` and `FFPROBE_PATH` to the local executables. The renderer uses the tagged sources rather than whichever working copies happen to be present.
