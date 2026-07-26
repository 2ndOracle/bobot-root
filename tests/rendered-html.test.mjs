import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("exports the BOBOT project page as static HTML", async () => {
  const html = await readFile(
    new URL("../out/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /BOBOT/);
  assert.match(html, /Играю со/);
  assert.match(html, /Propose/);
  assert.match(html, /SellSync/);
});
