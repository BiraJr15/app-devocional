import { test } from "node:test";
import assert from "node:assert/strict";
import { todasEntradas, filtrarEntradas } from "../js/core/busca.js";

const livro = { nome: "Mateus", leituras: [
  { id: "mt-01", ref: "Mateus 1:1-17", titulo: "A família de Jesus" },
  { id: "mt-02", ref: "Mateus 1:18-25", titulo: "O nascimento" },
  { id: "mt-03", ref: "Mateus 2:1-12", titulo: "Os sábios" },
]};
const r = (t) => ({ aconteceu: t, aprendi: "", praticar: "", versiculo: "" });
const estado = { concluidas: {
  "mt-01": { data: "2026-11-20", respostas: r("Genealogia") },
  "mt-03": { data: "2026-11-23", respostas: r("Adoração dos magos") },
}};

test("todasEntradas lista só concluídas, mais recente primeiro", () => {
  assert.deepEqual(todasEntradas(livro, estado).map((e) => e.leitura.id), ["mt-03", "mt-01"]);
});

test("filtrar ignora maiúsculas e acentos", () => {
  const e = todasEntradas(livro, estado);
  assert.deepEqual(filtrarEntradas(e, "JESUS").map((x) => x.leitura.id), ["mt-01"]);
  assert.deepEqual(filtrarEntradas(e, "adoracao").map((x) => x.leitura.id), ["mt-03"]);
  assert.deepEqual(filtrarEntradas(e, "2:1").map((x) => x.leitura.id), ["mt-03"]);
});

test("busca vazia devolve tudo", () => {
  assert.equal(filtrarEntradas(todasEntradas(livro, estado), "  ").length, 2);
});
