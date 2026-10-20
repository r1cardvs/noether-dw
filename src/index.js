const { createServer } = require("node:http");
const { getAbsoluteFSPath } = require("swagger-ui-dist");
const { readFileSync, existsSync } = require("node:fs");
const path = require("node:path");
const { systemInfo } = require("./info");
const { swaggerDocument } = require("./swagger"); // Importando o Swagger separado

const PORT = Number(process.env.PORT) || 3000;

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

// Mapeamento de tipos MIME para ficheiros estáticos
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
};

function createApp() {
  const swaggerDistPath = getAbsoluteFSPath();

  return createServer((req, res) => {
    const parsedUrl = new URL(req.url, "http://localhost");
    const pathname = parsedUrl.pathname;

    // 1. Rota raiz "/" e "/info" devolvem o systemInfo()
    if (req.method === "GET" && (pathname === "/" || pathname === "/info")) {
      json(res, 200, systemInfo());
      return;
    }

    // 2. Rota "/health"
    if (req.method === "GET" && pathname === "/health") {
      json(res, 200, { status: "ok" });
      return;
    }

    // 3. Endpoint do JSON do Swagger
    if (req.method === "GET" && pathname === "/docs/swagger.json") {
      json(res, 200, swaggerDocument);
      return;
    }

    // 4. Redirecionar /docs para /docs/
    if (req.method === "GET" && pathname === "/docs") {
      res.writeHead(301, { Location: "/docs/" });
      res.end();
      return;
    }

    // 5. Servir interface gráfica do Swagger UI (/docs/*)
    if (req.method === "GET" && pathname.startsWith("/docs/")) {
      let relativePath = pathname.replace("/docs/", "");
      if (!relativePath || relativePath === "/") {
        relativePath = "index.html";
      }

      const filePath = path.join(swaggerDistPath, relativePath);

      if (existsSync(filePath)) {
        try {
          let content = readFileSync(filePath);
          const ext = path.extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || "text/plain";

          // Injetar script de inicialização do Swagger no index.html
          if (relativePath === "index.html") {
            let html = content.toString("utf-8");
            
            const customScript = `
              <script>
                window.addEventListener('load', function() {
                  window.ui = SwaggerUIBundle({
                    url: '/docs/swagger.json',
                    dom_id: '#swagger-ui',
                    deepLinking: true,
                    presets: [
                      SwaggerUIBundle.presets.apis,
                      SwaggerUIStandalonePreset
                    ],
                    layout: "StandaloneLayout"
                  });
                });
              </script>
            `;
            html = html.replace("</body>", customScript + "</body>");

            res.writeHead(200, { "Content-Type": MIME_TYPES[".html"] });
            res.end(html);
            return;
          }

          res.writeHead(200, { "Content-Type": contentType });
          res.end(content);
          return;
        } catch (err) {
          json(res, 500, { erro: "erro_ao_ler_ficheiro" });
          return;
        }
      }
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