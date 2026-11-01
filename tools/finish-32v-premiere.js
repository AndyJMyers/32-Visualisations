/* A single editorial title/footer frame replaces colliding native scene labels. */
const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { once } = require('node:events');
const { createCanvas } = require('@napi-rs/canvas');
const root = path.resolve(__dirname, '..');
const folder = process.env.SHOWCASE_OUTPUT || path.resolve(root, '..', '..', 'outputs', '32V-Premiere');
const ffmpeg = process.env.FFMPEG_PATH || 'C:\\Program Files\\CEWE Creator\\CEWE Creator\\ffmpeg.exe';
const edit = JSON.parse(fs.readFileSync(path.join(folder, 'edit-manifest.json')));
const cache = path.join(folder, '_render-cache'); fs.mkdirSync(cache, { recursive: true });
const masterName = '32V-Premiere-YouTube-Rumble-1080p.mp4', reviewName = '32V-Premiere-GitHub-540p.mp4';
const master = path.join(folder, masterName), review = path.join(folder, reviewName);
const original = path.join(cache, 'original-master.mp4');
const input = fs.existsSync(original) ? original : master;
const fixed = path.join(cache, 'finished-master.mp4'), small = path.join(cache, 'finished-review.mp4');
const canvas = createCanvas(1920, 304), c = canvas.getContext('2d');
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const fade = (t, a, b, r = .8) => smooth((t - a) / r) * smooth((b - t) / r);
const colours = { cups: '#ebabc0', swords: '#99cceb', pentacles: '#c6d4a0', wands: '#d5b4fb' };
function text(value, x, y, size, colour, align = 'left', family = 'Arial') {
  c.textAlign = align; c.font = `${size}px ${family}`; c.fillStyle = colour; c.fillText(value, x, y);
}
async function finish() {
  const filter = '[1:v]split=2[h][f];[h]crop=1920:160:0:0[header];[f]crop=1920:144:0:160[footer];[0:v][header]overlay=0:0[a];[a][footer]overlay=0:936[b];[b]split=2[wide][s];[s]scale=960:540[small]';
  const process = spawn(ffmpeg, ['-y','-v','error','-i',input,'-f','rawvideo','-pix_fmt','rgba','-s','1920x304','-r','30','-i','pipe:0',
    '-filter_complex',filter,'-map','[wide]','-map','0:a','-c:v','libopenh264','-b:v','8M','-pix_fmt','yuv420p','-c:a','copy','-t','180','-r','30','-movflags','+faststart',fixed,
    '-map','[small]','-map','0:a','-c:v','libopenh264','-b:v','1100k','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-t','180','-r','30','-movflags','+faststart',small], { stdio: ['pipe','ignore','pipe'] });
  let errors = ''; process.stderr.on('data', data => { errors += data; }); process.stdin.on('error', () => {});
  const finished = new Promise((resolve, reject) => { process.on('error', reject); process.on('close', code => code === 0 ? resolve() : reject(new Error(errors))); }); finished.catch(() => {});
  try {
    for (let frame = 0; frame < 5400; frame++) {
      const t = frame / 30, shot = edit.shots.find(s => t >= s.start && t < s.end);
      c.globalAlpha = 1; c.fillStyle = '#080c12'; c.fillRect(0, 0, 1920, 304);
      const global = 1 - Math.max(0, 1 - t / 1.2, (t - 178.4) / 1.6);
      c.globalAlpha = global * fade(t, shot.start, shot.end, .6);
      c.fillStyle = colours[shot.suit]; c.fillRect(69, 47, 4, 29);
      text(`${shot.suit.toUpperCase()}  /  ${shot.title.toUpperCase()}`, 103, 72, 24, '#f3e5ca');
      if (shot.development) text('DEVELOPMENT COLLECTION', 103, 112, 16, '#d6bc87');
      c.globalAlpha = global;
      text('32 V', 1854, 72, 32, '#e4cf9e', 'right', 'Georgia');
      const song = edit.music.findLast(song => t >= song.start) || edit.music[0];
      const a = song.start + (song.start === 0 ? 8 : 1.6), b = Math.min(song.start + 17, 180);
      c.globalAlpha = global * fade(t, a, b, .9);
      text('ORIGINAL SOUNDTRACK', 1850, 196, 15, '#c3b28e', 'right');
      text(song.title, 1850, 235, 29, '#f1e3c6', 'right', 'Georgia');
      c.globalAlpha = global;
      text('32 VISUALISATIONS / MUSIC MADE VISIBLE', 72, 264, 15, '#b8b2a3');
      c.fillStyle = '#e6c98988'; c.fillRect(72, 286, 1776 * t / 180, 1);
      const pixels = c.getImageData(0, 0, 1920, 304).data;
      if (process.stdin.destroyed) { await finished; throw new Error('Finishing encoder closed early'); }
      if (!process.stdin.write(Buffer.from(pixels.buffer, pixels.byteOffset, pixels.byteLength))) await once(process.stdin, 'drain');
      if (frame % 900 === 0) console.log(`Editorial frame: ${t}/180s`);
    }
    process.stdin.end(); await finished;
  } catch (error) { process.kill(); throw error; }
  for (const file of [fixed, small]) {
    const check = spawnSync(ffmpeg, ['-hide_banner','-i',file], { encoding: 'utf8' });
    if (!check.stderr.includes('Duration: 00:03:00.')) throw new Error(`Incomplete finishing output: ${file}`);
  }
  if (!fs.existsSync(original)) fs.renameSync(master, original); else fs.renameSync(master, path.join(cache, 'previous-master.mp4'));
  fs.renameSync(review, path.join(cache, 'original-review.mp4'));
  fs.renameSync(fixed, master); fs.renameSync(small, review);
  const play = spawnSync(ffmpeg, ['-y','-v','error','-i',master,'-t','60','-vf','fade=t=out:st=58.8:d=1.2','-af','afade=t=out:st=58:d=2',
    '-c:v','libopenh264','-b:v','4500k','-c:a','aac','-b:a','192k','-movflags','+faststart',path.join(folder,'32V-Play-Preview-60s.mp4')], { encoding: 'utf8' });
  if (play.status !== 0) throw new Error(play.stderr || 'Play preview finishing failed');
  console.log('Editorial finishing complete; first renders retained in _render-cache.');
}
finish().catch(error => { console.error(error); process.exitCode = 1; });
