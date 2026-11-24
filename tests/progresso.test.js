import { test } from "node:test";
import assert from "node:assert/strict";
import {
  META_SEMANAL, proximaLeitura, progressoLivro, concluirLeitura, diasDaSemana,
  inicioDaSemana, capituloTerminado, entradasDaSemana, saudacao, registrarVisita,
} from "../js/core/progresso.js";
import { estadoInicial } from "../js/core/storage.js";

const livro = {
  id: "falso", nome: "Falso",
  leituras: [
    { id: "fa-01", capitulo: 1 }, { id: "fa-02", capitulo: 1 },
    { id: "fa-03", capitulo: 2 }, { id: "fa-04", capitulo: 2 },
  ],
};
const resp = (t) => ({ aconteceu: t, aprendi: t, praticar: t, versiculo: "" });
const dia = (d, h = 9) => new Date(2026, 10, d, h, 0);

function com(...pares) {
  let e = estadoInicial();
  for (const [id, d] of pares) e = concluirLeitura(e, id, resp(id), dia(d));
  return e;
}

test("meta semanal é 5", () => assert.equal(META_SEMANAL, 5));

test("proximaLeitura segue a ordem e termina em null", () => {
  assert.equal(proximaLeitura(livro, estadoInicial()).id, "fa-01");
  assert.equal(proximaLeitura(livro, com(["fa-01", 23], ["fa-02", 24])).id, "fa-03");
  assert.equal(proximaLeitura(livro, com(["fa-01", 21], ["fa-02", 22], ["fa-03", 23], ["fa-04", 24])), null);
});

test("progressoLivro conta feitas e total", () => {
  assert.deepEqual(progressoLivro(livro, com(["fa-01", 23], ["fa-02", 24])), { feitas: 2, total: 4 });
});

test("concluir tarde da noite grava o dia local", () => {
  const e = concluirLeitura(estadoInicial(), "fa-01", resp("x"), new Date(2026, 10, 24, 23, 30));
  assert.equal(e.concluidas["fa-01"].data, "2026-11-24");
});

test("concluirLeitura não altera o estado recebido", () => {
  const e0 = estadoInicial();
  concluirLeitura(e0, "fa-01", resp("x"), dia(24));
  assert.deepEqual(e0.concluidas, {});
});

test("refazer substitui respostas e não conta o dia duas vezes", () => {
  let e = concluirLeitura(estadoInicial(), "fa-01", resp("primeira"), dia(25, 8));
  e = concluirLeitura(e, "fa-01", resp("segunda"), dia(25, 20));
  assert.equal(e.concluidas["fa-01"].respostas.aconteceu, "segunda");
  assert.deepEqual(diasDaSemana(e, dia(25)), [false, false, false, true, false, false, false]);
});

test("diasDaSemana marca domingo a sábado da semana atual", () => {
  const e = com(["fa-01", 21], ["fa-02", 22], ["fa-03", 25]);
  assert.deepEqual(diasDaSemana(e, dia(25)), [true, false, false, true, false, false, false]);
});

test("inicioDaSemana devolve o domingo", () => {
  assert.equal(inicioDaSemana(dia(25)), "2026-11-22");
  assert.equal(inicioDaSemana(dia(22)), "2026-11-22");
  assert.equal(inicioDaSemana(dia(28)), "2026-11-22");
});

test("capituloTerminado só ao fechar o capítulo", () => {
  assert.equal(capituloTerminado(livro, com(["fa-01", 23], ["fa-02", 24]), "fa-02"), 1);
  assert.equal(capituloTerminado(livro, com(["fa-01", 23]), "fa-01"), null);
});

test("entradasDaSemana pega últimos 7 dias, mais recente primeiro", () => {
  const e = com(["fa-01", 17], ["fa-02", 18], ["fa-03", 23]);
  const r = entradasDaSemana(livro, e, dia(24));
  assert.deepEqual(r.map((x) => x.leitura.id), ["fa-03", "fa-02"]);
  assert.equal(r[0].data, "2026-11-23");
});

test("saudacao conforme a hora", () => {
  const e = { ...estadoInicial(), ultimaVisita: "2026-11-24" };
  assert.equal(saudacao(e, dia(24, 8)), "Bom dia, Bira!");
  assert.equal(saudacao(e, dia(24, 14)), "Boa tarde, Bira!");
  assert.equal(saudacao(e, dia(24, 20)), "Boa noite, Bira!");
  assert.equal(saudacao(estadoInicial(), dia(24, 8)), "Bom dia, Bira!");
});

test("saudacao de retorno após 3 dias, sem culpa", () => {
  const e = { ...estadoInicial(), ultimaVisita: "2026-11-21" };
  assert.equal(saudacao(e, dia(24, 8)), "Que bom te ver de volta, Bira!");
});

test("registrarVisita atualiza ultimaVisita", () => {
  assert.equal(registrarVisita(estadoInicial(), dia(24)).ultimaVisita, "2026-11-24");
});

test("editar uma leitura em outro dia mantém a data original", () => {
  let e = concluirLeitura(estadoInicial(), "fa-01", resp("primeira"), dia(23));
  e = concluirLeitura(e, "fa-01", resp("corrigida"), dia(25));
  assert.equal(e.concluidas["fa-01"].data, "2026-11-23");
  assert.equal(e.concluidas["fa-01"].respostas.aconteceu, "corrigida");
  assert.deepEqual(diasDaSemana(e, dia(25)), [false, true, false, false, false, false, false]);
});

test("capítulo não é dado como terminado se o conteúdo do livro está incompleto", () => {
  const parcial = { ...livro, completo: false };
  const e = com(["fa-01", 21], ["fa-02", 22], ["fa-03", 23], ["fa-04", 24]);
  assert.equal(capituloTerminado(parcial, e, "fa-04"), null);
  assert.equal(capituloTerminado(parcial, e, "fa-02"), 1);
});

import { leiturasDeHoje } from "../js/core/progresso.js";

test("leiturasDeHoje lista o que foi concluído hoje, na ordem do livro", () => {
  const e = com(["fa-01", 23], ["fa-02", 24], ["fa-03", 24]);
  assert.deepEqual(leiturasDeHoje(livro, e, dia(24, 22)).map((l) => l.id), ["fa-02", "fa-03"]);
  assert.deepEqual(leiturasDeHoje(livro, e, dia(25)), []);
});
