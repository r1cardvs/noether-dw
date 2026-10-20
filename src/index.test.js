const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("./index");
const { systemInfo } = require("./info");

test("GET /info retorna versao, autor e data de criacao", async (t) => {
  const server = createApp().listen(0);
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/info`);
  const body = await response.json();
  const expected = systemInfo();

  assert.equal(response.status, 200);
  assert.equal(body.sistema, "noether-dw");
  assert.equal(body.versao, expected.versao);
  assert.equal(body.autor, expected.autor);
  assert.equal(body.dataCriacao, expected.dataCriacao);
});

test("GET /health retorna status ok", async (t) => {
  const server = createApp().listen(0);
  t.after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
});
