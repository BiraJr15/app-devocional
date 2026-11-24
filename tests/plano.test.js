import { test } from "node:test";
import assert from "node:assert/strict";
import { ORDEM_LIVROS } from "../conteudo/livros.js";
import { proximoLivro } from "../js/core/plano.js";

test("ordem começa pelos Evangelhos e Atos", () => {
  assert.equal(ORDEM_LIVROS[0], "Mateus");
  assert.equal(ORDEM_LIVROS[1], "Marcos");
  assert.equal(ORDEM_LIVROS[4], "Atos");
});

test("ordem tem os 66 livros sem repetição", () => {
  assert.equal(ORDEM_LIVROS.length, 66);
  assert.equal(new Set(ORDEM_LIVROS).size, 66);
});

test("Antigo Testamento vem depois do Novo", () => {
  assert.ok(ORDEM_LIVROS.indexOf("Gênesis") > ORDEM_LIVROS.indexOf("Apocalipse"));
  assert.equal(ORDEM_LIVROS.at(-1), "Lamentações");
});

test("proximoLivro indica o seguinte e se já está disponível", () => {
  assert.deepEqual(proximoLivro("Mateus"), { nome: "Marcos", disponivel: false });
  assert.equal(proximoLivro(ORDEM_LIVROS.at(-1)), null);
});
