# App Devocional Pessoal — Documento de Desenho

**Data:** 24/11/2026 · **Para:** uso pessoal do Bira · **Status:** aprovado em 24/11/2026

---

## 1. Intenção (o porquê)

Criar um app simples que transforme o devocional em **rotina diária** e ajude a **entender** a Bíblia, não só ler.

O problema hoje: a leitura de Mateus na Bíblia de Estudo NVT vira "ler, ler, ler sem entender", fica monótona e a rotina não se sustenta.

O app é um **companheiro da Bíblia física NVT**: ele guia, explica e registra. A leitura acontece na Bíblia de papel.

## 2. Objetivos

- Ter um **momento diário curto** (10 a 15 min) com começo, meio e fim.
- **Entender** cada trecho antes e depois de ler.
- **Sentir progresso**, vendo o caminho percorrido e o que foi aprendido.
- **Criar vontade de voltar** no dia seguinte.

## 3. O que NÃO é (fora do escopo agora)

- Não tem o texto da Bíblia dentro do app (a NVT tem direitos autorais; a leitura é na Bíblia física).
- Não tem login, servidor, banco de dados nem mensalidade.
- Não tem IA dentro do app.
- Não tem notificações do app (o lembrete é o alarme do celular).
- O conteúdo começa só com Mateus, mas a estrutura **já nasce preparada para vários livros**, seguindo a ordem da seção 8.1. Cada novo livro é só um novo arquivo de conteúdo, sem mudar o app.

## 4. O que faria o projeto fracassar (mesmo funcionando)

- Ficar **complicado**, com muitas telas, botões ou opções.
- **Culpar** o usuário por faltar um dia.
- Virar só mais uma tela para "marcar como feito", sem aprendizado.
- **Perder as anotações** do diário.

## 5. Abordagens consideradas

| Abordagem | Decisão |
|---|---|
| **A) Companheiro da Bíblia física** × B) Texto bíblico dentro do app | **A escolhida.** Aproveita a NVT de estudo e evita problema de direitos autorais |
| 1) Conteúdo pronto · 2) IA ao vivo · **3) Conteúdo pronto + botão "tirar dúvida"** | **3 escolhida.** Custo zero, sem servidor. As dúvidas pontuais vão para o Claude com um toque |

A abordagem 2 foi descartada por exigir servidor, chave de API e custo, o que é complexidade demais para um projeto pessoal.

## 6. Como o app funciona

### Tela 1 — Início
```
Bom dia, Bira!
┌──────────────────────────────┐
│ Leitura de hoje              │
│ Mateus 5:1-12                │
│ "As bem-aventuranças"        │
│        [ Começar ]           │
└──────────────────────────────┘
Esta semana: ● ● ● ○ ○   (meta: 5 dias)
Mateus: ███░░░░░░░ 12 de 65 leituras
[ Meu diário ]   [ Revisão da semana ]
```

### Tela 2 — Leitura do dia (5 passos, um por vez)
1. **Antes de ler:** contexto em até 3 frases (onde, quem, por que importa).
2. **Ler:** indica o trecho e lembra de olhar as notas de estudo da NVT. Botão "Já li".
3. **Entender:** uma palavra-chave explicada em linguagem simples.
4. **Responder:** 3 perguntas curtas, sempre as mesmas para criar hábito:
   - O que aconteceu neste trecho?
   - O que aprendi sobre Deus (ou sobre Jesus)?
   - O que vou praticar hoje?
   - *(opcional)* Um versículo para levar comigo hoje.
5. **Orar:** uma frase curta para iniciar a oração. Botão "Concluir".

Em qualquer passo: botão **"Tirar dúvida"**, que copia uma pergunta pronta, por exemplo:
> "Estou estudando Mateus 5:1-12 (NVT). Sou iniciante. Não entendi: ___. Pode me explicar de forma simples?"

### Tela 3 — Meu diário
Lista das leituras concluídas, com as respostas. Busca por palavra.

### Tela 4 — Revisão da semana
Mostra o que foi escrito nos últimos 7 dias e os versículos guardados. Pergunta final: "O que mais marcou esta semana?". Pode ser aberta a qualquer momento, mas o app sugere aos domingos.

## 7. O que gera motivação

- **Trechos curtos**, com uma história ou ensino completo por vez, não o capítulo inteiro.
- **Meta semanal de 5 dias**, não sequência infinita. Faltar um dia não zera nada.
- **Progresso visível** em Mateus (barra) e na semana (bolinhas).
- **Pequenas comemorações** ao terminar um capítulo e ao concluir Mateus.
- **Revisão semanal**: ver o próprio aprendizado acumulado.
- **Recomeço gentil**: depois de dias sem abrir, a mensagem é "Que bom te ver de volta", nunca "Você perdeu X dias".

## 8. Conteúdo

- Plano de **Mateus dividido em cerca de 65 leituras**, escrito pelo Claude em um arquivo de dados.
- Cada leitura tem: referência, título, contexto, palavra-chave com explicação e frase de oração.
- **Regra:** o conteúdo do app apoia a leitura. Se divergir das notas da NVT, **vale a NVT**.
- O conteúdo é revisado aos poucos pelo Bira durante o uso.

### 8.1 Ordem de leitura sugerida (proposta do Claude, ajustável)

Segue a orientação recebida pelo Bira: começar por Mateus, percorrer o Novo Testamento e depois entrar no Antigo. Dentro de cada parte, a ordem vai do mais acessível para o mais denso. Se o líder ou a igreja do Bira orientarem outra ordem, a orientação deles prevalece.

**Etapa 1 — A vida de Jesus e o começo da igreja**
1. Mateus
2. Marcos
3. Lucas
4. João
5. Atos

**Etapa 2 — Cartas práticas (curtas e diretas)**
6. Tiago
7. Filipenses
8. Efésios
9. Colossenses
10. 1 e 2 Tessalonicenses
11. 1 Pedro e 2 Pedro
12. 1, 2 e 3 João

**Etapa 3 — Cartas de base da fé (mais profundas)**
13. Gálatas
14. Romanos
15. 1 e 2 Coríntios
16. 1 e 2 Timóteo, Tito, Filemom
17. Hebreus
18. Judas
19. Apocalipse

**Etapa 4 — Antigo Testamento: o começo da história**
20. Gênesis
21. Êxodo
22. Josué, Juízes, Rute
23. 1 e 2 Samuel
24. 1 e 2 Reis

**Etapa 5 — Sabedoria e oração**
25. Salmos (em trechos, pode ser intercalado com outros livros)
26. Provérbios
27. Eclesiastes, Jó

**Etapa 6 — Os profetas e o restante**
28. Isaías, Jeremias, Daniel, Jonas e os demais profetas
29. Levítico, Números, Deuteronômio, Crônicos, Esdras, Neemias, Ester, Cantares, Lamentações

No app, ao terminar um livro, o próximo da lista aparece como sugestão (só aparece depois que o conteúdo dele for criado).

## 9. Tecnologia (escolhas simples)

| Item | Escolha | Por quê |
|---|---|---|
| Tipo de app | App web instalável (PWA) | Abre como app no celular, funciona offline, não precisa de loja |
| Linguagem | HTML + CSS + JavaScript puro, sem framework | Menos coisas para aprender e manter; bom para estudar |
| Dados | Salvos no próprio celular (localStorage) | Sem servidor e sem custo |
| Backup | Botão "Exportar diário" (baixa um arquivo) e "Importar" | Protege as anotações se o navegador for limpo ou o celular trocado |
| Hospedagem | GitHub Pages (gratuito) | Já usa GitHub |
| Visual | Minimalista, letra grande, tons calmos | Leitura tranquila, sem distração |

## 10. Etapas sugeridas (pequenas e testáveis)

1. Estrutura do projeto e tela Início com dados de exemplo.
2. Tela Leitura do dia com os 5 passos e respostas salvas.
3. Conteúdo das primeiras 10 leituras de Mateus, para já começar a usar.
4. Progresso, meta semanal e diário.
5. Revisão da semana e backup.
6. Instalação no celular (PWA) e publicação no GitHub Pages.
7. Restante do conteúdo de Mateus.

O app pode ser usado de verdade a partir da etapa 3.

## 11. Deixado para quem construir decidir

Cores e fontes exatas, textos dos botões e mensagens de comemoração, dentro do estilo calmo e simples definido acima.

## 12. Ideias para o futuro (não fazer agora)

Outros livros (Marcos, Salmos...), notificação diária pelo app, compartilhar versículo como imagem, uso por outras pessoas.
