// Ponto de partida do app: guarda o estado em memória e troca as telas.
import { carregarEstado, salvarEstado } from "./core/storage.js";
import { registrarVisita } from "./core/progresso.js";
import { LIVROS_DISPONIVEIS } from "../conteudo/livros.js";
import * as inicio from "./ui/inicio.js";
import * as leitura from "./ui/leitura.js";
import * as diario from "./ui/diario.js";
import * as revisao from "./ui/revisao.js";

const telas = { inicio, leitura, diario, revisao };
let estado = carregarEstado();

export function getEstado() {
  return estado;
}

export function setEstado(novo) {
  estado = novo;
  if (!salvarEstado(estado)) {
    avisar("Não foi possível salvar neste aparelho. Exporte seu diário para não perder.");
  }
}

export function livroAtual() {
  return LIVROS_DISPONIVEIS[estado.livroAtual] ?? LIVROS_DISPONIVEIS.Mateus;
}

export function irPara(tela, params) {
  const raiz = document.getElementById("app");
  raiz.innerHTML = "";
  telas[tela].render(raiz, params);
  window.scrollTo(0, 0);
}

let temporizador;
export function avisar(texto) {
  const el = document.getElementById("aviso");
  el.textContent = texto;
  el.hidden = false;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => { el.hidden = true; }, 3500);
}

// Pequeno ajudante para criar elementos sem escrever HTML em texto.
export function el(tag, atributos = {}, ...filhos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(atributos)) {
    if (k === "onclick") e.addEventListener("click", v);
    else if (k === "class") e.className = v;
    else if (v !== false && v != null) e.setAttribute(k, v === true ? "" : v);
  }
  for (const f of filhos.flat()) {
    if (f == null || f === false) continue;
    e.append(f instanceof Node ? f : document.createTextNode(String(f)));
  }
  return e;
}

// A saudação usa a visita ANTERIOR, então guardamos antes de registrar a de hoje.
const visitaAnterior = estado.ultimaVisita;
export function getVisitaAnterior() {
  return visitaAnterior;
}

setEstado(registrarVisita(estado, new Date()));
irPara("inicio");
