// Qual livro vem depois do atual na ordem de leitura.
import { ORDEM_LIVROS, LIVROS_DISPONIVEIS } from "../../conteudo/livros.js";

export function proximoLivro(nomeAtual) {
  const i = ORDEM_LIVROS.indexOf(nomeAtual);
  if (i < 0 || i === ORDEM_LIVROS.length - 1) return null;
  const nome = ORDEM_LIVROS[i + 1];
  return { nome, disponivel: Boolean(LIVROS_DISPONIVEIS[nome]) };
}
