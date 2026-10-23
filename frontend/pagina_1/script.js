/* Status: Lista Nacional (MMA/ICMBio). */
const ANIMAIS = [
  {
    nome: "Caburé-de-pernambuco", sci: "Glaucidium mooreorum", nivel: "CR",
    desc: "Coruja endêmica dos últimos fragmentos da Mata Atlântica no litoral sul de Pernambuco. Sem registro confirmado há anos; a busca acústica tenta descobrir se a espécie ainda existe.",
    ameacas: "Destruição da Mata Atlântica e população minúscula"
  },
  {
    nome: "Choquinha-de-alagoas", sci: "Myrmotherula snowi", nivel: "CR",
    desc: "Pequena ave restrita a matas de altitude na divisa de Alagoas e Pernambuco. A fragmentação extrema da floresta deixou populações isoladas e extremamente reduzidas.",
    ameacas: "Fragmentação extrema da floresta"
  },
  {
    nome: "Peixe-boi-marinho", sci: "Trichechus manatus", nivel: "CR",
    desc: "Mamífero aquático dos estuários e do litoral norte, como Itamaracá (PE). Assoreamento, colisão com embarcações e redes de pesca mantêm a população sob risco muito alto.",
    ameacas: "Colisão com barcos, redes de pesca e assoreamento",
    nota: "A Portaria de 2022 o listava como Em Perigo (EN); notícia do MPF de agosto de 2026 informa que o MMA passou a classificá-lo como Criticamente em Perigo."
  },
  {
    nome: "Tartaruga-de-pente", sci: "Eretmochelys imbricata", nivel: "CR",
    desc: "Tartaruga marinha de casco ornamentado; desova em Ipojuca, no litoral sul e em Fernando de Noronha. Ocupação da orla, luz artificial, pesca acidental e o comércio de carapaças a colocam em risco crítico.",
    ameacas: "Ocupação da orla, luz artificial, pesca acidental e comércio de carapaças"
  },
  {
    nome: "Macaco-prego-galego", sci: "Sapajus flavius", nivel: "EN",
    desc: "Primata endêmico dos fragmentos da Mata Atlântica nordestina, inclusive na Zona da Mata de Pernambuco. Sofre com perda de habitat, caça e tráfico de animais silvestres.",
    ameacas: "Perda de habitat, caça e tráfico"
  },
  {
    nome: "Tatu-bola", sci: "Tolypeutes tricinctus", nivel: "EN",
    desc: "Tatu-de-três-bandas endêmico da Caatinga, presente no Sertão e no Agreste. Enrolar-se em bola não o protege da caça nem do desmatamento do único bioma exclusivamente brasileiro.",
    ameacas: "Caça e desmatamento da Caatinga"
  },
  {
    nome: "Onça-pintada", sci: "Panthera onca", nivel: "VU",
    desc: "Maior felino das Américas; no Brasil está vulnerável pela perda de habitat, atropelamentos e conflito com a pecuária. Ainda ocorre em áreas contínuas da Amazônia, Pantanal e alguns remanescentes da Mata Atlântica.",
    ameacas: "Perda de habitat, atropelamentos e conflito com a pecuária"
  }
];

const ROTULO = { CR: "Criticamente em Perigo", EN: "Em Perigo", VU: "Vulnerável" };
const RISCO = {
  CR: { pct: 90, txt: "Risco extremamente alto de extinção na natureza." },
  EN: { pct: 70, txt: "Risco muito alto de extinção na natureza." },
  VU: { pct: 50, txt: "Risco alto de extinção na natureza a médio prazo." }
};
const ORDEM = { CR: 0, EN: 1, VU: 2 };

const grade = document.getElementById("grade");
const busca = document.getElementById("busca");
const nivel = document.getElementById("nivel");
const contador = document.getElementById("contador");
const vazio = document.getElementById("vazio");
const resumo = document.getElementById("resumo");

const normalizar = (texto) =>
  texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

function renderizarResumo() {
  resumo.innerHTML = ["CR", "EN", "VU"].map((k) => {
    const n = ANIMAIS.filter((a) => a.nivel === k).length;
    return `<div class="sum ${k}"><b>${n}</b><span>${ROTULO[k]} (${k})</span></div>`;
  }).join("");
}

function filtrar() {
  const termo = normalizar(busca.value.trim());
  const categoria = nivel.value;
  return ANIMAIS
    .filter((animal) => {
      const nomeOk = !termo || normalizar(animal.nome).includes(termo) || normalizar(animal.sci).includes(termo);
      const nivelOk = categoria === "todos" || animal.nivel === categoria;
      return nomeOk && nivelOk;
    })
    .sort((a, b) => ORDEM[a.nivel] - ORDEM[b.nivel] || a.nome.localeCompare(b.nome, "pt-BR"));
}

function renderizar() {
  const lista = filtrar();
  grade.replaceChildren();

  lista.forEach((animal) => {
    const id = "a-" + animal.sci.replace(/\s/g, "-");
    const r = RISCO[animal.nivel];
    const item = document.createElement("li");
    item.innerHTML = `
      <article class="sp" aria-labelledby="${id}">
        <div class="top">
          <h3 id="${id}">${animal.nome}</h3>
          <p class="badge b-${animal.nivel}">${ROTULO[animal.nivel]}</p>
        </div>
        <p class="sci">${animal.sci}</p>
        <p>${animal.desc}</p>
        <div class="meter" role="img" aria-label="Risco de extinção: ${ROTULO[animal.nivel]}">
          <div class="lbl"><span>Risco de extinção</span><span>${animal.nivel}</span></div>
          <div class="track"><div class="fill ${animal.nivel}" style="width:${r.pct}%"></div></div>
        </div>
        <p class="risco"><b>${r.txt}</b> Principais ameaças: ${animal.ameacas}.</p>
        ${animal.nota ? `<p class="risco">${animal.nota}</p>` : ""}
      </article>
    `;
    grade.append(item);
  });

  const n = lista.length;
  contador.textContent = n === 1 ? "1 espécie" : `${n} espécies`;
  vazio.hidden = n !== 0;
}

document.getElementById("filtros").addEventListener("submit", (e) => e.preventDefault());
busca.addEventListener("input", renderizar);
nivel.addEventListener("change", renderizar);
renderizarResumo();
renderizar();