import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const PASTAS = ["css", "js", "conteudo", "icons"];
function arquivos(pasta) {
  return readdirSync(pasta).flatMap((n) => {
    const c = join(pasta, n);
    return statSync(c).isDirectory() ? arquivos(c) : [c.replaceAll("\\", "/")];
  });
}

test("todo arquivo do app está no cache offline", () => {
  const sw = readFileSync("sw.js", "utf8");
  const esperados = ["index.html", "manifest.webmanifest", ...PASTAS.flatMap(arquivos)];
  for (const a of esperados) assert.ok(sw.includes(`"./${a}"`), `falta no sw.js: ${a}`);
});

test("manifest usa caminhos relativos (GitHub Pages)", () => {
  const m = JSON.parse(readFileSync("manifest.webmanifest", "utf8"));
  assert.equal(m.start_url, "./");
  assert.equal(m.scope, "./");
  assert.equal(m.lang, "pt-BR");
  assert.deepEqual(m.icons.map((i) => i.sizes), ["192x192", "512x512"]);
});

test("instalação busca arquivos novos, sem cache HTTP antigo", () => {
  assert.match(readFileSync("sw.js", "utf8"), /cache: "reload"/);
});
