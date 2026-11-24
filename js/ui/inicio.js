// Tela Início: saudação, leitura de hoje, semana e progresso.
import { el, irPara, getEstado, livroAtual, getVisitaAnterior } from "../app.js";
import {
  META_SEMANAL, proximaLeitura, progressoLivro, diasDaSemana, saudacao,
} from "../core/progresso.js";
import { proximoLivro } from "../core/plano.js";

const NOMES_DIAS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function render(raiz) {
  const estado = getEstado();
  const livro = livroAtual();
  const hoje = new Date();
  const leitura = proximaLeitura(livro, estado);
  const { feitas, total } = progressoLivro(livro, estado);
  const dias = diasDaSemana(estado, hoje);
  const domingo = hoje.getDay() === 0;

  raiz.append(
    el("h1", { class: "saudacao" }, saudacao({ ...estado, ultimaVisita: getVisitaAnterior() }, hoje)),
    leitura ? cartaoHoje(leitura) : cartaoFim(livro),
    el("section", { "aria-label": "Sua semana" },
      el("h2", {}, "Esta semana"),
      el("div", { class: "semana" },
        dias.map((feito, i) =>
          el("div", { class: `dia${i === hoje.getDay() ? " hoje-marcado" : ""}` },
            el("span", { class: `bolinha${feito ? " feita" : ""}`, "aria-hidden": "true" }),
            el("span", {}, NOMES_DIAS[i]),
          ),
        ),
      ),
      el("p", { class: "leve" }, `${dias.filter(Boolean).length} ${dias.filter(Boolean).length === 1 ? "dia" : "dias"} com leitura (meta: ${META_SEMANAL} dias)`),
    ),
    el("section", { class: "progresso", "aria-label": "Progresso no livro" },
      el("p", { class: "leve" }, `${livro.nome}: ${feitas} de ${total} leituras`),
      el("div", { class: "barra", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": total, "aria-valuenow": feitas },
        el("div", { style: `width:${total ? (feitas / total) * 100 : 0}%` }),
      ),
    ),
    el("div", { class: "atalhos" },
      el("button", { class: "secundario", onclick: () => irPara("diario") }, "Meu diário"),
      el("button", { class: `secundario${domingo ? " destaque" : ""}`, onclick: () => irPara("revisao") }, "Revisão da semana"),
    ),
  );
}

function cartaoHoje(leitura) {
  return el("section", { class: "hoje", "aria-label": "Leitura de hoje" },
    el("p", { class: "rotulo" }, "Leitura de hoje"),
    el("p", { class: "referencia" }, leitura.ref),
    el("p", { class: "titulo" }, leitura.titulo),
    el("button", { class: "primario largo", onclick: () => irPara("leitura", { id: leitura.id }) }, "Começar"),
  );
}

function cartaoFim(livro) {
  const prox = proximoLivro(livro.nome);
  return el("section", { class: "hoje comemoracao" },
    el("p", { class: "referencia" }, "Parabéns!"),
    el("p", {}, `Você concluiu todas as leituras disponíveis de ${livro.nome}.`),
    prox && el("p", { class: "leve" },
      `Próximo livro sugerido: ${prox.nome}${prox.disponivel ? "" : " (ainda em preparação)"}`),
  );
}
