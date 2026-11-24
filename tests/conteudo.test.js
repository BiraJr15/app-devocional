import { test } from "node:test";
import assert from "node:assert/strict";
import { LIVROS_DISPONIVEIS } from "../conteudo/livros.js";

const frases = (t) => (t.match(/[.!?]+/g) || []).length;

for (const [nome, livro] of Object.entries(LIVROS_DISPONIVEIS)) {
  test(`${nome}: estrutura das leituras`, () => {
    assert.equal(livro.nome, nome);
    assert.ok(livro.leituras.length > 0);
    let capAnterior = 0;
    livro.leituras.forEach((l, i) => {
      const prefixo = l.id.slice(0, 2);
      assert.match(l.id, /^[a-z]{2}-\d{2}$/);
      assert.equal(l.id, `${prefixo}-${String(i + 1).padStart(2, "0")}`);
      assert.ok(l.capitulo >= capAnterior, `${l.id}: capítulo diminuiu`);
      capAnterior = l.capitulo;
      for (const campo of ["ref", "titulo", "contexto", "oracao"]) {
        assert.ok(l[campo]?.trim(), `${l.id}: falta ${campo}`);
      }
      assert.ok(l.ref.startsWith(`${nome} ${l.capitulo}:`), `${l.id}: ref não bate com capítulo`);
      assert.ok(l.palavra?.termo?.trim() && l.palavra?.explicacao?.trim(), `${l.id}: falta palavra`);
      assert.ok(frases(l.contexto) <= 3, `${l.id}: contexto com mais de 3 frases`);
      assert.ok(l.palavra.explicacao.length <= 300, `${l.id}: explicação longa`);
    });
  });
}

test("Mateus está disponível", () => {
  assert.ok(LIVROS_DISPONIVEIS.Mateus);
});
