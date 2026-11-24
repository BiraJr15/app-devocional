// Ordem de leitura (seção 8.1 do desenho).
// Para incluir um livro novo: crie conteudo/<livro>.js e registre abaixo.
import mateus from "./mateus.js";

export const ORDEM_LIVROS = [
  // Etapa 1 — A vida de Jesus e o começo da igreja
  "Mateus", "Marcos", "Lucas", "João", "Atos",
  // Etapa 2 — Cartas práticas
  "Tiago", "Filipenses", "Efésios", "Colossenses",
  "1 Tessalonicenses", "2 Tessalonicenses", "1 Pedro", "2 Pedro",
  "1 João", "2 João", "3 João",
  // Etapa 3 — Cartas de base da fé
  "Gálatas", "Romanos", "1 Coríntios", "2 Coríntios",
  "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus", "Judas", "Apocalipse",
  // Etapa 4 — Antigo Testamento: o começo da história
  "Gênesis", "Êxodo", "Josué", "Juízes", "Rute",
  "1 Samuel", "2 Samuel", "1 Reis", "2 Reis",
  // Etapa 5 — Sabedoria e oração
  "Salmos", "Provérbios", "Eclesiastes", "Jó",
  // Etapa 6 — Os profetas e o restante
  "Isaías", "Jeremias", "Daniel", "Jonas",
  "Ezequiel", "Oseias", "Joel", "Amós", "Obadias", "Miqueias",
  "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias",
  "Levítico", "Números", "Deuteronômio", "1 Crônicas", "2 Crônicas",
  "Esdras", "Neemias", "Ester", "Cantares", "Lamentações",
];

export const LIVROS_DISPONIVEIS = {
  Mateus: mateus,
};
