// Regras de progresso: qual a próxima leitura, como foi a semana, saudação.
import { dataLocal, diasEntre } from "./datas.js";

export const META_SEMANAL = 5;

export function proximaLeitura(livro, estado) {
  return livro.leituras.find((l) => !estado.concluidas[l.id]) ?? null;
}

export function progressoLivro(livro, estado) {
  const feitas = livro.leituras.filter((l) => estado.concluidas[l.id]).length;
  return { feitas, total: livro.leituras.length };
}

// Devolve um NOVO estado (não altera o original).
// Refazer ou editar uma leitura substitui as respostas, mas mantém o dia
// em que ela foi feita pela primeira vez (para a semana não mudar).
export function concluirLeitura(estado, leituraId, respostas, hoje) {
  const data = estado.concluidas[leituraId]?.data ?? dataLocal(hoje);
  return {
    ...estado,
    concluidas: {
      ...estado.concluidas,
      [leituraId]: { data, respostas: { ...respostas } },
    },
  };
}

// Data (AAAA-MM-DD) do domingo da semana de "hoje".
export function inicioDaSemana(hoje) {
  const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - hoje.getDay());
  return dataLocal(d);
}

// 7 posições, domingo a sábado: true se houve leitura naquele dia.
export function diasDaSemana(estado, hoje) {
  const domingo = inicioDaSemana(hoje);
  const dias = Array(7).fill(false);
  for (const { data } of Object.values(estado.concluidas)) {
    const i = diasEntre(domingo, data);
    if (i >= 0 && i < 7) dias[i] = true;
  }
  return dias;
}

// Número do capítulo, se esta leitura fechou o capítulo; senão null.
// Se o conteúdo do livro ainda está incompleto (completo: false), a última
// leitura disponível não fecha capítulo: o resto dele ainda não foi escrito.
export function capituloTerminado(livro, estado, leituraId) {
  const leitura = livro.leituras.find((l) => l.id === leituraId);
  if (!leitura) return null;
  if (livro.completo === false && livro.leituras.at(-1).id === leituraId) return null;
  const doCapitulo = livro.leituras.filter((l) => l.capitulo === leitura.capitulo);
  const ultima = doCapitulo[doCapitulo.length - 1];
  const todas = doCapitulo.every((l) => estado.concluidas[l.id]);
  return ultima.id === leituraId && todas ? leitura.capitulo : null;
}

// Leituras dos últimos 7 dias (hoje incluído), da mais recente para a mais antiga.
export function entradasDaSemana(livro, estado, hoje) {
  const hojeTexto = dataLocal(hoje);
  return livro.leituras
    .filter((l) => estado.concluidas[l.id])
    .map((l) => ({ leitura: l, ...estado.concluidas[l.id] }))
    .filter((x) => {
      const dias = diasEntre(x.data, hojeTexto);
      return dias >= 0 && dias <= 6;
    })
    .sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));
}

export function saudacao(estado, hoje, nome = "Bira") {
  if (estado.ultimaVisita && diasEntre(estado.ultimaVisita, dataLocal(hoje)) >= 3) {
    return `Que bom te ver de volta, ${nome}!`;
  }
  const h = hoje.getHours();
  const periodo = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  return `${periodo}, ${nome}!`;
}

export function registrarVisita(estado, hoje) {
  return { ...estado, ultimaVisita: dataLocal(hoje) };
}
