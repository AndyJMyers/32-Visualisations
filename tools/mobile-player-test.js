const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
function section(from, to) {
  const start = source.indexOf(from);
  const end = source.indexOf(to, start + from.length);
  assert.ok(start >= 0 && end > start, "Tested app section exists: " + from);
  return source.slice(start, end);
}

async function test() {
  let starts = 0, advances = 0, loads = 0, finishStart, failStart;
  const audio = Object.assign(new EventTarget(), {
    src: "/alpha", paused: true, currentTime: 0, duration: 20, ended: false, readyState: 4,
    pause() { this.paused = true; },
    load() { loads++; },
    play() {
      starts++;
      return new Promise((resolve, reject) => {
        finishStart = () => { this.paused = false; resolve(); };
        failStart = reject;
      });
    },
  });
  const classes = new Set();
  const dial = () => Object.assign(new EventTarget(), { setAttribute() {} });
  const ctx = vm.createContext({
    audio, HTMLMediaElement: { HAVE_FUTURE_DATA: 3 }, console, setTimeout, clearTimeout,
    currentIndex: 0, tracks: ["Alpha", "Beta", "Ballad", "Gamma"], playbackGeneration: 0, playbackAttemptGeneration: -1,
    continuousPlaybackRequested: false, playbackTransitioning: false,
    playlistAdvancePending: false, playlistAdvanceFailures: 0, isAndroidCarMode: true,
    audioContext: { state: "suspended", resume: () => new Promise(() => {}) },
    setupAudioGraph() {}, clearPlaylistAdvanceRetry() {}, scheduleSessionSave() {},
    setStatus() {}, drawVisualizer() {}, updateAndroidMediaSession() {}, pulseStageLabel() {},
    songWheelIsAvailable: () => true, isDesktopSongWheelMode: () => false,
    clearSongWheelTimers() {}, updateSongWheelSearchResults() {},
    schedulePlaylistAdvanceRetry() { assert.fail("Unexpected retry"); },
    trackDisplayTitle: (track) => track, nextIndex: () => 1,
    mobileLetterDial: dial(), mobileTrackDial: dial(),
    mobileLetterValue: {}, mobileTrackValue: {},
    songWheelAlphabetIndex: 0, songWheelIndex: 0,
    songWheelSearchResults: { querySelector: () => null, querySelectorAll: () => [] },
    loadTrack(index) {
      advances++;
      ctx.currentIndex = index;
      ctx.playbackGeneration++;
      Object.assign(audio, { currentTime: 0, ended: false });
    },
    songWheel: {
      classList: {
        add: (...names) => names.forEach((name) => classes.add(name)),
        contains: (name) => classes.has(name),
        remove: (name) => classes.delete(name),
      },
      setAttribute() {},
    },
    songWheelSearch: { value: "", blur() {} },
  });
  ctx.window = ctx;
  const run = (code) => vm.runInContext(code, ctx);
  run(section("async function playCurrent()", "function stopCurrent()"));
  run(section("function togglePlayPause()", 'playButton.addEventListener("click", togglePlayPause)'));
  run(section('audio.addEventListener("ended"', 'audio.addEventListener("timeupdate"'));
  run(section("function hideSongWheel()", "function commitSongWheelSelection()"));
  run(section("function openSongWheel()", "function moveSongWheel("));
  run(section("function songWheelSearchMatches()", "function updateSongWheelSearchResults()"));
  run(section("function updateMobileTrackDials()", "function selectSongWheelSearchResult("));
  run(section("function songWheelLetterForTrack(", "function songWheelDialAt("));
  run(section('mobileLetterDial.addEventListener("input"', 'songWheelSearch.addEventListener("input"'));

  run("togglePlayPause()");
  audio.dispatchEvent(new Event("canplay"));
  run("recoverContinuousPlayback()");
  assert.equal(starts, 1, "A pending AudioContext resume does not block or duplicate play");
  finishStart();
  await new Promise(setImmediate);
  Object.assign(audio, { currentTime: 20, paused: true, ended: true });
  audio.dispatchEvent(new Event("pause"));
  audio.dispatchEvent(new Event("ended"));
  assert.equal(advances, 1, "Pause and ended advance exactly once");
  assert.equal(ctx.currentIndex, 1);

  run("playLoadedTrackWithRetry(playbackGeneration, { preservePlaybackIntent: true })");
  run("pauseCurrent()");
  failStart(new Error("Cancelled by pause"));
  await new Promise(setImmediate);
  assert.equal(starts, 2, "An explicit pause cancels any retry of the stale start");
  assert.equal(ctx.continuousPlaybackRequested, false);

  let expireStart;
  ctx.setTimeout = (callback) => { expireStart = callback; };
  ctx.console = { warn() {} };
  run("togglePlayPause()");
  expireStart();
  await new Promise(setImmediate);
  assert.equal(loads, 1, "A timed-out Android start reloads the media once before retrying");
  assert.equal(starts, 4, "Reload retries without another Play tap");
  finishStart();
  await new Promise(setImmediate);

  assert.equal(run("openSongWheel()"), true);
  assert.ok(classes.has("active") && classes.has("mobile-picker"), "Mobile opens the compact picker");
  assert.equal(run("songWheelSearchMatches().length"), 2, "Show every track in the current letter");
  ctx.mobileTrackDial.value = "1";
  ctx.mobileTrackDial.dispatchEvent(new Event("input"));
  assert.equal(ctx.mobileTrackValue.textContent, "Ballad");
  assert.equal(ctx.currentIndex, 1, "Browsing does not change playback");
  ctx.mobileLetterDial.value = "2";
  ctx.mobileLetterDial.dispatchEvent(new Event("input"));
  assert.equal(ctx.mobileLetterValue.textContent, "G");
  assert.equal(run("songWheelSearchMatches()[0].title"), "Gamma");
  run("hideSongWheel()");
  assert.ok(!classes.has("active") && !classes.has("mobile-picker"));
  console.log("Mobile player: playback recovery, exactly-once advance, and compact track browsing passed.");
}
test().catch((error) => { console.error(error); process.exitCode = 1; });
