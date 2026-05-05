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
const shuffleToggle = document.querySelector("#shuffleToggle");
const sortSelect = document.querySelector("#sortSelect");
const themeSelect = document.querySelector("#themeSelect");
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

const peakHoldMs = 3200;
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
      ? collator.compare(a.file.name, b.file.name)
      : a.file.lastModified - b.file.lastModified;
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
    name.textContent = trackTitle(track.file);

    const date = document.createElement("span");
    date.className = "track-date";
    date.textContent = dateFormatter.format(new Date(track.file.lastModified));

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
  track.url = URL.createObjectURL(track.file);
  audio.src = track.url;
  currentTrack.textContent = trackTitle(track.file);
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
  drawEqualizer();
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

function drawEqualizer() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  const canvasContext = visualizer.getContext("2d");
  const buffer = new Uint8Array(analyser.frequencyBinCount);

  const draw = () => {
    const width = visualizer.width;
    const height = visualizer.height;
    canvasContext.clearRect(0, 0, width, height);
    canvasContext.fillStyle = "#0b0d0f";
    canvasContext.fillRect(0, 0, width, height);

    analyser.getByteFrequencyData(buffer);

    const barCount = 48;
    const barGap = 5;
    const barWidth = (width - (barCount - 1) * barGap) / barCount;
    const theme = visualizerThemes[themeSelect.value] || visualizerThemes.mono;
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

    animationId = requestAnimationFrame(draw);
  };

  draw();
}

function drawIdleEqualizer() {
  const canvasContext = visualizer.getContext("2d");
  const width = visualizer.width;
  const height = visualizer.height;
  const barCount = 48;
  const barGap = 5;
  const barWidth = (width - (barCount - 1) * barGap) / barCount;
  const theme = visualizerThemes[themeSelect.value] || visualizerThemes.mono;

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

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = visualizer.getBoundingClientRect();
  visualizer.width = Math.floor(rect.width * ratio);
  visualizer.height = Math.floor(rect.height * ratio);

  if (!animationId) {
    drawIdleEqualizer();
  }
}

folderInput.addEventListener("change", () => {
  const files = Array.from(folderInput.files || []);
  tracks.forEach((track) => {
    if (track.url) {
      URL.revokeObjectURL(track.url);
    }
  });

  tracks = files
    .filter((file) => file.name.toLowerCase().endsWith(".wav"))
    .map((file) => ({ file, url: "" }));

  currentIndex = -1;
  audio.removeAttribute("src");
  audio.load();
  currentTrack.textContent = "No track loaded";
  timeReadout.textContent = "0:00 / 0:00";
  directoryName.textContent = files[0]?.webkitRelativePath?.split("/")[0] || "Selected directory";
  setStatus("stopped");
  sortTracks();
  renderTracks();
});

sortSelect.addEventListener("change", () => {
  const activeFile = tracks[currentIndex]?.file;
  sortTracks();
  currentIndex = activeFile ? tracks.findIndex((track) => track.file === activeFile) : -1;
  renderTracks();
});

themeSelect.addEventListener("change", () => {
  if (!animationId) {
    drawIdleEqualizer();
  }
});

peakToggle.addEventListener("change", () => {
  peakLevels = [];
  peakUpdatedAt = [];
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

resizeCanvas();
setControlsEnabled(false);
setStatus("stopped");
