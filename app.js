const folderInput = document.querySelector("#folderInput");
const directoryName = document.querySelector("#directoryName");
const statusLight = document.querySelector("#statusLight");
const statusText = document.querySelector("#statusText");
const currentTrack = document.querySelector("#currentTrack");
const timeReadout = document.querySelector("#timeReadout");
const visualizer = document.querySelector("#visualizer");
const audio = document.querySelector("#audio");
const previousButton = document.querySelector("#previousButton");
const playButton = document.querySelector("#playButton");
const stopButton = document.querySelector("#stopButton");
const nextButton = document.querySelector("#nextButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const shuffleToggle = document.querySelector("#shuffleToggle");
const sortSelect = document.querySelector("#sortSelect");
const visualizerSelect = document.querySelector("#visualizerSelect");
const fireworkFormSelect = document.querySelector("#fireworkFormSelect");
const themeSelect = document.querySelector("#themeSelect");
const fireworkSpeed = document.querySelector("#fireworkSpeed");
const fireworkSpeedValue = document.querySelector("#fireworkSpeedValue");
const handSize = document.querySelector("#handSize");
const handSizeValue = document.querySelector("#handSizeValue");
const handCount = document.querySelector("#handCount");
const handCountValue = document.querySelector("#handCountValue");
const handGrasp = document.querySelector("#handGrasp");
const handGraspValue = document.querySelector("#handGraspValue");
const peakToggle = document.querySelector("#peakToggle");
const trackCount = document.querySelector("#trackCount");
const trackList = document.querySelector("#trackList");

let tracks = [];
let currentIndex = -1;
let audioContext;
let analyser;
let sourceNode;
let animationId;
let peakLevels = [];
let peakUpdatedAt = [];
let fireworks = [];
let fireworkCooldowns = [];
let fireworkFrame = 0;
let shapeReveal = 0;
let pacDancers = [];
let pacFrame = 0;
let handForms = [];
let handFrame = 0;
let swampBubbles = [];
let swampFrame = 0;
let moodState = {
  energy: 0,
  brightness: 0,
  warmth: 0,
};

const peakHoldMs = 3200;
const fireworksBands = [
  { start: 1, end: 5, threshold: 0.42, name: "bass" },
  { start: 6, end: 14, threshold: 0.35, name: "lowMid" },
  { start: 15, end: 32, threshold: 0.31, name: "mid" },
  { start: 33, end: 60, threshold: 0.28, name: "highMid" },
  { start: 61, end: 112, threshold: 0.22, name: "treble" },
];
const visualizerThemes = {
  mono: {
    idle: "rgba(87, 216, 178, 0.22)",
    peak: "rgba(244, 240, 232, 0.82)",
    color(index, count, value) {
      const lightness = 40 + value * 22;
      return `hsl(156 58% ${lightness}%)`;
    },
  },
  ice: {
    idle: "rgba(117, 199, 255, 0.2)",
    peak: "rgba(255, 255, 255, 0.86)",
    color(index, count, value) {
      const hue = 198 + (index / count) * 34;
      const lightness = 44 + value * 24;
      return `hsl(${hue} 82% ${lightness}%)`;
    },
  },
  ember: {
    idle: "rgba(252, 190, 74, 0.2)",
    peak: "rgba(255, 244, 214, 0.9)",
    color(index, count, value) {
      const hue = 44 - (index / count) * 24;
      const lightness = 45 + value * 20;
      return `hsl(${hue} 92% ${lightness}%)`;
    },
  },
  spectrum: {
    idle: "rgba(166, 173, 181, 0.18)",
    peak: "rgba(255, 255, 255, 0.82)",
    color(index, count, value) {
      const hue = 285 - (index / count) * 230;
      const lightness = 48 + value * 18;
      return `hsl(${hue} 78% ${lightness}%)`;
    },
  },
};

const fireworkPalettes = {
  mono: [156, 142, 174],
  ice: [196, 212, 226],
  ember: [18, 34, 48],
  spectrum: [285, 215, 155, 48, 330],
};

const pacBands = [
  { start: 1, end: 5, move: "stomp" },
  { start: 6, end: 12, move: "sway" },
  { start: 13, end: 26, move: "spin" },
  { start: 27, end: 48, move: "slide" },
  { start: 49, end: 80, move: "shimmy" },
  { start: 81, end: 112, move: "twirl" },
];

const handBands = [
  { start: 1, end: 5, root: 0.08, side: 1 },
  { start: 6, end: 12, root: 0.23, side: -1 },
  { start: 13, end: 24, root: 0.39, side: 1 },
  { start: 25, end: 44, root: 0.56, side: -1 },
  { start: 45, end: 74, root: 0.72, side: 1 },
  { start: 75, end: 112, root: 0.9, side: -1 },
];

const swampBands = [
  { start: 1, end: 5, kind: "leviathan" },
  { start: 6, end: 12, kind: "balloon" },
  { start: 13, end: 28, kind: "mutter" },
  { start: 29, end: 56, kind: "midge" },
  { start: 57, end: 88, kind: "soap" },
  { start: 89, end: 112, kind: "tinkle" },
];

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function trackTitle(file) {
  return file.name.replace(/\.wav$/i, "");
}

function trackName(track) {
  return track.file?.name || track.name || "";
}

function trackModified(track) {
  return track.file?.lastModified || track.lastModified || 0;
}

function trackDisplayTitle(track) {
  return trackName(track).replace(/\.wav$/i, "");
}

function setStatus(status) {
  statusLight.className = "status-light";

  if (status === "playing") {
    statusLight.classList.add("playing");
    statusText.textContent = "Playing";
    playButton.textContent = "Pause";
  } else if (status === "paused") {
    statusLight.classList.add("paused");
    statusText.textContent = "Paused";
    playButton.textContent = "Play";
  } else {
    statusText.textContent = "Stopped";
    playButton.textContent = "Play";
  }
}

function sortTracks() {
  const [field, direction] = sortSelect.value.split("-");
  const multiplier = direction === "asc" ? 1 : -1;

  tracks.sort((a, b) => {
    const comparison = field === "name"
      ? collator.compare(trackName(a), trackName(b))
      : trackModified(a) - trackModified(b);
    return comparison * multiplier;
  });
}

function renderTracks() {
  trackList.innerHTML = "";
  trackCount.textContent = `${tracks.length} ${tracks.length === 1 ? "track" : "tracks"}`;

  if (tracks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No WAV files found in this directory.";
    trackList.append(empty);
    setControlsEnabled(false);
    return;
  }

  const fragment = document.createDocumentFragment();

  tracks.forEach((track, index) => {
    const item = document.createElement("li");
    item.className = `track-item${index === currentIndex ? " active" : ""}`;
    item.tabIndex = 0;
    item.dataset.index = index;

    const name = document.createElement("span");
    name.className = "track-name";
    name.textContent = trackDisplayTitle(track);

    const date = document.createElement("span");
    date.className = "track-date";
    date.textContent = dateFormatter.format(new Date(trackModified(track)));

    item.append(name, date);
    fragment.append(item);
  });

  trackList.append(fragment);
  setControlsEnabled(true);
}

function setControlsEnabled(enabled) {
  [previousButton, playButton, stopButton, nextButton, shuffleToggle, sortSelect].forEach((control) => {
    control.disabled = !enabled;
  });
}

function visualizerTheme() {
  return visualizerThemes[themeSelect.value] || visualizerThemes.mono;
}

function fireworkSpeedMultiplier() {
  return Number(fireworkSpeed.value) || 1;
}

function updateFireworkSpeedLabel() {
  fireworkSpeedValue.textContent = `${fireworkSpeedMultiplier().toFixed(1)}x`;
}

function handSizeMultiplier() {
  return Number(handSize.value) || 1;
}

function handCountValueNumber() {
  return Number(handCount.value) || 6;
}

function handGraspAmount() {
  return Number(handGrasp.value) || 0;
}

function updateHandControlLabels() {
  handSizeValue.textContent = `${handSizeMultiplier().toFixed(2)}x`;
  handCountValue.textContent = String(handCountValueNumber());
  handGraspValue.textContent = `${Math.round(handGraspAmount() * 100)}%`;
}

function setFullscreenLabel() {
  fullscreenButton.textContent = document.fullscreenElement ? "X" : "F";
}

function restartVisualizer() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = 0;
  }

  peakLevels = [];
  peakUpdatedAt = [];
  fireworks = [];
  fireworkCooldowns = [];
  fireworkFrame = 0;
  shapeReveal = 0;
  pacDancers = [];
  pacFrame = 0;
  handForms = [];
  handFrame = 0;
  swampBubbles = [];
  swampFrame = 0;
  swampBubbles = [];
  swampFrame = 0;

  if (!audio.paused && analyser) {
    drawVisualizer();
  } else {
    drawIdleVisualizer();
  }
}

function setupAudioGraph() {
  if (!audioContext) {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.78;
    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
  }
}

function loadTrack(index, autoplay = true) {
  if (index < 0 || index >= tracks.length) {
    return;
  }

  if (currentIndex >= 0 && tracks[currentIndex]?.url) {
    URL.revokeObjectURL(tracks[currentIndex].url);
    tracks[currentIndex].url = "";
  }

  currentIndex = index;
  const track = tracks[currentIndex];
  const trackUrl = URL.createObjectURL(track.file);
  track.url = trackUrl;
  audio.src = trackUrl;
  currentTrack.textContent = trackDisplayTitle(track);
  renderTracks();

  if (autoplay) {
    playCurrent();
  }
}

async function playCurrent() {
  if (tracks.length === 0) {
    return;
  }

  if (currentIndex === -1) {
    loadTrack(0, false);
  }

  setupAudioGraph();
  await audioContext.resume();
  await audio.play();
  setStatus("playing");
  drawVisualizer();
}

function pauseCurrent() {
  audio.pause();
  setStatus("paused");
}

function stopCurrent() {
  audio.pause();
  audio.currentTime = 0;
  setStatus("stopped");
}

function resetLibraryState() {
  tracks.forEach((track) => {
    if (track.url) {
      URL.revokeObjectURL(track.url);
    }
  });

  currentIndex = -1;
  audio.removeAttribute("src");
  audio.load();
  currentTrack.textContent = "No track loaded";
  timeReadout.textContent = "0:00 / 0:00";
  setStatus("stopped");
}

function nextIndex() {
  if (tracks.length < 2) {
    return currentIndex;
  }

  if (shuffleToggle.checked) {
    let next = currentIndex;
    while (next === currentIndex) {
      next = Math.floor(Math.random() * tracks.length);
    }
    return next;
  }

  return (currentIndex + 1) % tracks.length;
}

function previousIndex() {
  if (shuffleToggle.checked || currentIndex <= 0) {
    return 0;
  }

  return currentIndex - 1;
}

function drawVisualizer() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  const canvasContext = visualizer.getContext("2d");
  const buffer = new Uint8Array(analyser.frequencyBinCount);

  const draw = () => {
    try {
      if (visualizerSelect.value === "swampbubbles") {
        drawSwampBubblesFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "branchhands") {
        drawBranchHandsFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "pacdance") {
        drawPacDanceFrame(canvasContext, buffer);
      } else if (visualizerSelect.value === "fireworks") {
        drawFireworksFrame(canvasContext, buffer);
      } else {
        drawEqualizerFrame(canvasContext, buffer);
      }
    } catch (error) {
      console.warn("Visualizer frame skipped", error);
    }

    animationId = requestAnimationFrame(draw);
  };

  draw();
}

function drawEqualizerFrame(canvasContext, buffer) {
    const width = visualizer.width;
    const height = visualizer.height;
    canvasContext.clearRect(0, 0, width, height);
    canvasContext.fillStyle = "#0b0d0f";
    canvasContext.fillRect(0, 0, width, height);

    analyser.getByteFrequencyData(buffer);

    const barCount = 48;
    const barGap = 5;
    const barWidth = (width - (barCount - 1) * barGap) / barCount;
    const theme = visualizerTheme();
    const now = performance.now();

    for (let i = 0; i < barCount; i += 1) {
      const start = Math.floor((i / barCount) * buffer.length);
      const end = Math.floor(((i + 1) / barCount) * buffer.length);
      let total = 0;

      for (let j = start; j < end; j += 1) {
        total += buffer[j];
      }

      const value = total / Math.max(1, end - start);
      const normalizedValue = value / 255;
      const barHeight = Math.max(8, normalizedValue * (height - 28));
      const x = i * (barWidth + barGap);
      const y = height - barHeight;

      if (!peakLevels[i] || barHeight >= peakLevels[i] || now - peakUpdatedAt[i] > peakHoldMs) {
        peakLevels[i] = barHeight;
        peakUpdatedAt[i] = now;
      }

      canvasContext.fillStyle = theme.color(i, barCount, normalizedValue);
      canvasContext.fillRect(x, y, barWidth, barHeight);
      canvasContext.fillStyle = "rgba(255, 255, 255, 0.18)";
      canvasContext.fillRect(x, y, barWidth, 3);

      if (peakToggle.checked && peakLevels[i]) {
        const age = now - peakUpdatedAt[i];
        const opacity = Math.max(0, 1 - age / peakHoldMs);
        const peakY = height - peakLevels[i];
        canvasContext.fillStyle = theme.peak.replace(/[\d.]+\)$/, `${0.28 + opacity * 0.62})`);
        canvasContext.fillRect(x, peakY, barWidth, 4);
      }
    }
}

function averageBand(buffer, start, end) {
  let total = 0;
  const safeEnd = Math.min(end, buffer.length - 1);

  for (let index = start; index <= safeEnd; index += 1) {
    total += buffer[index];
  }

  return total / Math.max(1, safeEnd - start + 1) / 255;
}

function updateMood(buffer) {
  const bass = averageBand(buffer, 1, 8);
  const mids = averageBand(buffer, 12, 42);
  const treble = averageBand(buffer, 46, 112);
  const energy = bass * 0.42 + mids * 0.36 + treble * 0.22;

  moodState.energy = moodState.energy * 0.92 + energy * 0.08;
  moodState.brightness = moodState.brightness * 0.9 + treble * 0.1;
  moodState.warmth = moodState.warmth * 0.9 + bass * 0.1;
}

function fireworkHue(bandIndex, intensity) {
  const palette = fireworkPalettes[themeSelect.value] || fireworkPalettes.mono;
  const baseHue = palette[bandIndex % palette.length];
  const moodShift = (moodState.brightness - moodState.warmth) * 44;
  return baseHue + moodShift + intensity * 16;
}

function hsla(hue, saturation, lightness, alpha) {
  return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

function pointOnLine(x1, y1, x2, y2) {
  const amount = Math.random();
  return {
    x: x1 + (x2 - x1) * amount,
    y: y1 + (y2 - y1) * amount,
  };
}

function pointOnEllipse(cx, cy, rx, ry) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random());
  return {
    x: cx + Math.cos(angle) * rx * radius,
    y: cy + Math.sin(angle) * ry * radius,
  };
}

function hydraPoint() {
  const pick = Math.random();

  if (pick < 0.5) {
    const neck = Math.floor(Math.random() * 7);
    const t = Math.random();
    const rootX = 0.5;
    const rootY = 0.78;
    const headX = 0.18 + neck * 0.105;
    const headY = 0.18 + Math.sin(neck * 1.35) * 0.09;
    const bend = Math.sin(t * Math.PI * 2 + neck) * 0.06;
    return {
      x: rootX + (headX - rootX) * t + bend,
      y: rootY + (headY - rootY) * t,
    };
  }

  if (pick < 0.75) {
    const head = Math.floor(Math.random() * 7);
    return pointOnEllipse(0.18 + head * 0.105, 0.18 + Math.sin(head * 1.35) * 0.09, 0.04, 0.05);
  }

  if (pick < 0.9) {
    return pointOnEllipse(0.5, 0.76, 0.18, 0.095);
  }

  const coil = Math.random();
  return {
    x: 0.5 + Math.cos(coil * Math.PI * 2) * (0.08 + coil * 0.1),
    y: 0.78 + Math.sin(coil * Math.PI * 2) * 0.06,
  };
}

function womanPoint() {
  const pick = Math.random();

  if (pick < 0.18) {
    return pointOnEllipse(0.5, 0.22, 0.05, 0.065);
  }

  if (pick < 0.42) {
    const side = Math.random() < 0.5 ? -1 : 1;
    const t = Math.random();
    return {
      x: 0.5 + side * (0.055 + Math.sin(t * Math.PI) * 0.09),
      y: 0.29 + t * 0.33,
    };
  }

  if (pick < 0.66) {
    const side = Math.random() < 0.5 ? -1 : 1;
    return pointOnLine(0.5, 0.36, 0.5 + side * 0.19, 0.52);
  }

  if (pick < 0.86) {
    const side = Math.random() < 0.5 ? -1 : 1;
    return pointOnLine(0.47 + side * 0.035, 0.62, 0.5 + side * 0.12, 0.84);
  }

  return pointOnEllipse(0.5, 0.51, 0.105, 0.18);
}

function lionPoint() {
  const pick = Math.random();

  if (pick < 0.28) {
    return pointOnEllipse(0.46, 0.55, 0.17, 0.11);
  }

  if (pick < 0.42) {
    return pointOnEllipse(0.62, 0.38, 0.07, 0.075);
  }

  if (pick < 0.58) {
    const side = Math.random() < 0.5 ? 0 : 1;
    return side
      ? pointOnLine(0.56, 0.48, 0.76, 0.28)
      : pointOnLine(0.5, 0.48, 0.68, 0.2);
  }

  if (pick < 0.76) {
    const side = Math.random() < 0.5 ? 0 : 1;
    return side
      ? pointOnLine(0.42, 0.62, 0.5, 0.84)
      : pointOnLine(0.54, 0.62, 0.65, 0.82);
  }

  if (pick < 0.9) {
    const t = Math.random();
    return {
      x: 0.3 - Math.sin(t * Math.PI) * 0.14,
      y: 0.5 - t * 0.22 + Math.sin(t * Math.PI * 2) * 0.025,
    };
  }

  return pointOnLine(0.66, 0.35, 0.78, 0.3);
}

function fireworkShapePoint(width, height) {
  const form = fireworkFormSelect.value;
  const point = form === "woman"
    ? womanPoint()
    : form === "lion"
      ? lionPoint()
      : hydraPoint();

  return {
    x: point.x * width,
    y: point.y * height,
  };
}

function spawnFirework(band, bandIndex, intensity, width, height) {
  const speedMultiplier = fireworkSpeedMultiplier();
  const burstScale = 0.55 + Math.random() * 1.75 + moodState.energy * 0.8;
  const particleCount = Math.round((10 + intensity * 26 + moodState.energy * 16) * burstScale);
  const radius = 0.9 + intensity * 3.1 + Math.random() * 2.2;
  const bias = bandIndex / Math.max(1, fireworksBands.length - 1);
  const originX = width * (0.08 + Math.random() * 0.84) * 0.7 + width * bias * 0.3;
  const originY = height * (0.14 + Math.random() * 0.72);
  const hue = fireworkHue(bandIndex, intensity);

  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.8 + Math.random() * (2.6 + intensity * 5.8)) * burstScale * speedMultiplier;
    const target = fireworkShapePoint(width, height);
    fireworks.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - intensity * 1.7,
      life: 1,
      age: 0,
      decay: (0.0048 + Math.random() * 0.0085) * (0.55 + speedMultiplier * 0.55),
      radius,
      targetX: target.x,
      targetY: target.y,
      pull: 0.0018 + Math.random() * 0.0048,
      hue: hue + (Math.random() - 0.5) * 22,
      saturation: 68 + intensity * 24,
      lightness: 48 + moodState.brightness * 30,
    });
  }
}

function drawFireworksFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  updateMood(buffer);
  fireworkFrame += speedMultiplier;
  shapeReveal = Math.min(1, shapeReveal + 0.0018 / Math.max(0.55, speedMultiplier));

  canvasContext.fillStyle = `rgba(5, 7, 9, ${(0.038 + moodState.energy * 0.065) * Math.sqrt(speedMultiplier)})`;
  canvasContext.fillRect(0, 0, width, height);

  const gradient = canvasContext.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `rgba(87, 216, 178, ${0.03 + moodState.brightness * 0.08})`);
  gradient.addColorStop(1, `rgba(252, 190, 74, ${0.02 + moodState.warmth * 0.08})`);
  canvasContext.fillStyle = gradient;
  canvasContext.fillRect(0, 0, width, height);

  fireworksBands.forEach((band, bandIndex) => {
    const intensity = averageBand(buffer, band.start, band.end);
    const cooldown = fireworkCooldowns[bandIndex] || 0;
    const chance = intensity * 0.12 + moodState.energy * 0.035;

    if ((intensity > band.threshold || Math.random() < chance) && cooldown <= 0) {
      spawnFirework(band, bandIndex, intensity, width, height);
      fireworkCooldowns[bandIndex] = Math.max(4, (24 - intensity * 16 + Math.random() * 16) / speedMultiplier);
    } else {
      fireworkCooldowns[bandIndex] = Math.max(0, cooldown - speedMultiplier);
    }

    if (intensity > 0.12) {
      const pulseRadius = 14 + intensity * 64;
      const pulseHue = fireworkHue(bandIndex, intensity);
      const pulsePoint = fireworkShapePoint(width, height);
      const pulse = canvasContext.createRadialGradient(
        pulsePoint.x,
        pulsePoint.y,
        0,
        pulsePoint.x,
        pulsePoint.y,
        pulseRadius,
      );
      pulse.addColorStop(0, hsla(pulseHue, 78, 58, 0.22));
      pulse.addColorStop(1, "rgba(255, 255, 255, 0)");
      canvasContext.fillStyle = pulse;
      canvasContext.beginPath();
      canvasContext.arc(pulsePoint.x, pulsePoint.y, pulseRadius, 0, Math.PI * 2);
      canvasContext.fill();
    }
  });

  if (Math.floor(fireworkFrame) % 34 < speedMultiplier && moodState.energy > 0.03) {
    const index = Math.floor(Math.random() * fireworksBands.length);
    spawnFirework(fireworksBands[index], index, 0.18 + moodState.energy * 0.8, width, height);
  }

  drawEmergentForm(canvasContext, width, height);

  fireworks = fireworks.filter((particle) => particle.life > 0);
  fireworks.forEach((particle) => {
    const dying = Math.max(0, 0.72 - particle.life) / 0.72;
    const pull = particle.pull * (0.24 + dying * 1.7) * (0.95 + moodState.brightness);
    particle.vx += (particle.targetX - particle.x) * pull;
    particle.vy += (particle.targetY - particle.y) * pull;
    particle.x += particle.vx * speedMultiplier;
    particle.y += particle.vy * speedMultiplier;
    particle.vy += (0.012 + moodState.warmth * 0.03) * speedMultiplier;
    particle.vx *= 0.988 - dying * 0.012;
    particle.vy *= 0.988 - dying * 0.012;
    particle.age += speedMultiplier;
    particle.life -= particle.decay * speedMultiplier;

    const shimmer = 0.72 + Math.sin(particle.age * 0.22 + particle.hue) * 0.28;
    canvasContext.fillStyle = hsla(
      particle.hue,
      particle.saturation,
      particle.lightness + dying * 16,
      Math.max(0, particle.life) * shimmer,
    );
    canvasContext.beginPath();
    canvasContext.arc(particle.x, particle.y, Math.max(0.5, particle.radius * (0.32 + particle.life)), 0, Math.PI * 2);
    canvasContext.fill();
  });

  if (fireworks.length > 1200) {
    fireworks.splice(0, fireworks.length - 1200);
  }
}

function drawEmergentForm(canvasContext, width, height) {
  if (visualizerSelect.value !== "fireworks") {
    return;
  }

  const palette = fireworkPalettes[themeSelect.value] || fireworkPalettes.mono;
  const samples = Math.round(36 + shapeReveal * 118 + moodState.energy * 80);
  const alpha = 0.012 + shapeReveal * 0.032 + moodState.brightness * 0.018;

  canvasContext.save();
  canvasContext.globalCompositeOperation = "lighter";

  for (let index = 0; index < samples; index += 1) {
    const point = fireworkShapePoint(width, height);
    const hue = palette[index % palette.length] + Math.sin((fireworkFrame + index) * 0.017) * 22;
    const flicker = 0.6 + Math.sin(fireworkFrame * 0.08 + index) * 0.4;
    canvasContext.fillStyle = hsla(hue, 72, 64, alpha * flicker);
    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, 1.1 + shapeReveal * 1.6, 0, Math.PI * 2);
    canvasContext.fill();
  }

  if (fireworkFormSelect.value === "hydra" && shapeReveal > 0.18) {
    for (let neck = 0; neck < 7; neck += 1) {
      const head = {
        x: (0.18 + neck * 0.105) * width,
        y: (0.18 + Math.sin(neck * 1.35) * 0.09) * height,
      };
      canvasContext.strokeStyle = hsla(palette[neck % palette.length], 68, 58, 0.018 + shapeReveal * 0.045);
      canvasContext.lineWidth = 1.2 + shapeReveal * 2.4;
      canvasContext.beginPath();
      canvasContext.moveTo(width * 0.5, height * 0.78);
      canvasContext.quadraticCurveTo(
        width * (0.42 + neck * 0.025),
        height * (0.44 + Math.sin(neck) * 0.06),
        head.x,
        head.y,
      );
      canvasContext.stroke();
    }
  }

  canvasContext.restore();
}

function frequencyHue(bandIndex, intensity) {
  const lowHue = 352;
  const highHue = 272;
  const progress = bandIndex / Math.max(1, pacBands.length - 1);

  if (progress < 0.5) {
    return lowHue + progress * 2 * 68;
  }

  return 60 + (progress - 0.5) * 2 * (highHue - 60) + intensity * 14;
}

function setupPacDancers(width, height) {
  if (pacDancers.length) {
    return;
  }

  const rows = [
    height * 0.28,
    height * 0.5,
    height * 0.72,
  ];

  pacDancers = Array.from({ length: 18 }, (_, index) => {
    const bandIndex = index % pacBands.length;
    const row = Math.floor(index / pacBands.length);
    return {
      bandIndex,
      x: width * (0.08 + (index % pacBands.length) * 0.165) + (row % 2) * width * 0.045,
      y: rows[row],
      homeX: width * (0.08 + (index % pacBands.length) * 0.165) + (row % 2) * width * 0.045,
      homeY: rows[row],
      size: 18 + row * 4 + Math.random() * 5,
      phase: Math.random() * Math.PI * 2,
      lady: index % 3 === 1,
      direction: index % 2 ? -1 : 1,
    };
  });
}

function drawPacCharacter(canvasContext, dancer, intensity, width, height) {
  const speedMultiplier = fireworkSpeedMultiplier();
  const band = pacBands[dancer.bandIndex];
  const beat = pacFrame * (0.045 + dancer.bandIndex * 0.006) + dancer.phase;
  const bounce = Math.sin(beat * 2.2) * intensity * dancer.size * 0.9;
  const sway = Math.sin(beat) * intensity * width * 0.025;
  const spin = band.move === "spin" || band.move === "twirl" ? beat * (0.35 + intensity) : Math.sin(beat) * 0.25;
  const slide = band.move === "slide" ? Math.sin(beat) * intensity * width * 0.06 : 0;
  const shimmy = band.move === "shimmy" ? Math.sin(beat * 6) * intensity * 9 : 0;
  const stomp = band.move === "stomp" ? Math.abs(Math.sin(beat * 1.5)) * intensity * 16 : 0;
  const x = dancer.homeX + sway + slide + shimmy;
  const y = dancer.homeY - bounce + stomp;
  const hue = frequencyHue(dancer.bandIndex, intensity);
  const mouth = 0.18 + Math.abs(Math.sin(beat * (4.8 + intensity * 4))) * (0.42 + intensity * 0.25);
  const radius = dancer.size * (0.92 + intensity * 0.45);

  dancer.homeX += Math.sin(beat * 0.31) * intensity * speedMultiplier * 0.5;
  dancer.homeY += Math.cos(beat * 0.27) * intensity * speedMultiplier * 0.26;
  dancer.homeX += (width * (0.08 + (dancer.bandIndex) * 0.165) - dancer.homeX) * 0.004;
  dancer.homeY += (height * (0.28 + Math.floor(pacDancers.indexOf(dancer) / pacBands.length) * 0.22) - dancer.homeY) * 0.004;

  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(spin * dancer.direction);
  canvasContext.scale(dancer.direction, 1);

  const glow = canvasContext.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius * 2.1);
  glow.addColorStop(0, hsla(hue, 92, 58, 0.24 + intensity * 0.22));
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  canvasContext.fillStyle = glow;
  canvasContext.beginPath();
  canvasContext.arc(0, 0, radius * 2.1, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.fillStyle = hsla(hue, 88, 34 + intensity * 34, 0.95);
  canvasContext.beginPath();
  canvasContext.moveTo(0, 0);
  canvasContext.arc(0, 0, radius, mouth, Math.PI * 2 - mouth);
  canvasContext.closePath();
  canvasContext.fill();

  canvasContext.fillStyle = "rgba(5, 7, 9, 0.82)";
  canvasContext.beginPath();
  canvasContext.arc(radius * 0.25, -radius * 0.45, Math.max(2.2, radius * 0.11), 0, Math.PI * 2);
  canvasContext.fill();

  if (dancer.lady) {
    canvasContext.fillStyle = hsla((hue + 34) % 360, 92, 68, 0.9);
    canvasContext.beginPath();
    canvasContext.moveTo(-radius * 0.25, -radius * 0.95);
    canvasContext.lineTo(-radius * 0.02, -radius * 1.38);
    canvasContext.lineTo(radius * 0.22, -radius * 0.95);
    canvasContext.closePath();
    canvasContext.fill();
    canvasContext.beginPath();
    canvasContext.arc(-radius * 0.02, -radius * 1.05, radius * 0.14, 0, Math.PI * 2);
    canvasContext.fill();
  }

  canvasContext.strokeStyle = hsla(hue, 90, 72, 0.65);
  canvasContext.lineWidth = Math.max(1.4, radius * 0.08);
  const legSwing = Math.sin(beat * 3.2) * radius * 0.36;
  canvasContext.beginPath();
  canvasContext.moveTo(-radius * 0.3, radius * 0.85);
  canvasContext.lineTo(-radius * 0.58, radius * 1.25 + legSwing);
  canvasContext.moveTo(radius * 0.05, radius * 0.9);
  canvasContext.lineTo(radius * 0.38, radius * 1.22 - legSwing);
  canvasContext.stroke();

  canvasContext.restore();
}

function drawPacDanceFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  pacFrame += speedMultiplier;

  canvasContext.fillStyle = "rgba(5, 7, 9, 0.22)";
  canvasContext.fillRect(0, 0, width, height);

  const gridSpacing = Math.max(42, width / 18);
  canvasContext.strokeStyle = "rgba(87, 216, 178, 0.05)";
  canvasContext.lineWidth = 1;
  for (let x = 0; x < width; x += gridSpacing) {
    canvasContext.beginPath();
    canvasContext.moveTo(x, 0);
    canvasContext.lineTo(x, height);
    canvasContext.stroke();
  }
  for (let y = 0; y < height; y += gridSpacing) {
    canvasContext.beginPath();
    canvasContext.moveTo(0, y);
    canvasContext.lineTo(width, y);
    canvasContext.stroke();
  }

  setupPacDancers(width, height);

  const bandIntensities = pacBands.map((band) => averageBand(buffer, band.start, band.end));

  bandIntensities.forEach((intensity, bandIndex) => {
    const hue = frequencyHue(bandIndex, intensity);
    const x = width * (0.08 + bandIndex * 0.165);
    const barHeight = Math.max(4, intensity * height * 0.18);
    canvasContext.fillStyle = hsla(hue, 86, 48 + intensity * 26, 0.22);
    canvasContext.fillRect(x - 18, height - barHeight - 8, 36, barHeight);
  });

  pacDancers.forEach((dancer) => {
    const intensity = bandIntensities[dancer.bandIndex];
    drawPacCharacter(canvasContext, dancer, intensity, width, height);
  });
}

function setupHandForms(width, height) {
  const targetCount = handCountValueNumber();

  if (handForms.length === targetCount) {
    return;
  }

  handForms = Array.from({ length: targetCount }, (_, index) => {
    const band = handBands[index % handBands.length];
    const progress = targetCount === 1 ? 0.5 : index / (targetCount - 1);
    const side = index % 2 === 0 ? 1 : -1;
    return {
      band,
      rootX: width * (0.06 + progress * 0.88),
      rootY: height * (side > 0 ? 0.91 : 0.09),
      baseAngle: side > 0 ? -Math.PI / 2 : Math.PI / 2,
      side,
      phase: Math.random() * Math.PI * 2,
      growth: 0,
      fingers: Array.from({ length: 5 }, (_, finger) => ({
        spread: (finger - 2) * 0.21,
        length: 0.48 + finger * 0.08 + Math.random() * 0.16,
        knuckle: 0.28 + Math.random() * 0.24,
      })),
      index,
      count: targetCount,
    };
  });
}

function handHue(index, intensity) {
  const progress = index / Math.max(1, handCountValueNumber() - 1);
  const hue = progress < 0.45
    ? 354 + progress * 2.22 * 44
    : 52 + (progress - 0.45) * 1.82 * 230;
  return hue + intensity * 18;
}

function drawLittleBuoyMan(canvasContext, x, y, size, hue, alpha, wobble) {
  canvasContext.save();
  canvasContext.translate(x, y);
  canvasContext.rotate(Math.sin(wobble) * 0.35);
  canvasContext.strokeStyle = hsla(hue, 78, 68, alpha);
  canvasContext.fillStyle = hsla(hue, 82, 58, alpha * 0.9);
  canvasContext.lineWidth = Math.max(1, size * 0.12);
  canvasContext.beginPath();
  canvasContext.arc(0, -size * 0.55, size * 0.22, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.beginPath();
  canvasContext.moveTo(0, -size * 0.3);
  canvasContext.lineTo(0, size * 0.28);
  canvasContext.moveTo(0, -size * 0.1);
  canvasContext.lineTo(-size * 0.34, size * 0.08);
  canvasContext.moveTo(0, -size * 0.1);
  canvasContext.lineTo(size * 0.34, size * 0.08);
  canvasContext.moveTo(0, size * 0.28);
  canvasContext.lineTo(-size * 0.25, size * 0.7);
  canvasContext.moveTo(0, size * 0.28);
  canvasContext.lineTo(size * 0.25, size * 0.7);
  canvasContext.stroke();
  canvasContext.restore();
}

function drawFinger(canvasContext, hand, finger, intensity, width, height) {
  const speedMultiplier = fireworkSpeedMultiplier();
  const sizeMultiplier = handSizeMultiplier();
  const grasp = handGraspAmount();
  const hue = handHue(hand.index, intensity);
  const direction = hand.side;
  const pulse = Math.sin(handFrame * 0.035 * speedMultiplier + hand.phase + finger.spread * 4);
  const reach = hand.growth * finger.length * (0.62 + intensity * 0.72 + grasp * 0.28);
  const baseLength = height * 0.34 * sizeMultiplier;
  const length = baseLength * reach;
  const angle = hand.baseAngle + finger.spread + pulse * (0.18 + intensity * 0.32);
  const curl = Math.sin(handFrame * 0.05 + hand.phase + finger.knuckle * 8) * (0.18 + intensity * 0.4) + grasp * direction * (0.45 + intensity * 0.9);
  const rootX = hand.rootX + Math.sin(hand.phase + finger.spread) * width * 0.015;
  const rootY = hand.rootY;
  const midX = rootX + Math.cos(angle) * length * finger.knuckle;
  const midY = rootY + Math.sin(angle) * length * finger.knuckle;
  const tipAngle = angle + curl * direction;
  const tipX = midX + Math.cos(tipAngle) * length * (1 - finger.knuckle);
  const tipY = midY + Math.sin(tipAngle) * length * (1 - finger.knuckle);
  const branchAlpha = 0.22 + intensity * 0.58 + grasp * 0.16;

  canvasContext.strokeStyle = hsla(hue, 76, 38 + intensity * 30, branchAlpha);
  canvasContext.lineWidth = Math.max(1.5, (5.5 - Math.abs(finger.spread) * 9) * (0.6 + intensity * 0.65 + grasp * 0.28) * Math.sqrt(sizeMultiplier));
  canvasContext.lineCap = "round";
  canvasContext.beginPath();
  canvasContext.moveTo(rootX, rootY);
  canvasContext.quadraticCurveTo(midX, midY, tipX, tipY);
  canvasContext.stroke();

  canvasContext.strokeStyle = hsla(hue + 30, 86, 70, 0.18 + intensity * 0.28);
  canvasContext.lineWidth = 1;
  for (let branch = 0; branch < 3; branch += 1) {
    const t = 0.35 + branch * 0.18;
    const bx = rootX + (tipX - rootX) * t;
    const by = rootY + (tipY - rootY) * t;
    const twigAngle = tipAngle + (branch % 2 ? 1 : -1) * (0.65 + intensity * 0.45 + grasp * 0.75);
    const twigLength = length * (0.08 + branch * 0.025) * (0.5 + intensity + grasp * 0.5);
    canvasContext.beginPath();
    canvasContext.moveTo(bx, by);
    canvasContext.lineTo(bx + Math.cos(twigAngle) * twigLength, by + Math.sin(twigAngle) * twigLength);
    canvasContext.stroke();
  }

  const glow = canvasContext.createRadialGradient(tipX, tipY, 0, tipX, tipY, 18 + intensity * 34);
  glow.addColorStop(0, hsla(hue, 92, 66, 0.26 + intensity * 0.28));
  glow.addColorStop(1, "rgba(255, 255, 255, 0)");
  canvasContext.fillStyle = glow;
  canvasContext.beginPath();
  canvasContext.arc(tipX, tipY, 18 + intensity * 34, 0, Math.PI * 2);
  canvasContext.fill();

  if (grasp > 0.08) {
    const bits = Math.round(1 + grasp * 5 + intensity * 4);
    canvasContext.fillStyle = hsla(hue + 48, 92, 68, 0.18 + grasp * 0.42);
    for (let bit = 0; bit < bits; bit += 1) {
      const amount = Math.random();
      const bitX = tipX + (rootX - tipX) * amount * grasp + Math.sin(handFrame * 0.12 + bit) * 9 * grasp;
      const bitY = tipY + (rootY - tipY) * amount * grasp + Math.cos(handFrame * 0.1 + bit) * 9 * grasp;
      canvasContext.beginPath();
      canvasContext.arc(bitX, bitY, 1.2 + grasp * 2.4, 0, Math.PI * 2);
      canvasContext.fill();
    }
  }

  if (intensity > 0.13 || finger.spread === 0 || grasp > 0.55) {
    drawLittleBuoyMan(canvasContext, tipX, tipY, (7 + intensity * 14) * Math.sqrt(sizeMultiplier), hue + 16, 0.22 + intensity * 0.58 + grasp * 0.12, handFrame * 0.05 + finger.spread);
  }
}

function drawBranchHandsFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  handFrame += speedMultiplier;
  setupHandForms(width, height);

  canvasContext.fillStyle = "rgba(5, 7, 9, 0.16)";
  canvasContext.fillRect(0, 0, width, height);

  const field = canvasContext.createLinearGradient(0, 0, width, height);
  field.addColorStop(0, "rgba(70, 10, 24, 0.11)");
  field.addColorStop(0.52, "rgba(20, 96, 76, 0.08)");
  field.addColorStop(1, "rgba(74, 34, 128, 0.13)");
  canvasContext.fillStyle = field;
  canvasContext.fillRect(0, 0, width, height);

  handForms.forEach((hand) => {
    const intensity = averageBand(buffer, hand.band.start, hand.band.end);
    const grasp = handGraspAmount();
    hand.growth += (intensity * (1 + grasp * 0.42) - hand.growth) * (0.025 + speedMultiplier * 0.025 + grasp * 0.025);
    const hue = handHue(hand.index, intensity);

    canvasContext.fillStyle = hsla(hue, 78, 34 + intensity * 28, 0.18 + intensity * 0.24);
    canvasContext.beginPath();
    canvasContext.ellipse(
      hand.rootX,
      hand.rootY,
      (24 + intensity * 24) * Math.sqrt(handSizeMultiplier()),
      10 + intensity * 10 + grasp * 10,
      0,
      0,
      Math.PI * 2,
    );
    canvasContext.fill();

    hand.fingers.forEach((finger) => {
      drawFinger(canvasContext, hand, finger, intensity, width, height);
    });
  });
}

function swampHue(index, intensity) {
  const progress = index / Math.max(1, swampBands.length - 1);
  return progress < 0.45
    ? 356 + progress * 54
    : 292 - progress * 18 + intensity * 12;
}

function spawnSwampBubble(bandIndex, intensity, width, height, bassBoom = 0) {
  const band = swampBands[bandIndex];
  const speedMultiplier = fireworkSpeedMultiplier();
  const isBass = bandIndex < 2;
  const radius = isBass
    ? height * (0.09 + intensity * 0.32 + bassBoom * 0.22)
    : 5 + intensity * 28 + Math.random() * 14;
  const horizon = height * (0.5 + Math.sin(swampFrame * 0.012 + bandIndex) * 0.035);
  const x = isBass
    ? width * (0.18 + Math.random() * 0.64)
    : width * Math.random();
  const y = isBass
    ? horizon + height * (0.08 + Math.random() * 0.22)
    : height * (0.75 + Math.random() * 0.22);

  swampBubbles.push({
    x,
    y,
    vx: (Math.random() - 0.5) * (0.25 + intensity * 1.1),
    vy: -(0.22 + intensity * 1.9 + (isBass ? bassBoom * 2.4 : 0)) * speedMultiplier,
    radius,
    targetRadius: radius * (0.8 + Math.random() * 0.6),
    hue: swampHue(bandIndex, intensity),
    life: 1,
    decay: isBass ? 0.0024 + intensity * 0.003 : 0.006 + intensity * 0.014,
    wobble: Math.random() * Math.PI * 2,
    kind: band.kind,
    alarm: isBass ? 0 : Math.min(1, bassBoom + intensity * 0.6),
    bass: isBass,
  });
}

function drawSwampCreature(canvasContext, bubble, bassEnergy) {
  const wobble = Math.sin(swampFrame * 0.035 + bubble.wobble) * bubble.radius * 0.12;
  const stretch = 1 + Math.sin(swampFrame * 0.023 + bubble.wobble) * 0.08 + bubble.alarm * 0.18;
  const alpha = Math.max(0, bubble.life);
  const hue = bubble.hue + Math.sin(swampFrame * 0.01 + bubble.wobble) * 10;

  canvasContext.save();
  canvasContext.translate(bubble.x + wobble, bubble.y);
  canvasContext.scale(1 / stretch, stretch);

  const gradient = canvasContext.createRadialGradient(
    -bubble.radius * 0.25,
    -bubble.radius * 0.35,
    bubble.radius * 0.04,
    0,
    0,
    bubble.radius,
  );
  gradient.addColorStop(0, hsla(hue + 26, 74, bubble.bass ? 35 : 72, alpha * 0.62));
  gradient.addColorStop(0.62, hsla(hue, 72, bubble.bass ? 24 : 54, alpha * 0.36));
  gradient.addColorStop(1, hsla(hue - 18, 78, bubble.bass ? 12 : 34, alpha * 0.12));
  canvasContext.fillStyle = gradient;
  canvasContext.beginPath();
  canvasContext.ellipse(0, 0, bubble.radius * 1.08, bubble.radius * 0.88, 0, 0, Math.PI * 2);
  canvasContext.fill();

  canvasContext.strokeStyle = hsla(hue + 42, 88, bubble.bass ? 42 : 76, alpha * (bubble.bass ? 0.36 : 0.62));
  canvasContext.lineWidth = Math.max(1, bubble.radius * 0.035);
  canvasContext.stroke();

  const eyeCount = bubble.bass ? 3 : 2;
  for (let eye = 0; eye < eyeCount; eye += 1) {
    const eyeX = (eye - (eyeCount - 1) / 2) * bubble.radius * 0.32;
    const eyeY = -bubble.radius * (0.1 + bubble.alarm * 0.18);
    canvasContext.fillStyle = hsla(55 + bassEnergy * 32, 90, 76, alpha * 0.8);
    canvasContext.beginPath();
    canvasContext.arc(eyeX, eyeY, Math.max(1.4, bubble.radius * (bubble.bass ? 0.045 : 0.085)), 0, Math.PI * 2);
    canvasContext.fill();
  }

  if (!bubble.bass) {
    canvasContext.strokeStyle = hsla(hue + 80, 86, 82, alpha * bubble.alarm * 0.65);
    canvasContext.lineWidth = 1;
    for (let jolt = 0; jolt < 3; jolt += 1) {
      const angle = -Math.PI / 2 + (jolt - 1) * 0.45;
      canvasContext.beginPath();
      canvasContext.moveTo(Math.cos(angle) * bubble.radius * 0.65, Math.sin(angle) * bubble.radius * 0.65);
      canvasContext.lineTo(Math.cos(angle) * bubble.radius * (1 + bubble.alarm), Math.sin(angle) * bubble.radius * (1 + bubble.alarm));
      canvasContext.stroke();
    }
  }

  canvasContext.restore();
}

function drawSwampBubblesFrame(canvasContext, buffer) {
  const width = visualizer.width;
  const height = visualizer.height;
  const speedMultiplier = fireworkSpeedMultiplier();

  analyser.getByteFrequencyData(buffer);
  swampFrame += speedMultiplier;

  const bassEnergy = averageBand(buffer, 1, 7);
  const trebleEnergy = averageBand(buffer, 62, 112);
  const midEnergy = averageBand(buffer, 14, 48);

  const sky = canvasContext.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "rgba(42, 5, 28, 0.38)");
  sky.addColorStop(0.42, `rgba(75, 18, 70, ${0.2 + midEnergy * 0.2})`);
  sky.addColorStop(0.54, "rgba(38, 38, 38, 0.42)");
  sky.addColorStop(1, "rgba(2, 8, 7, 0.72)");
  canvasContext.fillStyle = sky;
  canvasContext.fillRect(0, 0, width, height);

  const swamp = canvasContext.createLinearGradient(0, height * 0.52, 0, height);
  swamp.addColorStop(0, "rgba(22, 23, 18, 0.45)");
  swamp.addColorStop(0.45, "rgba(5, 24, 18, 0.72)");
  swamp.addColorStop(1, "rgba(0, 4, 4, 0.92)");
  canvasContext.fillStyle = swamp;
  canvasContext.fillRect(0, height * 0.52, width, height * 0.48);

  const horizonY = height * (0.51 + Math.sin(swampFrame * 0.01) * 0.018);
  canvasContext.strokeStyle = `rgba(173, 78, 126, ${0.12 + bassEnergy * 0.18})`;
  canvasContext.lineWidth = 2 + bassEnergy * 8;
  canvasContext.beginPath();
  for (let x = 0; x <= width; x += width / 32) {
    const y = horizonY + Math.sin(x * 0.018 + swampFrame * 0.025) * (5 + bassEnergy * 22);
    if (x === 0) {
      canvasContext.moveTo(x, y);
    } else {
      canvasContext.lineTo(x, y);
    }
  }
  canvasContext.stroke();

  swampBands.forEach((band, bandIndex) => {
    const intensity = averageBand(buffer, band.start, band.end);
    const chance = bandIndex < 2
      ? intensity * 0.08 + bassEnergy * 0.08
      : intensity * 0.1 + trebleEnergy * 0.06;

    if (Math.random() < chance * speedMultiplier) {
      spawnSwampBubble(bandIndex, intensity, width, height, bassEnergy);
    }
  });

  if (bassEnergy > 0.44 && Math.random() < bassEnergy * 0.18) {
    spawnSwampBubble(0, bassEnergy, width, height, bassEnergy);
  }

  swampBubbles = swampBubbles.filter((bubble) => bubble.life > 0 && bubble.y + bubble.radius > -height * 0.2);
  swampBubbles.forEach((bubble) => {
    const fright = Math.max(0, bassEnergy - 0.28);
    bubble.x += bubble.vx * speedMultiplier + (bubble.bass ? 0 : Math.sin(swampFrame * 0.08 + bubble.wobble) * fright * 4);
    bubble.y += bubble.vy * speedMultiplier;
    bubble.vx += Math.sin(swampFrame * 0.015 + bubble.wobble) * 0.012;
    bubble.vy -= bubble.bass ? 0.001 : 0.004 + trebleEnergy * 0.012;
    bubble.radius += (bubble.targetRadius - bubble.radius) * 0.018 + (bubble.bass ? bassEnergy * 0.18 : trebleEnergy * 0.035);
    bubble.alarm = Math.max(bubble.alarm * 0.965, fright);
    bubble.life -= bubble.decay * speedMultiplier * (bubble.bass ? 0.75 : 1.15);
    drawSwampCreature(canvasContext, bubble, bassEnergy);
  });

  if (swampBubbles.length > 180) {
    swampBubbles.splice(0, swampBubbles.length - 180);
  }

  canvasContext.fillStyle = `rgba(7, 3, 7, ${0.12 + bassEnergy * 0.1})`;
  canvasContext.fillRect(0, height * 0.84, width, height * 0.16);
}

function drawIdleVisualizer() {
  if (visualizerSelect.value === "swampbubbles") {
    drawIdleSwampBubbles();
  } else if (visualizerSelect.value === "branchhands") {
    drawIdleBranchHands();
  } else if (visualizerSelect.value === "pacdance") {
    drawIdlePacDance();
  } else if (visualizerSelect.value === "fireworks") {
    drawIdleFireworks();
  } else {
    drawIdleEqualizer();
  }
}

function drawIdleSwampBubbles() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#050707";
  canvasContext.fillRect(0, 0, width, height);

  const gradient = canvasContext.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "rgba(55, 7, 36, 0.56)");
  gradient.addColorStop(0.5, "rgba(55, 34, 52, 0.34)");
  gradient.addColorStop(1, "rgba(0, 8, 6, 0.82)");
  canvasContext.fillStyle = gradient;
  canvasContext.fillRect(0, 0, width, height);

  for (let index = 0; index < 18; index += 1) {
    const bandIndex = index % swampBands.length;
    const radius = bandIndex < 2 ? 28 + Math.random() * 58 : 7 + Math.random() * 24;
    const bubble = {
      x: width * Math.random(),
      y: height * (0.55 + Math.random() * 0.38),
      radius,
      hue: swampHue(bandIndex, 0.2),
      life: 0.32,
      wobble: Math.random() * Math.PI * 2,
      alarm: bandIndex > 3 ? 0.5 : 0,
      bass: bandIndex < 2,
    };
    drawSwampCreature(canvasContext, bubble, 0.18);
  }
}


function drawIdleBranchHands() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#050709";
  canvasContext.fillRect(0, 0, width, height);
  setupHandForms(width, height);

  handForms.forEach((hand) => {
    hand.growth = 0.28;
    hand.fingers.forEach((finger) => {
      drawFinger(canvasContext, hand, finger, 0.16 + hand.index * 0.025, width, height);
    });
  });
}


function drawIdlePacDance() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;

  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#050709";
  canvasContext.fillRect(0, 0, width, height);
  setupPacDancers(width, height);

  pacDancers.forEach((dancer) => {
    drawPacCharacter(canvasContext, dancer, 0.12 + dancer.bandIndex * 0.025, width, height);
  });
}

function drawIdleEqualizer() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const barCount = 48;
  const barGap = 5;
  const barWidth = (width - (barCount - 1) * barGap) / barCount;
  const theme = visualizerTheme();

  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#0b0d0f";
  canvasContext.fillRect(0, 0, width, height);

  for (let i = 0; i < barCount; i += 1) {
    const wave = Math.sin(i * 0.48) * 0.5 + 0.5;
    const barHeight = 14 + wave * height * 0.18;
    const x = i * (barWidth + barGap);
    const y = height - barHeight;
    canvasContext.fillStyle = theme.idle;
    canvasContext.fillRect(x, y, barWidth, barHeight);
  }
}

function drawIdleFireworks() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const palette = fireworkPalettes[themeSelect.value] || fireworkPalettes.mono;

  canvasContext.clearRect(0, 0, width, height);
  canvasContext.fillStyle = "#050709";
  canvasContext.fillRect(0, 0, width, height);

  fireworksBands.forEach((band, index) => {
    const point = fireworkShapePoint(width, height);
    const x = point.x;
    const y = point.y;
    const radius = 22 + Math.sin(index * 1.7) * 6;
    const glow = canvasContext.createRadialGradient(x, y, 0, x, y, radius * 3.2);
    glow.addColorStop(0, hsla(palette[index % palette.length], 74, 58, 0.2));
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    canvasContext.fillStyle = glow;
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius * 3.2, 0, Math.PI * 2);
    canvasContext.fill();

    canvasContext.fillStyle = hsla(palette[index % palette.length], 74, 58, 0.34);
    canvasContext.beginPath();
    canvasContext.arc(x, y, 3 + index, 0, Math.PI * 2);
    canvasContext.fill();
  });

  for (let index = 0; index < 90; index += 1) {
    const point = fireworkShapePoint(width, height);
    canvasContext.fillStyle = hsla(palette[index % palette.length], 66, 62, 0.055);
    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, 1.4, 0, Math.PI * 2);
    canvasContext.fill();
  }
}

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = visualizer.getBoundingClientRect();
  visualizer.width = Math.floor(rect.width * ratio);
  visualizer.height = Math.floor(rect.height * ratio);
  pacDancers = [];
  handForms = [];
  swampBubbles = [];

  if (!animationId) {
    drawIdleVisualizer();
  }
}

folderInput.addEventListener("change", () => {
  const files = Array.from(folderInput.files || []);
  resetLibraryState();

  tracks = files
    .filter((file) => file.name.toLowerCase().endsWith(".wav"))
    .map((file) => ({ file, url: "", source: "picker" }));

  directoryName.textContent = files[0]?.webkitRelativePath?.split("/")[0] || "Selected directory";
  sortTracks();
  renderTracks();
});

sortSelect.addEventListener("change", () => {
  const activeTrack = tracks[currentIndex];
  sortTracks();
  currentIndex = activeTrack ? tracks.findIndex((track) => track === activeTrack) : -1;
  renderTracks();
});

themeSelect.addEventListener("change", () => {
  if (!animationId) {
    drawIdleVisualizer();
  }
});

peakToggle.addEventListener("change", () => {
  peakLevels = [];
  peakUpdatedAt = [];
});

visualizerSelect.addEventListener("change", () => {
  const visualizerLabels = {
    equalizer: "Graphic equaliser visualisation",
    fireworks: "Frequency fireworks visualisation",
    pacdance: "Pac Dance frequency visualisation",
    branchhands: "Branch Hands frequency visualisation",
    swampbubbles: "Swamp Bubbles frequency visualisation",
  };

  visualizer.setAttribute(
    "aria-label",
    visualizerLabels[visualizerSelect.value] || visualizerLabels.equalizer,
  );
  restartVisualizer();
});

fireworkFormSelect.addEventListener("change", () => {
  restartVisualizer();
});

handSize.addEventListener("input", () => {
  updateHandControlLabels();
});

handCount.addEventListener("input", () => {
  updateHandControlLabels();
  handForms = [];
  if (!animationId) {
    drawIdleVisualizer();
  }
});

handGrasp.addEventListener("input", () => {
  updateHandControlLabels();
});

trackList.addEventListener("click", (event) => {
  const item = event.target.closest(".track-item");
  if (item) {
    loadTrack(Number(item.dataset.index));
  }
});

trackList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const item = event.target.closest(".track-item");
  if (item) {
    event.preventDefault();
    loadTrack(Number(item.dataset.index));
  }
});

playButton.addEventListener("click", () => {
  if (!audio.paused) {
    pauseCurrent();
  } else {
    playCurrent().catch(() => setStatus("paused"));
  }
});

stopButton.addEventListener("click", stopCurrent);
nextButton.addEventListener("click", () => loadTrack(nextIndex()));
previousButton.addEventListener("click", () => loadTrack(previousIndex()));
fullscreenButton.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.querySelector(".player").requestFullscreen();
  }
});

fireworkSpeed.addEventListener("input", updateFireworkSpeedLabel);

audio.addEventListener("ended", () => loadTrack(nextIndex()));
audio.addEventListener("pause", () => {
  if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
    setStatus("paused");
  }
});
audio.addEventListener("timeupdate", () => {
  timeReadout.textContent = `${formatDuration(audio.currentTime)} / ${formatDuration(audio.duration)}`;
});

window.addEventListener("resize", resizeCanvas);
document.addEventListener("fullscreenchange", () => {
  setFullscreenLabel();
  requestAnimationFrame(resizeCanvas);
});

document.addEventListener("keydown", (event) => {
  const tagName = event.target.tagName.toLowerCase();

  if (tagName === "input" || tagName === "select" || tagName === "textarea") {
    return;
  }

  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    fullscreenButton.click();
  }
});

resizeCanvas();
updateFireworkSpeedLabel();
updateHandControlLabels();
setFullscreenLabel();
setControlsEnabled(false);
setStatus("stopped");
