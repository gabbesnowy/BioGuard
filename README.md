# BioGuard

**Inteligência artificial para ajudar o IBAMA a localizar animais ameaçados de extinção em Pernambuco.**

Projeto acadêmico desenvolvido para apresentação no evento IDEATHON. O site mostra de forma interativa, como câmeras, gravadores de som, drones e satélites combinados com IA podem indicar onde estão as espécies ameaçadas do estado e onde a fiscalização deve agir primeiro.

> Projeto conceitual, sem vínculo oficial com o IBAMA ou o ICMBio. O mapa é esquemático e as detecções exibidas são simuladas.

---

## Acesse o site

🔗 **https://github.com/gabbesnowy/BioGuard/**

---

## O problema

Pernambuco reúne quatro ambientes muito diferentes: **Mata Atlântica**, **Caatinga**, **litoral** e o arquipélago de **Fernando de Noronha**. Cada um abriga espécies ameaçadas, e monitorar tudo isso a pé é lento e caro.

- O **IBAMA** atua na fiscalização ambiental, no combate ao tráfico de animais silvestres e no recebimento de animais apreendidos (CETAS).
- O **ICMBio** cuida das unidades de conservação e dos planos de ação para espécies ameaçadas.

A proposta do BioGuard é dar a essas equipes uma ferramenta que diga **onde olhar primeiro**.

## Como a IA ajuda

| Etapa | O que acontece | Tecnologias |
|---|---|---|
| **1. Coletar** | Sensores registram a mata dia e noite | Armadilhas fotográficas, gravadores, drones, satélite |
| **2. Detectar** | A IA descarta fotos vazias e identifica a espécie pela imagem ou pelo som | Visão computacional, bioacústica |
| **3. Mapear** | As detecções viram pontos no mapa e modelos preveem onde a espécie ainda pode estar | Modelos de distribuição, sensoriamento remoto |
| **4. Agir** | Áreas com espécie ameaçada e sinal de desmatamento viram prioridade de fiscalização | Painel de alertas |

## Funcionalidades do site

- **Armadilha fotográfica animada** na abertura, com detecção automática do animal.
- **Mapa interativo de Pernambuco** com as regiões (Sertão, Agreste, Zona da Mata e Noronha) e os pontos de ocorrência de cada espécie.
- **Feed de detecções em tempo real** (simulado), que encaminha para revisão humana os registros com confiança baixa.
- **Fichas de 8 espécies ameaçadas**, com filtro por ambiente.
- **Demonstração do classificador**: o usuário escolhe uma captura noturna e vê a IA localizar o animal e estimar a probabilidade de cada espécie.
- **Tema claro e escuro** automático e layout adaptado para celular.

## Espécies apresentadas

| Espécie | Nome científico | Categoria | Ambiente |
|---|---|---|---|
| Macaco-prego-galego | *Sapajus flavius* | EN | Mata Atlântica |
| Tartaruga-de-pente | *Eretmochelys imbricata* | CR | Litoral e mar |
| Peixe-boi-marinho | *Trichechus manatus* | EN | Litoral e mar |
| Mero | *Epinephelus itajara* | CR | Litoral e mar |
| Tatu-bola | *Tolypeutes tricinctus* | EN | Caatinga |
| Choquinha-de-alagoas | *Myrmotherula snowi* | CR | Mata Atlântica |
| Caburé-de-pernambuco | *Glaucidium mooreorum* | CR | Mata Atlântica |
| Gato-maracajá | *Leopardus wiedii* | VU | Mata Atlântica |

**CR** = Criticamente em perigo · **EN** = Em perigo · **VU** = Vulnerável
Categorias com base na Lista Nacional de Espécies Ameaçadas (Portaria MMA nº 148/2022).

## Tecnologias utilizadas

- **HTML5**: estrutura e conteúdo das seções
- **CSS3**: layout com Grid e Flexbox, variáveis de cor, tema escuro e design responsivo
- **JavaScript**: mapa em SVG, feed de detecções, fichas das espécies e desenho das cenas da armadilha fotográfica em Canvas

Nenhuma biblioteca externa é usada. As fontes vêm do Google Fonts (Anybody, Public Sans e JetBrains Mono).

## Estrutura do projeto

```
bioguard/
├── index.html   # estrutura e conteúdo do site
├── style.css    # estilos, cores e responsividade
├── script.js    # mapa, feed, fichas e demonstração da IA
└── README.md    # este arquivo
```

## Referências

- [SALVE / ICMBio](https://salve.icmbio.gov.br/): Sistema de Avaliação do Risco de Extinção da Biodiversidade
- [MegaDetector](https://github.com/agentmorris/MegaDetector): IA para detectar animais em armadilhas fotográficas
- [Wildlife Insights](https://www.wildlifeinsights.org/): plataforma de análise de imagens de fauna
- [BirdNET](https://birdnet.cornell.edu/): identificação de aves pelo canto (Cornell Lab of Ornithology)
- [MapBiomas Alerta](https://alerta.mapbiomas.org/): alertas de desmatamento por satélite
- [Projeto Tamar](https://www.tamar.org.br/): conservação de tartarugas marinhas

## Autor

1. Arthur Moraes de Souza  (01866154)
2. Leonardo Ibrahim (01773992) S.I
3. Ana Gabriela Ferreira de Souza (01888284) C.C
4. Fábio Renan Gomes Lourenço da Silva (01877026) SI
5. João Victor barros vila nova (01895901) C.C
6. Carlos Eduardo de Vasconcelos Luis (01904246) C.C
7. Diego Bulhões de Assis (11030139) ADS
8. Daniel veiga Fernandes da luz (01943991) ADS
9. ⁠Richarlyson Lucas Xavier de Araujo Melo (01887842) ADS
