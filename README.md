# Meu Devocional

App pessoal de devocional diário, companheiro da Bíblia de Estudo NVT.
Cada dia tem 5 passos curtos: contexto, leitura na sua Bíblia, uma palavra explicada, 3 perguntas e oração.

## Como o projeto está organizado

| Pasta | O que tem |
|---|---|
| `index.html`, `css/` | A página e o visual |
| `js/core/` | As regras do app (datas, progresso, salvamento, busca). Tudo tem teste |
| `js/ui/` | As telas: Início, Leitura, Diário e Revisão |
| `conteudo/` | O plano de leitura. `livros.js` tem a ordem dos livros; cada livro é um arquivo |
| `sw.js`, `manifest.webmanifest`, `icons/` | O que faz o app funcionar offline e ser instalado no celular |
| `tests/` | Testes automáticos |
| `docs/` | O desenho do app e o plano de construção |

## Rodar no computador (Windows / CMD)

Troque `C:\Projetos\app-devocional` pelo caminho onde a pasta está no seu computador.

Rodar os testes (precisa do Node.js instalado):

```
cd /d C:\Projetos\app-devocional && npm test
```

Abrir o app no navegador (precisa do Python instalado):

```
cd /d C:\Projetos\app-devocional && python -m http.server 8000
```

Depois acesse http://localhost:8000. Para parar o servidor, use `Ctrl + C`.

## Publicar no GitHub Pages (gratuito)

1. No site do GitHub, crie um repositório chamado `app-devocional` (pode ser privado só se o seu plano permitir Pages privado; senão, público).
2. Ligue a pasta ao repositório (troque `SEU-USUARIO`):

```
cd /d C:\Projetos\app-devocional && git remote add origin https://github.com/SEU-USUARIO/app-devocional.git
```

3. Envie o código:

```
cd /d C:\Projetos\app-devocional && git push -u origin main
```

4. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
5. Em 1 a 2 minutos o app fica em `https://SEU-USUARIO.github.io/app-devocional/`.

## Instalar no celular

1. Abra o endereço do GitHub Pages no Chrome do celular.
2. Toque no menu (⋮) → **Adicionar à tela inicial** (ou **Instalar app**).
3. Pronto: o ícone aparece na tela inicial e o app funciona sem internet.

**Dica:** crie um alarme diário no celular no horário do seu devocional, com o nome "Meu Devocional".

## Sobre seus dados

Suas respostas ficam salvas **só no seu celular**. No **Meu diário**, use **Exportar diário** de vez em quando e guarde o arquivo (Google Drive, e-mail). Se trocar de celular ou limpar o navegador, use **Importar diário**.

## Mudar alguma coisa

- Depois de alterar qualquer arquivo, abra `sw.js` e aumente a versão: `devocional-v1` → `devocional-v2`. Sem isso, o celular continua mostrando a versão antiga.
- Se criar um arquivo novo, inclua-o na lista `ARQUIVOS` do `sw.js`. O `npm test` avisa se esquecer.
- Para adicionar um livro: crie `conteudo/<livro>.js` no mesmo formato de `mateus.js` e registre em `LIVROS_DISPONIVEIS` dentro de `conteudo/livros.js`.

O conteúdo do plano apoia a leitura. Se algo divergir das notas da sua Bíblia de Estudo NVT, vale a NVT.
