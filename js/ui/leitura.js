// Tela Leitura do dia: 5 passos, um por vez.
import { el, irPara, getEstado, setEstado, livroAtual, avisar } from "../app.js";
import { concluirLeitura, capituloTerminado } from "../core/progresso.js";
import { textoDuvida } from "../core/duvida.js";

const TOTAL = 5;
const PERGUNTAS = [
  ["aconteceu", "O que aconteceu neste trecho?"],
  ["aprendi", "O que aprendi sobre Deus (ou sobre Jesus)?"],
  ["praticar", "O que vou praticar hoje?"],
];

// Rascunho em memória: não se perde ao voltar e avançar entre os passos.
let rascunho = null;

export function render(raiz, { id, passo = 1, voltar = "inicio" } = {}) {
  const livro = livroAtual();
  const leitura = livro.leituras.find((l) => l.id === id);
  if (!leitura) return irPara("inicio");

  if (!rascunho || rascunho.id !== id) {
    const salvo = getEstado().concluidas[id]?.respostas;
    rascunho = { id, respostas: { aconteceu: "", aprendi: "", praticar: "", versiculo: "", ...salvo } };
  }

  const ir = (n) => irPara("leitura", { id, passo: n, voltar });

  raiz.append(
    el("div", { class: "topo" },
      el("button", { class: "link", onclick: () => irPara(voltar) }, "Sair"),
      el("span", { class: "leve" }, leitura.ref),
    ),
    el("div", { class: "trilha", "aria-hidden": "true" },
      Array.from({ length: TOTAL }, (_, i) => el("span", { class: i < passo ? "ativo" : "" })),
    ),
    el("p", { class: "passo-num" }, `Passo ${passo} de ${TOTAL}`),
    conteudoDoPasso(passo, leitura, livro, ir, voltar),
    blocoDuvida(leitura.ref),
  );
}

function navegacao(passo, ir, textoAvancar = "Continuar", aoAvancar = () => ir(passo + 1)) {
  return el("div", { class: "acoes" },
    passo > 1 && el("button", { class: "secundario", onclick: () => ir(passo - 1) }, "Voltar"),
    el("button", { class: "primario", onclick: aoAvancar }, textoAvancar),
  );
}

function conteudoDoPasso(passo, leitura, livro, ir, voltar) {
  switch (passo) {
    case 1:
      return el("section", {},
        el("h1", {}, "Antes de ler"),
        el("p", { class: "texto" }, leitura.contexto),
        navegacao(passo, ir),
      );
    case 2:
      return el("section", {},
        el("h1", {}, "Ler"),
        el("p", { class: "texto" }, `Abra sua Bíblia em ${leitura.ref}. Leia com calma e olhe as notas de estudo da NVT.`),
        navegacao(passo, ir, "Já li"),
      );
    case 3:
      return el("section", {},
        el("h1", {}, "Entender"),
        el("p", { class: "termo" }, leitura.palavra.termo),
        el("p", { class: "texto" }, leitura.palavra.explicacao),
        navegacao(passo, ir),
      );
    case 4:
      return el("section", {},
        el("h1", {}, "Responder"),
        PERGUNTAS.map(([chave, texto]) => campo(chave, texto, "textarea")),
        campo("versiculo", "Um versículo para levar comigo hoje (opcional)", "input"),
        navegacao(passo, ir),
      );
    default:
      return el("section", {},
        el("h1", {}, "Orar"),
        el("p", { class: "oracao" }, leitura.oracao),
        el("p", { class: "leve" }, "Continue com suas próprias palavras."),
        navegacao(passo, ir, "Concluir", () => concluir(leitura, livro, voltar)),
      );
  }
}

function campo(chave, rotulo, tipo) {
  const idCampo = `campo-${chave}`;
  const entrada = el(tipo, { id: idCampo, ...(tipo === "input" ? { type: "text" } : {}) });
  entrada.value = rascunho.respostas[chave] ?? "";
  entrada.addEventListener("input", () => { rascunho.respostas[chave] = entrada.value; });
  return [el("label", { class: "pergunta", for: idCampo }, rotulo), entrada];
}

function concluir(leitura, livro, voltar) {
  const jaFeita = Boolean(getEstado().concluidas[leitura.id]);
  const novo = concluirLeitura(getEstado(), leitura.id, rascunho.respostas, new Date());
  setEstado(novo);
  rascunho = null;
  const cap = capituloTerminado(livro, novo, leitura.id);
  if (jaFeita) {
    avisar("Respostas atualizadas.");
    return irPara(voltar);
  }
  avisar(cap ? `Você terminou o capítulo ${cap} de ${livro.nome}!` : "Leitura concluída. Até amanhã!");
  irPara("inicio");
}

function blocoDuvida(ref) {
  const area = el("div", { class: "copia" });
  const botao = el("button", {
    class: "link",
    onclick: async () => {
      const texto = textoDuvida(ref);
      try {
        await navigator.clipboard.writeText(texto);
        avisar("Pergunta copiada! Cole no Claude.");
      } catch {
        const caixa = el("textarea", { readonly: true, "aria-label": "Pergunta para copiar" });
        caixa.value = texto;
        area.replaceChildren(el("p", { class: "leve" }, "Copie o texto abaixo e cole no Claude:"), caixa);
        caixa.select();
      }
    },
  }, "Tirar dúvida");
  return el("div", { class: "duvida" }, botao, area);
}
