/* Render an Instagram-friendly Android Chicks teaser over Canonical Baklava. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas } = require('@napi-rs/canvas');

const root = path.join(__dirname, '..');
const ffmpeg = process.env.FFMPEG_PATH || 'C:\\Program Files\\CEWE Creator\\CEWE Creator\\ffmpeg.exe';
const music = process.env.CHICKS_MUSIC || 'C:\\Users\\mr__b\\Downloads\\Canonical Baklava.wav';
const output = process.env.CHICKS_OUTPUT || path.join(root, 'docs', 'marketing', 'android-chicks-canonical-baklava-preview.mp4');
if (!fs.existsSync(ffmpeg)) throw new Error(`FFmpeg not found: ${ffmpeg}`);
if (!fs.existsSync(music)) throw new Error(`Music file not found: ${music}`);

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(root, 'android-chicks.js'), 'utf8'), sandbox);
const visual = sandbox.window.AndroidChicks;
const fps = 24, secondsPerChapter = 10, chapterCount = 4, seconds = secondsPerChapter * chapterCount;
const audioStart = Number(process.env.CHICKS_AUDIO_START || 90);
const width = 720, height = 1280, stageWidth = 960, stageHeight = 540;
const stage = createCanvas(stageWidth, stageHeight), stageContext = stage.getContext('2d');
const canvas = createCanvas(width, height), c = canvas.getContext('2d');
const chapters = [
  { form: 'chrome', title: 'PERFECTLY TUNED', note: 'Compatibility: OPTIMAL', crop: [135, 123, 690, 300] },
  { form: 'rose', title: 'DATE NIGHT', note: 'A little chemistry gets the whole city dancing.', crop: [220, 190, 540, 270] },
  { form: 'ultraviolet', title: 'ALWAYS AGREEABLE', note: 'Every preference matched. Something still feels missing.', crop: [64, 168, 832, 320] },
  { form: 'wildcard', title: 'THE X FACTOR', note: 'A surprise is not a fault in the design.', crop: [300, 170, 360, 310] },
];

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
  return Math.min(1, Math.max(.06, Math.sqrt(sum / Math.max(1, count)) * 6));
}
function label(value, x, y, size, colour, align = 'left', family = 'Arial') {
  c.font = `600 ${size}px ${family}`; c.textAlign = align; c.fillStyle = colour; c.fillText(value, x, y);
}
function drawFrame(chapterIndex, local, absolute) {
  const chapter = chapters[chapterIndex], energy = energyAt(local);
  visual.draw(stageContext, stageWidth, stageHeight, absolute * 1000, {
    form: chapter.form, bass: energy, mid: energy * .72, treble: energy * .54, speed: 1,
  });

  c.fillStyle = '#10141d'; c.fillRect(0, 0, width, height);
  const glow = c.createRadialGradient(width * .5, 360, 4, width * .5, 360, 530);
  glow.addColorStop(0, chapter.form === 'rose' ? '#ef93b72c' : '#68c8e22a');
  glow.addColorStop(1, '#10141d00'); c.fillStyle = glow; c.fillRect(0, 0, width, 810);
  c.fillStyle = '#e89eb2'; c.fillRect(35, 45, 82, 4);
  label('32 V  /  CUPS', 35, 78, 16, '#c7d4de');
  label('ANDROID CHICKS', 33, 151, 46, '#fff0cf', 'left', 'Georgia');
  label('CANONICAL BAKLAVA', 35, 187, 19, '#efacb9');
  label('A Stepford-Wives Bossa', 35, 216, 17, '#c6c9d0');
  label(chapter.title, 35, 250, 17, '#f1cf81');

  c.fillStyle = '#d8c5a3'; c.fillRect(26, 267, 668, 376);
  c.fillStyle = '#151923'; c.fillRect(32, 273, 656, 364);
  c.drawImage(stage, 32, 273, 656, 364);
  c.fillStyle = '#d8c5a3'; c.fillRect(26, 666, 668, 246);
  c.fillStyle = '#171b24'; c.fillRect(32, 672, 656, 234);
  const [sx, sy, sw, sh] = chapter.crop;
  c.drawImage(stage, sx, sy, sw, sh, 32, 672, 656, 234);
  c.fillStyle = '#11141cdd'; c.fillRect(32, 864, 656, 42);
  label(chapter.note, 48, 891, 14, '#fff0cf');

  label('FUTURE MOOD', 35, 959, 13, '#a5aab4');
  label(['CHROME CONFIDENCE', 'PINK COMPATIBILITY', 'ULTRAVIOLET UNCANNY', 'DOUBLE-X WILDCARD'][chapterIndex], 35, 986, 18, '#f1cf81');
  const bars = 48, gap = 13.5, base = 1068;
  for (let i = 0; i < bars; i++) {
    const level = energyAt(Math.max(0, local + (i - bars / 2) * .028));
    const barHeight = 7 + level * (13 + ((i * 7) % 17));
    c.fillStyle = i / bars < absolute / seconds ? '#ea9fb2' : '#58616f';
    c.fillRect(35 + i * gap, base - barHeight, 8, barHeight);
  }
  c.fillStyle = '#68717d'; c.fillRect(35, 1080, 650, 1);
  label('FLIRTATION  /  FUTURE  /  A LITTLE AGENCY', 35, 1122, 13, '#c9c8c0');
  label('32 VISUALISATIONS', 35, 1207, 16, '#f5dda0');
  label('MUSIC MADE VISIBLE', 685, 1207, 14, '#89929e', 'right');
  c.fillStyle = '#e7a5b5'; c.fillRect(35, 1225, 650 * (absolute / seconds), 2);

  const transition = Math.max(0, 1 - local / .38, 1 - (secondsPerChapter - local) / .38);
  if (transition > 0) {
    c.save(); c.globalAlpha = transition * .25; c.fillStyle = '#fff0d0'; c.fillRect(0, 0, width, height); c.restore();
  }
  const fadeIn = Math.max(0, 1 - absolute / 1.1), fadeOut = Math.max(0, (absolute - (seconds - 1.3)) / 1.3);
  const fade = Math.max(fadeIn, fadeOut);
  if (fade > 0) { c.fillStyle = `rgba(9, 12, 19, ${fade * .88})`; c.fillRect(0, 0, width, height); }
}

async function capture() {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const encoder = spawn(ffmpeg, [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${width}x${height}`,
    '-framerate', String(fps), '-i', 'pipe:0',
    '-ss', String(audioStart), '-t', String(seconds), '-i', music,
    '-filter_complex', '[0:v]scale=1080:1920:flags=lanczos,format=yuv420p[v];[1:a]afade=t=in:st=0:d=0.8,afade=t=out:st=37.5:d=2.5[a]',
    '-map', '[v]', '-map', '[a]', '-t', String(seconds),
    '-c:v', 'libopenh264', '-b:v', '4M', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', output,
  ], { stdio: ['pipe', 'ignore', 'pipe'] });
  let errors = '';
  encoder.stderr.on('data', chunk => { errors += chunk.toString(); });
  const exit = new Promise((resolve, reject) => {
    encoder.on('error', reject);
    encoder.on('close', code => code === 0 ? resolve() : reject(new Error(errors || `FFmpeg exited ${code}`)));
  });
  let activeChapter = -1;
  for (let frame = 0; frame < seconds * fps; frame++) {
    const absolute = frame / fps;
    const chapterIndex = Math.min(chapterCount - 1, Math.floor(absolute / secondsPerChapter));
    const local = absolute - chapterIndex * secondsPerChapter;
    if (chapterIndex !== activeChapter) {
      activeChapter = chapterIndex;
      visual.reset();
      for (let tick = 0; tick < chapterIndex * secondsPerChapter * fps; tick++) {
        visual.draw(stageContext, stageWidth, stageHeight, tick * 1000 / fps, {
          form: chapters[chapterIndex].form, bass: .25, mid: .2, treble: .12, speed: 1,
        });
      }
    }
    drawFrame(chapterIndex, local, absolute);
    const pixels = c.getImageData(0, 0, width, height).data;
    if (!encoder.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength))) await once(encoder.stdin, 'drain');
    if (frame % (fps * 5) === 0) console.log(`Rendered ${Math.round(absolute)}s / ${seconds}s`);
  }
  encoder.stdin.end();
  await exit;
  console.log(output);
}
capture().catch(error => { console.error(error); process.exitCode = 1; });
