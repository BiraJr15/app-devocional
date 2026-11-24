# App Devocional Pessoal — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir um app web instalável (PWA), companheiro da Bíblia de Estudo NVT, que guia um devocional diário de 10 a 15 min com contexto, leitura, palavra-chave, 3 perguntas, oração, diário, progresso e revisão semanal.

**Architecture:** Site estático, sem servidor. A lógica fica em módulos JS puros (`js/core/`), testados com `node --test`. As telas (`js/ui/`) só leem e escrevem o estado através desses módulos. O conteúdo de cada livro é um módulo JS (`conteudo/<livro>.js`), então incluir um livro novo é só adicionar um arquivo e registrá-lo em `conteudo/livros.js`.

**Tech Stack:** HTML, CSS, JavaScript puro (módulos ES), localStorage, Service Worker, Web App Manifest, `node:test` (Node 22, nenhuma dependência npm), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-24-app-devocional-design.md`

## Global Constraints

- Sem framework, sem dependências npm, sem servidor, sem login, sem IA dentro do app.
- Todo texto da interface em português do Brasil, com tom calmo, simples e encorajador. Nunca culpar o usuário ("Você perdeu X dias" é proibido).
- Meta semanal: **5 dias**. Faltar um dia não zera nada.
- As 3 perguntas fixas, com estes textos exatos:
  - `O que aconteceu neste trecho?`
  - `O que aprendi sobre Deus (ou sobre Jesus)?`
  - `O que vou praticar hoje?`
  - E o campo opcional `Um versículo para levar comigo hoje`.
- Texto do botão "Tirar dúvida", exato: `Estou estudando {ref} (NVT). Sou iniciante. Não entendi: ___. Pode me explicar de forma simples?`
- O app não contém texto bíblico. A leitura é feita na Bíblia física NVT. O passo "Ler" lembra de olhar as notas de estudo da NVT.
- Retorno após 3 ou mais dias sem uso: saudação `Que bom te ver de volta, Bira!`.
- Datas sempre no **fuso local** (`AAAA-MM-DD`, montada com `getFullYear/getMonth/getDate`). Nunca usar `toISOString()` para datas.
- Visual minimalista, fonte grande (base ≥ 18px), tons calmos, uma ação principal por tela. Antes das tarefas de interface, carregar a skill `frontend-design`.
- Chave do localStorage: `devocional:v1`.

## Review Focus

1. **Leitura feita à noite (depois das 21h no Brasil):** deve contar no dia local, não no dia seguinte (erro clássico de UTC). Teste na Task 2.
2. **localStorage vazio, corrompido ou indisponível (modo anônimo):** o app abre com estado inicial e não trava. Teste na Task 1.
3. **Importar um arquivo errado como backup:** mostra `Arquivo de backup inválido` e mantém os dados atuais. Teste na Task 1.
4. **Refazer uma leitura já concluída:** substitui as respostas e não conta o dia duas vezes na semana. Teste na Task 2.
5. **Terminar todas as leituras do livro:** `proximaLeitura` retorna `null`, e a tela Início mostra a comemoração e o próximo livro sugerido, sem quebrar. Testes nas Tasks 2 e 3.

---

## Estrutura de arquivos

```
app-devocional/
├── index.html                 # casca única; as telas são trocadas pelo app.js
├── manifest.webmanifest
├── sw.js                      # cache offline
├── css/style.css
├── icons/icon-192.png, icon-512.png
├── js/
│   ├── app.js                 # inicia, troca de telas, guarda estado em memória
│   ├── core/
│   │   ├── datas.js           # datas no fuso local
│   │   ├── storage.js         # carregar/salvar/exportar/importar
│   │   ├── progresso.js       # próxima leitura, semana, conclusão, saudação
│   │   ├── duvida.js          # texto do "Tirar dúvida"
│   │   └── plano.js           # ordem dos livros, próximo livro
│   └── ui/
│       ├── inicio.js
│       ├── leitura.js
│       ├── diario.js
│       └── revisao.js
├── conteudo/
│   ├── livros.js              # ORDEM_LIVROS e LIVROS_DISPONIVEIS
│   └── mateus.js
└── tests/
    ├── datas.test.js
    ├── storage.test.js
    ├── progresso.test.js
    ├── plano.test.js
    ├── duvida.test.js
    └── conteudo.test.js
```

**Formas dos dados (usadas por todas as tarefas):**

```js
// Leitura (conteúdo)
{ id: "mt-01", capitulo: 1, ref: "Mateus 1:1-17", titulo: "A família de Jesus",
  contexto: "até 3 frases", palavra: { termo: "Messias", explicacao: "..." },
  oracao: "frase curta" }

// Livro (conteúdo)
{ id: "mateus", nome: "Mateus", leituras: Leitura[] }

// Estado (salvo no localStorage)
{ versao: 1, livroAtual: "mateus", ultimaVisita: "2026-11-24" | null,
  concluidas: { [leituraId]: { data: "2026-11-24",
     respostas: { aconteceu, aprendi, praticar, versiculo } } },
  revisoes: { [dataDomingo]: "texto" } }
```

---

### Task 1: Projeto base, datas e armazenamento

**Files:**
- Create: `package.json` (só `{"type":"module","scripts":{"test":"node --test tests/"}}`), `.gitignore`, `README.md` (como rodar e testar, em português)
- Create: `js/core/datas.js`, `js/core/storage.js`
- Test: `tests/datas.test.js`, `tests/storage.test.js`

**Interfaces:**
- Produces:
  - `dataLocal(d: Date): string` → `"AAAA-MM-DD"` no fuso local
  - `diasEntre(a: string, b: string): number` → dias inteiros de `a` até `b`
  - `estadoInicial(): Estado`
  - `carregarEstado(store = globalThis.localStorage): Estado`
  - `salvarEstado(estado: Estado, store = globalThis.localStorage): boolean` (false se falhar)
  - `exportarEstado(estado: Estado): string` (JSON indentado)
  - `importarEstado(texto: string): Estado` (lança `Error("Arquivo de backup inválido")`)

- [ ] **Step 1: Escrever os testes que falham**
  - `dataLocal(new Date(2026, 10, 24, 23, 30))` → `"2026-11-24"`
  - `diasEntre("2026-11-20", "2026-11-24")` → `4`; `diasEntre("2026-10-31", "2026-11-01")` → `1`
  - `carregarEstado(storeFalso)` com store vazio → `estadoInicial()` (`versao: 1`, `livroAtual: "mateus"`, `ultimaVisita: null`, `concluidas: {}`, `revisoes: {}`)
  - store com `"{lixo"` → `estadoInicial()`
  - store cujo `getItem` lança erro → `estadoInicial()`; `salvarEstado` com `setItem` que lança → retorna `false`
  - salvar e carregar → objeto igual (`deepStrictEqual`)
  - `importarEstado(exportarEstado(e))` → igual a `e`
  - `importarEstado("oi")`, `importarEstado('{"versao":2}')` e `importarEstado('{"versao":1}')` (sem `concluidas`) → lançam `"Arquivo de backup inválido"`

  Store falso: objeto `{ dados: {}, getItem(k), setItem(k, v) }`.

- [ ] **Step 2:** Run `npm test`. Expected: FAIL (módulos inexistentes).
- [ ] **Step 3:** Implementar `datas.js` e `storage.js`. Em `carregarEstado`, usar try/catch e validar `versao === 1` e `concluidas` como objeto. Ao carregar, mesclar com `estadoInicial()` para preencher campos que faltarem.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: base do projeto, datas locais e armazenamento`.

---

### Task 2: Progresso, semana e saudação

**Files:**
- Create: `js/core/progresso.js`
- Test: `tests/progresso.test.js` (com um livro falso de 4 leituras em 2 capítulos)

**Interfaces:**
- Consumes: `dataLocal`, `diasEntre` (Task 1)
- Produces:
  - `META_SEMANAL = 5`
  - `proximaLeitura(livro: Livro, estado: Estado): Leitura | null` → a primeira leitura não concluída, na ordem
  - `progressoLivro(livro, estado): { feitas: number, total: number }`
  - `concluirLeitura(estado, leituraId: string, respostas, hoje: Date): Estado` → **novo objeto**; refazer sobrescreve
  - `diasDaSemana(estado, hoje: Date): boolean[]` → 7 posições, domingo a sábado da semana de `hoje`; `true` se houve leitura concluída naquele dia
  - `capituloTerminado(livro, estado, leituraId): number | null` → número do capítulo se essa era a última leitura dele e todas as leituras do capítulo estão concluídas
  - `entradasDaSemana(livro, estado, hoje): Array<{ leitura, data, respostas }>` → dos últimos 7 dias (incluindo hoje), da mais recente para a mais antiga
  - `saudacao(estado, hoje: Date, nome = "Bira"): string`
  - `registrarVisita(estado, hoje): Estado` → atualiza `ultimaVisita`

- [ ] **Step 1: Escrever os testes que falham**
  - `proximaLeitura` com nada concluído → leitura 1; com 1 e 2 concluídas → leitura 3; com todas concluídas → `null`
  - `progressoLivro` → `{ feitas: 2, total: 4 }`
  - concluir às `new Date(2026,10,24,23,30)` → `concluidas[id].data === "2026-11-24"` (Review Focus 1)
  - concluir a mesma leitura duas vezes no mesmo dia → as respostas da segunda vez ficam salvas e `diasDaSemana` marca só aquele dia (Review Focus 4)
  - `diasDaSemana`: hoje = quarta 25/11/2026, concluídas em 22/11 (dom) e 25/11 → `[true,false,false,true,false,false,false]`; uma concluída em 21/11 (semana anterior) não aparece
  - `capituloTerminado` → `1` ao concluir a última do cap. 1; `null` numa leitura do meio
  - `saudacao`: 8h → começa com `Bom dia`; 14h → `Boa tarde`; 20h → `Boa noite`; sempre termina com `, Bira!`. Com `ultimaVisita` 3 dias antes → exatamente `Que bom te ver de volta, Bira!`. Com `ultimaVisita: null` → saudação normal
  - `entradasDaSemana` ignora entradas com mais de 6 dias
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementar `progresso.js` usando só `datas.js`, sem mutar o estado recebido.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: progresso, meta semanal e saudação`.

---

### Task 3: Ordem dos livros, dúvida e primeiras 10 leituras de Mateus

**Files:**
- Create: `conteudo/livros.js`, `conteudo/mateus.js`, `js/core/plano.js`, `js/core/duvida.js`
- Test: `tests/plano.test.js`, `tests/duvida.test.js`, `tests/conteudo.test.js`

**Interfaces:**
- Produces:
  - `ORDEM_LIVROS: string[]`: os nomes na ordem da seção 8.1 do spec, um item por livro (ex.: `"1 Tessalonicenses"` e `"2 Tessalonicenses"` separados), Novo Testamento completo antes do Antigo
  - `LIVROS_DISPONIVEIS: { [nome: string]: Livro }` (por enquanto só `"Mateus"`)
  - `proximoLivro(nomeAtual: string): { nome: string, disponivel: boolean } | null`
  - `textoDuvida(ref: string): string` (texto exato das Global Constraints)

- [ ] **Step 1: Escrever os testes que falham**
  - `ORDEM_LIVROS[0] === "Mateus"`, `[1] === "Marcos"`, `[4] === "Atos"`; tem 66 itens sem repetição; `"Gênesis"` vem depois de `"Apocalipse"`
  - `proximoLivro("Mateus")` → `{ nome: "Marcos", disponivel: false }`; `proximoLivro(ORDEM_LIVROS.at(-1))` → `null`; `"Lamentações"` é o último (fim da etapa 6 do spec); os "demais profetas" da etapa 6 entram na ordem bíblica
  - `textoDuvida("Mateus 5:1-12")` → `"Estou estudando Mateus 5:1-12 (NVT). Sou iniciante. Não entendi: ___. Pode me explicar de forma simples?"`
  - Conteúdo (vale para todo livro em `LIVROS_DISPONIVEIS`): ids únicos no formato `xx-NN` em sequência; `capitulo` nunca diminui; todos os campos preenchidos; `contexto` com no máximo 3 frases (contar `.`, `!` e `?`); `palavra.explicacao` com no máximo 300 caracteres
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implementar `livros.js`, `plano.js` e `duvida.js`.
- [ ] **Step 4:** Escrever `conteudo/mateus.js` com as 10 primeiras leituras, nesta divisão:

  | id | ref | título |
  |---|---|---|
  | mt-01 | Mateus 1:1-17 | A família de Jesus |
  | mt-02 | Mateus 1:18-25 | O nascimento de Jesus |
  | mt-03 | Mateus 2:1-12 | A visita dos sábios do Oriente |
  | mt-04 | Mateus 2:13-23 | A fuga para o Egito |
  | mt-05 | Mateus 3:1-12 | João Batista prepara o caminho |
  | mt-06 | Mateus 3:13-17 | O batismo de Jesus |
  | mt-07 | Mateus 4:1-11 | Jesus é tentado no deserto |
  | mt-08 | Mateus 4:12-25 | Jesus começa seu ministério |
  | mt-09 | Mateus 5:1-12 | As bem-aventuranças |
  | mt-10 | Mateus 5:13-16 | Sal da terra e luz do mundo |

  Escrever para iniciante: frases curtas, nada de termos técnicos sem explicação, conteúdo histórico e teológico consensual (sem posições denominacionais). Não citar o texto da NVT.
- [ ] **Step 5:** Run `npm test`. Expected: PASS.
- [ ] **Step 6:** Commit `feat: ordem dos livros, texto de dúvida e 10 leituras de Mateus`.

---

### Task 4: Casca do app e tela Início

**Files:**
- Create: `index.html`, `css/style.css`, `js/app.js`, `js/ui/inicio.js`

**Interfaces:**
- Consumes: todas as funções das Tasks 1 a 3
- Produces:
  - `app.js` exporta `irPara(tela: "inicio" | "leitura" | "diario" | "revisao", params?)`, `getEstado(): Estado`, `setEstado(e: Estado): void` (salva automaticamente) e `livroAtual(): Livro`
  - Cada tela exporta `render(raiz: HTMLElement, params?): void`

- [ ] **Step 1:** Carregar a skill `frontend-design` e definir as variáveis de CSS (cores calmas, fonte base 18px, espaçamentos, modo claro).
- [ ] **Step 2:** Montar `index.html` com `<main id="app">` e `<script type="module" src="js/app.js">`. O `app.js` carrega o estado, chama `registrarVisita` e renderiza `inicio`.
- [ ] **Step 3:** Implementar `inicio.js`, conforme o desenho da Tela 1 do spec: saudação, cartão "Leitura de hoje" (ref, título, botão `Começar`), 7 bolinhas da semana com legenda `(meta: 5 dias)`, barra `Mateus: N de T leituras`, botões `Meu diário` e `Revisão da semana`. Quando `proximaLeitura` for `null`: mensagem de comemoração e `Próximo livro sugerido: Marcos` (com `ainda em preparação` se não estiver disponível).
- [ ] **Step 4: Verificar no navegador.** Run `python3 -m http.server 8000` e abrir `http://localhost:8000`. Expected: tela Início com `mt-01`, 0 de 10, nenhuma bolinha marcada e nenhum erro no console. Simular todas concluídas (pelo console, via `setEstado`) → aparece a comemoração.
- [ ] **Step 5:** Commit `feat: casca do app e tela Início`.

---

### Task 5: Tela Leitura do dia (5 passos)

**Files:**
- Create: `js/ui/leitura.js`
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `concluirLeitura`, `capituloTerminado`, `textoDuvida`, `irPara`, `getEstado`, `setEstado`

- [ ] **Step 1:** Implementar os 5 passos, um por vez, com `Voltar` e `Continuar` e o indicador `Passo N de 5`:
  1. `Antes de ler`: contexto
  2. `Ler`: `Abra sua Bíblia em {ref}. Leia com calma e olhe as notas de estudo da NVT.` e botão `Já li`
  3. `Entender`: termo e explicação
  4. `Responder`: as 3 perguntas (textarea) e o versículo opcional (input). Se a leitura já foi feita, os campos vêm preenchidos
  5. `Orar`: frase de oração e botão `Concluir`
- [ ] **Step 2:** Botão `Tirar dúvida` em todos os passos: copiar `textoDuvida(ref)` com `navigator.clipboard.writeText` e mostrar `Pergunta copiada! Cole no Claude.`. Se a cópia falhar, mostrar o texto num campo selecionável.
- [ ] **Step 3:** O rascunho das respostas é salvo em memória ao trocar de passo, para não se perder ao voltar. Ao `Concluir`: `setEstado(concluirLeitura(...))`. Se `capituloTerminado` retornar um número, mostrar `Você terminou o capítulo N de Mateus!`; senão, `Leitura concluída. Até amanhã!`. Depois, voltar ao Início.
- [ ] **Step 4: Verificar no navegador.** Fazer a leitura `mt-01` inteira. Expected: Início mostra 1 de 10, a bolinha de hoje marcada e a próxima leitura `mt-02`. Recarregar a página → os dados continuam. Abrir `mt-01` de novo pelo diário → respostas preenchidas.
- [ ] **Step 5:** Commit `feat: tela Leitura do dia com 5 passos`.

---

### Task 6: Diário, revisão da semana e backup

**Files:**
- Create: `js/ui/diario.js`, `js/ui/revisao.js`
- Modify: `css/style.css`

**Interfaces:**
- Consumes: `entradasDaSemana`, `exportarEstado`, `importarEstado`, `dataLocal`, `irPara`, `getEstado`, `setEstado`

- [ ] **Step 1:** `diario.js`: lista das concluídas, da mais recente para a mais antiga (data, ref, título, respostas resumidas), e campo `Buscar no diário` que filtra por texto nas respostas, no título e na ref, sem diferenciar maiúsculas de acentos (usar `normalize("NFD")`). Tocar numa entrada abre a leitura no passo 4. No rodapé, `Exportar diário` (baixa `devocional-backup-AAAA-MM-DD.json`) e `Importar diário` (input de arquivo; pede confirmação `Isso vai substituir os dados atuais. Continuar?`; em caso de erro mostra `Arquivo de backup inválido` e não altera nada).
- [ ] **Step 2:** `revisao.js`: entradas dos últimos 7 dias, versículos guardados e campo `O que mais marcou esta semana?`, salvo em `revisoes[data do domingo da semana]`. Se não houver entradas: `Ainda não há leituras nesta semana. Que tal começar hoje?`. No Início, aos domingos, o botão `Revisão da semana` recebe destaque.
- [ ] **Step 3: Verificar no navegador.** Exportar o backup, apagar o localStorage e importar → tudo volta. Importar um `.txt` qualquer → aparece o erro e os dados ficam intactos. Buscar `jesus` → encontra `Jesus`.
- [ ] **Step 4:** Commit `feat: diário, revisão semanal e backup`.

---

### Task 7: PWA (offline e instalação)

**Files:**
- Create: `manifest.webmanifest`, `sw.js`, `icons/icon-192.png`, `icons/icon-512.png`
- Modify: `index.html` (link do manifest, `theme-color`, registro do service worker no `app.js`)

- [ ] **Step 1:** Gerar os ícones (Pillow): fundo na cor principal do tema e um símbolo simples (livro aberto). Manifest com `name: "Meu Devocional"`, `short_name: "Devocional"`, `lang: "pt-BR"`, `display: "standalone"`, `start_url: "./"`, `scope: "./"` (caminhos relativos, por causa do GitHub Pages).
- [ ] **Step 2:** `sw.js`: `CACHE = "devocional-v1"`, pré-cache de todos os arquivos do app, estratégia cache-first e limpeza de caches antigos no `activate`. Comentário no topo: `Ao mudar qualquer arquivo, aumente a versão do CACHE`.
- [ ] **Step 3: Verificar.** No Chrome DevTools → Application: manifest sem erros e service worker ativo. Marcar `Offline` e recarregar → o app abre e funciona.
- [ ] **Step 4:** Commit `feat: PWA com funcionamento offline`.

---

### Task 8: Publicação no GitHub Pages e instalação no celular

**Files:**
- Modify: `README.md` (seção "Publicar e instalar", com passo a passo para Windows/CMD: um comando por bloco, já com o `cd` da pasta)

- [ ] **Step 1:** Rodar `npm test` → PASS. Revisar o checklist do Review Focus no navegador.
- [ ] **Step 2:** Documentar no README: criar o repositório no GitHub, `git push`, ativar Settings → Pages → branch `main` / root, abrir a URL no celular → `Adicionar à tela inicial`. Incluir a dica de criar um alarme diário no celular.
- [ ] **Step 3:** Commit `docs: publicação e instalação`. Push e ativação do Pages feitos pelo Bira, com acompanhamento.

---

### Task 9 (depois de usar alguns dias): restante de Mateus

**Files:**
- Modify: `conteudo/mateus.js`, `sw.js` (versão do cache)

- [ ] **Step 1:** Escrever as leituras `mt-11` até o fim de Mateus 28 (cerca de 65 no total), dividindo pelos blocos naturais do texto (uma história ou ensino completo, em geral de 8 a 25 versículos), com as mesmas regras de escrita da Task 3.
- [ ] **Step 2:** Adicionar ao `conteudo.test.js` um teste específico de Mateus: os capítulos de 1 a 28 aparecem todos e a última `ref` termina em `28:20`.
- [ ] **Step 3:** Run `npm test` → PASS. Aumentar `CACHE` para `devocional-v2`.
- [ ] **Step 4:** Commit `feat: conteúdo completo de Mateus`.
