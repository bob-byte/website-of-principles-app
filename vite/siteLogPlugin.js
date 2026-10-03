function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function attachSiteLogMiddleware(server) {
  server.middlewares.use("/site-log", async (req, res, next) => {
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.method !== "POST") {
      next();
      return;
    }

    try {
      const payload = await readJsonBody(req);
      const line = typeof payload?.line === "string" ? payload.line.trim() : "";
      if (line) {
        console.log(line);
      }
      res.statusCode = 204;
      res.end();
    } catch {
      res.statusCode = 400;
      res.end("Bad request");
    }
  });
}

/** Dev/preview: print site analytics lines to the Vite terminal. */
export function siteLogPlugin() {
  return {
    name: "principles-site-log",
    configureServer(server) {
      attachSiteLogMiddleware(server);
    },
    configurePreviewServer(server) {
      attachSiteLogMiddleware(server);
    },
  };
}
