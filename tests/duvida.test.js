import { test } from "node:test";
import assert from "node:assert/strict";
import { textoDuvida } from "../js/core/duvida.js";

test("textoDuvida monta a pergunta exata", () => {
  assert.equal(
    textoDuvida("Mateus 5:1-12"),
    "Estou estudando Mateus 5:1-12 (NVT). Sou iniciante. Não entendi: ___. Pode me explicar de forma simples?",
  );
});
