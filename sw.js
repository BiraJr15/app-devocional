// Guarda os arquivos do app para funcionar sem internet.
// Ao mudar qualquer arquivo, aumente a versão do CACHE (ex.: devocional-v2).
// Ao criar um arquivo novo, inclua-o na lista ARQUIVOS (o teste avisa se esquecer).
const CACHE = "devocional-v3";
const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/app.js",
  "./js/ui/diario.js",
  "./js/ui/inicio.js",
  "./js/ui/leitura.js",
  "./js/ui/revisao.js",
  "./js/core/busca.js",
  "./js/core/datas.js",
  "./js/core/duvida.js",
  "./js/core/plano.js",
  "./js/core/progresso.js",
  "./js/core/storage.js",
  "./conteudo/livros.js",
  "./conteudo/mateus.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

// Primeiro o cache; se não tiver, busca na internet.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request)));
});
