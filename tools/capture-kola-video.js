/* A forty-second portrait descent, measured against three soundtrack bands. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas } = require('@napi-rs/canvas');
const root = path.join(__dirname, '..');
const ffmpeg = process.env.FFMPEG_PATH || 'C:\\Program Files\\CEWE Creator\\CEWE Creator\\ffmpeg.exe';
const music = process.env.KOLA_MUSIC;
const output = path.join(root, 'docs', 'marketing', 'kola-superdeep-chedd-teaser.mp4');
if (!music || !fs.existsSync(music)) throw new Error('Set KOLA_MUSIC to the original track.');
const sandbox = { window: {}, Math };
vm.runInNewContext(fs.readFileSync(path.join(root, 'kola-superdeep.js'), 'utf8'), sandbox);
const scene = sandbox.window.KolaSuperdeep;
const fps = 24, seconds = 40, start = 30;
const stage = createCanvas(1000, 600), ctx = stage.getContext('2d');
const canvas = createCanvas(720, 1280), c = canvas.getContext('2d');
const colours = ['#ffc66b', '#60efff', '#ffd98a', '#f599bc'];
const samples = ['lowpass=f=220', 'highpass=f=220,lowpass=f=1800', 'highpass=f=1800'].map(filter => {
  const result = spawnSync(ffmpeg, ['-v', 'error', '-ss', String(start), '-t', String(seconds), '-i', music,
    '-af', filter, '-ac', '1', '-ar', '8000', '-f', 's16le', 'pipe:1'], { maxBuffer: 2 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr.toString());
  if (result.stdout.length < seconds * 8000 * 2) throw new Error('Source audio is too short');
  return result.stdout;
});
function energy(band, t) {
  const begin = Math.floor(t * 8000), end = Math.min(begin + 334, samples[band].length / 2);
  let sum = 0;
  for (let i = begin; i < end; i++) sum += (samples[band].readInt16LE(i * 2) / 32768) ** 2;
  return Math.min(1, Math.sqrt(sum / Math.max(1, end - begin)) * [6, 7, 12][band]);
}
function text(s, x, y, size, colour, font = 'Arial') {
  c.font = `600 ${size}px ${font}`; c.fillStyle = colour; c.fillText(s, x, y);
}
async function capture() {
  const encoder = spawn(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'rawvideo', '-pixel_format', 'rgba',
    '-video_size', '720x1280', '-framerate', String(fps), '-i', 'pipe:0', '-ss', String(start), '-t', String(seconds), '-i', music,
    '-filter_complex', '[0:v]scale=1080:1920:flags=lanczos,format=yuv420p[v];[1:a]afade=t=in:d=0.7,afade=t=out:st=38:d=2[a]',
    '-map', '[v]', '-map', '[a]', '-t', String(seconds), '-c:v', 'libopenh264', '-b:v', '5M', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', output],
  { stdio: ['pipe', 'ignore', 'pipe'] });
  let errors = '';
  encoder.stderr.on('data', chunk => { errors += chunk; });
  const exit = new Promise((resolve, reject) => {
    encoder.on('error', reject); encoder.on('close', code => code === 0 ? resolve() : reject(new Error(errors)));
  });
  encoder.stdin.on('error', () => {});
  for (let frame = 0; frame < seconds * fps; frame++) {
    const t = frame / fps, chapter = Math.min(3, Math.floor(t / 10));
    const recipe = scene.recipes[chapter], colour = colours[chapter];
    const state = scene.draw(ctx, 1000, 600, t * 1000, { form: recipe.form, speed: 2.5, bass: energy(0, t), mid: energy(1, t), treble: energy(2, t) });
    c.fillStyle = '#090f14'; c.fillRect(0, 0, 720, 1280);
    c.save(); c.globalAlpha = .12; c.drawImage(stage, -700, 0, 2133, 1280); c.restore();
    c.fillStyle = colour; c.fillRect(32, 40, 100, 4);
    text('32 VISUALISATIONS / PENTACLES', 32, 77, 18, '#c9d3d5');
    text('KOLA', 29, 152, 73, colour, 'Georgia');
    text('SUPERDEEP BOREHOLE', 32, 198, 35, '#edf0e8', 'Georgia');
    text(recipe.name.toUpperCase(), 33, 243, 19, colour);
    c.fillStyle = colour; c.fillRect(27, 263, 666, 404); c.drawImage(stage, 32, 268, 656, 394);
    // Alternate sides to reveal the archaeology rather than duplicating the shaft.
    const side = Math.floor(t / 5) % 2;
    c.fillStyle = colour; c.fillRect(27, 692, 666, 290);
    c.drawImage(stage, side ? 340 : 0, 140, 660, 282, 32, 697, 656, 280);
    text(`${state.depth.toFixed(0).padStart(5, '0')} m`, 33, 1023, 29, colour, 'monospace');
    text(`${Math.round(state.temperature)} C / ${Math.round(state.pressure)} MPa`, 320, 1023, 23, '#e4e8df', 'monospace');
    text(state.speculative ? 'BEYOND THE LIMIT OF THE KNOWN' : 'THE EARTH KEEPS ITS OWN ARCHIVE', 34, 1057, 17, '#c9d3d5');
    text('QUIT WHILE YOU\u2019RE A CHEDD', 33, 1125, 27, '#eee0be', 'Georgia');
    text('Original music. Impossible archaeology.', 34, 1157, 18, '#bdc8cb');
    text('MUSIC MADE VISIBLE', 34, 1220, 18, '#d4dcd5');
    c.fillStyle = colour; c.fillRect(34, 1239, 652 * t / seconds, 2);
    const fade = Math.max(0, 1 - t / .8, (t - 38.5) / 1.5);
    if (fade) { c.fillStyle = `rgba(6,10,13,${fade})`; c.fillRect(0, 0, 720, 1280); }
    if (frame === 24 * 17) fs.writeFileSync(output.replace('.mp4', '-poster.jpg'), canvas.toBuffer('image/jpeg'));
    const pixels = c.getImageData(0, 0, 720, 1280).data;
    if (encoder.stdin.destroyed) { await exit; throw new Error('Encoder closed early'); }
    if (!encoder.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength))) await once(encoder.stdin, 'drain');
    if (frame % (fps * 10) === 0) console.log(`Rendered ${t}s / ${seconds}s`);
  }
  encoder.stdin.end(); await exit; console.log(output);
}
capture().catch(error => { console.error(error); process.exitCode = 1; });
