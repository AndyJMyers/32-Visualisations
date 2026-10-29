/* Render the Autumn scenes themselves into a short, music-backed Play preview draft. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas } = require('@napi-rs/canvas');

const root = path.join(__dirname, '..');
const ffmpeg = process.env.FFMPEG_PATH;
const music = process.env.AUTUMN_MUSIC;
const output = process.env.AUTUMN_OUTPUT || path.join(root, 'docs', 'marketing', 'autumn-season-preview.mp4');
if (!ffmpeg || !fs.existsSync(ffmpeg)) throw new Error('Set FFMPEG_PATH to an FFmpeg executable.');
if (!music || !fs.existsSync(music)) throw new Error('Set AUTUMN_MUSIC to an original music file.');
fs.mkdirSync(path.dirname(output), { recursive: true });

const scenes = [
  { title: 'STARRY NIGHT', file: 'starry-night.js', export: 'StarryNight', forms: ['cobalt', 'silver'], start: 5 },
  { title: 'WATER LILIES', file: 'water-lilies.js', export: 'WaterLilies', forms: ['awake', 'orange'], start: 7 },
  { title: 'TOADSTOOLS', file: 'toadstools.js', export: 'AutumnToadstools', forms: ['golden', 'moonlight'], start: 8 },
  { title: 'THE SCREAM', file: 'the-scream.js', export: 'TheScream', forms: ['burning', 'negative'], start: 8 },
  { title: 'OLD SCHOOL GAMES', file: 'old-school-games.js', export: 'OldSchoolGames', forms: ['popart', 'afterdark'], start: 20 },
  { title: 'HARVEST TIME', file: 'harvest.js', export: 'HarvestTime', forms: ['amber', 'blue'], start: 9 },
  { title: 'RAT RACE', file: 'rat-race.js', export: 'RatRace', forms: ['clockwork', 'neon'], start: 8 },
  { title: 'PLENTY OF PUFF', file: 'plenty-of-puff.js', export: 'PlentyOfPuff', forms: ['brass', 'furnace'], start: 5 },
];
const fps = 24, secondsPerScene = 4, seconds = scenes.length * secondsPerScene;
const audioStart = Number(process.env.AUTUMN_AUDIO_START || 20);
const width = 960, height = 540;
const stage = createCanvas(width, height), stageContext = stage.getContext('2d');
const canvas = createCanvas(width, height), c = canvas.getContext('2d');

const decoded = spawnSync(ffmpeg, [
  '-v', 'error', '-ss', String(audioStart), '-t', String(seconds), '-i', music,
  '-ac', '1', '-ar', '4000', '-f', 's16le', 'pipe:1',
], { maxBuffer: 2 * 1024 * 1024 });
if (decoded.status !== 0) throw new Error(decoded.stderr.toString() || 'Could not decode music');
const samples = decoded.stdout;
function energyAt(second) {
  const start = Math.max(0, Math.floor(second * 4000));
  let sum = 0, count = 0;
  for (let i = start; i < Math.min(start + 600, samples.length / 2); i += 2) {
    const value = samples.readInt16LE(i * 2) / 32768;
    sum += value * value; count++;
  }
  return Math.min(1, Math.max(.12, Math.sqrt(sum / Math.max(1, count)) * 6));
}
function loadScene(index) {
  const scene = scenes[index], sandbox = { window: {}, Math,
    document: { createElement: () => createCanvas(1, 1) } };
  vm.runInNewContext(fs.readFileSync(path.join(root, scene.file), 'utf8'), sandbox);
  const visual = sandbox.window[scene.export];
  if (!visual || typeof visual.draw !== 'function') throw new Error(`${scene.file} has no draw function`);
  if (typeof visual.reset === 'function') visual.reset();
  for (let i = 0; i <= scene.start * fps; i++) {
    const energy = energyAt(index * secondsPerScene);
    visual.draw(stageContext, width, height, i * 1000 / fps,
      { form: scene.forms[0], bass: energy, mid: energy * .78, treble: energy * .58, speed: 1.2 });
  }
  return visual;
}
function frame(index, localTime, energy, visual) {
  const scene = scenes[index];
  visual.draw(stageContext, width, height, (scene.start + localTime) * 1000,
    { form: scene.forms[localTime < secondsPerScene / 2 ? 0 : 1],
      bass: energy, mid: energy * .78, treble: energy * .58, speed: 1.2 });
  c.drawImage(stage, 0, 0);
  const shade = c.createLinearGradient(0, 0, 0, 150);
  shade.addColorStop(0, '#0b111bd9'); shade.addColorStop(1, '#0b111b00');
  c.fillStyle = shade; c.fillRect(0, 0, width, 150);
  c.fillStyle = '#f7dfb0'; c.font = 'bold 18px Arial';
  c.fillText('32 VISUALISATIONS  /  AUTUMN', 28, 38);
  c.fillStyle = '#fff5e2'; c.font = 'bold 36px Georgia'; c.fillText(scene.title, 28, 82);
  c.fillStyle = '#f4c575'; c.fillRect(28, 98, 172, 3);
  if (index === 0 || index === scenes.length - 1) {
    c.fillStyle = '#0b111bbd'; c.fillRect(0, height - 70, width, 70);
    c.fillStyle = '#fff5e2'; c.font = 'bold 23px Arial';
    c.fillText(index === 0 ? 'YOUR MUSIC. TWO SEASONS.' : 'SUMMER + AUTUMN. ONE PLAYER.', 28, height - 27);
  }
  const fade = Math.max(0, 1 - localTime / .28, 1 - (secondsPerScene - localTime) / .28);
  if (fade > 0) { c.fillStyle = `rgba(11, 17, 27, ${Math.min(.8, fade * .8)})`; c.fillRect(0, 0, width, height); }
}

async function capture() {
  const encoder = spawn(ffmpeg, [
    '-y', '-v', 'error', '-f', 'rawvideo', '-pixel_format', 'rgba',
    '-video_size', `${width}x${height}`, '-framerate', String(fps), '-i', 'pipe:0',
    '-ss', String(audioStart), '-t', String(seconds), '-i', music,
    '-filter_complex', '[0:v]scale=1920:1080:flags=lanczos,format=yuv420p[v];[1:a]afade=t=in:st=0:d=1,afade=t=out:st=30:d=2[a]',
    '-map', '[v]', '-map', '[a]', '-t', String(seconds),
    '-c:v', 'libopenh264', '-b:v', '5M', '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart', output,
  ], { stdio: ['pipe', 'ignore', 'pipe'] });
  let errors = '';
  encoder.stderr.on('data', chunk => { errors += chunk.toString(); });
  const exit = new Promise((resolve, reject) => {
    encoder.on('error', reject);
    encoder.on('close', code => code === 0 ? resolve() : reject(new Error(errors || `FFmpeg exited ${code}`)));
  });
  let activeIndex = -1, visual;
  for (let i = 0; i < seconds * fps; i++) {
    const t = i / fps, index = Math.floor(t / secondsPerScene);
    if (index !== activeIndex) { activeIndex = index; visual = loadScene(index); }
    frame(index, t - index * secondsPerScene, energyAt(t), visual);
    const pixels = c.getImageData(0, 0, width, height).data;
    if (!encoder.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength)))
      await once(encoder.stdin, 'drain');
    if (i % (fps * 4) === 0) console.log(`Rendered ${Math.round(t)}s / ${seconds}s`);
  }
  encoder.stdin.end();
  await exit;
  console.log(output);
}
capture().catch(error => { console.error(error); process.exitCode = 1; });
