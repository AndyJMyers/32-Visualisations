# Song Library Workflow

Historical note: this was the proposed mood-classification workflow. The current
Android car UI has deliberately dropped the Mood button in favour of simpler
track skip, visualisation, `A++`, and `Speed` controls.

The car player should stay simple. Mood intelligence belongs in a desktop
preflight step, before the music folder is copied to the phone or published.

## Preflight Mood Pass

The preflight pass should scan a song folder and write a `moods.json` manifest
beside the audio files. Android then reads that manifest rather than trying to
analyse audio while driving.

Inputs:

- Audio filenames and folder names.
- Optional song-history notes from production sessions.
- Optional manual overrides from artistic direction.
- Lightweight audio structure: duration, loudness, dynamic range, brightness,
  low-end weight, onset density and tempo estimate.

Outputs:

```json
{
  "version": 1,
  "generatedAt": "2026-07-01T00:00:00Z",
  "moods": {
    "Love": ["song-a.wav"],
    "Ballads": ["song-b.wav"],
    "Rock": ["song-c.wav"]
  },
  "tracks": {
    "song-a.wav": {
      "moods": ["Love", "After Hours"],
      "energy": 0.42,
      "notes": "Warm vocal-led song with soft arrangement."
    }
  }
}
```

The app should treat this as advisory, not sacred. If a mood has no tracks, the
car UI skips it. If a track appears in several moods, it can be reached from
each of them.

## Mood Set

Initial car moods:

- All
- Love
- Ballads
- Bossa
- Louche Jazz
- Balearic
- Rock
- Night Drive
- Sunny
- Melancholy
- Ridiculous
- High Energy
- After Hours

These names are deliberately short enough for cockpit controls but broad enough
for a large, eccentric catalogue.

## Substack Song Pack

If a song folder is shared alongside a Substack post, include a plain
`COPYRIGHT.txt` file in the folder.

Suggested notice:

```text
Copyright notice

All songs in this folder are original works by AndyJMyers unless explicitly
marked otherwise.

You may listen privately and share links to the associated Substack post.
You may not redistribute, re-host, sample, synchronise, sell, train models on,
or incorporate these recordings into another work without written permission.

For permissions, licensing, collaboration or ceremonial disputes over authorship,
contact AndyJMyers through the Substack or GitHub project page.
```

This is a practical notice, not legal advice. If the songs become commercially
important, get the wording reviewed properly.

## Implementation Direction

1. Add a desktop script that scans a folder and produces `moods.json`.
2. Start with filename, folder and optional manual notes.
3. Add audio feature analysis once the manifest path is working.
4. Teach Android to load `moods.json` from the chosen folder.
5. Keep the car UI as one forward-cycling Mood button.

Current command:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\update-moods.ps1 "D:\Music\TVR Playlist"
```

The script preserves existing entries, classifies only new audio files with local
filename/folder rules, writes uncertain tracks into `review`, and creates
`COPYRIGHT.txt` if the folder does not already have one.
