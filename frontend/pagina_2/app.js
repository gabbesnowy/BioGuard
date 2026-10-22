javascript
const INFORMATIVOS_URL = "";
const PAGINAS = {
  problema: "",
  ia: "",
  demonstracao: ""
};

const ESPECIES = [
  {
    id: "sp-001", bioma: "Mata Atlântica", emoji: "🦉",
    nomePopular: "Caburé-de-pernambuco", nomeCientifico: "Glaucidium mooreorum",
    motivos: [
      "Endêmica da Mata Atlântica de Pernambuco, restrita a pouquíssimos fragmentos florestais",
      "Perda histórica de floresta para o cultivo de cana-de-açúcar e para a urbanização",
      "Fragmentos pequenos e isolados, que impedem a dispersão e a formação de novas populações",
      "População muito reduzida, vulnerável a qualquer nova perda de habitat"
    ],
    localizacao: {
      ponto: "CT-07",
      local: "Mata do Sirinhaém",
      lat: -8.59,
      lng: -35.11
    },
    placeholder: true
  },

  {
    id: "sp-002", bioma: "Mata Atlântica", emoji: "🐦",
    nomePopular: "Choquinha-de-alagoas", nomeCientifico: "Myrmotherula snowi",
    motivos: [
      "Ave florestal que depende de mata densa e bem conservada",
      "Destruição das matas de altitude do Nordeste para agricultura e pastagem",
      "Distribuição restrita a poucos remanescentes em Pernambuco e Alagoas",
      "Dificuldade de atravessar áreas abertas entre os fragmentos"
    ],
    localizacao: {
      ponto: "CT-15",
      local: "Região de Catende",
      lat: -8.67,
      lng: -35.72
    },
    placeholder: true
  },

  {
    id: "sp-003", bioma: "Mata Atlântica", emoji: "🐒",
    nomePopular: "Macaco-prego-galego", nomeCientifico: "Sapajus flavius",
    motivos: [
      "Fragmentação da Mata Atlântica do litoral nordestino",
      "Captura de filhotes para criação como animal de estimação",
      "Caça e conflitos em lavouras vizinhas aos remanescentes",
      "Atropelamentos em estradas que cortam os fragmentos"
    ],
    localizacao: {
      ponto: "CT-12",
      local: "Reserva do Saltinho (Tamandaré)",
      lat: -8.73,
      lng: -35.18
    },
    placeholder: true
  },

  {
    id: "sp-004", bioma: "Caatinga", emoji: "🦔",
    nomePopular: "Tatu-bola", nomeCientifico: "Tolypeutes tricinctus",
    motivos: [
      "Caça de subsistência e esportiva",
      "Conversão da Caatinga em pastagem e lavoura",
      "Reprodução lenta, com um único filhote por vez",
      "Atropelamentos e queimadas em áreas de vegetação aberta"
    ],
    localizacao: {
      ponto: "CT-21",
      local: "Vale do Catimbau",
      lat: -8.55,
      lng: -37.25
    },
    placeholder: true
  },

  {
    id: "sp-005", bioma: "Caatinga", emoji: "🐆",
    nomePopular: "Onça-pintada", nomeCientifico: "Panthera onca",
    motivos: [
      "Populações da Caatinga pequenas e isoladas",
      "Caça retaliatória por ataques a rebanhos",
      "Redução das presas naturais, como veados e porcos-do-mato",
      "Desmatamento e perda de corredores entre áreas preservadas"
    ],
    localizacao: {
      ponto: "CT-26",
      local: "Serra Talhada",
      lat: -7.99,
      lng: -38.29
    },
    placeholder: true
  },

  {
    id: "sp-006", bioma: "Litoral", emoji: "🌊",
    nomePopular: "Peixe-boi-marinho", nomeCientifico: "Trichechus manatus",
    motivos: [
      "Colisões com embarcações em estuários e canais",
      "Emaranhamento em redes de pesca",
      "Degradação de manguezais e estuários usados para alimentação e reprodução",
      "Histórico de caça e reprodução lenta"
    ],
    localizacao: {
      ponto: "CT-31",
      local: "Canal de Santa Cruz (Itamaracá)",
      lat: -7.75,
      lng: -34.83
    },
    placeholder: true
  },

  {
    id: "sp-007", bioma: "Litoral", emoji: "🐢",
    nomePopular: "Tartaruga-de-pente", nomeCientifico: "Eretmochelys imbricata",
    motivos: [
      "Comércio ilegal do casco para artesanato",
      "Captura acidental em redes e linhas de pesca",
      "Ocupação e iluminação artificial das praias de desova",
      "Lixo plástico e degradação dos recifes de coral que sustentam sua alimentação"
    ],
    localizacao: {
      ponto: "CT-34",
      local: "Praia de Porto de Galinhas (Ipojuca)",
      lat: -8.51,
      lng: -35.03
    },
    placeholder: true
  }
];


const INFORMATIVOS = [
  {
    titulo: "Caburé-de-pernambuco",
    texto: "Espécie endêmica de Pernambuco, entre as mais ameaçadas do estado.",
    minutosAtras: 4,
    placeholder: true
  },

  {
    titulo: "Litoral",
    texto: "Período de desova de tartarugas marinhas: evite iluminar as praias à noite.",
    minutosAtras: 38,
    placeholder: true
  },

  {
    titulo: "Caatinga",
    texto: "Queimadas e caça seguem entre as principais pressões sobre o tatu-bola.",
    minutosAtras: 125,
    placeholder: true
  }
];


// ============================================================
// MAPA DE PERNAMBUCO
// ============================================================

let PE_GEO = [];

const PE_GEO_URL =
  "https://raw.githubusercontent.com/gfosena/geodata-br/master/geojson/geojs-26-mun.json";


window.addEventListener("DOMContentLoaded", async () => {

  try {

    const respostaGeo = await fetch(
      PE_GEO_URL,
      {
        cache: "no-store"
      }
    );

    if (!respostaGeo.ok) {
      throw new Error(`HTTP ${respostaGeo.status}`);
    }

    const geojson = await respostaGeo.json();

    PE_GEO = geojson.features.map((feature) => {

      const nome =
        feature.properties?.name ||
        feature.properties?.description ||
        "Município";

      const geometry = feature.geometry;

      if (!geometry) {
        return [nome, []];
      }

      if (geometry.type === "Polygon") {
        return [nome, geometry.coordinates];
      }

      if (geometry.type === "MultiPolygon") {
        return [
          nome,
          geometry.coordinates.flat()
        ];
      }

      return [nome, []];

    });

  } catch (erro) {

    console.error(
      "Não foi possível carregar o mapa de Pernambuco:",
      erro
    );

    const stage = document.querySelector("#stage");

    if (stage) {

      const avisoMapa =
        document.createElement("p");

      avisoMapa.className =
        "map-error";

      avisoMapa.textContent =
        "Não foi possível carregar os limites dos municípios. Verifique sua conexão com a internet.";

      stage.prepend(avisoMapa);
    }

    return;
  }


  // ============================================================
  // FUNÇÕES AUXILIARES
  // ============================================================

  const $ = (s) =>
    document.querySelector(s);


  const esc = (v) =>
    String(v).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[c])
    );


  const NS =
    "http://www.w3.org/2000/svg";


  // ============================================================
  // LIMITES DO MAPA
  // ============================================================

  const all =
    PE_GEO.flatMap(
      ([, rings]) => rings.flat()
    );


  const LON0 =
    Math.min(
      ...all.map((p) => p[0])
    );


  const LAT1 =
    Math.max(
      ...all.map((p) => p[1])
    );


  const LON1 =
    Math.max(
      ...all.map((p) => p[0])
    );


  const LAT0 =
    Math.min(
      ...all.map((p) => p[1])
    );


  const KX =
    Math.cos(
      ((LAT0 + LAT1) / 2) *
      Math.PI / 180
    ) * 100;


  const px = (lon) =>
    (lon - LON0) * KX + 10;


  const py = (lat) =>
    (LAT1 - lat) * 100 + 10;


  const BASE = {
    x: 0,
    y: 0,
    w: (LON1 - LON0) * KX + 20,
    h: (LAT1 - LAT0) * 100 + 20
  };


  let view = {
    ...BASE
  };


  // ============================================================
  // VERIFICAR MUNICÍPIO
  // ============================================================

  function inRing(lon, lat, ring) {

    let c = false;

    for (
      let i = 0, j = ring.length - 1;
      i < ring.length;
      j = i++
    ) {

      const [xi, yi] =
        ring[i];

      const [xj, yj] =
        ring[j];

      if (
        (yi > lat) !== (yj > lat) &&
        lon <
        ((xj - xi) *
          (lat - yi)) /
          (yj - yi) +
          xi
      ) {

        c = !c;

      }

    }

    return c;
  }


  const municipioDe =
    (lon, lat) => {

      return (
        PE_GEO.find(
          ([, rings]) =>
            rings.some(
              (r) =>
                inRing(
                  lon,
                  lat,
                  r
                )
            )
        ) || []
      )[0] || null;

    };


  ESPECIES.forEach(
    (sp) => {

      sp.municipio =
        municipioDe(
          sp.localizacao.lng,
          sp.localizacao.lat
        );

    }
  );


  const comRegistro =
    new Set(
      ESPECIES
        .map(
          (s) =>
            s.municipio
        )
        .filter(Boolean)
    );


  // ============================================================
  // DESENHAR MAPA
  // ============================================================

  const pathD =
    (rings) =>

      rings
        .map(
          (r) =>
            "M" +
            r
              .map(
                ([x, y]) =>
                  px(x).toFixed(1) +
                  " " +
                  py(y).toFixed(1)
              )
              .join("L") +
            "Z"
        )
        .join("");


  const CIDADES = [

    [
      "Recife",
      -8.05,
      -34.88
    ],

    [
      "Caruaru",
      -8.28,
      -35.97
    ],

    [
      "Garanhuns",
      -8.89,
      -36.49
    ],

    [
      "Serra Talhada",
      -7.99,
      -38.29
    ],

    [
      "Petrolina",
      -9.39,
      -40.5
    ]

  ];


  const svg =
    document.createElementNS(
      NS,
      "svg"
    );


  svg.setAttribute(
    "role",
    "img"
  );


  svg.setAttribute(
    "aria-label",
    "Mapa interativo de Pernambuco com a localização de espécies ameaçadas cadastradas"
  );


  svg.innerHTML =

    `<g id="muns">${
      PE_GEO
        .map(
          ([n, r], i) =>
            `<path
              data-i="${i}"
              class="mun${
                comRegistro.has(n)
                  ? " has"
                  : ""
              }"
              d="${pathD(r)}"
            />`
        )
        .join("")
    }</g>` +


    `<g id="refs">${
      CIDADES
        .map(
          ([n, la, lo]) =>
            `<g class="ref">
              <circle
                cx="${px(lo)}"
                cy="${py(la)}"
                r="1.1"
              />
              <text
                x="${px(lo) + 2.5}"
                y="${py(la) + 1.2}"
              >
                ${n}
              </text>
            </g>`
        )
        .join("")
    }</g>` +


    `<g id="pins"></g>`;


  $("#stage").prepend(svg);


  // ============================================================
  // TOOLTIP
  // ============================================================

  const tip =
    $("#tip");


  const showTip =
    (e, txt) => {

      const b =
        $("#stage")
          .getBoundingClientRect();

      tip.textContent =
        txt;

      tip.style.left =
        e.clientX -
        b.left +
        12 +
        "px";

      tip.style.top =
        e.clientY -
        b.top +
        12 +
        "px";

      tip.hidden = false;

    };


  // ============================================================
  // ZOOM
  // ============================================================

  function applyView() {

    view.w =
      Math.min(
        BASE.w,
        Math.max(
          BASE.w / 12,
          view.w
        )
      );


    view.h =
      view.w *
      (BASE.h / BASE.w);


    view.x =
      Math.min(
        BASE.x +
        BASE.w -
        view.w,

        Math.max(
          BASE.x,
          view.x
        )
      );


    view.y =
      Math.min(
        BASE.y +
        BASE.h -
        view.h,

        Math.max(
          BASE.y,
          view.y
        )
      );


    svg.setAttribute(
      "viewBox",
      `${view.x} ${view.y} ${view.w} ${view.h}`
    );


    const s =
      view.w / BASE.w;


    svg.style.setProperty(
      "--s",
      s
    );


    svg.style.touchAction =
      s < 0.99
        ? "none"
        : "pan-y";

  }


  function zoomAt(
    f,
    cx,
    cy
  ) {

    const nw =
      view.w * f;


    view.x =
      cx -
      (cx - view.x) *
      (nw / view.w);


    view.y =
      cy -
      (cy - view.y) *
      (nw / view.w);


    view.w =
      nw;


    applyView();

  }


  const toSvg =
    (e) => {

      const b =
        svg.getBoundingClientRect();


      return [

        view.x +
          ((e.clientX - b.left) /
            b.width) *
            view.w,

        view.y +
          ((e.clientY - b.top) /
            b.height) *
            view.h

      ];

    };


  const focusOn =
    (lon, lat, w) => {

      view.w = w;

      view.h =
        w *
        (BASE.h / BASE.w);

      view.x =
        px(lon) -
        view.w / 2;

      view.y =
        py(lat) -
        view.h / 2;

      applyView();

    };


  const resetView =
    () => {

      view = {
        ...BASE
      };

      applyView();

    };


  // ============================================================
  // ARRASTAR MAPA
  // ============================================================

  let active = false;
  let drag = null;
  let moved = false;


  svg.addEventListener(
    "pointerdown",
    (e) => {

      active = true;

      moved = false;

      drag = {
        x: e.clientX,
        y: e.clientY,
        vx: view.x,
        vy: view.y
      };

    }
  );


  window.addEventListener(
    "pointermove",
    (e) => {

      if (!drag) return;

      const b =
        svg.getBoundingClientRect();


      if (
        Math.abs(
          e.clientX -
          drag.x
        ) +
        Math.abs(
          e.clientY -
          drag.y
        ) > 4
      ) {

        moved = true;

      }


      if (moved) {

        view.x =
          drag.vx -
          ((e.clientX -
            drag.x) /
            b.width) *
            view.w;


        view.y =
          drag.vy -
          ((e.clientY -
            drag.y) /
            b.height) *
            view.h;


        applyView();

      }

    }
  );


  window.addEventListener(
    "pointerup",
    () => {

      drag = null;

    }
  );


  $("#stage")
    .addEventListener(
      "mouseleave",
      () => {

        active = false;

        tip.hidden = true;

      }
    );


  svg.addEventListener(
    "wheel",
    (e) => {

      if (!active) return;

      e.preventDefault();

      const [
        cx,
        cy
      ] = toSvg(e);


      zoomAt(
        e.deltaY < 0
          ? 0.8
          : 1.25,
        cx,
        cy
      );

    },
    {
      passive: false
    }
  );


  $("#zin").onclick =
    () =>
      zoomAt(
        0.65,
        view.x +
          view.w / 2,
        view.y +
          view.h / 2
      );


  $("#zout").onclick =
    () =>
      zoomAt(
        1.5,
        view.x +
          view.w / 2,
        view.y +
          view.h / 2
      );


  $("#zreset").onclick =
    resetView;


  // ============================================================
  // TOOLTIP DO MAPA
  // ============================================================

  svg.addEventListener(
    "mousemove",
    (e) => {

      const p =
        e.target.closest(
          ".pin"
        );


      const m =
        e.target.closest(
          ".mun"
        );


      if (p) {

        const especie =
          ESPECIES.find(
            (s) =>
              s.id ===
              p.dataset.id
          );


        if (especie) {

          showTip(
            e,
            especie.nomePopular
          );

        }

      }

      else if (m) {

        showTip(
          e,
          PE_GEO[
            m.dataset.i
          ][0]
        );

      }

      else {

        tip.hidden = true;

      }

    }
  );


  svg.addEventListener(
    "mouseleave",
    () => {

      tip.hidden = true;

    }
  );


  // ============================================================
  // FILTROS
  // ============================================================

  let filtro = "Todos";
  let selecionada = null;


  const motivosHTML =
    (sp) =>

      `<ul class="reasons">${
        sp.motivos
          .map(
            (m) =>
              `<li>${esc(m)}</li>`
          )
          .join("")
      }</ul>`;


  const whereHTML =
    (sp) =>

      `<div class="where">
        <b>
          ${esc(
            sp.localizacao.local
          )}
        </b>

        · ponto
        ${esc(
          sp.localizacao.ponto
        )}

        ${
          sp.municipio
            ? `<br>
               Município:
               ${esc(
                 sp.municipio
               )}`
            : ""
        }

        <br>

        ${sp.localizacao.lat.toFixed(
          2
        )},

        ${sp.localizacao.lng.toFixed(
          2
        )}

      </div>`;


  // ============================================================
  // PINOS
  // ============================================================

  function drawPins() {

    $("#pins").innerHTML =

      ESPECIES

        .filter(
          (s) =>
            filtro === "Todos" ||
            s.bioma === filtro
        )

        .map(
          (sp) =>

            `<g
              class="pin${
                sp.id === selecionada
                  ? " sel"
                  : ""
              }"
              data-id="${esc(
                sp.id
              )}"
              transform="translate(
                ${px(
                  sp.localizacao.lng
                ).toFixed(1)}
                ${py(
                  sp.localizacao.lat
                ).toFixed(1)}
              )"
              tabindex="0"
              role="button"
              aria-label="${esc(
                sp.nomePopular
              )}"
            >

              <circle
                class="halo"
                r="5"
              />

              <circle
                class="core"
                r="2.6"
              />

            </g>`

        )

        .join("");

  }


  // ============================================================
  // SELECIONAR ESPÉCIE
  // ============================================================

  function select(
    id,
    zoom
  ) {

    selecionada = id;


    const sp =
      ESPECIES.find(
        (s) =>
          s.id === id
      );


    if (!sp) return;


    $("#panel").innerHTML = `

      <span class="tag">
        ${esc(sp.bioma)}
      </span>

      <h3>
        ${esc(
          sp.nomePopular
        )}
      </h3>

      <div class="sci">
        ${esc(
          sp.nomeCientifico
        )}
      </div>

      ${whereHTML(sp)}

      ${
        sp.placeholder
          ? '<span class="ex">LOCALIZAÇÃO DE EXEMPLO</span>'
          : ""
      }

      <h4>
        Motivos do risco de extinção
      </h4>

      ${motivosHTML(sp)}

    `;


    drawPins();


    if (zoom) {

      focusOn(
        sp.localizacao.lng,
        sp.localizacao.lat,
        BASE.w / 5
      );

    }

  }


  // ============================================================
  // CARDS
  // ============================================================

  function renderCards() {

    $("#grid").innerHTML =

      ESPECIES

        .filter(
          (s) =>
            filtro === "Todos" ||
            s.bioma === filtro
        )

        .map(
          (sp) =>

            `<article class="card">

              <div
                class="thumb"
                aria-hidden="true"
              >
                ${sp.emoji}
              </div>

              <div class="card-body">

                <span class="tag">
                  ${esc(
                    sp.bioma
                  )}
                </span>

                <h3>
                  ${esc(
                    sp.nomePopular
                  )}
                </h3>

                <div class="sci">
                  ${esc(
                    sp.nomeCientifico
                  )}
                </div>

                ${whereHTML(sp)}

                ${motivosHTML(sp)}

                <button
                  class="locate"
                  data-id="${esc(
                    sp.id
                  )}"
                >
                  Ver no mapa
                </button>

              </div>

            </article>`

        )

        .join("");

  }


  // ============================================================
  // FILTROS
  // ============================================================

  function renderFilters() {

    const biomas = [
      "Todos",
      ...new Set(
        ESPECIES.map(
          (s) =>
            s.bioma
        )
      )
    ];


    $("#filters").innerHTML =

      biomas

        .map(
          (b) =>

            `<button
              class="chip ${
                b === filtro
                  ? "on"
                  : ""
              }"
              data-b="${esc(b)}"
            >
              ${esc(b)}
            </button>`

        )

        .join("");

  }


  $("#filters")
    .addEventListener(
      "click",
      (e) => {

        const b =
          e.target.closest(
            ".chip"
          );


        if (!b) return;


        filtro =
          b.dataset.b;


        renderFilters();

        renderCards();

        resetView();

        drawPins();

      }
    );


  $("#pins")
    .addEventListener(
      "click",
      (e) => {

        const p =
          e.target.closest(
            ".pin"
          );


        if (
          p &&
          !moved
        ) {

          select(
            p.dataset.id,
            false
          );

        }

      }
    );


  $("#pins")
    .addEventListener(
      "keydown",
      (e) => {

        if (
          e.key === "Enter"
        ) {

          const p =
            e.target.closest(
              ".pin"
            );


          if (p) {

            select(
              p.dataset.id,
              false
            );

          }

        }

      }
    );


  $("#grid")
    .addEventListener(
      "click",
      (e) => {

        const b =
          e.target.closest(
            ".locate"
          );


        if (!b) return;


        $("#mapa")
          .scrollIntoView({
            behavior: "smooth"
          });


        select(
          b.dataset.id,
          true
        );

      }
    );


  // ============================================================
  // MENU
  // ============================================================

  const toggle =
    $(".nav-toggle");

  const menu =
    $("#menu");


  toggle.addEventListener(
    "click",
    () =>
      toggle.setAttribute(
        "aria-expanded",
        menu.classList.toggle(
          "open"
        )
      )
  );


  // ============================================================
  // AVISOS
  // ============================================================

  const toast =
    $("#toast");

  let toastTimer;


  function aviso(txt) {

    toast.textContent =
      txt;

    toast.hidden =
      false;

    clearTimeout(
      toastTimer
    );


    toastTimer =
      setTimeout(
        () => {

          toast.hidden =
            true;

        },
        4000
      );

  }


  const links =
    [
      ...menu.querySelectorAll(
        "a[data-menu]"
      )
    ];


  const secoes = {

    mapa:
      $("#mapa"),

    especies:
      $("#especies")

  };


  let travado = false;

  let travaTimer;

  let raf;


  function marcar(chave) {

    links.forEach(
      (l) => {

        const on =
          l.dataset.menu ===
          chave;


        l.classList.toggle(
          "active",
          on
        );


        if (on) {

          l.setAttribute(
            "aria-current",
            "page"
          );

        }

        else {

          l.removeAttribute(
            "aria-current"
          );

        }

      }
    );

  }


  function destacar(chave) {

    const t =
      secoes[
        chave
      ].querySelector(
        ".h2"
      );


    t.classList.remove(
      "destaque"
    );


    void t.offsetWidth;


    t.classList.add(
      "destaque"
    );

  }


  function atualizarMenu() {

    if (travado) return;


    const linha =
      window.innerHeight *
      0.35;


    const m =
      secoes.mapa
        .getBoundingClientRect();


    marcar(
      m.top <= linha &&
      m.bottom > linha
        ? "mapa"
        : "especies"
    );

  }


  window.addEventListener(
    "scroll",
    () => {

      cancelAnimationFrame(
        raf
      );


      raf =
        requestAnimationFrame(
          atualizarMenu
        );

    },
    {
      passive: true
    }
  );


  menu.addEventListener(
    "click",
    (e) => {

      const a =
        e.target.closest(
          "a[data-menu]"
        );


      if (!a) return;


      const chave =
        a.dataset.menu;


      menu.classList.remove(
        "open"
      );


      toggle.setAttribute(
        "aria-expanded",
        "false"
      );


      if (
        secoes[chave]
      ) {

        e.preventDefault();

        marcar(chave);

        travado = true;

        clearTimeout(
          travaTimer
        );


        secoes[chave]
          .scrollIntoView({
            behavior:
              "smooth"
          });


        destacar(
          chave
        );


        travaTimer =
          setTimeout(
            () => {

              travado =
                false;

              atualizarMenu();

            },
            900
          );

      }

      else if (
        PAGINAS[chave]
      ) {

        a.href =
          PAGINAS[chave];

      }

      else {

        e.preventDefault();

        aviso(
          `"${a.textContent}" é outra página do projeto e ainda não foi ligada a este menu.`
        );

      }

    }
  );


  // ============================================================
  // INFORMATIVOS
  // ============================================================

  const news = [];


  function ago(ts) {

    const m =
      Math.max(
        0,
        Math.round(
          (Date.now() - ts) /
          60000
        )
      );


    if (m < 1)
      return "agora";


    if (m < 60)
      return `há ${m} min`;


    const h =
      Math.floor(
        m / 60
      );


    return h < 24
      ? `há ${h} h`
      : `há ${Math.floor(
          h / 24
        )} d`;

  }


  function renderNews() {

    $("#news").innerHTML =

      [
        ...news
      ]

        .sort(
          (a, b) =>
            b.ts - a.ts
        )

        .slice(0, 6)

        .map(
          (n) =>

            `<li>

              <span class="when">
                ${ago(n.ts)}
              </span>

              <div>

                <span class="t">
                  ${esc(
                    n.titulo
                  )}
                </span>

                ${
                  n.placeholder
                    ? '<span class="ex">EXEMPLO</span>'
                    : ""
                }

                <div class="d">
                  ${esc(
                    n.texto
                  )}
                </div>

              </div>

            </li>`

        )

        .join("");

  }


  // ============================================================
  // RELÓGIO
  // ============================================================

  const tickClock =
    () => {

      $("#clock").textContent =
        new Date()
          .toLocaleString(
            "pt-BR",
            {
              dateStyle:
                "short",

              timeStyle:
                "medium"
            }
          );

    };


  // ============================================================
  // NOTÍCIAS
  // ============================================================

  async function pollNews() {

    if (
      !INFORMATIVOS_URL
    )
      return;


    try {

      const items =
        await (
          await fetch(
            INFORMATIVOS_URL,
            {
              cache:
                "no-store"
            }
          )
        ).json();


      news.length =
        0;


      items.forEach(
        (i) =>

          news.push({
            titulo:
              i.titulo,

            texto:
              i.texto,

            ts:
              Date.parse(
                i.publicadoEm
              ) ||
              Date.now()
          })

      );


      renderNews();

    }

    catch (e) {

      console.error(
        "Erro ao carregar informativos:",
        e
      );

    }

  }


  // ============================================================
  // INICIALIZAÇÃO
  // ============================================================

  $("#placeholder-note").hidden =
    !ESPECIES.some(
      (s) =>
        s.placeholder
    );


  applyView();

  renderFilters();

  renderCards();

  drawPins();


  INFORMATIVOS.forEach(
    (i) =>

      news.push({
        ...i,

        ts:
          Date.now() -
          i.minutosAtras *
            60000
      })
  );


  renderNews();

  tickClock();


  setInterval(
    tickClock,
    1000
  );


  setInterval(
    renderNews,
    30000
  );


  pollNews();


  if (
    INFORMATIVOS_URL
  ) {

    setInterval(
      pollNews,
      60000
    );

  }

});