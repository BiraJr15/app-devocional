// Lista e busca do diário.

export function todasEntradas(livro, estado) {
  return livro.leituras
    .filter((l) => estado.concluidas[l.id])
    .map((l) => ({ leitura: l, ...estado.concluidas[l.id] }))
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

// "Adoração" e "adoracao" viram a mesma coisa.
function normalizar(texto) {
  return String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function filtrarEntradas(entradas, busca) {
  const termo = normalizar(busca).trim();
  if (!termo) return entradas;
  return entradas.filter((e) =>
    normalizar([e.leitura.ref, e.leitura.titulo, ...Object.values(e.respostas)].join(" ")).includes(termo),
  );
}
