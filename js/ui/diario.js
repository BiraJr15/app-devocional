// Tela Meu diário: tudo o que você já escreveu, com busca e backup.
import { el, irPara, getEstado, setEstado, livroAtual, avisar } from "../app.js";
import { todasEntradas, filtrarEntradas } from "../core/busca.js";
import { exportarEstado, importarEstado } from "../core/storage.js";
import { dataLocal, dataCurta } from "../core/datas.js";

export function render(raiz) {
  const entradas = todasEntradas(livroAtual(), getEstado());
  const lista = el("div", {});
  const busca = el("input", { type: "search", placeholder: "Buscar no diário", "aria-label": "Buscar no diário" });

  const desenhar = () => {
    const achadas = filtrarEntradas(entradas, busca.value);
    lista.replaceChildren(
      ...(achadas.length ? achadas.map(cartao) : [el("p", { class: "vazio" },
        entradas.length ? "Nada encontrado com essa palavra." : "Seu diário ainda está vazio. Faça a leitura de hoje e suas respostas aparecem aqui.")]),
    );
  };
  busca.addEventListener("input", desenhar);
  desenhar();

  raiz.append(
    el("div", { class: "topo" },
      el("button", { class: "link", onclick: () => irPara("inicio") }, "Início"),
    ),
    el("h1", {}, "Meu diário"),
    entradas.length > 0 && busca,
    el("div", { style: "margin-top:1rem" }, lista),
    el("div", { class: "rodape" },
      el("p", { class: "leve" }, "Seu diário fica salvo só neste aparelho. Exporte de vez em quando para não perder."),
      el("button", { class: "secundario", onclick: exportar }, "Exportar diário"),
      botaoImportar(),
    ),
  );
}

function cartao({ leitura, data, respostas }) {
  return el("button", { class: "entrada", onclick: () => irPara("leitura", { id: leitura.id, passo: 4, voltar: "diario" }) },
    el("span", { class: "leve" }, dataCurta(data)), " ",
    el("strong", {}, leitura.ref),
    el("p", {}, leitura.titulo),
    respostas.praticar && el("p", {}, `Vou praticar: ${respostas.praticar}`),
    respostas.versiculo && el("p", { class: "versiculo" }, respostas.versiculo),
    el("span", { class: "editar" }, "Toque para ver ou editar"),
  );
}

function exportar() {
  const blob = new Blob([exportarEstado(getEstado())], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: `devocional-backup-${dataLocal(new Date())}.json` });
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  avisar("Diário exportado.");
}

function botaoImportar() {
  const arquivo = el("input", { type: "file", accept: ".json,application/json", hidden: true });
  arquivo.addEventListener("change", async () => {
    const f = arquivo.files[0];
    arquivo.value = "";
    if (!f) return;
    let novo;
    try {
      novo = importarEstado(await f.text());
    } catch {
      avisar("Arquivo de backup inválido");
      return;
    }
    if (!confirm("Isso vai substituir os dados atuais. Continuar?")) return;
    setEstado(novo);
    avisar("Diário importado.");
    irPara("diario");
  });
  return [arquivo, el("button", { class: "secundario", onclick: () => arquivo.click() }, "Importar diário")];
}
