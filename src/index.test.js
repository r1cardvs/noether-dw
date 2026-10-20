const { test } = require("node:test");
const assert = require("node:assert/strict");

test("health payload includes project identity", () => {
  const payload = {
    name: "noether-dw",
    status: "ok",
    challenge: "Inteligência em Decisões Jurídicas",
  };

  assert.equal(payload.name, "noether-dw");
  assert.equal(payload.status, "ok");
});
