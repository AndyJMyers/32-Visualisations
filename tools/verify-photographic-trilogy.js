const assert=require('node:assert/strict'),path=require('node:path'),{spawnSync}=require('node:child_process');
const folder=process.env.PHOTO_OUTPUT||path.resolve(__dirname,'../../../outputs/Light-Lens-Illusion');
const ffmpeg=process.env.FFMPEG_PATH||'C:/Program Files/CEWE Creator/CEWE Creator/ffmpeg.exe';
const ffprobe=process.env.FFPROBE_PATH||'C:/Program Files/CEWE Creator/CEWE Creator/ffprobe.exe';
for(const edition of ['Landscape','Portrait']){
  const file=path.join(folder,`32V-Light-Lens-Illusion-Mission-To-Mars-${edition}-1080p60.mp4`);
  const probe=spawnSync(ffprobe,['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8',windowsHide:true});
  assert.equal(probe.status,0,probe.stderr);const meta=JSON.parse(probe.stdout),video=meta.streams.find(s=>s.codec_type==='video'),audio=meta.streams.find(s=>s.codec_type==='audio');
  assert.equal(video.width,edition==='Landscape'?1920:1080);assert.equal(video.height,edition==='Landscape'?1080:1920);
  assert.equal(video.avg_frame_rate,'60/1');assert.equal(Number(video.nb_frames),5400);assert.equal(audio.channels,2);assert.equal(audio.codec_name,'aac');
  assert.ok(Math.abs(Number(meta.format.duration)-90)<.02);
  const packets=spawnSync(ffprobe,['-v','error','-select_streams','v:0','-show_packets','-show_entries','packet=pts_time','-of','json',file],{encoding:'utf8',windowsHide:true,maxBuffer:4*1024*1024});
  assert.equal(packets.status,0,packets.stderr);const times=JSON.parse(packets.stdout).packets.map(p=>Number(p.pts_time));
  assert.equal(times.length,5400);assert.ok(Math.abs(times[0])<.0001);
  for(let i=1;i<times.length;i++)assert.ok(Math.abs(times[i]-times[i-1]-1/60)<.00001,`Frame timestamp discontinuity at ${i}`);
  const decode=spawnSync(ffmpeg,['-hide_banner','-i',file,'-af','volumedetect','-f','null','-'],{encoding:'utf8',windowsHide:true,maxBuffer:4*1024*1024});
  assert.equal(decode.status,0,decode.stderr);assert.ok(!/Error while|corrupt|Invalid data/i.test(decode.stderr),decode.stderr);
  const peak=Number(decode.stderr.match(/max_volume:\s*([\d.-]+) dB/)?.[1]);assert.ok(Number.isFinite(peak)&&peak<-.2,`Insufficient audio headroom: ${peak}`);
  console.log(`${edition}: 90 seconds, 5400 frames, native ${video.width}x${video.height}, 60 fps, continuous timestamps, clean full decode, stereo AAC peak ${peak} dBFS.`);
}
