/* Render a portrait teaser through the four chapters, using the named original track. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas } = require('@napi-rs/canvas');

const root = path.join(__dirname, '..');
const ffmpeg = process.env.FFMPEG_PATH;
const music = process.env.BEE_MUSIC || 'C:\\Users\\mr__b\\OneDrive\\TVR MUSIC PLAYLIST\\Salt Light Litany suno1.wav';
const output = process.env.BEE_OUTPUT || path.join(root, 'docs', 'marketing', 'busy-as-a-bee-instagram.mp4');
if (!ffmpeg || !fs.existsSync(ffmpeg)) throw new Error('Set FFMPEG_PATH to the installed FFmpeg executable.');
if (!fs.existsSync(music)) throw new Error(`Music file not found: ${music}`);

const visualSandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(root, 'busy-as-a-bee.js'), 'utf8'), visualSandbox);
const visual = visualSandbox.window.BusyAsABee;
const fps = 24, secondsPerChapter = 10, chapterCount = 4, seconds = secondsPerChapter * chapterCount;
const audioStart = Number(process.env.BEE_AUDIO_START || 20);
const width = 720, height = 1280, stageWidth = 960, stageHeight = 540;
const stage = createCanvas(stageWidth, stageHeight), stageContext = stage.getContext('2d');
const canvas = createCanvas(width, height), c = canvas.getContext('2d');
const chapters = [
  { form: 'meadow', title: 'THE MATING FLIGHT', note: 'A queen takes the bright air.', crop: [44, 49, 670, 365] },
  { form: 'bloom', title: 'A COLONY TAKES SHAPE', note: 'Many small labours make a living whole.', crop: [76, 69, 760, 404] },
  { form: 'hive', title: 'NECTAR & POLLEN', note: 'Every returning worker carries the day.', crop: [34, 242, 700, 286] },
  { form: 'moonflower', title: 'THE WAGGLE DANCE', note: 'A dance becomes a map to the flowers.', crop: [260, 143, 340, 300] },
];
const recipes = { meadow: 'MEADOW GOLD', bloom: 'ORCHARD BLOOM', hive: 'INSIDE THE HIVE', moonflower: 'MOONFLOWER NOCTURNE' };
fs.mkdirSync(path.dirname(output), { recursive: true });

const decoded = spawnSync(ffmpeg, [
  '-v', 'error', '-ss', String(audioStart), '-t', String(seconds), '-i', music,
  '-ac', '1', '-ar', '4000', '-f', 's16le', 'pipe:1',
], { maxBuffer: 2 * 1024 * 1024 });
if (decoded.status !== 0) throw new Error(decoded.stderr.toString() || 'Could not decode the selected music.');
const samples = decoded.stdout;
function energyAt(second) {
  const first = Math.max(0, Math.floor(second * 4000));
  let sum = 0, count = 0;
  for (let i = first; i < Math.min(first + 600, samples.length / 2); i++) {
    const value = samples.readInt16LE(i * 2) / 32768;
    sum += value * value; count++;
  }
  return Math.min(1, Math.max(.08, Math.sqrt(sum / Math.max(1, count)) * 6));
}
function label(value, x, y, size, colour, align = 'left', family = 'Arial') {
  c.font = `600 ${size}px ${family}`; c.textAlign = align; c.fillStyle = colour; c.fillText(value, x, y);
}
function drawChapterFrame(chapterIndex, local, absolute) {
  const chapter = chapters[chapterIndex], energy = energyAt(local);
  visual.draw(stageContext, stageWidth, stageHeight, local * 1000, {
    form: chapter.form, bass: energy, mid: energy * .72, treble: energy * .54, speed: 1.12,
  });

  c.fillStyle = '#111918'; c.fillRect(0, 0, width, height);
  const glow = c.createRadialGradient(width * .5, 306, 8, width * .5, 306, 470);
  glow.addColorStop(0, '#d3963424'); glow.addColorStop(1, '#10181600');
  c.fillStyle = glow; c.fillRect(0, 0, width, 740);
  c.fillStyle = '#f0c45b'; c.fillRect(34, 43, 80, 4);
  label('32 V  /  PENTACLES', 34, 76, 17, '#dfd3b7');
  label('BUSY AS A BEE', 32, 151, 48, '#fff0c4', 'left', 'Georgia');
  label('A living world, dancing to your music.', 35, 185, 20, '#c7c8aa');
  label(chapter.title, 35, 230, 20, '#f2c76a');

  c.fillStyle = '#e6c989'; c.fillRect(26, 250, 668, 389);
  c.fillStyle = '#151a18'; c.fillRect(32, 256, 656, 377);
  c.drawImage(stage, 32, 256, 656, 377);
  c.fillStyle = '#e6c989'; c.fillRect(26, 665, 668, 244);
  c.fillStyle = '#171c1b'; c.fillRect(32, 671, 656, 232);
  const [sx, sy, sw, sh] = chapter.crop;
  c.drawImage(stage, sx, sy, sw, sh, 32, 671, 656, 232);
  c.fillStyle = '#0d1412db'; c.fillRect(32, 861, 656, 42);
  label(chapter.note, 48, 889, 16, '#fff1cf');

  label('COLONY MOOD', 35, 952, 13, '#9ba695');
  label(recipes[chapter.form], 35, 979, 18, '#f1cf81');
  const bars = 48, gap = 13.5, base = 1062;
  for (let i = 0; i < bars; i++) {
    const level = energyAt(Math.max(0, local + (i - bars / 2) * .028));
    const heightPx = 7 + level * (13 + ((i * 7) % 17));
    c.fillStyle = i / bars < absolute / seconds ? '#efbd55' : '#5d6659';
    c.fillRect(35 + i * gap, base - heightPx, 8, heightPx);
  }
  c.fillStyle = '#697264'; c.fillRect(35, 1075, 650, 1);
  label('COURTSHIP  ·  CRAFT  ·  FORAGING  ·  DANCE', 35, 1115, 13, '#c2c2a5');
  label('32 VISUALISATIONS', 35, 1204, 16, '#f5dda0');
  label('MUSIC MADE VISIBLE', 685, 1204, 14, '#899283', 'right');
  c.fillStyle = '#e8bd5a'; c.fillRect(35, 1222, 650 * (absolute / seconds), 2);

  const transition = Math.max(0, 1 - local / .38, 1 - (secondsPerChapter - local) / .38);
  if (transition > 0) {
    c.save(); c.globalAlpha = transition * .28;
    c.fillStyle = '#fff0b8'; c.fillRect(0, 0, width, height);
    c.restore();
  }
  const fadeIn = Math.max(0, 1 - absolute / 1.1);
  const fadeOut = Math.max(0, (absolute - (seconds - 1.3)) / 1.3);
  const fade = Math.max(fadeIn, fadeOut);
  if (fade > 0) { c.fillStyle = `rgba(9, 14, 13, ${fade * .88})`; c.fillRect(0, 0, width, height); }
}

async function capture() {
  const encoder = spawn(ffmpeg, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${width}x${height}`,
    '-framerate', String(fps), '-i', 'pipe:0',
    '-ss', String(audioStart), '-t', String(seconds), '-i', music,
    '-filter_complex', '[0:v]scale=1080:1920:flags=lanczos,format=yuv420p[v];[1:a]afade=t=in:st=0:d=0.8,afade=t=out:st=37.5:d=2.5[a]',
    '-map', '[v]', '-map', '[a]', '-t', String(seconds),
    '-c:v', 'libopenh264', '-b:v', '4M', '-c:a', 'aac', '-b:a', '160k',
    '-movflags', '+faststart', output,
  ], { stdio: ['pipe', 'ignore', 'pipe'] });
  let errors = '';
  encoder.stderr.on('data', chunk => { errors += chunk.toString(); });
  const exit = new Promise((resolve, reject) => {
    encoder.on('error', reject);
    encoder.on('close', code => code === 0 ? resolve() : reject(new Error(errors || `FFmpeg exited ${code}`)));
  });
  const chapterFrames = secondsPerChapter * fps;
  let activeChapter = -1;
  for (let frame = 0; frame < seconds * fps; frame++) {
    const absolute = frame / fps;
    const chapterIndex = Math.min(chapterCount - 1, Math.floor(absolute / secondsPerChapter));
    const local = absolute - chapterIndex * secondsPerChapter;
    if (chapterIndex !== activeChapter) {
      activeChapter = chapterIndex;
      visual.reset();
      const preRoll = Math.floor(chapterIndex * 11 * fps);
      for (let tick = 0; tick < preRoll; tick++) {
        const energy = energyAt(absolute);
        visual.draw(stageContext, stageWidth, stageHeight, tick * 1000 / fps, {
          form: chapters[chapterIndex].form, bass: energy, mid: energy * .72, treble: energy * .54, speed: 1.12,
        });
      }
      if (preRoll) visual.draw(stageContext, stageWidth, stageHeight, preRoll * 1000 / fps, {
        form: chapters[chapterIndex].form, bass: .3, mid: .2, treble: .1, animate: false,
      });
    }
    drawChapterFrame(chapterIndex, local, absolute);
    const pixels = c.getImageData(0, 0, width, height).data;
    if (!encoder.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength))) await once(encoder.stdin, 'drain');
    if (frame % (fps * 5) === 0) console.log(`Rendered ${Math.round(absolute)}s / ${seconds}s`);
  }
  encoder.stdin.end();
  await exit;
  console.log(output);
}
capture().catch(error => { console.error(error); process.exitCode = 1; });
