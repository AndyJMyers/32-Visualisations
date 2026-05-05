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
      if (visualizerSelect.value === "fireworks") {
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

function drawIdleVisualizer() {
  if (visualizerSelect.value === "fireworks") {
    drawIdleFireworks();
  } else {
    drawIdleEqualizer();
  }
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
  visualizer.setAttribute(
    "aria-label",
    visualizerSelect.value === "fireworks"
      ? "Frequency fireworks visualisation"
      : "Graphic equaliser visualisation",
  );
  restartVisualizer();
});

fireworkFormSelect.addEventListener("change", () => {
  restartVisualizer();
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
setFullscreenLabel();
setControlsEnabled(false);
setStatus("stopped");
