const fs = require("fs");
const fsp = require("fs/promises");
const http = require("http");
const path = require("path");

const port = Number(process.env.PORT) || 4173;
const host = "127.0.0.1";
const appRoot = __dirname;
const musicRoot = process.env.WAVE_DECK_LIBRARY || "C:\\Andy ChatGPT DALL-E aisongs";
const musicRootResolved = path.resolve(musicRoot);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".wav": "audio/wav",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "cache-control": "no-store",
    ...headers,
  });
  res.end(body);
}

function isInsideMusicRoot(filePath) {
  const resolved = path.resolve(filePath);
  const root = musicRootResolved.toLowerCase();
  const candidate = resolved.toLowerCase();
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

async function collectTracks(directory, prefix = "") {
  const entries = await fsp.readdir(directory, { withFileTypes: true });
  const tracks = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      tracks.push(...await collectTracks(absolutePath, relativePath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".wav")) {
      const stat = await fsp.stat(absolutePath);
      tracks.push({
        name: entry.name,
        relativePath,
        lastModified: stat.mtimeMs,
        audioUrl: `http://${host}:${port}/audio?file=${encodeURIComponent(absolutePath)}`,
      });
    }
  }

  return tracks;
}

async function serveApiTracks(res) {
  try {
    const tracks = await collectTracks(musicRootResolved);
    send(res, 200, JSON.stringify({
      directoryName: path.basename(musicRootResolved),
      tracks,
    }), { "content-type": "application/json; charset=utf-8" });
  } catch (error) {
    send(res, 404, JSON.stringify({
      directoryName: path.basename(musicRootResolved),
      tracks: [],
      error: "Default WAV directory could not be read.",
    }), { "content-type": "application/json; charset=utf-8" });
  }
}

function serveAudio(req, res, url) {
  const file = url.searchParams.get("file") || "";
  const filePath = path.resolve(file);

  if (!isInsideMusicRoot(filePath) || path.extname(filePath).toLowerCase() !== ".wav") {
    send(res, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      send(res, 404, "Not found");
      return;
    }

    const range = req.headers.range;
    if (range) {
      const match = range.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = Number(match[1]);
        const end = match[2] ? Number(match[2]) : stat.size - 1;
        const safeEnd = Math.min(end, stat.size - 1);

        if (start <= safeEnd) {
          res.writeHead(206, {
            "access-control-allow-origin": "*",
            "accept-ranges": "bytes",
            "cache-control": "no-store",
            "content-length": safeEnd - start + 1,
            "content-range": `bytes ${start}-${safeEnd}/${stat.size}`,
            "content-type": "audio/wav",
          });
          if (req.method === "HEAD") {
            res.end();
            return;
          }
          fs.createReadStream(filePath, { start, end: safeEnd }).pipe(res);
          return;
        }
      }
    }

    res.writeHead(200, {
      "access-control-allow-origin": "*",
      "accept-ranges": "bytes",
      "cache-control": "no-store",
      "content-length": stat.size,
      "content-type": "audio/wav",
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  });
}

function serveStatic(res, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(appRoot, `.${safePath}`);
  const root = appRoot.toLowerCase();
  const candidate = filePath.toLowerCase();

  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found");
      return;
    }

    send(res, 200, data, {
      "content-type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
  });
}

http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    send(res, 204, "");
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed");
    return;
  }

  const url = new URL(req.url, `http://${host}:${port}`);

  if (url.pathname === "/api/tracks") {
    serveApiTracks(res);
  } else if (url.pathname === "/audio") {
    serveAudio(req, res, url);
  } else {
    serveStatic(res, decodeURIComponent(url.pathname));
  }
}).listen(port, host, () => {
  console.log(`Wave Deck serving http://${host}:${port}/`);
  console.log(`Default WAV directory: ${musicRootResolved}`);
});
