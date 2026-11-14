# Arcana Collections

The GitHub build has 84 visualisations across six collections: 56 in the four Minor Arcana suits, one in Major Arcana, and 27 in The Damned. This is the development catalogue, not a list of what is currently on Google Play. Summer and Autumn are preserved in the [season development archive](SEASONS.md).

## Cups

Fluid, intimate, reflective and dreamlike scenes.

Swamp Bubbles; Lizard Louche; Goddess Kisses; Turtle River; Oil Slide; Oyster Pearls; Water Lilies; Inner Space; Champagne Fountain; Shy Smiles; Rat Race; Sunflower Smiles; Confessions of an Opium Eater; Life Studies.

## Swords

Conflict, danger, tension, strategy and difficult questions.

Arrow Storm; Knife Thunk; Lightning; Asteroids; War of the Roses; The Scream; Your call is important to us; Beowulf; The Life of Winston Churchill; The Iron Lady; Tony Blair: The Great Satan; P = NP?; There Will Be Bones; Spaced.

## Pentacles

Craft, nature, work, place and material life.

Branch Hands; Tipu's Tiger; Climbing Garden; Bob Ross Garden; Cathedral Organism; Mondrian; A load of Pollocks; Toadstools; Last Mow of the Year; Squirrel Sequestering; Autumn Drive; Harvest Time; Birds Eye; Plenty of Puff.

## Wands

Spectacle, motion, play, invention and unruly energy.

Equaliser; Fireworks; Pac Dance; Cephalopod Mind; Disco Jive; Glitter Fall; Butterfly Host; Octopus Occlusion; Mandelbrot Set; Eyes; Interzone Oracles; Hypnotic Flight; Kaleidoscope; Chimaera of Snake and Conga-line.

## Major Arcana

**0 · The Fool** opens the planned 22-card collection. Its Alchemies tell three different episodes: First Light, Moonlit Crossing, and A Fool at the Fair.

## The Damned

The 27 visualisations outside the two decks have a collection of their own.

Dawn Cobweb; Lingerie; Android Chicks; Boiling Pot; Hearts; Romans; Old School Games; Game of Life; Clubs; Berzerk; Ralph’s Last Watch; Hansel & Gretel; Punting with Ladies; Busy as a bee; Kola Superdeep Borehole; Monkey Business; Orbital; Spades; Hellstrom's Hive; Starry Night; Walk like an Egyptian; Space-Time Warp; Wormhole; Slit-Scan Photography; Schlieren Photography; Anamorphic Squeeze; Bipack Processing.

## Switching Scenes

The Arcana control cycles through the collections in the order above. Changing visualisations sweeps the outgoing frame aside in under half a second without interrupting playback. Night Drive dims the effect; reduced motion skips it.

## Assignment Notes

These are editorial groupings, not fixed interpretations of the art. Keep every visual assigned exactly once and each Minor Arcana suit at 14. Saved sessions find a visual by its ID even if it changes collections. The runtime catalogue lives in [app.js](../app.js) so the offline Android player does not need to fetch it.

The existing Summer/Autumn source-family flag remains internal to select the appropriate renderer and Alchemy recipes. It is not a second collection selector and must not interrupt playback.
