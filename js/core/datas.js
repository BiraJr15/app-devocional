// Datas sempre no fuso do aparelho, no formato "AAAA-MM-DD".
// Não usamos toISOString(): ele converte para UTC e, no Brasil,
// uma leitura feita depois das 21h seria registrada no dia seguinte.

export function dataLocal(d) {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function paraMeioDiaUTC(texto) {
  const [a, m, d] = texto.split("-").map(Number);
  return Date.UTC(a, m - 1, d, 12);
}

// Quantos dias inteiros vão de a até b (b - a).
export function diasEntre(a, b) {
  return Math.round((paraMeioDiaUTC(b) - paraMeioDiaUTC(a)) / 86400000);
}
