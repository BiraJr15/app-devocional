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

// Lê o localStorage dentro do try: em alguns navegadores, só acessar já dá erro.
function armazenamento(store) {
  return store === undefined ? globalThis.localStorage : store;
}

// Devolve o estado e se foi preciso guardar uma cópia de dados danificados.
export function carregarComAviso(store) {
  let texto = null;
  try {
    const s = armazenamento(store);
    texto = s.getItem(CHAVE);
    if (!texto) return { estado: estadoInicial(), recuperado: false };
    const e = JSON.parse(texto);
    if (valido(e)) return { estado: { ...estadoInicial(), ...e }, recuperado: false };
  } catch {
    if (texto === null) return { estado: estadoInicial(), recuperado: false };
  }
  // Dados existem mas não são válidos: guarda uma cópia antes que sejam substituídos.
  try {
    armazenamento(store).setItem(`${CHAVE}:corrompido`, texto);
  } catch { /* sem como guardar */ }
  return { estado: estadoInicial(), recuperado: true };
}

export function carregarEstado(store) {
  return carregarComAviso(store).estado;
}

export function salvarEstado(estado, store) {
  try {
    armazenamento(store).setItem(CHAVE, JSON.stringify(estado));
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
