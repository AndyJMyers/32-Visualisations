/* Verify the finished film package without changing it. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const folder = process.env.SHOWCASE_OUTPUT || path.resolve(root, '..', '..', 'outputs', '32V-Premiere');
const ffmpeg = process.env.FFMPEG_PATH || 'C:\\Program Files\\CEWE Creator\\CEWE Creator\\ffmpeg.exe';
const edit = JSON.parse(fs.readFileSync(path.join(folder, 'edit-manifest.json')));
assert.equal(edit.duration, 180);
assert.equal(edit.fps, 30);
assert.equal(edit.shots[0].start, 0);
assert.equal(edit.shots.at(-1).end, 180);
for (let i = 1; i < edit.shots.length; i++) assert.equal(edit.shots[i].start, edit.shots[i - 1].end, 'Shot coverage is continuous');
assert.equal(new Set(edit.shots.map(shot => shot.suit)).size, 4);
assert.equal(edit.music.length, 6);
assert.equal(edit.music.at(-1).start + edit.music.at(-1).length, 180);
for (const song of edit.music) assert.ok(fs.existsSync(song.file), `Soundtrack source exists: ${song.title}`);
const files = [
  ['32V-Premiere-YouTube-Rumble-1080p.mp4', 180, '1920x1080'],
  ['32V-Premiere-Instagram-1080x1920.mp4', 180, '1080x1920'],
  ['32V-Premiere-GitHub-540p.mp4', 180, '960x540'],
  ['32V-Play-Preview-60s.mp4', 60, '1920x1080'],
];
for (const [name, duration, size] of files) {
  const file = path.join(folder, name);
  const info = spawnSync(ffmpeg, ['-hide_banner', '-i', file], { encoding: 'utf8' }).stderr;
  const time = info.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
  assert.ok(time, `${name} has a valid duration`);
  const actual = Number(time[1]) * 3600 + Number(time[2]) * 60 + Number(time[3]);
  assert.ok(Math.abs(actual - duration) < .1, `${name}: expected ${duration}s, got ${actual}s`);
  assert.ok(info.includes(size), `${name} has the expected dimensions`);
  assert.match(info, /Video: h264/);
  assert.match(info, /Audio: aac/);
  assert.match(info, /30 fps/);
  const decode = spawnSync(ffmpeg, ['-v', 'error', '-i', file, '-f', 'null', process.platform === 'win32' ? 'NUL' : '/dev/null'], { encoding: 'utf8' });
  assert.equal(decode.status, 0, `Full decode: ${name}`);
  assert.equal(decode.stderr.trim(), '', `No decode warnings: ${name}`);
  console.log(`${name}: ${actual}s / ${size} / full audio-video decode passed / ${(fs.statSync(file).size / 1048576).toFixed(1)} MiB`);
}
assert.ok(fs.statSync(path.join(folder, '32V-Premiere-GitHub-540p.mp4')).size < 100 * 1024 * 1024);
console.log('Four suits, six songs, continuous edit, all deliverables verified.');
