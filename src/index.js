const { createServer } = require("node:http");
const { systemInfo } = require("./info");

const PORT = Number(process.env.PORT) || 3000;

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function createApp() {
  return createServer((req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;

    if (req.method === "GET" && (pathname === "/" || pathname === "/info")) {
      json(res, 200, systemInfo());
      return;
    }

    if (req.method === "GET" && pathname === "/health") {
      json(res, 200, { status: "ok" });
      return;
    }

    json(res, 404, { erro: "nao_encontrado" });
  });
}

if (require.main === module) {
  createApp().listen(PORT, () => {
    console.log(`noether-dw listening on port ${PORT}`);
  });
}

module.exports = { createApp };
