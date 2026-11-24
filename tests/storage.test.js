import { test } from "node:test";
import assert from "node:assert/strict";
import {
  estadoInicial, carregarEstado, salvarEstado, exportarEstado, importarEstado,
} from "../js/core/storage.js";

function storeFalso() {
  return {
    dados: {},
    getItem(k) { return k in this.dados ? this.dados[k] : null; },
    setItem(k, v) { this.dados[k] = String(v); },
  };
}

test("estadoInicial tem os campos padrão", () => {
  assert.deepEqual(estadoInicial(), {
    versao: 1, livroAtual: "Mateus", ultimaVisita: null, concluidas: {}, revisoes: {},
  });
});

test("carregarEstado com store vazio devolve estado inicial", () => {
  assert.deepEqual(carregarEstado(storeFalso()), estadoInicial());
});

test("carregarEstado com JSON corrompido devolve estado inicial", () => {
  const s = storeFalso();
  s.setItem("devocional:v1", "{lixo");
  assert.deepEqual(carregarEstado(s), estadoInicial());
});

test("carregarEstado quando o store lança erro devolve estado inicial", () => {
  const s = { getItem() { throw new Error("bloqueado"); } };
  assert.deepEqual(carregarEstado(s), estadoInicial());
});

test("carregarEstado sem store disponível devolve estado inicial", () => {
  assert.deepEqual(carregarEstado(undefined), estadoInicial());
});

test("salvarEstado devolve false quando setItem falha", () => {
  const s = { setItem() { throw new Error("cheio"); } };
  assert.equal(salvarEstado(estadoInicial(), s), false);
});

test("salvar e carregar devolve o mesmo estado", () => {
  const s = storeFalso();
  const e = { ...estadoInicial(), ultimaVisita: "2026-11-24",
    concluidas: { "mt-01": { data: "2026-11-24", respostas: { aconteceu: "a", aprendi: "b", praticar: "c", versiculo: "" } } } };
  assert.equal(salvarEstado(e, s), true);
  assert.deepEqual(carregarEstado(s), e);
});

test("exportar e importar preserva o estado", () => {
  const e = { ...estadoInicial(), revisoes: { "2026-11-22": "Gostei" } };
  assert.deepEqual(importarEstado(exportarEstado(e)), e);
});

test("importarEstado rejeita arquivos inválidos", () => {
  for (const texto of ["oi", '{"versao":2}', '{"versao":1}', '{"versao":1,"concluidas":[]}']) {
    assert.throws(() => importarEstado(texto), { message: "Arquivo de backup inválido" });
  }
});
