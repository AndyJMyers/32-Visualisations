/* Capture real visualisation frames for the Autumn README gallery. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const root = path.join(__dirname, '..');
const output = path.join(root, 'docs', 'images', 'autumn-gallery');
const width = 1440;
const height = 810;
const shots = [
  ['01-starry-night.png', 'starry-night.js', 'StarryNight', 'cobalt', 6],
  ['02-water-lilies.png', 'water-lilies.js', 'WaterLilies', 'awake', 7],
  ['03-the-scream.png', 'the-scream.js', 'TheScream', 'burning', 8],
  ['04-mondrian.png', 'mondrian.js', 'Mondrian', 'boogie', 8],
  ['05-pollocks.png', 'pollocks.js', 'Pollocks', 'enamel', 16],
  ['06-walk-egyptian.png', 'walk-egyptian.js', 'WalkEgyptian', 'gold', 3],
  ['07-old-school-games.png', 'old-school-games.js', 'OldSchoolGames', 'popart', 20],
  ['08-beowulf.png', 'beowulf.js', 'Beowulf', 'wyrdfire', 9],
  ['09-churchill.png', 'churchill.js', 'Churchill', 'oils', 20],
  ['10-iron-lady.png', 'iron-lady.js', 'IronLady', 'coal', 32],
];

fs.mkdirSync(output, { recursive: true });
for (const [filename, source, exportedName, form, seconds] of shots) {
  const sandbox = { window: {}, Math };
  vm.runInNewContext(fs.readFileSync(path.join(root, source), 'utf8'), sandbox);
  const visual = sandbox.window[exportedName];
  if (!visual || typeof visual.draw !== 'function') throw new Error(`${source} has no draw function`);
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  let state;
  const frames = Math.ceil(seconds * 20);
  for (let frame = 0; frame <= frames; frame++) {
    const beat = frame % 17 === 0;
    state = visual.draw(context, width, height, frame * 50, {
      form, speed: 3, bass: beat ? .88 : .4, mid: .58, treble: .52,
    });
  }
  fs.writeFileSync(path.join(output, filename), canvas.toBuffer('image/png'));
  console.log(`${filename}: ${JSON.stringify(state)}`);
}

async function captureExhibitionPoster() {
  const poster = createCanvas(1600, 920);
  const context = poster.getContext('2d');
  context.fillStyle = '#11141e';
  context.fillRect(0, 0, 1600, 920);
  context.fillStyle = '#f7efdb';
  context.font = 'bold 66px Arial';
  context.fillText('AUTUMN / A MOVING EXHIBITION', 42, 82);
  context.font = 'bold 34px Arial';
  context.textAlign = 'right';
  context.fillStyle = '#f3bd62';
  context.fillText('29 / 32', 1556, 82);

  const panels = [
    ['01-starry-night.png', 'STARRY NIGHT', 0, 0],
    ['03-the-scream.png', 'THE SCREAM', 1, 0],
    ['07-old-school-games.png', 'OLD SCHOOL GAMES', 0, 1],
    ['08-beowulf.png', 'BEOWULF', 1, 1],
  ];
  for (const [filename, title, column, row] of panels) {
    const image = await loadImage(path.join(output, filename));
    const x = 12 + column * 794;
    const y = 116 + row * 398;
    const w = 782;
    const h = 386;
    const sourceHeight = image.width * h / w;
    context.drawImage(image, 0, (image.height - sourceHeight) / 2, image.width, sourceHeight, x, y, w, h);
    context.fillStyle = '#10121acc';
    context.fillRect(x, y + h - 52, w, 52);
    context.fillStyle = '#fff5e4';
    context.textAlign = 'left';
    context.font = 'bold 26px Arial';
    context.fillText(title, x + 22, y + h - 17);
  }
  fs.writeFileSync(path.join(output, 'autumn-exhibition.png'), poster.toBuffer('image/png'));
}

captureExhibitionPoster().catch(error => { console.error(error); process.exitCode = 1; });
