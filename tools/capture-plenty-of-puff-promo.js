/* Produce a portrait, music-backed one-minute promo for Plenty of Puff. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas } = require('@napi-rs/canvas');

const root = path.join(__dirname, '..');
const ffmpeg = process.env.FFMPEG_PATH;
const music = process.env.PUFF_MUSIC;
const output = process.env.PUFF_OUTPUT || path.join(root, 'docs', 'marketing', 'plenty-of-puff-instagram-reel.mp4');
if (!ffmpeg || !fs.existsSync(ffmpeg)) throw new Error('Set FFMPEG_PATH to an FFmpeg executable.');
if (!music || !fs.existsSync(music)) throw new Error('Set PUFF_MUSIC to the original WAV.');
fs.mkdirSync(path.dirname(output), { recursive: true });

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(root, 'plenty-of-puff.js'), 'utf8'), sandbox);
const visual = sandbox.window.PlentyOfPuff;
const rate = 24;
const seconds = 60;
const audioStart = 20;
const width = 720, height = 1280;
const stage = createCanvas(960, 540);
const stageContext = stage.getContext('2d');
const canvas = createCanvas(width, height);
const c = canvas.getContext('2d');
const formNames = { brass: 'BRASS & SOOT', furnace: 'FURNACE GLOW', blueprint: "ENGINEER'S BLUEPRINT", night: 'NIGHT SHIFT' };
const forms = [['brass', 'blueprint'], ['furnace', 'night'], ['night', 'blueprint'], ['furnace', 'brass']];
const closeups = [[365, 252, 430, 245], [90, 97, 780, 446], [318, 62, 340, 380], [361, 182, 470, 265]];

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
  const rms = Math.sqrt(sum / Math.max(1, count));
  return Math.min(1, Math.max(.12, rms * 6));
}
function label(value, x, y, size, colour, align = 'left') {
  c.font = `bold ${size}px Georgia`; c.textAlign = align; c.fillStyle = colour; c.fillText(value, x, y);
}
function frame(t, audioEnergy) {
  const storyTime = Math.min(55.99, Math.max(0, t - 2));
  const chapter = Math.min(3, Math.floor(storyTime / 14));
  const within = storyTime % 14;
  const form = forms[chapter][within < 7 ? 0 : 1];
  visual.draw(stageContext, 960, 540, storyTime * 1000, {
    form, bass: audioEnergy, mid: audioEnergy * .72, treble: audioEnergy * .5,
    animate: t >= 2 && t < 58,
  });

  c.fillStyle = '#14181c'; c.fillRect(0, 0, width, height);
  c.save(); c.globalAlpha = .18;
  c.drawImage(stage, -780, 0, 2275, height);
  c.restore();
  c.fillStyle = '#111820ca'; c.fillRect(0, 0, width, height);

  c.fillStyle = '#e8a754'; c.fillRect(32, 38, 112, 5);
  label('PLENTY', 32, 113, 73, '#f4d6a2');
  label('OF PUFF', 32, 188, 73, '#f4d6a2');
  label('32 VISUALISATIONS  /  AUTUMN NO. 32', 35, 229, 19, '#d6bd99');
  c.fillStyle = '#e8a754'; c.fillRect(32, 252, 656, 2);
  label(visual.chapters[chapter][0], 34, 310, 39, '#fff0d3');
  label(formNames[form], 35, 342, 17, '#efae63');

  c.fillStyle = '#ddab69'; c.fillRect(27, 368, 666, 380);
  c.drawImage(stage, 32, 373, 656, 369);
  c.fillStyle = '#ddab69'; c.fillRect(27, 776, 666, 325);
  const [sx, sy, sw, sh] = closeups[chapter];
  c.drawImage(stage, sx, sy, sw, sh, 32, 781, 656, 315);
  c.fillStyle = '#15191dde'; c.fillRect(32, 1054, 656, 42);
  label('THE MACHINE, UP CLOSE', 48, 1082, 17, '#f4d6a2');

  label('LOTS GOING ON HERE', 34, 1160, 31, '#f4d6a2');
  label('Original music  /  one minute from the steam age', 35, 1190, 17, '#d6bd99');
  for (let i = 0; i < 45; i++) {
    const level = energyAt(Math.max(0, t + (i - 22) * .035));
    const bar = 8 + level * (14 + (i * 7 % 20));
    c.fillStyle = i < (t / seconds) * 45 ? '#edae60' : '#8a8278';
    c.fillRect(34 + i * 14.5, 1239 - bar, 8, bar);
  }

  // Rising steam masks each scene cut and each change of alchemy.
  const boundaries = [2, 9, 16, 23, 30, 37, 44, 51, 58];
  const nearest = boundaries.reduce((best, boundary) => Math.abs(boundary - t) < Math.abs(best - t) ? boundary : best);
  const flash = Math.max(0, 1 - Math.abs(t - nearest) / .48);
  if (flash > 0) {
    c.save(); c.globalAlpha = flash * .66;
    c.fillStyle = '#d7d2be';
    for (let i = 0; i < 13; i++) {
      const x = (i * 137 + nearest * 41) % 860 - 70;
      const y = height - flash * 990 - i * 61;
      c.beginPath(); c.arc(x, y, 80 + i % 4 * 24, 0, Math.PI * 2); c.fill();
    }
    c.restore();
  }
  if (t < 2 || t > 58) {
    const alpha = t < 2 ? Math.max(0, 1 - t / 2) : Math.min(1, (t - 58) / 1.3);
    c.fillStyle = `rgba(12, 15, 20, ${alpha * .86})`; c.fillRect(0, 0, width, height);
    c.save(); c.globalAlpha = alpha;
    label('PLENTY OF PUFF', 360, 592, 54, '#f4d6a2', 'center');
    label(t < 2 ? 'THE STEAM AGE HAS A BEAT' : '32 VISUALISATIONS', 360, 637, 22, '#edae60', 'center');
    c.restore();
  }
}

async function capture() {
  const encoder = spawn(ffmpeg, [
    '-y', '-v', 'error',
    '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${width}x${height}`,
    '-framerate', String(rate), '-i', 'pipe:0',
    '-ss', String(audioStart), '-t', String(seconds), '-i', music,
    '-filter_complex', '[0:v]scale=1080:1920:flags=lanczos,format=yuv420p[v];[1:a]afade=t=in:st=0:d=1,afade=t=out:st=58:d=2[a]',
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
  for (let i = 0; i < seconds * rate; i++) {
    const t = i / rate;
    frame(t, energyAt(t));
    const pixels = c.getImageData(0, 0, width, height).data;
    if (!encoder.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength))) {
      await once(encoder.stdin, 'drain');
    }
    if (i % 240 === 0) console.log(`Rendered ${Math.round(t)}s / ${seconds}s`);
  }
  encoder.stdin.end();
  await exit;
  console.log(output);
}
capture().catch(error => { console.error(error); process.exitCode = 1; });
