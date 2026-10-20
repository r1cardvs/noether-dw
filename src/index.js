const { createServer } = require("node:http");

const PORT = Number(process.env.PORT) || 3000;

const payload = {
  name: "noether-dw",
  status: "ok",
  challenge: "Inteligência em Decisões Jurídicas",
};

const server = createServer((req, res) => {
  const body = JSON.stringify(payload);
  const status = req.url === "/health" || req.url === "/" ? 200 : 404;
  const response = status === 200 ? body : JSON.stringify({ status: "not_found" });

  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(response);
});

server.listen(PORT, () => {
  console.log(`noether-dw listening on port ${PORT}`);
});
