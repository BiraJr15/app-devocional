// Tela Revisão da semana: o que você aprendeu nos últimos 7 dias.
import { el, irPara, getEstado, setEstado, livroAtual, avisar } from "../app.js";
import { entradasDaSemana, inicioDaSemana } from "../core/progresso.js";
import { dataCurta } from "../core/datas.js";

export function render(raiz) {
  const hoje = new Date();
  const estado = getEstado();
  const entradas = entradasDaSemana(livroAtual(), estado, hoje);
  const chave = inicioDaSemana(hoje);
  const versiculos = entradas.map((e) => e.respostas.versiculo).filter((v) => v?.trim());

  const topo = el("div", { class: "topo" },
    el("button", { class: "link", onclick: () => irPara("inicio") }, "Início"),
  );

  if (!entradas.length) {
    raiz.append(topo, el("h1", {}, "Revisão da semana"),
      el("p", { class: "vazio" }, "Ainda não há leituras nesta semana. Que tal começar hoje?"),
      el("button", { class: "primario largo", onclick: () => irPara("inicio") }, "Ir para a leitura de hoje"));
    return;
  }

  const marcou = el("textarea", { id: "marcou" });
  marcou.value = estado.revisoes?.[chave] ?? "";

  raiz.append(
    topo,
    el("h1", {}, "Revisão da semana"),
    el("p", { class: "leve" }, `${entradas.length} ${entradas.length === 1 ? "leitura" : "leituras"} nos últimos 7 dias.`),
    entradas.map(({ leitura, data, respostas }) =>
      el("div", { class: "entrada" },
        el("span", { class: "leve" }, dataCurta(data)), " ",
        el("strong", {}, `${leitura.ref}: ${leitura.titulo}`),
        respostas.aprendi && el("p", {}, `Aprendi: ${respostas.aprendi}`),
        respostas.praticar && el("p", {}, `Pratiquei: ${respostas.praticar}`),
      ),
    ),
    versiculos.length > 0 && el("section", {},
      el("h2", { style: "margin-top:1.5rem" }, "Versículos que guardei"),
      versiculos.map((v) => el("p", { class: "versiculo" }, v)),
    ),
    el("label", { class: "pergunta", for: "marcou" }, "O que mais marcou esta semana?"),
    marcou,
    el("button", {
      class: "primario largo", style: "margin-top:1rem",
      onclick: () => {
        const atual = getEstado();
        setEstado({ ...atual, revisoes: { ...atual.revisoes, [chave]: marcou.value } });
        avisar("Revisão salva.");
      },
    }, "Salvar revisão"),
  );
}
