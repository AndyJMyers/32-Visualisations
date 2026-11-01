/* Store cut: omit the unreleased Busy as a Bee shot and all later development work. */
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const folder = process.env.SHOWCASE_OUTPUT || path.resolve(root, '..', '..', 'outputs', '32V-Premiere');
const ffmpeg = process.env.FFMPEG_PATH || 'C:\\Program Files\\CEWE Creator\\CEWE Creator\\ffmpeg.exe';
const filter = '[0:v]split=2[x][y];[x]trim=start=0:end=29.6,setpts=PTS-STARTPTS[v0];[y]trim=start=37:end=68.4,setpts=PTS-STARTPTS[v1];[v0][v1]xfade=transition=fade:duration=1:offset=28.6,fade=t=out:st=58.8:d=1.2[v];[0:a]asplit=2[c][d];[c]atrim=start=0:end=29.6,asetpts=PTS-STARTPTS[a0];[d]atrim=start=37:end=68.4,asetpts=PTS-STARTPTS[a1];[a0][a1]acrossfade=d=1:c1=qsin:c2=qsin,afade=t=out:st=58:d=2[a]';
const result = spawnSync(ffmpeg, ['-y','-v','error','-i',path.join(folder,'32V-Premiere-YouTube-Rumble-1080p.mp4'),
  '-filter_complex',filter,'-map','[v]','-map','[a]','-t','60','-r','30','-c:v','libopenh264','-b:v','4500k','-pix_fmt','yuv420p',
  '-c:a','aac','-b:a','192k','-movflags','+faststart',path.join(folder,'32V-Play-Preview-60s.mp4')], { encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr || 'Play preview failed');
console.log('60-second Play candidate: original-collection scenes, no prices or ranking claims.');
