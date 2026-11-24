// Guarda o estado do app no próprio aparelho (localStorage).
const CHAVE = "devocional:v1";

export function estadoInicial() {
  return { versao: 1, livroAtual: "Mateus", ultimaVisita: null, concluidas: {}, revisoes: {} };
}

function ehObjeto(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function valido(e) {
  return ehObjeto(e) && e.versao === 1 && ehObjeto(e.concluidas);
}

export function carregarEstado(store = globalThis.localStorage) {
  try {
    const texto = store.getItem(CHAVE);
    if (!texto) return estadoInicial();
    const e = JSON.parse(texto);
    return valido(e) ? { ...estadoInicial(), ...e } : estadoInicial();
  } catch {
    return estadoInicial();
  }
}

export function salvarEstado(estado, store = globalThis.localStorage) {
  try {
    store.setItem(CHAVE, JSON.stringify(estado));
    return true;
  } catch {
    return false;
  }
}

export function exportarEstado(estado) {
  return JSON.stringify(estado, null, 2);
}

export function importarEstado(texto) {
  let e;
  try {
    e = JSON.parse(texto);
  } catch {
    throw new Error("Arquivo de backup inválido");
  }
  if (!valido(e)) throw new Error("Arquivo de backup inválido");
  return { ...estadoInicial(), ...e };
}
