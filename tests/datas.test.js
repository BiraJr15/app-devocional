import { test } from "node:test";
import assert from "node:assert/strict";
import { dataLocal, diasEntre } from "../js/core/datas.js";

test("dataLocal usa o fuso local mesmo tarde da noite", () => {
  assert.equal(dataLocal(new Date(2026, 10, 24, 23, 30)), "2026-11-24");
});

test("dataLocal completa mês e dia com zero", () => {
  assert.equal(dataLocal(new Date(2026, 0, 5, 8, 0)), "2026-01-05");
});

test("diasEntre conta dias inteiros", () => {
  assert.equal(diasEntre("2026-11-20", "2026-11-24"), 4);
  assert.equal(diasEntre("2026-10-31", "2026-11-01"), 1);
  assert.equal(diasEntre("2026-11-24", "2026-11-24"), 0);
});
