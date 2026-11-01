/* Portrait promo, driven by the selected track's bass, mids, and treble. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas } = require('@napi-rs/canvas');
const root = path.join(__dirname, '..');
const ffmpeg = process.env.FFMPEG_PATH || 'C:\\Program Files\\CEWE Creator\\CEWE Creator\\ffmpeg.exe';
const music = process.env.BOILING_MUSIC;
const output = process.env.BOILING_OUTPUT || path.join(root, 'docs', 'marketing', 'boiling-pot-quit-while-youre-a-chedd.mp4');
if (!music || !fs.existsSync(music)) throw new Error('Set BOILING_MUSIC to the original track.');
if (!fs.existsSync(ffmpeg)) throw new Error('Set FFMPEG_PATH to FFmpeg.');
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(root, 'boiling-pot.js'), 'utf8'), sandbox);
const visual = sandbox.window.BoilingPot;
const fps = 24, seconds = 60, start = Number(process.env.BOILING_AUDIO_START || 10);
const width = 720, height = 1280;
const stage = createCanvas(960, 540), ctx = stage.getContext('2d');
const canvas = createCanvas(width, height), c = canvas.getContext('2d');
const forms = ['tar', 'sulphur', 'mine', 'bluefire'];
const names = ['TAR BLACK', 'SULPHUR VEIN', 'THE OLD MINE', 'BLUE FIRE'];
const colours = ['#f8b34d', '#d7ed64', '#ff9361', '#79eaff'];
const notes = ['Something is stirring beneath the crust.', 'The air itself is catching fire.', 'The old workings breathe. Then roar.', 'A last dance above the blowtorches.'];
const bands = ['lowpass=f=220', 'highpass=f=220,lowpass=f=1800', 'highpass=f=1800'];
const samples = bands.map(filter => {
  const decoded = spawnSync(ffmpeg, ['-v', 'error', '-ss', String(start), '-t', String(seconds), '-i', music,
    '-af', filter, '-ac', '1', '-ar', '8000', '-f', 's16le', 'pipe:1'], { maxBuffer: 3 * 1024 * 1024 });
  if (decoded.status !== 0) throw new Error(decoded.stderr.toString());
  if (decoded.stdout.length < seconds * 8000 * 2) throw new Error('Track excerpt is shorter than the promo.');
  return decoded.stdout;
});
function energy(band, t) {
  const begin = Math.floor(t * 8000), end = Math.min(begin + 334, samples[band].length / 2);
  let sum = 0;
  for (let i = begin; i < end; i++) sum += (samples[band].readInt16LE(i * 2) / 32768) ** 2;
  return Math.min(1, Math.sqrt(sum / Math.max(1, end - begin)) * [6, 7, 12][band]);
}
function text(s, x, y, size, colour, family = 'Arial') {
  c.fillStyle = colour; c.font = `600 ${size}px ${family}`; c.fillText(s, x, y);
}
async function capture() {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const encoder = spawn(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo', '-pixel_format', 'rgba',
    '-video_size', `${width}x${height}`, '-framerate', String(fps), '-i', 'pipe:0',
    '-ss', String(start), '-t', String(seconds), '-i', music,
    '-filter_complex', '[0:v]scale=1080:1920:flags=lanczos,format=yuv420p[v];[1:a]afade=t=in:d=0.7,afade=t=out:st=57.5:d=2.5[a]',
    '-map', '[v]', '-map', '[a]', '-t', String(seconds), '-c:v', 'libopenh264', '-b:v', '5M', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', output],
  { stdio: ['pipe', 'ignore', 'pipe'] });
  let errors = '';
  encoder.stderr.on('data', chunk => { errors += chunk; });
  const exit = new Promise((resolve, reject) => {
    encoder.on('error', reject);
    encoder.on('close', code => code === 0 ? resolve() : reject(new Error(errors)));
  });
  encoder.stdin.on('error', () => {});
  for (let frame = 0; frame < seconds * fps; frame++) {
    const t = frame / fps, index = Math.min(3, Math.floor(t / 15));
    const bass = energy(0, t), mid = energy(1, t), treble = energy(2, t);
    visual.draw(ctx, 960, 540, t * 1000, { form: forms[index], bass, mid, treble });
    c.fillStyle = '#100f0e'; c.fillRect(0, 0, width, height);
    c.save(); c.globalAlpha = .15; c.drawImage(stage, -750, 0, 2280, 1280); c.restore();
    c.fillStyle = colours[index]; c.fillRect(32, 43, 90, 4);
    text('32 VISUALISATIONS  /  CUPS', 32, 79, 18, '#d8cfc2');
    text('BOILING POT', 29, 153, 67, colours[index], 'Georgia');
    text('A little pressure. A lot of atmosphere.', 33, 191, 21, '#e5dfd5');
    text(names[index], 33, 245, 22, colours[index]);
    c.fillStyle = colours[index]; c.fillRect(27, 267, 666, 380);
    c.drawImage(stage, 32, 272, 656, 370);
    const focus = [245, 267, 680, 490][index] + Math.sin(t * .22) * 38;
    const cropWidth = index === 2 ? 470 : 530;
    c.fillStyle = colours[index]; c.fillRect(27, 673, 666, 335);
    c.drawImage(stage, Math.max(0, Math.min(960 - cropWidth, focus - cropWidth / 2)), 118, cropWidth, 330, 32, 678, 656, 325);
    c.fillStyle = '#100f0ee8'; c.fillRect(32, 958, 656, 45);
    text(notes[index], 47, 987, 17, '#f2e5d2');
    text('QUIT WHILE YOU\u2019RE A CHEDD', 33, 1070, 29, '#fff0cf', 'Georgia');
    text('Original music. Unquiet ground.', 34, 1102, 18, '#c9c0b4');
    for (let bar = 0; bar < 48; bar++) {
      const level = [bass, mid, treble][bar % 3];
      c.fillStyle = colours[index]; c.fillRect(34 + bar * 13.5, 1161 - level * (12 + bar % 7 * 5), 7, 3 + level * (12 + bar % 7 * 5));
    }
    text('MUSIC MADE VISIBLE', 34, 1220, 18, '#ddd0ba');
    c.fillStyle = colours[index]; c.fillRect(34, 1238, 652 * t / seconds, 2);
    const fade = Math.max(0, 1 - t / .8, (t - 58.5) / 1.5);
    if (fade) { c.fillStyle = `rgba(12,10,9,${fade})`; c.fillRect(0, 0, width, height); }
    if (frame === 24 * 38) fs.writeFileSync(output.replace(/\.mp4$/, '-poster.jpg'), canvas.toBuffer('image/jpeg'));
    const pixels = c.getImageData(0, 0, width, height).data;
    if (encoder.stdin.destroyed) { await exit; throw new Error('Encoder closed early'); }
    if (!encoder.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength))) await once(encoder.stdin, 'drain');
    if (frame % (fps * 10) === 0) console.log(`Rendered ${t}s / ${seconds}s`);
  }
  encoder.stdin.end();
  await exit;
  console.log(output);
}
capture().catch(error => { console.error(error); process.exitCode = 1; });
