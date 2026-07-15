const { spawn } = require("child_process");
const fs = require("fs");
const http = require("http");
const net = require("net");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const sampleMusicRoot = path.join(repoRoot, "sample-music");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function request(port, pathname, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      host: "127.0.0.1",
      port,
      path: pathname,
      method: options.method || "GET",
      headers: options.headers || {},
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks),
        });
      });
    });
    req.once("error", reject);
    req.end();
  });
}

function waitForServer(child, port) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let output = "";
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`Server did not start on port ${port}.\n${output}`));
      }
    }, 10000);

    function onData(chunk) {
      output += chunk.toString();
      if (!settled && output.includes(`http://127.0.0.1:${port}/`)) {
        settled = true;
        clearTimeout(timeout);
        resolve();
      }
    }

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.once("exit", (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(new Error(`Server exited before tests could run. Exit code: ${code}\n${output}`));
      }
    });
  });
}

async function run() {
  assert(fs.existsSync(sampleMusicRoot), "sample-music folder is missing.");

  const port = await findFreePort();
  const child = spawn(process.execPath, ["server.js"], {
    cwd: repoRoot,
    env: {
      ...process.env,
      PORT: String(port),
      WAVE_DECK_LIBRARY: sampleMusicRoot,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await waitForServer(child, port);

    const index = await request(port, "/");
    assert(index.statusCode === 200, `Expected / to return 200, got ${index.statusCode}.`);
    assert(index.headers["content-type"]?.includes("text/html"), "Expected / to return HTML.");
    const indexHtml = index.body.toString("utf8");
    assert(indexHtml.includes('id="visualizer"'), "Index page is missing the visualizer canvas.");
    assert(indexHtml.includes('id="audio"'), "Index page is missing the audio element.");
    assert(indexHtml.includes('id="carPlayButton"'), "Index page is missing the Android car play control.");
    assert(indexHtml.includes('src="app.js"'), "Index page is missing the app script.");

    const appJs = await request(port, "/app.js");
    assert(appJs.statusCode === 200, `Expected /app.js to return 200, got ${appJs.statusCode}.`);
    assert(appJs.headers["content-type"]?.includes("text/javascript"), "Expected app.js JavaScript content type.");

    const tracksResponse = await request(port, "/api/tracks");
    assert(tracksResponse.statusCode === 200, `Expected /api/tracks to return 200, got ${tracksResponse.statusCode}.`);
    const payload = JSON.parse(tracksResponse.body.toString("utf8"));
    assert(payload.directoryName === "32 Visualisations Sample Suite", `Unexpected directory name: ${payload.directoryName}`);
    assert(Array.isArray(payload.tracks), "Tracks payload is not an array.");
    assert(payload.tracks.length === 3, `Expected 3 sample WAV tracks, got ${payload.tracks.length}.`);
    assert(payload.tracks.every((track) => track.name.toLowerCase().endsWith(".wav")), "Every sample track should be a WAV.");
    assert(payload.tracks.every((track) => track.audioUrl.includes(`127.0.0.1:${port}/audio?file=`)), "Track audio URLs should point at the test server.");

    const sampleTrack = payload.tracks[0];
    const audioUrl = new URL(sampleTrack.audioUrl);
    const audioRange = await request(port, `${audioUrl.pathname}${audioUrl.search}`, {
      headers: { Range: "bytes=0-31" },
    });
    assert(audioRange.statusCode === 206, `Expected ranged audio request to return 206, got ${audioRange.statusCode}.`);
    assert(audioRange.headers["content-type"] === "audio/wav", "Expected WAV content type for ranged audio.");
    assert(audioRange.body.length === 32, `Expected 32 bytes from ranged audio request, got ${audioRange.body.length}.`);

    const forbidden = await request(port, `/audio?file=${encodeURIComponent(path.join(repoRoot, "README.md"))}`);
    assert(forbidden.statusCode === 403, `Expected non-WAV/non-library audio request to return 403, got ${forbidden.statusCode}.`);

    const missing = await request(port, "/not-a-real-file");
    assert(missing.statusCode === 404, `Expected missing static file to return 404, got ${missing.statusCode}.`);

    console.log("System tests passed.");
  } finally {
    child.kill();
  }
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
