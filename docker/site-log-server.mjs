#!/usr/bin/env node
/**
 * Tiny same-container log sink for EasyPanel website stdout.
 * Accepts POST /site-log { "line": "[HH:mm:ss dd-MM-yyyy INF] ..." }
 */
import http from "node:http";

const PORT = 8090;
const MAX_BODY_BYTES = 4_096;

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res, status, body = "") {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url?.split("?")[0] !== "/site-log") {
    send(res, 404, "Not found");
    return;
  }

  try {
    const raw = await readBody(req);
    const payload = JSON.parse(raw);
    const line = typeof payload?.line === "string" ? payload.line.trim() : "";

    if (!line || line.length > 2_000) {
      send(res, 400, "Invalid line");
      return;
    }

    // Print the client-formatted Kyiv line so EasyPanel shows it as-is.
    console.log(line);
    send(res, 204);
  } catch {
    send(res, 400, "Bad request");
  }
});

server.listen(PORT, "127.0.0.1");
