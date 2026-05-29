import http from "node:http";

const port = parseInt(process.env.PORT || "3000");

const { default: handler } = await import("./dist/server/server.js");

const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host || "localhost";
    const url = new URL(req.url, `https://${host}`);

    const headers = new Headers();
    for (const [key, val] of Object.entries(req.headers)) {
      if (val === undefined) continue;
      if (Array.isArray(val)) val.forEach((v) => headers.append(key, v));
      else headers.set(key, val);
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const hasBody = req.method !== "GET" && req.method !== "HEAD" && chunks.length > 0;

    const request = new Request(url.toString(), {
      method: req.method,
      headers,
      body: hasBody ? Buffer.concat(chunks) : undefined,
      duplex: hasBody ? "half" : undefined,
    });

    const response = await handler.fetch(request, {}, {});

    res.statusCode = response.status;
    response.headers.forEach((val, key) => res.setHeader(key, val));

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error("Request error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`UStack server listening on http://0.0.0.0:${port}`);
});
