// Páginas do menu. Preencha com o caminho de cada página quando existirem.
const PAGINAS = {
  problema: "",
  ia: "",
  demonstracao: "",
  // LOGIN: coloque aqui o caminho da pasta/página de login (ex.: "login/index.html")
  login: ""
};

// Sem localização: só espécie, bioma e motivos do risco.
const ESPECIES = [
  {
    id: "sp-001", bioma: "Mata Atlântica", emoji: "🦉",
    nomePopular: "Caburé-de-pernambuco", nomeCientifico: "Glaucidium mooreorum",
    motivos: [
      "Endêmica da Mata Atlântica de Pernambuco, restrita a pouquíssimos fragmentos florestais",
      "Perda histórica de floresta para o cultivo de cana-de-açúcar e para a urbanização",
      "Fragmentos pequenos e isolados, que impedem a dispersão e a formação de novas populações",
      "População muito reduzida, vulnerável a qualquer nova perda de habitat"
    ]
  },
  {
    id: "sp-002", bioma: "Mata Atlântica", emoji: "🐦",
    nomePopular: "Choquinha-de-alagoas", nomeCientifico: "Myrmotherula snowi",
    motivos: [
      "Ave florestal que depende de mata densa e bem conservada",
      "Destruição das matas de altitude do Nordeste para agricultura e pastagem",
      "Distribuição restrita a poucos remanescentes em Pernambuco e Alagoas",
      "Dificuldade de atravessar áreas abertas entre os fragmentos"
    ]
  },
  {
    id: "sp-003", bioma: "Mata Atlântica", emoji: "🐒",
    nomePopular: "Macaco-prego-galego", nomeCientifico: "Sapajus flavius",
    motivos: [
      "Fragmentação da Mata Atlântica do litoral nordestino",
      "Captura de filhotes para criação como animal de estimação",
      "Caça e conflitos em lavouras vizinhas aos remanescentes",
      "Atropelamentos em estradas que cortam os fragmentos"
    ]
  },
  {
    id: "sp-004", bioma: "Caatinga", emoji: "🦔",
    nomePopular: "Tatu-bola", nomeCientifico: "Tolypeutes tricinctus",
    motivos: [
      "Caça de subsistência e esportiva",
      "Conversão da Caatinga em pastagem e lavoura",
      "Reprodução lenta, com um único filhote por vez",
      "Atropelamentos e queimadas em áreas de vegetação aberta"
    ]
  },
  {
    id: "sp-005", bioma: "Caatinga", emoji: "🐆",
    nomePopular: "Onça-pintada", nomeCientifico: "Panthera onca",
    motivos: [
      "Populações da Caatinga pequenas e isoladas",
      "Caça retaliatória por ataques a rebanhos",
      "Redução das presas naturais, como veados e porcos-do-mato",
      "Desmatamento e perda de corredores entre áreas preservadas"
    ]
  },
  {
    id: "sp-006", bioma: "Litoral", emoji: "🌊",
    nomePopular: "Peixe-boi-marinho", nomeCientifico: "Trichechus manatus",
    motivos: [
      "Colisões com embarcações em estuários e canais",
      "Emaranhamento em redes de pesca",
      "Degradação de manguezais e estuários usados para alimentação e reprodução",
      "Histórico de caça e reprodução lenta"
    ]
  },
  {
    id: "sp-007", bioma: "Litoral", emoji: "🐢",
    nomePopular: "Tartaruga-de-pente", nomeCientifico: "Eretmochelys imbricata",
    motivos: [
      "Comércio ilegal do casco para artesanato",
      "Captura acidental em redes e linhas de pesca",
      "Ocupação e iluminação artificial das praias de desova",
      "Lixo plástico e degradação dos recifes de coral que sustentam sua alimentação"
    ]
  }
];

window.addEventListener("DOMContentLoaded", () => {
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let filtro = "Todos";

  function renderStats() {
    const biomas = new Set(ESPECIES.map((s) => s.bioma)).size;
    $("#stats").innerHTML = `
      <div class="stat"><b>${ESPECIES.length}</b><span>espécies ameaçadas cadastradas</span></div>
      <div class="stat"><b>${biomas}</b><span>biomas afetados</span></div>
      <div class="stat"><b>${ESPECIES.reduce((n, s) => n + s.motivos.length, 0)}</b><span>fatores de risco identificados</span></div>`;
  }

  function renderFilters() {
    const biomas = ["Todos", ...new Set(ESPECIES.map((s) => s.bioma))];
    $("#filters").innerHTML = biomas.map((b) =>
      `<button class="chip ${b === filtro ? "on" : ""}" data-b="${esc(b)}">${esc(b)}</button>`).join("");
  }

  function renderCards() {
    $("#grid").innerHTML = ESPECIES.filter((s) => filtro === "Todos" || s.bioma === filtro).map((sp) => `
      <article class="card">
        <div class="thumb" aria-hidden="true">${sp.emoji}</div>
        <div class="card-body">
          <div class="card-top">
            <span class="badge">Em extinção</span>
            <span class="tag">${esc(sp.bioma)}</span>
          </div>
          <h3>${esc(sp.nomePopular)}</h3>
          <div class="sci">${esc(sp.nomeCientifico)}</div>
          <h4 class="reasons-title">Riscos que enfrenta</h4>
          <ul class="reasons">${sp.motivos.map((m) => `<li>${esc(m)}</li>`).join("")}</ul>
        </div>
      </article>`).join("");
  }

  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    filtro = b.dataset.b;
    renderFilters();
    renderCards();
  });

  // Menu
  const toggle = $(".nav-toggle"), menu = $("#menu");
  toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", menu.classList.toggle("open")));

  const toast = $("#toast");
  let toastTimer;
  function aviso(txt) {
    toast.textContent = txt;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
  }

  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-menu]");
    if (!a) return;
    const chave = a.dataset.menu;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");

    if (chave === "especies") {
      e.preventDefault();
      $("#especies").scrollIntoView({ behavior: "smooth" });
    } else if (PAGINAS[chave]) {
      a.href = PAGINAS[chave]; // segue o link configurado em PAGINAS
    } else {
      e.preventDefault();
      aviso(chave === "login"
        ? "O login ainda não foi ligado a este menu (defina PAGINAS.login)."
        : `"${a.textContent}" é outra página do projeto e ainda não foi ligada a este menu.`);
    }
  });

  renderStats();
  renderFilters();
  renderCards();
});