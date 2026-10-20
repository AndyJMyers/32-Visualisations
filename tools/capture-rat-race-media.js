/* Capture deterministic Rat Race frames and a complete, sped-up day for the README. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas } = require('@napi-rs/canvas');

const root = path.join(__dirname, '..');
const output = path.join(root, 'docs', 'images', 'rat-race');
const ffmpeg = process.env.FFMPEG_PATH;
if (!ffmpeg || !fs.existsSync(ffmpeg)) {
  throw new Error('Set FFMPEG_PATH to an FFmpeg executable before capturing Rat Race media.');
}
fs.mkdirSync(output, { recursive: true });

const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(root, 'rat-race.js'), 'utf8'), sandbox);
const visual = sandbox.window.RatRace;
const canvas = createCanvas(900, 500);
const context = canvas.getContext('2d');
const settings = { form: 'clockwork', bass: .48, treble: .32 };
let tick = -1;
function advanceTo(seconds) {
  const target = Math.round(seconds * 10);
  while (tick < target) {
    tick++;
    visual.draw(context, 900, 500, tick * 100, settings);
  }
}

async function capture() {
  const stills = [
    ['01-wake-up.png', .5, 'alarm'],
    ['02-morning-train.png', 39.6, 'trainOut'],
    ['03-office-hours.png', 58.7, 'office'],
    ['04-home-again.png', 105.6, 'home'],
  ];
  for (const [filename, seconds, scene] of stills) {
    advanceTo(seconds);
    const shot = createCanvas(1440, 800);
    const state = visual.draw(shot.getContext('2d'), 1440, 800, tick * 100, { ...settings, animate: false });
    if (state.scene !== scene) throw new Error(`${filename}: expected ${scene}, got ${state.scene}`);
    fs.writeFileSync(path.join(output, filename), shot.toBuffer('image/png'));
  }

  visual.reset(); tick = -1;
  const clip = path.join(output, 'rat-race-one-day.mp4');
  const rate = 24, frameCount = 22 * rate;
  const encoder = spawn(ffmpeg, [
    '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pixel_format', 'rgba',
    '-video_size', '900x500', '-framerate', String(rate), '-i', 'pipe:0',
    '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '24',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', clip,
  ], { stdio: ['pipe', 'ignore', 'pipe'] });
  let errors = '';
  encoder.stderr.on('data', chunk => { errors += chunk.toString(); });
  const exit = new Promise((resolve, reject) => {
    encoder.on('error', reject);
    encoder.on('close', code => code === 0 ? resolve() : reject(new Error(errors || `FFmpeg exited ${code}`)));
  });
  for (let frame = 0; frame < frameCount; frame++) {
    advanceTo(frame / (frameCount - 1) * visual.scenes.reduce((total, [, length]) => total + length, 0));
    const pixels = context.getImageData(0, 0, 900, 500).data;
    if (!encoder.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength))) {
      await once(encoder.stdin, 'drain');
    }
  }
  encoder.stdin.end();
  await exit;
  console.log(`Captured ${stills.length} stills and ${frameCount / rate}s video in ${output}`);
}

capture().catch(error => { console.error(error); process.exitCode = 1; });
