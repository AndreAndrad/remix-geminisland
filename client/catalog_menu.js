// Interactive Construction Menu Controller (15 categories in Portuguese, 76 presets)
// Features live animated 3D voxel & villager previews rendered via ONE shared offscreen WebGLRenderer
// (0% GPU/CPU when closed) and 1-click selection straight into continuous map placement.

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildCreationGroup } from "./voxel/vox.js";
import { buildVillagerRig } from "./voxel/villagers.js";
import BUNDLED_CATALOG_ITEMS from "./catalog_data.json";

export const CATALOG_CATEGORIES = [
  {
    id: "predio",
    label: "Prédio",
    summary: "Escolha um tipo de prédio e clique no mapa para construir quantos quiser.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="10" height="18" rx="1.5"/><path d="M14 9h6v12h-6"/><path d="M7 7h1m3 0h1M7 11h1m3 0h1M7 15h1m3 0h1M17 13h1m-1 4h1"/></svg>`,
    items: [
      {
        id: "predio-residencial",
        name: "Edifício Residencial",
        description: "Prédio moderno com sacadas envidraçadas, jardins e cobertura.",
        meta: "Prédio · Grande",
        previewHint: "building",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "predio-comercial",
        name: "Torre Comercial",
        description: "Torre espelhada de vidro azul e aço com cobertura iluminada e antena.",
        meta: "Prédio · Grande",
        previewHint: "building",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "predio-torre-ouro",
        name: "Torre Cristal & Ouro",
        description: "Arranha-céu contemporâneo de fachada de vidro, frisos dourados e farol.",
        meta: "Prédio · Animado · Grande",
        previewHint: "building",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "predio-mirante-giratorio",
        name: "Torre Mirante Giratória",
        description: "Arranha-céu sofisticado com restaurante panorâmico giratório no topo.",
        meta: "Prédio · Animado · Grande",
        previewHint: "building",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "predio-hotel-luxo",
        name: "Grand Hotel Boutique",
        description: "Hotel art-déco creme e dourado com toldo, piscina e estrela giratória.",
        meta: "Prédio · Animado · Grande",
        previewHint: "building",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "predio-ecotorre",
        name: "Eco-Torre Sustentável",
        description: "Torre futurista com jardins suspensos e turbinas eólicas giratórias.",
        meta: "Prédio · Animado · Grande",
        previewHint: "building",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "predio-relogio-central",
        name: "Edifício do Relógio",
        description: "Torre clássica europeia com cúpula de cobre e ponteiros giratórios.",
        meta: "Prédio · Animado · Grande",
        previewHint: "building",
        isRoad: false,
        kind: "creation",
      },
    ],
  },
  {
    id: "casa",
    label: "Casa",
    summary: "Escolha o estilo de casa e clique no mapa onde quiser adicionar.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h14V9.5"/><path d="M9.5 20v-6h5v6"/></svg>`,
    items: [
      {
        id: "casa-campo",
        name: "Casa de Campo",
        description: "Residência acolhedora com telhado cerâmico, varanda e jardim florido.",
        meta: "Casa · Médio",
        previewHint: "house",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "casa-moderna",
        name: "Sobrado Moderno",
        description: "Arquitetura contemporânea com painéis de vidro, pergolado e jardim.",
        meta: "Casa · Médio",
        previewHint: "house",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "casa-villa-jardim",
        name: "Villa Contemporânea",
        description: "Casa de alto padrão em concreto, madeira ripada, piscina e paisagismo.",
        meta: "Casa · Grande",
        previewHint: "house",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "casa-chale",
        name: "Chalé de Madeira",
        description: "Chalé alpino de madeira com telhado inclinado e lareira de pedra.",
        meta: "Casa · Médio",
        previewHint: "house",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "casa-mansao-piscina",
        name: "Mansão com Piscina",
        description: "Residência de luxo com varanda panorâmica, piscina iluminada e palmeira.",
        meta: "Casa · Animada · Grande",
        previewHint: "house",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "casa-vitoriana",
        name: "Casarão Vitoriano",
        description: "Casa azul-pastel com torreão redondo, varanda florida e lanterna.",
        meta: "Casa · Animada · Médio",
        previewHint: "house",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "casa-praia",
        name: "Casa de Praia",
        description: "Casa litorânea sobre palafitas com telhado azul, prancha e catavento.",
        meta: "Casa · Animada · Médio",
        previewHint: "house",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "casa-japonesa",
        name: "Casa Jardim Oriental",
        description: "Pavilhão tradicional de telhado curvo, portas iluminadas e cerejeira.",
        meta: "Casa · Médio",
        previewHint: "house",
        isRoad: false,
        kind: "creation",
      },
    ],
  },
  {
    id: "carro",
    label: "Carros",
    summary: "Carros modernos, viatura patrulha e bombeiro — todos entram e andam automaticamente nas estradas.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 14l1.5-5A2 2 0 0 1 8.4 7.5h7.2a2 2 0 0 1 1.9 1.5L19 14"/><rect x="3" y="13" width="18" height="5" rx="1.5"/><circle cx="7" cy="18.5" r="1.5"/><circle cx="17" cy="18.5" r="1.5"/></svg>`,
    items: [
      {
        id: "carro-hypercar",
        name: "Hypercar Elétrico",
        description: "Superesportivo prata e fibra de carbono com faróis LED e aerofólio.",
        meta: "Carro Moderno · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "carro-suv-moderno",
        name: "SUV Moderno",
        description: "SUV branco-pérola com teto panorâmico escuro, barra LED e rodas esportivas.",
        meta: "Carro Moderno · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "carro-sedan-executivo",
        name: "Sedan Executivo",
        description: "Sedan azul-meia-noite aerodinâmico com grade cromada e LEDs modernos.",
        meta: "Carro Moderno · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "carro-patrulha",
        name: "Viatura Patrulha",
        description: "Viatura policial moderna com giroflex azul e vermelho animado.",
        meta: "Patrulha · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "carro-bombeiro",
        name: "Caminhão Bombeiro",
        description: "Caminhão de bombeiros com escada magirus, mangueiras e sirene giratória.",
        meta: "Bombeiro · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "carro-esportivo",
        name: "Carro Esportivo",
        description: "Cupê esportivo vermelho com faróis LED, difusor traseiro e aerofólio.",
        meta: "Carro · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "carro-picape",
        name: "Picape Utilitária",
        description: "Caminhonete azul com caçamba carregada e para-choques cromados.",
        meta: "Carro · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "carro-classico",
        name: "Carro Clássico",
        description: "Compacto amarelo retrô com teto creme arredondado e faróis redondos.",
        meta: "Carro · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "carro-conversivel",
        name: "Conversível de Luxo",
        description: "Conversível turquesa elegante com interior creme e rodas cromadas.",
        meta: "Carro · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "carro-onibus-turistico",
        name: "Ônibus Turístico",
        description: "Ônibus vermelho de dois andares com teto panorâmico aberto.",
        meta: "Veículo · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "maquinas",
    label: "Máquinas",
    summary: "Pá carregadeira, retroescavadeira e caminhão basculante rodando pelas estradas da ilha.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 16h11V9H8l-4 4v3Z"/><path d="M15 11h4l2 5h-6"/><circle cx="7.5" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M10 9V6h4"/></svg>`,
    items: [
      {
        id: "maquina-pa-carregadeira",
        name: "Pá Carregadeira",
        description: "Máquina pesada amarela com braço hidráulico e caçamba frontal animada.",
        meta: "Máquina · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "maquina-retroescavadeira",
        name: "Retroescavadeira",
        description: "Retroescavadeira com pá dianteira e lança traseira articulada animada.",
        meta: "Máquina · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "maquina-basculante",
        name: "Caminhão Basculante",
        description: "Caminhão de obra pesado com caçamba articulada carregada e giroflex.",
        meta: "Máquina · Anda na estrada",
        previewHint: "car",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "estradas",
    label: "Estradas",
    summary: "Adicione estradas e pontes clicando diretamente no mapa — cada clique constrói e conecta.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 20 9.5 4M18 20 14.5 4"/><path d="M12 6v2M12 11v2.5M12 16.5V19"/></svg>`,
    items: [
      {
        id: "estrada-asfalto",
        name: "Estrada Asfaltada",
        description: "Via asfaltada de mão dupla; cada clique adiciona e conecta a pista.",
        meta: "Estrada · Clique para pavimentar",
        previewHint: "road",
        isRoad: true,
        kind: "road",
        useRawSpot: true,
      },
      {
        id: "estrada-ponte-madeira",
        name: "Ponte de Madeira",
        description: "Ponte arqueada de madeira com corrimão, pilares e lampiões.",
        meta: "Ponte · 3D no mapa",
        previewHint: "bridge",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "estrada-ponte-pedra",
        name: "Ponte de Pedra",
        description: "Ponte clássica em arcos de pedra com parapeito e luminárias.",
        meta: "Ponte · 3D no mapa",
        previewHint: "bridge",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "estrada-ponte-estaiada",
        name: "Ponte Estaiada",
        description: "Ponte moderna suspensa por cabos brancos com sinalizador giratório.",
        meta: "Ponte · Animada · Grande",
        previewHint: "bridge",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "estrada-paralelepipedo",
        name: "Rua de Paralelepípedo",
        description: "Calçamento de pedra ideal para ligar casas, praças e o centro.",
        meta: "Estrada · Clique para pavimentar",
        previewHint: "road",
        isRoad: true,
        kind: "road",
        useRawSpot: true,
      },
      {
        id: "estrada-terra",
        name: "Estrada de Terra",
        description: "Caminho rural de terra batida perfeito para fazendas e plantações.",
        meta: "Estrada · Clique para pavimentar",
        previewHint: "road",
        isRoad: true,
        kind: "road",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "agua",
    label: "Rios e Lagos",
    summary: "Desenhe rios cristalinos conectando cliques ou crie lagos naturais com plantas aquáticas.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/></svg>`,
    items: [
      {
        id: "agua-rio",
        name: "Rio Cristalino",
        description: "Rio largo de água azul brilhante com margens verdes; clique para estender.",
        meta: "Rio · Clique para traçar",
        previewHint: "water",
        isRoad: true,
        isWater: true,
        kind: "road",
        useRawSpot: true,
      },
      {
        id: "agua-riacho",
        name: "Riacho com Pedras",
        description: "Riacho sinuoso cercado por pedrinhas e juncos; conecte vários pontos.",
        meta: "Riacho · Clique para traçar",
        previewHint: "water",
        isRoad: true,
        isWater: true,
        kind: "road",
        useRawSpot: true,
      },
      {
        id: "agua-lago-natural",
        name: "Lago Natural",
        description: "Lago amplo com margens de pedra, taboas e água cristalina para barcos.",
        meta: "Lago · Clique para criar",
        previewHint: "water",
        isRoad: false,
        isWater: true,
        kind: "pond",
        useRawSpot: true,
      },
      {
        id: "agua-lago-vitoria",
        name: "Lago com Vitórias-Régias",
        description: "Lago ornamental com flores de lótus, pedras e vegetação aquática.",
        meta: "Lago · Clique para criar",
        previewHint: "water",
        isRoad: false,
        isWater: true,
        kind: "pond",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "barcos",
    label: "Barcos",
    summary: "Lanchas, veleiros e iates que navegam nos rios, lagos ou no mar da ilha.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17l2 3h14l2-3H3Z"/><path d="M12 4v11"/><path d="M12 5l6 7h-6"/><path d="M12 7l-4.5 5H12"/></svg>`,
    items: [
      {
        id: "barco-lancha",
        name: "Lancha Moderna",
        description: "Lancha esportiva branca e azul com para-brisa aerodinâmico e motor.",
        meta: "Barco · Navega na água",
        previewHint: "boat",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "barco-veleiro",
        name: "Veleiro Clássico",
        description: "Veleiro elegante com mastro alto, velas brancas e bandeira balançando.",
        meta: "Barco · Navega na água",
        previewHint: "boat",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "barco-iate",
        name: "Iate de Luxo",
        description: "Iate moderno de dois andares com deck de teca, vidro escuro e radar.",
        meta: "Barco · Navega na água",
        previewHint: "boat",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "barco-remo",
        name: "Barco a Remo",
        description: "Barquinho artesanal de madeira com remos perfeitos para rios e lagos.",
        meta: "Barco · Navega na água",
        previewHint: "boat",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "fazendas",
    label: "Fazendas",
    summary: "Celeiros, silos e estábulos para montar sua área rural na ilha.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12 7 6l5-2 5 2 4 6"/><path d="M5 11v9h14v-9"/><path d="M9 20v-6h6v6M9 14l6 6M15 14l-6 6"/></svg>`,
    items: [
      {
        id: "fazenda-celeiro",
        name: "Celeiro com Silo",
        description: "Celeiro vermelho clássico com portas em X, feno e silo metálico.",
        meta: "Fazenda · Grande",
        previewHint: "barn",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "fazenda-estabulo",
        name: "Estábulo Rural",
        description: "Estábulo de madeira com cerca de pasto, cocho de água e feno.",
        meta: "Fazenda · Médio",
        previewHint: "barn",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "fazenda-moinho",
        name: "Moinho de Vento Rural",
        description: "Moinho de pedra com grandes pás de madeira girando ao vento.",
        meta: "Fazenda · Animado · Grande",
        previewHint: "barn",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "fazenda-estufa",
        name: "Estufa Botânica",
        description: "Estufa de vidro branco repleta de flores coloridas e plantas.",
        meta: "Fazenda · Médio",
        previewHint: "barn",
        isRoad: false,
        kind: "creation",
      },
    ],
  },
  {
    id: "plantacoes",
    label: "Plantações",
    summary: "Lavouras cultivadas e hortas orgânicas para espalhar pelo mapa.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21V9"/><path d="M12 13c-3.5 0-6-2.2-6-5.5 3.3 0 6 2 6 5.5Z"/><path d="M12 11c3.5 0 6-2.2 6-5.5-3.3 0-6 2-6 5.5Z"/><path d="M4 21h16"/></svg>`,
    items: [
      {
        id: "plantacao-milho",
        name: "Plantação de Milho",
        description: "Fileiras de terra arada com pés altos de milho e espigas douradas.",
        meta: "Plantação · Médio",
        previewHint: "crop",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "plantacao-trigo",
        name: "Campo de Trigo Dourado",
        description: "Canteiros dourados de trigo maduro com espantalho no centro.",
        meta: "Plantação · Médio",
        previewHint: "crop",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "plantacao-horta",
        name: "Horta Orgânica",
        description: "Canteiros de madeira com alfaces, tomates vermelhos e cenouras.",
        meta: "Plantação · Pequeno",
        previewHint: "crop",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "plantacao-girassois",
        name: "Campo de Girassóis",
        description: "Canteiros cercados com girassóis dourados balançando na brisa.",
        meta: "Plantação · Animada · Médio",
        previewHint: "crop",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "plantacao-vinhedo",
        name: "Vinhedo em Treliça",
        description: "Parreiras exuberantes com cachos de uva roxa e barris de carvalho.",
        meta: "Plantação · Médio",
        previewHint: "crop",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "planta-ipe-amarelo",
        name: "Ipê Amarelo Florido",
        description: "Árvore ornamental frondosa com copa dourada vibrante e flores no chão.",
        meta: "Planta · Paisagismo",
        previewHint: "crop",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "planta-jardim-tropical",
        name: "Jardim Tropical & Palmeiras",
        description: "Palmeiras esguias, bromélias coloridas e canteiro de pedras decorativas.",
        meta: "Planta · Paisagismo",
        previewHint: "crop",
        isRoad: false,
        kind: "creation",
      },
    ],
  },
  {
    id: "animais",
    label: "Animais",
    summary: "Animais 3D animados que caminham, saltitam e pastam onde você adicionar.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="9" r="1.5"/><circle cx="12" cy="6.5" r="1.5"/><circle cx="16.5" cy="9" r="1.5"/><path d="M7.5 16.5c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 1.6-1.2 2.5-2.6 2.5h-3.8c-1.4 0-2.6-.9-2.6-2.5Z"/></svg>`,
    items: [
      {
        id: "animal-vaca",
        name: "Vaca Malhada",
        description: "Vaquinha malhada passeando tranquilamente pelos campos verdes.",
        meta: "Animal · Anda pela ilha",
        previewHint: "animal",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "animal-ovelha",
        name: "Ovelha Fofa",
        description: "Ovelhinha de lã macia que saltita pelo gramado.",
        meta: "Animal · Saltita pelo campo",
        previewHint: "animal",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "animal-cavalo",
        name: "Cavalo Marrom",
        description: "Cavalo castanho de crina escura trotando pelos pastos.",
        meta: "Animal · Trota pelo campo",
        previewHint: "animal",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "animal-galinha",
        name: "Galinha Caipira",
        description: "Galinha branca de crista vermelha ciscando pelo gramado.",
        meta: "Animal · Anda pela ilha",
        previewHint: "animal",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "animal-cachorro",
        name: "Cachorro Dourado",
        description: "Cachorrinho amigável passeando e abanando o rabo pela ilha.",
        meta: "Animal · Corre pela ilha",
        previewHint: "animal",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "colheitas",
    label: "Colheitas",
    summary: "Máquinas agrícolas e carroças carregadas com a safra recém-colhida.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20V5"/><path d="M12 8c-2.5 0-4-1.5-4-3.5M12 12c-2.8 0-4.5-1.5-4.5-3.5M12 16c-2.8 0-4.5-1.5-4.5-3.5"/><path d="M12 8c2.5 0 4-1.5 4-3.5M12 12c2.8 0 4.5-1.5 4.5-3.5M12 16c2.8 0 4.5-1.5 4.5-3.5"/></svg>`,
    items: [
      {
        id: "colheita-colheitadeira",
        name: "Colheitadeira Agrícola",
        description: "Colheitadeira verde e amarela com rolo ceifador giratório.",
        meta: "Colheita · Animada",
        previewHint: "harvest",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "colheita-feno-aboboras",
        name: "Fardos de Feno e Abóboras",
        description: "Carroça de madeira com fardos dourados, abóboras e caixotes.",
        meta: "Colheita · Médio",
        previewHint: "harvest",
        isRoad: false,
        kind: "creation",
      },
      {
        id: "colheita-trator",
        name: "Trator Agrícola",
        description: "Trator vermelho de rodas grandes giratórias pronto para o campo.",
        meta: "Colheita · Animado · Médio",
        previewHint: "harvest",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "aviao",
    label: "Avião",
    summary: "Aeronaves com hélices giratórias que sobrevoam o local clicado.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"/></svg>`,
    items: [
      {
        id: "aviao-bimotor",
        name: "Avião Bimotor",
        description: "Aeronave branca e azul com duas hélices sobrevoando em círculos.",
        meta: "Avião · Voa sobre a ilha",
        previewHint: "plane",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "aviao-biplano",
        name: "Biplano Clássico",
        description: "Biplano retrô vermelho fazendo voos panorâmicos sobre a ilha.",
        meta: "Avião · Voa sobre a ilha",
        previewHint: "plane",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "aviao-helicoptero",
        name: "Helicóptero Panorâmico",
        description: "Helicóptero amarelo e branco com rotor principal e traseiro girando.",
        meta: "Aeronave · Voa sobre a ilha",
        previewHint: "plane",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "bicicleta",
    label: "Bicicleta",
    summary: "Bicicletas com rodas giratórias para circular onde você clicar.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="16.5" r="3.5"/><circle cx="18" cy="16.5" r="3.5"/><path d="M6 16.5 10.5 9h5l2.5 7.5M10.5 9l1.5 7.5h-6M14 6h2.5"/></svg>`,
    items: [
      {
        id: "bicicleta-urbana",
        name: "Bicicleta Urbana",
        description: "Bicicleta turquesa com cestinha dianteira e selim de couro.",
        meta: "Bicicleta · Circula no mapa",
        previewHint: "bike",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "bicicleta-esportiva",
        name: "Bicicleta Esportiva",
        description: "Bicicleta amarela aerodinâmica para passeios rápidos.",
        meta: "Bicicleta · Circula no mapa",
        previewHint: "bike",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "bicicleta-triciclo-cafe",
        name: "Triciclo de Café",
        description: "Food-bike charmosa com toldo listrado e máquina de espresso.",
        meta: "Bicicleta · Circula no mapa",
        previewHint: "bike",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "moto",
    label: "Moto",
    summary: "Motocicletas e scooters velozes que aceleram onde você adicionar.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M5.5 16.5h6l3-6h3.5M10 10.5h4l2 6M15.5 7.5h2.5"/></svg>`,
    items: [
      {
        id: "moto-esportiva",
        name: "Moto Esportiva",
        description: "Motocicleta vermelha e preta com farol aceso e escapamento cromado.",
        meta: "Moto · Dirige no mapa",
        previewHint: "moto",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "moto-scooter",
        name: "Scooter Clássica",
        description: "Scooter retrô verde-menta com assento marrom e farol redondo.",
        meta: "Moto · Dirige no mapa",
        previewHint: "moto",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
      {
        id: "moto-chopper",
        name: "Moto Chopper Custom",
        description: "Motocicleta azul-cobalto e cromada com garfo alongado e farol aceso.",
        meta: "Moto · Dirige no mapa",
        previewHint: "moto",
        isRoad: false,
        kind: "creation",
        useRawSpot: true,
      },
    ],
  },
  {
    id: "pessoas",
    label: "Pessoas",
    summary: "Moradores, fazendeiros e exploradores caminhando onde você clicar.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="7.5" r="3"/><path d="M3.5 19.5v-1.2a4.3 4.3 0 0 1 4.3-4.3h2.4a4.3 4.3 0 0 1 4.3 4.3v1.2"/><circle cx="16.5" cy="8.5" r="2.2"/><path d="M16.5 14a3.6 3.6 0 0 1 3.5 3.6v1.9"/></svg>`,
    items: [
      {
        id: "pessoa-morador",
        name: "Morador da Ilha",
        description: "Morador amigável passeando pela vizinhança e pontos de ônibus.",
        meta: "Pessoa · Caminha pela ilha",
        previewHint: "person",
        isRoad: false,
        kind: "villager",
        useRawSpot: true,
      },
      {
        id: "pessoa-fazendeiro",
        name: "Fazendeiro",
        description: "Trabalhador rural com chapéu de palha cuidando das lavouras.",
        meta: "Pessoa · Caminha pelo campo",
        previewHint: "person",
        isRoad: false,
        kind: "villager",
        useRawSpot: true,
      },
      {
        id: "pessoa-explorador",
        name: "Explorador",
        description: "Viajante curioso percorrendo trilhas e novos pontos da ilha.",
        meta: "Pessoa · Explora a ilha",
        previewHint: "person",
        isRoad: false,
        kind: "villager",
        useRawSpot: true,
      },
      {
        id: "pessoa-artista",
        name: "Artista",
        description: "Morador criativo visitando praças e observando as construções.",
        meta: "Pessoa · Caminha pela ilha",
        previewHint: "person",
        isRoad: false,
        kind: "villager",
        useRawSpot: true,
      },
      {
        id: "pessoa-chef",
        name: "Chef de Cozinha",
        description: "Chef com chapéu branco passeando pelos restaurantes e praças.",
        meta: "Pessoa · Caminha pela ilha",
        previewHint: "person",
        isRoad: false,
        kind: "villager",
        useRawSpot: true,
      },
      {
        id: "pessoa-esportista",
        name: "Esportista",
        description: "Visitante animado correndo pelas alamedas e parques da ilha.",
        meta: "Pessoa · Explora a ilha",
        previewHint: "person",
        isRoad: false,
        kind: "villager",
        useRawSpot: true,
      },
    ],
  },
];

const PREVIEW_W = 280;
const PREVIEW_H = 180;

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h % 9973) + 17;
}

export function createCatalogMenuController({ dialogEl, onSelectPreset } = {}) {
  if (!dialogEl) return null;

  let activeCatId = CATALOG_CATEGORIES[0].id;
  let activePresetId = null;

  // Pre-populated from static Vite-bundled catalog_data.json (works 100% on Vercel & offline)
  const serverCatalogMap = new Map();
  if (Array.isArray(BUNDLED_CATALOG_ITEMS)) {
    for (const item of BUNDLED_CATALOG_ITEMS) {
      if (item?.id) {
        serverCatalogMap.set(item.id, item);
      }
    }
  }

  // Shared single offscreen WebGL renderer (lazily initialized, 0% GPU/CPU when closed)
  let previewRenderer = null;
  let webglUnavailable = false;
  let previewScene = null;
  let previewCamera = null;
  let previewAnchor = null;
  let shadowDiscMesh = null;
  let previewRafId = 0;
  let lastFrameMs = 0;
  let hoveredPresetId = null;

  // Preview-local isolated materials so WebGL context #2 never shares shader programs
  // with meadow_engine.js's main WebGL context #1.
  const previewMaterialCache = new Map();

  // Cached built 3D preview rigs keyed by presetId: { root, animate, floating, baseYaw }
  const previewModelCache = new Map();
  // Cached lightweight 2D fallback primitives keyed by presetId
  const fallbackBoxCache = new Map();
  // Active card slots currently mounted in the DOM: [{ item, ctx, width, height }]
  let visibleCardSlots = [];

  dialogEl.innerHTML = `
    <div class="cat-shell">
      <header class="cat-header">
        <div class="cat-header-copy">
          <h2 class="cat-title">Menu de Construção</h2>
          <p class="cat-subtitle">Selecione a categoria e clique em qualquer desenho 3D para adicionar no mapa</p>
        </div>
        <button type="button" class="cat-close-btn" aria-label="Fechar menu">&times;</button>
      </header>

      <div class="cat-body">
        <nav class="cat-sidebar" role="tablist" aria-label="Categorias do menu"></nav>
        <section class="cat-stage" aria-live="polite">
          <div class="cat-stage-head">
            <h3 class="cat-stage-title"></h3>
            <p class="cat-stage-desc"></p>
          </div>
          <div class="cat-grid"></div>
        </section>
      </div>

      <footer class="cat-footer">
        <span class="cat-selection-summary">Clique em um modelo para sair clicando e adicionando na ilha</span>
        <div class="cat-footer-actions">
          <button type="button" class="cat-btn cat-btn-secondary" data-cat-action="cancel">Fechar</button>
        </div>
      </footer>
    </div>
  `;

  const closeBtn = dialogEl.querySelector(".cat-close-btn");
  const titleEl = dialogEl.querySelector(".cat-title");
  const subtitleEl = dialogEl.querySelector(".cat-subtitle");
  const summaryEl = dialogEl.querySelector(".cat-selection-summary");
  const sidebarEl = dialogEl.querySelector(".cat-sidebar");
  const stageTitleEl = dialogEl.querySelector(".cat-stage-title");
  const stageDescEl = dialogEl.querySelector(".cat-stage-desc");
  const gridEl = dialogEl.querySelector(".cat-grid");
  const cancelBtn = dialogEl.querySelector('[data-cat-action="cancel"]');
  let activeSwapLabel = null;

  function ensureCatalogLoaded() {
    return Promise.resolve(serverCatalogMap);
  }

  function getIsolatedPreviewMaterial(sourceMat) {
    if (sourceMat && sourceMat.vertexColors) {
      const offsetKey = sourceMat.polygonOffset
        ? `vc:${sourceMat.polygonOffsetFactor}:${sourceMat.polygonOffsetUnits}`
        : "vc:0";
      let cached = previewMaterialCache.get(offsetKey);
      if (!cached) {
        cached = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.56,
          metalness: 0.1,
          ...(sourceMat.polygonOffset
            ? {
                polygonOffset: true,
                polygonOffsetFactor: sourceMat.polygonOffsetFactor,
                polygonOffsetUnits: sourceMat.polygonOffsetUnits,
              }
            : {}),
        });
        previewMaterialCache.set(offsetKey, cached);
      }
      return cached;
    }
    if (sourceMat && typeof sourceMat.clone === "function") {
      return sourceMat.clone();
    }
    return getIsolatedPreviewMaterial({ vertexColors: true });
  }

  function isolateGroupMaterials(rootObj) {
    rootObj.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = false;
      obj.receiveShadow = false;
      if (Array.isArray(obj.material)) {
        obj.material = obj.material.map((m) => getIsolatedPreviewMaterial(m));
      } else {
        obj.material = getIsolatedPreviewMaterial(obj.material);
      }
    });
  }

  function ensurePreviewRenderer() {
    if (webglUnavailable) return false;
    if (previewRenderer) {
      const gl = previewRenderer.getContext?.();
      if (gl && typeof gl.isContextLost === "function" && gl.isContextLost()) {
        webglUnavailable = true;
        previewRenderer = null;
        return false;
      }
      return true;
    }
    try {
      previewRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      });
      previewRenderer.domElement.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        webglUnavailable = true;
        previewRenderer = null;
      });
      previewRenderer.setPixelRatio(1);
      previewRenderer.setSize(PREVIEW_W, PREVIEW_H, false);
      previewRenderer.setClearColor(0x000000, 0);
      previewRenderer.outputColorSpace = THREE.SRGBColorSpace;
      previewRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      previewRenderer.toneMappingExposure = 1.12;

      previewScene = new THREE.Scene();
      try {
        const pmrem = new THREE.PMREMGenerator(previewRenderer);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        previewScene.environment = envTex;
        previewScene.environmentIntensity = 0.52;
        pmrem.dispose();
      } catch {
        // Fallback if PMREM is unavailable
      }

      previewCamera = new THREE.PerspectiveCamera(34, PREVIEW_W / PREVIEW_H, 0.1, 40);
      previewCamera.position.set(3.25, 2.38, 3.65);
      previewCamera.lookAt(0, 0.62, 0);

      const hemi = new THREE.HemisphereLight(0xf6fbff, 0x7cb066, 1.38);
      previewScene.add(hemi);

      const sun = new THREE.DirectionalLight(0xfff7e2, 1.92);
      sun.position.set(5.2, 8.5, 6.2);
      previewScene.add(sun);

      const rim = new THREE.DirectionalLight(0xc4e2ff, 0.68);
      rim.position.set(-5.0, 4.2, -5.0);
      previewScene.add(rim);

      const shadowGeo = new THREE.CircleGeometry(1.16, 28);
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x264b24,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      });
      shadowDiscMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowDiscMesh.rotation.x = -Math.PI / 2;
      shadowDiscMesh.position.y = 0.006;
      previewScene.add(shadowDiscMesh);

      previewAnchor = new THREE.Group();
      previewScene.add(previewAnchor);
      return true;
    } catch {
      webglUnavailable = true;
      previewRenderer = null;
      return false;
    }
  }

  function shadeHexColor(hex, factor) {
    const clean = typeof hex === "string" && hex.startsWith("#") ? hex.slice(1) : "88aa88";
    const full = clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean.padEnd(6, "0").slice(0, 6);
    const num = parseInt(full, 16);
    if (Number.isNaN(num)) return "#88aa88";
    const r = Math.min(255, Math.max(0, Math.round(((num >> 16) & 255) * factor)));
    const g = Math.min(255, Math.max(0, Math.round(((num >> 8) & 255) * factor)));
    const b = Math.min(255, Math.max(0, Math.round((num & 255) * factor)));
    return `rgb(${r},${g},${b})`;
  }

  function getFallbackBoxes(item) {
    if (fallbackBoxCache.has(item.id)) return fallbackBoxCache.get(item.id);
    const srv = serverCatalogMap.get(item.id);
    const boxes = [];
    if (srv?.blueprint) {
      const pal = srv.blueprint.palette || {};
      const col = (c) => (typeof c === "string" ? pal[c] || c : "#8aa87e");
      const allOps = [
        ...(Array.isArray(srv.blueprint.ops) ? srv.blueprint.ops : []),
        ...(Array.isArray(srv.blueprint.parts)
          ? srv.blueprint.parts.flatMap((p) => (Array.isArray(p.ops) ? p.ops : []))
          : []),
      ];
      for (const op of allOps) {
        if (!op) continue;
        if (op.op === "box" || op.op === "hollowBox") {
          boxes.push({
            x0: op.x0 ?? -2, y0: op.y0 ?? 0, z0: op.z0 ?? -2,
            x1: op.x1 ?? 2, y1: op.y1 ?? 2, z1: op.z1 ?? 2,
            color: col(op.color),
          });
        } else if (op.op === "roofGable" || op.op === "roofPyramid" || op.op === "roofDome") {
          const rise = op.rise ?? op.height ?? 3;
          boxes.push({
            x0: op.x0 ?? -3, y0: op.yBase ?? 4, z0: op.z0 ?? -3,
            x1: op.x1 ?? 3, y1: (op.yBase ?? 4) + rise, z1: op.z1 ?? 3,
            color: col(op.color),
          });
        } else if (op.op === "cylinder" || op.op === "cone") {
          const r = op.r ?? op.rBottom ?? 2;
          boxes.push({
            x0: (op.cx ?? 0) - r, y0: op.y0 ?? 0, z0: (op.cz ?? 0) - r,
            x1: (op.cx ?? 0) + r, y1: op.y1 ?? 4, z1: (op.cz ?? 0) + r,
            color: col(op.color),
          });
        } else if (op.op === "sphere") {
          const rx = op.rx ?? 2;
          const ry = op.ry ?? 2;
          const rz = op.rz ?? 2;
          boxes.push({
            x0: (op.cx ?? 0) - rx, y0: (op.cy ?? 2) - ry, z0: (op.cz ?? 0) - rz,
            x1: (op.cx ?? 0) + rx, y1: (op.cy ?? 2) + ry, z1: (op.cz ?? 0) + rz,
            color: col(op.color),
          });
        }
      }
    } else if (srv?.villagerSpec) {
      const shirt = srv.villagerSpec.shirtColor || "#4c82d4";
      const hat = srv.villagerSpec.hatColor || "#f5b82e";
      boxes.push(
        { x0: -1.5, y0: 0, z0: -1, x1: -0.2, y1: 4, z1: 1, color: "#394a6d" },
        { x0: 0.2, y0: 0, z0: -1, x1: 1.5, y1: 4, z1: 1, color: "#394a6d" },
        { x0: -2, y0: 4, z0: -1.2, x1: 2, y1: 9, z1: 1.2, color: shirt },
        { x0: -1.8, y0: 9, z0: -1.8, x1: 1.8, y1: 12.6, z1: 1.8, color: "#f5cfa8" },
        { x0: -2, y0: 12.2, z0: -2, x1: 2, y1: 14, z1: 2.4, color: hat },
      );
    }

    if (boxes.length === 0) {
      boxes.push({ x0: -3, y0: 0, z0: -3, x1: 3, y1: 6, z1: 3, color: "#68b562" });
    }

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    for (const b of boxes) {
      minX = Math.min(minX, b.x0, b.x1);
      maxX = Math.max(maxX, b.x0, b.x1);
      minY = Math.min(minY, b.y0, b.y1);
      maxY = Math.max(maxY, b.y0, b.y1);
      minZ = Math.min(minZ, b.z0, b.z1);
      maxZ = Math.max(maxZ, b.z0, b.z1);
    }
    const cx = (minX + maxX) * 0.5;
    const cz = (minZ + maxZ) * 0.5;
    const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 1);
    const data = { boxes: boxes.slice(0, 48), cx, minY, cz, span };
    fallbackBoxCache.set(item.id, data);
    return data;
  }

  function render2DFallbackPreview(slot, yaw, bobY) {
    const { ctx, width, height, item } = slot;
    const data = getFallbackBoxes(item);
    ctx.clearRect(0, 0, width, height);

    const scale = Math.min(width, height) * 0.52 / data.span;
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const tilt = 0.52;
    const originX = width * 0.5;
    const originY = height * 0.78 - bobY * 18;

    const project = (x, y, z) => {
      const dx = x - data.cx;
      const dy = y - data.minY;
      const dz = z - data.cz;
      const rx = dx * cosY - dz * sinY;
      const rz = dx * sinY + dz * cosY;
      return {
        sx: originX + rx * scale,
        sy: originY - dy * scale * 0.92 + rz * scale * tilt,
        depth: rz,
      };
    };

    // Soft ground shadow
    ctx.save();
    ctx.fillStyle = "rgba(38, 75, 36, 0.14)";
    ctx.beginPath();
    ctx.ellipse(originX, height * 0.8, width * 0.22, height * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const sorted = data.boxes
      .map((b) => {
        const mx = (b.x0 + b.x1) * 0.5 - data.cx;
        const my = (b.y0 + b.y1) * 0.5 - data.minY;
        const mz = (b.z0 + b.z1) * 0.5 - data.cz;
        const rz = mx * sinY + mz * cosY;
        return { b, depth: rz + my * 0.08 };
      })
      .sort((a, b) => a.depth - b.depth);

    const drawQuad = (pts, fill) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].sx, pts[0].sy);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    };

    for (const { b } of sorted) {
      const x0 = Math.min(b.x0, b.x1);
      const x1 = Math.max(b.x0, b.x1);
      const y0 = Math.min(b.y0, b.y1);
      const y1 = Math.max(b.y0, b.y1);
      const z0 = Math.min(b.z0, b.z1);
      const z1 = Math.max(b.z0, b.z1);

      const p000 = project(x0, y0, z0);
      const p100 = project(x1, y0, z0);
      const p101 = project(x1, y0, z1);
      const p001 = project(x0, y0, z1);
      const p010 = project(x0, y1, z0);
      const p110 = project(x1, y1, z0);
      const p111 = project(x1, y1, z1);
      const p011 = project(x0, y1, z1);

      // Draw front-facing sides based on yaw
      if (cosY >= 0) {
        drawQuad([p001, p101, p111, p011], shadeHexColor(b.color, 0.92));
      } else {
        drawQuad([p000, p100, p110, p010], shadeHexColor(b.color, 0.88));
      }
      if (sinY >= 0) {
        drawQuad([p100, p101, p111, p110], shadeHexColor(b.color, 0.78));
      } else {
        drawQuad([p000, p001, p011, p010], shadeHexColor(b.color, 0.78));
      }
      // Top face
      drawQuad([p010, p110, p111, p011], shadeHexColor(b.color, 1.08));
    }
  }

  function getOrBuildPreviewModel(item) {
    if (previewModelCache.has(item.id)) {
      return previewModelCache.get(item.id);
    }
    const srv = serverCatalogMap.get(item.id);
    if (!srv) return null;

    const wrapper = new THREE.Group();
    let innerAnim = null;
    const isPlane = item.categoryId === "aviao" || item.previewHint === "plane";
    const isBoat = item.categoryId === "barcos" || item.previewHint === "boat";
    const isAnimal = item.categoryId === "animais" || item.previewHint === "animal";
    const isVehicle =
      item.categoryId === "carro" ||
      item.categoryId === "maquinas" ||
      item.categoryId === "bicicleta" ||
      item.categoryId === "moto";

    if (srv.blueprint) {
      const seed = hashString(item.id);
      const model = buildCreationGroup(srv.blueprint, {
        seed,
        useWorldScale: false,
      });
      isolateGroupMaterials(model);
      model.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y * 1.12, size.z, 0.01);
      const targetSpan = isPlane ? 2.55 : isBoat || isVehicle ? 2.38 : 2.26;
      const scale = targetSpan / maxDim;

      model.scale.setScalar(scale);
      model.position.set(
        -center.x * scale,
        -box.min.y * scale + 0.02,
        -center.z * scale,
      );
      model.updateMatrixWorld(true);
      wrapper.add(model);

      innerAnim = (t) => {
        if (typeof model.userData.animate === "function") {
          model.userData.animate(t, {
            wheelAngle: t * 4.4,
            speed: isVehicle ? 5.5 : 2.5,
          });
        }
        if (isPlane) {
          wrapper.position.y = 0.34 + Math.sin(t * 2.4) * 0.09;
          wrapper.rotation.z = Math.sin(t * 1.5) * 0.1;
          wrapper.rotation.x = Math.cos(t * 1.2) * 0.04;
        } else if (isBoat) {
          wrapper.position.y = 0.12 + Math.sin(t * 2.4) * 0.05;
          wrapper.rotation.z = Math.sin(t * 2.0) * 0.055;
          wrapper.rotation.x = Math.cos(t * 1.7) * 0.035;
        } else if (isAnimal) {
          wrapper.position.y = Math.abs(Math.sin(t * 3.6)) * 0.065;
        } else if (isVehicle) {
          wrapper.position.y = Math.abs(Math.sin(t * 6.0)) * 0.018;
        }
      };
    } else if (srv.villagerSpec) {
      const idx = hashString(item.id) % 97;
      const rig = buildVillagerRig(
        {
          id: item.id,
          name: item.name,
          role: srv.villagerSpec.role,
          hatColor: srv.villagerSpec.hatColor,
          shirtColor: srv.villagerSpec.shirtColor,
        },
        idx,
      );
      isolateGroupMaterials(rig.root);
      rig.root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(rig.root);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z, 0.01);
      const scale = 1.95 / maxDim;
      rig.root.scale.setScalar(scale);
      rig.root.position.set(
        -center.x * scale,
        -box.min.y * scale + 0.02,
        -center.z * scale,
      );
      rig.root.updateMatrixWorld(true);
      wrapper.add(rig.root);

      innerAnim = (t) => {
        const stride = Math.sin(t * 4.6) * 0.56;
        rig.leftLeg.rotation.x = stride;
        rig.rightLeg.rotation.x = -stride;
        rig.leftArm.rotation.x = -stride * 0.85;
        rig.rightArm.rotation.x = stride * 0.85;
        rig.headPivot.rotation.y = Math.sin(t * 1.5) * 0.24;
        wrapper.position.y = Math.abs(Math.sin(t * 4.6)) * 0.05;
      };
    } else {
      return null;
    }

    const entry = {
      root: wrapper,
      animate: innerAnim,
      floating: isPlane,
      baseYaw: isVehicle || isAnimal ? -0.58 : -0.45,
    };
    previewModelCache.set(item.id, entry);
    return entry;
  }

  function renderPreviewFrame(nowSec, force = false) {
    if (!dialogEl.open || visibleCardSlots.length === 0) return;
    if (!force && nowSec - lastFrameMs < 1 / 32) return;
    lastFrameMs = nowSec;

    const useWebGL = ensurePreviewRenderer();

    for (let i = 0; i < visibleCardSlots.length; i++) {
      const slot = visibleCardSlots[i];
      const phaseOffset = i * 1.15;
      const t = nowSec + phaseOffset;
      const isHovered = hoveredPresetId === slot.item.id;
      const spinRate = isHovered ? 1.15 : 0.52;

      if (!useWebGL) {
        const bobY = slot.item.categoryId === "aviao" ? 0.35 + Math.sin(t * 2.4) * 0.12 : 0;
        render2DFallbackPreview(slot, -0.55 + t * spinRate, bobY);
        continue;
      }

      const entry = getOrBuildPreviewModel(slot.item);
      if (!entry) {
        render2DFallbackPreview(slot, -0.55 + t * spinRate, 0);
        continue;
      }

      previewAnchor.clear();
      previewAnchor.add(entry.root);

      entry.root.rotation.set(0, entry.baseYaw + t * spinRate, 0);
      entry.root.position.y = 0;
      if (entry.animate) {
        entry.animate(t);
      }

      if (shadowDiscMesh) {
        shadowDiscMesh.visible = true;
        shadowDiscMesh.scale.setScalar(entry.floating ? 0.72 : 1.0);
        shadowDiscMesh.material.opacity = entry.floating ? 0.1 : 0.16;
      }

      try {
        previewRenderer.render(previewScene, previewCamera);
        slot.ctx.clearRect(0, 0, slot.width, slot.height);
        slot.ctx.drawImage(previewRenderer.domElement, 0, 0, slot.width, slot.height);
      } catch {
        webglUnavailable = true;
        render2DFallbackPreview(slot, -0.55 + t * spinRate, 0);
      }
    }
  }

  function startPreviewLoop() {
    if (previewRafId) return;
    lastFrameMs = 0;
    const tick = (ms) => {
      if (!dialogEl.open) {
        previewRafId = 0;
        return;
      }
      renderPreviewFrame(ms * 0.001, false);
      previewRafId = requestAnimationFrame(tick);
    };
    previewRafId = requestAnimationFrame(tick);
  }

  function stopPreviewLoop() {
    if (previewRafId) {
      cancelAnimationFrame(previewRafId);
      previewRafId = 0;
    }
  }

  function getActiveCategory() {
    return CATALOG_CATEGORIES.find((c) => c.id === activeCatId) || CATALOG_CATEGORIES[0];
  }

  function pickAndPlace(cat, item) {
    if (!item) return;
    activePresetId = item.id;
    onSelectPreset?.({
      ...item,
      categoryId: cat.id,
      categoryLabel: cat.label,
    });
    close();
  }

  function renderSidebar() {
    sidebarEl.innerHTML = "";
    for (const cat of CATALOG_CATEGORIES) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `cat-nav-btn${cat.id === activeCatId ? " is-active" : ""}`;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", cat.id === activeCatId ? "true" : "false");
      btn.dataset.categoryId = cat.id;
      btn.innerHTML = `<span class="cat-nav-icon">${cat.icon}</span><span class="cat-nav-label">${cat.label}</span>`;
      btn.addEventListener("click", () => {
        activeCatId = cat.id;
        renderAll();
      });
      sidebarEl.appendChild(btn);
    }
  }

  function renderStage() {
    const cat = getActiveCategory();
    stageTitleEl.textContent = cat.label;
    stageDescEl.textContent = cat.summary;

    gridEl.innerHTML = "";
    visibleCardSlots = [];

    for (const item of cat.items) {
      const isSelected = item.id === activePresetId;
      const card = document.createElement("button");
      card.type = "button";
      card.className = `cat-card${isSelected ? " is-selected" : ""}`;
      card.dataset.presetId = item.id;
      card.setAttribute("aria-pressed", isSelected ? "true" : "false");

      const stageWrap = document.createElement("div");
      stageWrap.className = "cat-card-stage";

      const canvas = document.createElement("canvas");
      canvas.className = "cat-preview-canvas";
      canvas.width = PREVIEW_W;
      canvas.height = PREVIEW_H;
      canvas.setAttribute("aria-hidden", "true");
      stageWrap.appendChild(canvas);

      const actionHint = document.createElement("span");
      actionHint.className = "cat-card-cta";
      actionHint.textContent = activeSwapLabel ? "Trocar por este" : "+ Adicionar no mapa";
      stageWrap.appendChild(actionHint);

      const copy = document.createElement("div");
      copy.className = "cat-card-copy";
      copy.innerHTML = `
        <div class="cat-card-title">${item.name}</div>
        <div class="cat-card-desc">${item.description}</div>
        <div class="cat-card-meta">${item.meta}</div>
      `;

      card.appendChild(stageWrap);
      card.appendChild(copy);

      card.addEventListener("pointerenter", () => {
        hoveredPresetId = item.id;
      });
      card.addEventListener("pointerleave", () => {
        if (hoveredPresetId === item.id) hoveredPresetId = null;
      });
      card.addEventListener("click", () => {
        pickAndPlace(cat, item);
      });

      gridEl.appendChild(card);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        visibleCardSlots.push({
          item: { ...item, categoryId: cat.id },
          ctx,
          width: PREVIEW_W,
          height: PREVIEW_H,
        });
      }
    }

    if (dialogEl.open) {
      renderPreviewFrame(performance.now() * 0.001, true);
    }
  }

  function renderAll() {
    renderSidebar();
    renderStage();
  }

  function open(categoryId, presetId, options = {}) {
    activeSwapLabel =
      typeof options?.swapLabel === "string" && options.swapLabel.trim()
        ? options.swapLabel.trim()
        : null;
    if (titleEl) {
      titleEl.textContent = activeSwapLabel ? `Trocar: ${activeSwapLabel}` : "Menu de Construção";
    }
    if (subtitleEl) {
      subtitleEl.textContent = activeSwapLabel
        ? "Escolha abaixo o novo modelo para substituir este item no mesmo local"
        : "Selecione a categoria e clique em qualquer desenho 3D para adicionar no mapa";
    }
    if (summaryEl) {
      summaryEl.textContent = activeSwapLabel
        ? "Clique em qualquer modelo para trocar instantaneamente no mapa"
        : "Clique em um modelo para sair clicando e adicionando na ilha";
    }
    if (categoryId && CATALOG_CATEGORIES.some((c) => c.id === categoryId)) {
      activeCatId = categoryId;
    }
    if (presetId) {
      activePresetId = presetId;
    }
    ensureCatalogLoaded();
    renderAll();
    if (!dialogEl.open) {
      dialogEl.showModal();
    }
    renderPreviewFrame(performance.now() * 0.001, true);
    startPreviewLoop();
  }

  function close() {
    hoveredPresetId = null;
    activeSwapLabel = null;
    stopPreviewLoop();
    if (dialogEl.open) {
      dialogEl.close();
    }
  }

  closeBtn?.addEventListener("click", close);
  cancelBtn?.addEventListener("click", close);

  dialogEl.addEventListener("close", () => {
    hoveredPresetId = null;
    stopPreviewLoop();
  });

  // Light-dismiss backdrop click
  dialogEl.addEventListener("click", (e) => {
    if (e.target === dialogEl) {
      close();
    }
  });

  renderAll();

  return {
    open,
    close,
    preload: ensureCatalogLoaded,
    getPresetData: (presetId) => serverCatalogMap.get(presetId) || null,
    isOpen: () => Boolean(dialogEl.open),
  };
}
