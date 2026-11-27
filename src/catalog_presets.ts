import type {
  CreationCategory,
  PathKind,
  ScaleClass,
  VoxelBlueprint,
  WorldVillager,
} from "./types";
import { normalizeAndGroundBlueprint } from "./voxel_dsl";

export type CatalogCategoryId =
  | "predio"
  | "casa"
  | "carro"
  | "estradas"
  | "fazendas"
  | "plantacoes"
  | "animais"
  | "colheitas"
  | "aviao"
  | "bicicleta"
  | "moto"
  | "pessoas";

export type CatalogItemKind = "creation" | "road" | "villager";

export interface CatalogPresetSpec {
  id: string;
  categoryId: CatalogCategoryId;
  name: string;
  description: string;
  meta: string;
  kind: CatalogItemKind;
  pathKind?: PathKind;
  villagerSpec?: {
    role: WorldVillager["role"];
    hatColor: string;
    shirtColor: string;
    usesTransit: boolean;
  };
  behaviorHint?: "landmark" | "vehicle_route" | "wander" | "fly_circle";
  wanderStyle?: "walk" | "hop" | "trot" | "glide";
  speed?: number;
  altitude?: number;
  buildBlueprint?: () => VoxelBlueprint;
  buildPreviewBlueprint?: () => VoxelBlueprint;
}

function makeBlueprint(raw: {
  name: string;
  description: string;
  category: CreationCategory;
  scaleClass: ScaleClass;
  palette: Record<string, string>;
  ops: Record<string, unknown>[];
  parts?: Record<string, unknown>[];
}): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: raw.name,
      description: raw.description,
      category: raw.category,
      scaleClass: raw.scaleClass,
      palette: raw.palette,
      ops: raw.ops,
      parts: raw.parts ?? [],
    },
    raw.name,
  );
}

export const CATALOG_PRESETS: Record<string, CatalogPresetSpec> = {
  // ---------------- 1. PRÉDIO ----------------
  "predio-residencial": {
    id: "predio-residencial",
    categoryId: "predio",
    name: "Edifício Residencial",
    description: "Prédio de apartamentos com varandas, janelas iluminadas e terraço.",
    meta: "Construção · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Edifício Residencial",
        description: "Prédio de apartamentos com varandas, janelas iluminadas e terraço arborizado.",
        category: "building",
        scaleClass: "large",
        palette: {
          facade: "#e9e2d4",
          facadeShade: "#d4cab8",
          brick: "#c87454",
          slate: "#434b59",
          balcony: "#8c97a4",
          glass: "#9bd3ea",
          warmGlow: "#ffe39c",
          door: "#6f492d",
          leaf: "#58ad52",
          steel: "#a7b4c2",
        },
        ops: [
          { op: "hollowBox", x0: -8, y0: 0, z0: -7, x1: 8, y1: 6, z1: 7, wall: 1, color: "brick", trim: "facadeShade" },
          { op: "box", x0: -2, y0: 0, z0: 6, x1: 2, y1: 4, z1: 7, color: "door" },
          { op: "box", x0: -4, y0: 4, z0: 7, x1: 4, y1: 5, z1: 9, color: "slate" },
          { op: "hollowBox", x0: -8, y0: 6, z0: -7, x1: 8, y1: 30, z1: 7, wall: 1, color: "facade", trim: "facadeShade" },
          { op: "box", x0: -9, y0: 11, z0: -8, x1: 9, y1: 12, z1: 8, color: "facadeShade" },
          { op: "box", x0: -9, y0: 17, z0: -8, x1: 9, y1: 18, z1: 8, color: "facadeShade" },
          { op: "box", x0: -9, y0: 23, z0: -8, x1: 9, y1: 24, z1: 8, color: "facadeShade" },
          { op: "box", x0: -9, y0: 30, z0: -8, x1: 9, y1: 31, z1: 8, color: "slate" },
          { op: "box", x0: -7, y0: 31, z0: -6, x1: 7, y1: 32, z1: 6, color: "facadeShade" },
          { op: "box", x0: -6, y0: 32, z0: -5, x1: -1, y1: 36, z1: 0, color: "brick" },
          { op: "cylinder", axis: "y", cx: 4, y0: 32, y1: 37, cz: -2, radius: 2.2, color: "steel" },
          { op: "box", x0: 3, y0: 7, z0: 6, x1: 6, y1: 10, z1: 7, color: "warmGlow", emit: 0.9, mirrorX: true },
          { op: "box", x0: 3, y0: 13, z0: 6, x1: 6, y1: 16, z1: 7, color: "glass", mirrorX: true },
          { op: "box", x0: 3, y0: 19, z0: 6, x1: 6, y1: 22, z1: 7, color: "warmGlow", emit: 0.95, mirrorX: true },
          { op: "box", x0: 3, y0: 25, z0: 6, x1: 6, y1: 28, z1: 7, color: "glass", mirrorX: true },
          { op: "box", x0: -1, y0: 13, z0: 6, x1: 1, y1: 16, z1: 7, color: "warmGlow", emit: 0.85 },
          { op: "box", x0: -1, y0: 25, z0: 6, x1: 1, y1: 28, z1: 7, color: "warmGlow", emit: 0.85 },
          { op: "box", x0: 7, y0: 13, z0: -3, x1: 8, y1: 16, z1: 3, color: "glass", mirrorX: true },
          { op: "box", x0: 7, y0: 19, z0: -3, x1: 8, y1: 22, z1: 3, color: "warmGlow", emit: 0.8, mirrorX: true },
          { op: "box", x0: 7, y0: 25, z0: -3, x1: 8, y1: 28, z1: 3, color: "glass", mirrorX: true },
          { op: "box", x0: 2, y0: 12, z0: 7, x1: 7, y1: 13, z1: 9, color: "balcony", mirrorX: true },
          { op: "box", x0: 2, y0: 18, z0: 7, x1: 7, y1: 19, z1: 9, color: "balcony", mirrorX: true },
          { op: "box", x0: 2, y0: 24, z0: 7, x1: 7, y1: 25, z1: 9, color: "balcony", mirrorX: true },
          { op: "box", x0: 5, y0: 13, z0: 7, x1: 6, y1: 14, z1: 8, color: "leaf", mirrorX: true },
          { op: "box", x0: 5, y0: 25, z0: 7, x1: 6, y1: 26, z1: 8, color: "leaf", mirrorX: true },
        ],
      }),
  },

  "predio-comercial": {
    id: "predio-comercial",
    categoryId: "predio",
    name: "Torre Comercial",
    description: "Prédio moderno de vidro e aço com fachada panorâmica e topo iluminado.",
    meta: "Construção · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Torre Comercial",
        description: "Edifício comercial de vidro espelhado e aço com hall moderno e topo panorâmico.",
        category: "building",
        scaleClass: "large",
        palette: {
          steel: "#546170",
          steelLight: "#98a8b8",
          glass: "#76c4e6",
          glassBright: "#b4ecff",
          lobbyGlow: "#ffebb0",
          concrete: "#d8d4ca",
          beacon: "#ff5c4a",
        },
        ops: [
          { op: "box", x0: -8, y0: 0, z0: -8, x1: 8, y1: 5, z1: 8, color: "concrete" },
          { op: "box", x0: -6, y0: 1, z0: 7, x1: 6, y1: 4, z1: 8, color: "lobbyGlow", emit: 1.0 },
          { op: "box", x0: -7, y0: 5, z0: -7, x1: 7, y1: 34, z1: 7, color: "glass" },
          { op: "pillars", x0: -7, y0: 5, z0: -7, x1: 7, y1: 35, z1: 7, color: "steel" },
          { op: "box", x0: -8, y0: 10, z0: -8, x1: 8, y1: 11, z1: 8, color: "steelLight" },
          { op: "box", x0: -8, y0: 16, z0: -8, x1: 8, y1: 17, z1: 8, color: "steelLight" },
          { op: "box", x0: -8, y0: 22, z0: -8, x1: 8, y1: 23, z1: 8, color: "steelLight" },
          { op: "box", x0: -8, y0: 28, z0: -8, x1: 8, y1: 29, z1: 8, color: "steelLight" },
          { op: "box", x0: -8, y0: 34, z0: -8, x1: 8, y1: 36, z1: 8, color: "steel" },
          { op: "box", x0: -5, y0: 12, z0: 6, x1: 5, y1: 15, z1: 7, color: "glassBright", emit: 0.45 },
          { op: "box", x0: -5, y0: 24, z0: 6, x1: 5, y1: 27, z1: 7, color: "lobbyGlow", emit: 0.7 },
          { op: "box", x0: -4, y0: 36, z0: -4, x1: 4, y1: 40, z1: 4, color: "steelLight" },
          { op: "box", x0: 0, y0: 40, z0: 0, x1: 1, y1: 45, z1: 1, color: "steel" },
          { op: "box", x0: 0, y0: 45, z0: 0, x1: 1, y1: 46, z1: 1, color: "beacon", emit: 1.5 },
        ],
      }),
  },

  "predio-mirante-giratorio": {
    id: "predio-mirante-giratorio",
    categoryId: "predio",
    name: "Torre Mirante Giratória",
    description: "Arranha-céu sofisticado com restaurante panorâmico giratório e antena no topo.",
    meta: "Prédio · Animado · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Torre Mirante Giratória",
        description: "Torre espelhada de luxo com mirante panorâmico giratório iluminado e coroa dourada.",
        category: "building",
        scaleClass: "large",
        palette: {
          marble: "#efe9dc",
          gold: "#e0b354",
          glass: "#74c2e6",
          glassLight: "#b8ecff",
          navy: "#2c384a",
          warmGlow: "#ffe69e",
          beacon: "#ff5a4a",
          leaf: "#54a84e",
        },
        ops: [
          // Grand marble podium + glowing atrium
          { op: "roundedBox", x0: -9, y0: 0, z0: -9, x1: 9, y1: 5, z1: 9, radius: 1.2, color: "marble" },
          { op: "box", x0: -6, y0: 1, z0: 8, x1: 6, y1: 4, z1: 9, color: "warmGlow", emit: 1.1 },
          { op: "box", x0: -8, y0: 5, z0: -8, x1: 8, y1: 6, z1: 8, color: "gold" },
          { op: "box", x0: 6, y0: 6, z0: 6, x1: 8, y1: 8, z1: 8, color: "leaf", mirrorX: true },
          // Sleek tapered glass & navy core
          { op: "cylinder", axis: "y", cx: 0, cz: 0, y0: 6, y1: 30, radius: 5.5, color: "glass" },
          { op: "cylinder", axis: "y", cx: 0, cz: 0, y0: 11, y1: 12, radius: 6.0, color: "gold" },
          { op: "cylinder", axis: "y", cx: 0, cz: 0, y0: 17, y1: 18, radius: 6.0, color: "gold" },
          { op: "cylinder", axis: "y", cx: 0, cz: 0, y0: 23, y1: 24, radius: 6.0, color: "gold" },
          { op: "box", x0: -1, y0: 6, z0: -6, x1: 1, y1: 30, z1: 6, color: "navy" },
          { op: "box", x0: -6, y0: 6, z0: -1, x1: 6, y1: 30, z1: 1, color: "navy" },
          { op: "cylinder", axis: "y", cx: 0, cz: 0, y0: 30, y1: 32, radius: 6.4, color: "marble" },
        ],
        parts: [
          {
            name: "rotating-sky-lounge",
            kind: "spinY",
            speed: 0.65,
            pivot: [0, 32, 0],
            ops: [
              { op: "cylinder", axis: "y", cx: 0, cz: 0, y0: 0, y1: 4, radius: 7.4, color: "glassLight", emit: 0.6 },
              { op: "ring", axis: "y", cx: 0, cz: 0, y0: 1, y1: 3, outerR: 7.6, innerR: 6.6, color: "warmGlow", emit: 1.1 },
              { op: "cylinder", axis: "y", cx: 0, cz: 0, y0: 4, y1: 6, radius: 6.2, color: "navy" },
              { op: "cylinder", axis: "y", cx: 0, cz: 0, y0: 6, y1: 7, radius: 4.0, color: "gold" },
              { op: "box", x0: -1, y0: 7, z0: -1, x1: 1, y1: 14, z1: 1, color: "marble" },
              { op: "box", x0: -4, y0: 10, z0: 0, x1: 4, y1: 11, z1: 1, color: "gold" },
              { op: "box", x0: -1, y0: 14, z0: -1, x1: 1, y1: 15, z1: 1, color: "beacon", emit: 1.6 },
            ],
          },
        ],
      }),
  },

  "predio-hotel-luxo": {
    id: "predio-hotel-luxo",
    categoryId: "predio",
    name: "Grand Hotel Boutique",
    description: "Hotel art-déco creme e dourado com toldo iluminado, piscina e estrela giratória.",
    meta: "Prédio · Animado · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Grand Hotel Boutique",
        description: "Grand Hotel sofisticado com fachada art-déco, varandas douradas e estrela giratória no topo.",
        category: "building",
        scaleClass: "large",
        palette: {
          cream: "#f6efe2",
          stone: "#ddd3c0",
          gold: "#e5b84c",
          burgundy: "#9e333c",
          glass: "#92d4ee",
          warmGlow: "#ffe69e",
          water: "#4dc4e8",
          leaf: "#54a84e",
        },
        ops: [
          { op: "hollowBox", x0: -10, y0: 0, z0: -8, x1: 10, y1: 6, z1: 8, wall: 1, color: "stone", trim: "gold" },
          // Red carpet & grand entrance marquee
          { op: "box", x0: -3, y0: 0, z0: 8, x1: 3, y1: 1, z1: 11, color: "burgundy" },
          { op: "box", x0: -5, y0: 5, z0: 8, x1: 5, y1: 6, z1: 11, color: "burgundy" },
          { op: "box", x0: -5, y0: 6, z0: 8, x1: 5, y1: 7, z1: 11, color: "gold", emit: 0.7 },
          { op: "box", x0: -4, y0: 1, z0: 7, x1: 4, y1: 5, z1: 8, color: "warmGlow", emit: 1.1 },
          // Main art-deco stepped hotel body
          { op: "hollowBox", x0: -9, y0: 6, z0: -7, x1: 9, y1: 24, z1: 7, wall: 1, color: "cream", trim: "gold" },
          { op: "hollowBox", x0: -6, y0: 24, z0: -5, x1: 6, y1: 31, z1: 5, wall: 1, color: "cream", trim: "gold" },
          // Illuminated guestroom windows
          ...[9, 14, 19].flatMap((y) => [
            { op: "box", x0: 5, y0: y, z0: 6, x1: 7, y1: y + 3, z1: 7, color: "warmGlow", emit: 0.9, mirrorX: true },
            { op: "box", x0: 1, y0: y, z0: 6, x1: 3, y1: y + 3, z1: 7, color: "glass", mirrorX: true },
            { op: "box", x0: 5, y0: y, z0: -7, x1: 7, y1: y + 3, z1: -6, color: "warmGlow", emit: 0.85, mirrorX: true },
          ]),
          // Penthouse terrace pool & greenery
          { op: "box", x0: -4, y0: 24, z0: 5, x1: 4, y1: 25, z1: 7, color: "water", emit: 0.35 },
          { op: "box", x0: 6, y0: 24, z0: 5, x1: 8, y1: 26, z1: 7, color: "leaf", mirrorX: true },
          { op: "box", x0: -4, y0: 26, z0: 4, x1: 4, y1: 29, z1: 5, color: "warmGlow", emit: 1.0 },
        ],
        parts: [
          {
            name: "hotel-star-crown",
            kind: "spinY",
            speed: 1.1,
            pivot: [0, 31, 0],
            ops: [
              { op: "box", x0: -1, y0: 0, z0: -1, x1: 1, y1: 4, z1: 1, color: "gold" },
              { op: "box", x0: -5, y0: 4, z0: -1, x1: 5, y1: 6, z1: 1, color: "gold", emit: 1.2 },
              { op: "box", x0: -1, y0: 2, z0: -1, x1: 1, y1: 8, z1: 1, color: "warmGlow", emit: 1.4 },
              { op: "box", x0: -1, y0: 4, z0: -4, x1: 1, y1: 6, z1: 4, color: "gold", emit: 1.1 },
            ],
          },
        ],
      }),
  },

  "predio-ecotorre": {
    id: "predio-ecotorre",
    categoryId: "predio",
    name: "Eco-Torre Sustentável",
    description: "Torre futurista com jardins suspensos, varandas verdes e turbinas eólicas giratórias.",
    meta: "Prédio · Animado · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Eco-Torre Sustentável",
        description: "Edifício sustentável de vidro e madeira com jardins suspensos e turbinas eólicas animadas.",
        category: "building",
        scaleClass: "large",
        palette: {
          white: "#f4f6f4",
          wood: "#be8a54",
          glass: "#8bd8ee",
          leaf: "#4aa84a",
          leafLight: "#78cf64",
          flower: "#f488a4",
          blade: "#eef4f8",
          hub: "#3c4a58",
        },
        ops: [
          { op: "roundedBox", x0: -9, y0: 0, z0: -8, x1: 9, y1: 8, z1: 8, radius: 1.2, color: "white" },
          { op: "box", x0: -7, y0: 1, z0: 7, x1: 7, y1: 6, z1: 8, color: "glass" },
          { op: "box", x0: -9, y0: 7, z0: 6, x1: 9, y1: 9, z1: 9, color: "leaf" },
          { op: "box", x0: -6, y0: 9, z0: 7, x1: -4, y1: 10, z1: 8, color: "flower" },
          // Terraced mid floors
          { op: "roundedBox", x0: -8, y0: 8, z0: -7, x1: 8, y1: 18, z1: 6, radius: 1.0, color: "glass" },
          { op: "box", x0: -9, y0: 12, z0: -8, x1: 9, y1: 13, z1: 7, color: "wood" },
          { op: "box", x0: -9, y0: 13, z0: 5, x1: 9, y1: 15, z1: 7, color: "leafLight" },
          { op: "box", x0: -9, y0: 18, z0: -8, x1: 9, y1: 19, z1: 7, color: "white" },
          { op: "box", x0: -8, y0: 19, z0: -7, x1: 8, y1: 21, z1: 6, color: "leaf" },
          // Upper glass tower
          { op: "roundedBox", x0: -6, y0: 19, z0: -6, x1: 6, y1: 31, z1: 4, radius: 1.0, color: "glass" },
          { op: "box", x0: -7, y0: 25, z0: -7, x1: 7, y1: 26, z1: 5, color: "wood" },
          { op: "box", x0: -7, y0: 31, z0: -7, x1: 7, y1: 32, z1: 5, color: "white" },
          { op: "box", x0: -6, y0: 32, z0: -6, x1: 6, y1: 33, z1: 4, color: "leafLight" },
          // Turbine masts
          { op: "box", x0: 3, y0: 32, z0: -1, x1: 4, y1: 39, z1: 0, color: "hub", mirrorX: true },
        ],
        parts: [
          {
            name: "wind-turbine-right",
            kind: "spinZ",
            speed: 3.4,
            pivot: [3.5, 38.5, 0.5],
            ops: [
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 1, y1: 6, z1: 1, color: "blade" },
              { op: "box", x0: 0, y0: -5, z0: 0, x1: 1, y1: 0, z1: 1, color: "blade" },
              { op: "box", x0: -5, y0: 0, z0: 0, x1: 6, y1: 1, z1: 1, color: "blade" },
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 1, y1: 1, z1: 1, color: "hub" },
            ],
          },
          {
            name: "wind-turbine-left",
            kind: "spinZ",
            speed: 3.4,
            phase: 1.1,
            pivot: [-3.5, 38.5, 0.5],
            ops: [
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 1, y1: 6, z1: 1, color: "blade" },
              { op: "box", x0: 0, y0: -5, z0: 0, x1: 1, y1: 0, z1: 1, color: "blade" },
              { op: "box", x0: -5, y0: 0, z0: 0, x1: 6, y1: 1, z1: 1, color: "blade" },
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 1, y1: 1, z1: 1, color: "hub" },
            ],
          },
        ],
      }),
  },

  "predio-relogio-central": {
    id: "predio-relogio-central",
    categoryId: "predio",
    name: "Edifício do Relógio",
    description: "Prédio clássico europeu com cúpula de cobre, mostrador iluminado e ponteiros giratórios.",
    meta: "Prédio · Animado · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Edifício do Relógio",
        description: "Torre clássica de pedra clara com cúpula esmeralda e relógio iluminado com ponteiros animados.",
        category: "building",
        scaleClass: "large",
        palette: {
          limestone: "#ece3cf",
          stoneShade: "#d0c4ab",
          copper: "#4d9e8a",
          copperDark: "#367868",
          gold: "#e5b84c",
          clockFace: "#fff9e6",
          hand: "#232830",
          warmGlow: "#ffe296",
        },
        ops: [
          { op: "hollowBox", x0: -8, y0: 0, z0: -8, x1: 8, y1: 12, z1: 8, wall: 1, color: "limestone", trim: "stoneShade" },
          { op: "arch", cx: 0, y0: 0, cz: 7, halfSpan: 3, height: 7, depth: 2, axis: "z", color: "stoneShade" },
          { op: "box", x0: -2, y0: 1, z0: 6, x1: 2, y1: 6, z1: 7, color: "warmGlow", emit: 1.0 },
          { op: "hollowBox", x0: -6, y0: 12, z0: -6, x1: 6, y1: 29, z1: 6, wall: 1, color: "limestone", trim: "gold" },
          // Clock dial on front and back
          { op: "cylinder", axis: "z", cx: 0, cy: 23, z0: 5, z1: 6, radius: 4.0, color: "clockFace", emit: 0.9 },
          { op: "ring", axis: "z", cx: 0, cy: 23, z0: 6, z1: 7, outerR: 4.3, innerR: 3.4, color: "gold" },
          { op: "cylinder", axis: "z", cx: 0, cy: 23, z0: -7, z1: -6, radius: 4.0, color: "clockFace", emit: 0.9 },
          // Copper dome & gold spire
          { op: "box", x0: -7, y0: 29, z0: -7, x1: 7, y1: 30, z1: 7, color: "stoneShade" },
          { op: "dome", cx: 0, yBase: 30, cz: 0, radius: 5.5, color: "copper" },
          { op: "cone", cx: 0, y0: 35, y1: 42, cz: 0, rBottom: 2.0, rTop: 0.4, color: "copperDark" },
          { op: "box", x0: 0, y0: 42, z0: 0, x1: 1, y1: 44, z1: 1, color: "gold", emit: 1.2 },
        ],
        parts: [
          {
            name: "clock-hand",
            kind: "spinZ",
            speed: -0.9,
            pivot: [0, 23, 6.8],
            ops: [
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 1, y1: 3, z1: 1, color: "hand" },
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 2, y1: 1, z1: 1, color: "gold" },
            ],
          },
          {
            name: "belfry-pendulum",
            kind: "swingZ",
            speed: 1.6,
            amp: 0.28,
            pivot: [0, 17, 6.5],
            ops: [
              { op: "box", x0: 0, y0: -4, z0: 0, x1: 1, y1: 0, z1: 1, color: "gold" },
              { op: "box", x0: -1, y0: -5, z0: 0, x1: 2, y1: -3, z1: 1, color: "gold", emit: 0.8 },
            ],
          },
        ],
      }),
  },

  // ---------------- 2. CASA ----------------
  "casa-campo": {
    id: "casa-campo",
    categoryId: "casa",
    name: "Casa de Campo",
    description: "Telhado cerâmico, varanda de madeira, chaminé e floreiras coloridas.",
    meta: "Casa · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Casa de Campo",
        description: "Casa charmosa com telhado em duas águas, chaminé de tijolos e varanda florida.",
        category: "building",
        scaleClass: "medium",
        palette: {
          plaster: "#f7efe0",
          wood: "#a87040",
          woodDark: "#6e4626",
          roof: "#c96244",
          brick: "#b35b42",
          windowGlow: "#ffe296",
          leaf: "#58ad52",
          flower: "#ec7da0",
          stone: "#cfc8ba",
        },
        ops: [
          { op: "hollowBox", x0: -8, y0: 0, z0: -6, x1: 8, y1: 9, z1: 6, wall: 1, color: "plaster", trim: "wood" },
          { op: "roofGable", x0: -9, yBase: 9, z0: -7, x1: 9, z1: 7, rise: 6, axis: "x", color: "roof", trim: "woodDark" },
          { op: "box", x0: 4, y0: 10, z0: -4, x1: 7, y1: 18, z1: -1, color: "brick" },
          { op: "box", x0: -6, y0: 0, z0: 6, x1: 6, y1: 1, z1: 9, color: "stone" },
          { op: "pillars", x0: -6, y0: 1, z0: 6, x1: 6, y1: 7, z1: 9, color: "wood" },
          { op: "box", x0: -6, y0: 7, z0: 6, x1: 6, y1: 8, z1: 9, color: "roof" },
          { op: "box", x0: -1, y0: 1, z0: 5, x1: 2, y1: 6, z1: 6, color: "woodDark" },
          { op: "box", x0: 4, y0: 3, z0: 5, x1: 7, y1: 6, z1: 6, color: "windowGlow", emit: 1.0, mirrorX: true },
          { op: "box", x0: 4, y0: 2, z0: 6, x1: 7, y1: 3, z1: 7, color: "woodDark", mirrorX: true },
          { op: "box", x0: 4, y0: 3, z0: 6, x1: 7, y1: 4, z1: 7, color: "leaf", mirrorX: true },
          { op: "box", x0: 5, y0: 4, z0: 6, x1: 6, y1: 5, z1: 7, color: "flower", mirrorX: true },
          { op: "box", x0: 7, y0: 3, z0: -2, x1: 8, y1: 6, z1: 2, color: "windowGlow", emit: 0.9, mirrorX: true },
        ],
      }),
  },

  "casa-moderna": {
    id: "casa-moderna",
    categoryId: "casa",
    name: "Sobrado Moderno",
    description: "Dois andares com janelas amplas, deck de madeira e iluminação aconchegante.",
    meta: "Casa · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Sobrado Moderno",
        description: "Residência contemporânea em dois pavimentos com grandes painéis de vidro e varanda superior.",
        category: "building",
        scaleClass: "medium",
        palette: {
          white: "#f6f5f0",
          charcoal: "#343a44",
          wood: "#c98f56",
          glass: "#a2dff2",
          warmGlow: "#ffe6a6",
          leaf: "#58ad52",
        },
        ops: [
          { op: "hollowBox", x0: -8, y0: 0, z0: -6, x1: 8, y1: 7, z1: 6, wall: 1, color: "white", trim: "charcoal" },
          { op: "box", x0: -6, y0: 1, z0: 5, x1: 2, y1: 6, z1: 6, color: "glass" },
          { op: "box", x0: 3, y0: 1, z0: 5, x1: 6, y1: 6, z1: 6, color: "wood" },
          { op: "hollowBox", x0: -7, y0: 7, z0: -6, x1: 9, y1: 14, z1: 8, wall: 1, color: "white", trim: "charcoal" },
          { op: "box", x0: -5, y0: 8, z0: 7, x1: 7, y1: 12, z1: 8, color: "warmGlow", emit: 0.85 },
          { op: "box", x0: -8, y0: 14, z0: -7, x1: 10, y1: 15, z1: 9, color: "charcoal" },
          { op: "box", x0: -8, y0: 0, z0: 6, x1: -2, y1: 1, z1: 9, color: "wood" },
          { op: "box", x0: -8, y0: 1, z0: 8, x1: -5, y1: 3, z1: 9, color: "leaf" },
        ],
      }),
  },

  "casa-chale": {
    id: "casa-chale",
    categoryId: "casa",
    name: "Chalé de Madeira",
    description: "Chalé alpino de madeira com telhado inclinado, varanda e lareira de pedra.",
    meta: "Casa · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Chalé de Madeira",
        description: "Chalé aconchegante de madeira maciça com telhado inclinado e chaminé de pedra.",
        category: "building",
        scaleClass: "medium",
        palette: {
          log: "#a46a3c",
          logDark: "#6e4322",
          roof: "#46584b",
          stone: "#8d9296",
          warmGlow: "#ffe294",
          leaf: "#4e9e4a",
        },
        ops: [
          { op: "box", x0: -7, y0: 0, z0: -7, x1: 7, y1: 2, z1: 8, color: "stone" },
          { op: "hollowBox", x0: -6, y0: 2, z0: -6, x1: 6, y1: 9, z1: 5, wall: 1, color: "log", trim: "logDark" },
          { op: "roofGable", x0: -8, yBase: 8, z0: -7, x1: 8, z1: 7, rise: 8, axis: "z", color: "roof", trim: "logDark" },
          { op: "box", x0: -2, y0: 2, z0: 4, x1: 2, y1: 7, z1: 5, color: "logDark" },
          { op: "box", x0: -2, y0: 10, z0: 4, x1: 2, y1: 13, z1: 5, color: "warmGlow", emit: 1.0 },
          { op: "box", x0: 3, y0: 4, z0: 4, x1: 5, y1: 7, z1: 5, color: "warmGlow", emit: 0.95, mirrorX: true },
          { op: "box", x0: -8, y0: 2, z0: -3, x1: -6, y1: 16, z1: 0, color: "stone" },
          { op: "box", x0: 5, y0: 2, z0: 6, x1: 7, y1: 4, z1: 8, color: "leaf", mirrorX: true },
        ],
      }),
  },

  "casa-mansao-piscina": {
    id: "casa-mansao-piscina",
    categoryId: "casa",
    name: "Mansão com Piscina",
    description: "Residência de luxo com varanda panorâmica, piscina azul iluminada e jardim.",
    meta: "Casa · Animada · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Mansão com Piscina",
        description: "Mansão contemporânea de pedra clara e vidro com piscina turquesa, pergolado e palmeira.",
        category: "building",
        scaleClass: "large",
        palette: {
          stucco: "#f8f4ec",
          limestone: "#dcd3c2",
          wood: "#b87e46",
          glass: "#9adbf0",
          warmGlow: "#ffe6a3",
          water: "#3ec2eb",
          deck: "#d4a672",
          leaf: "#4ca64a",
          umbrella: "#eb6b56",
        },
        ops: [
          // Travertine patio + swimming pool
          { op: "box", x0: -12, y0: 0, z0: -9, x1: 12, y1: 1, z1: 11, color: "limestone" },
          { op: "box", x0: -10, y0: 1, z0: 3, x1: 2, y1: 2, z1: 10, color: "water", emit: 0.45 },
          { op: "box", x0: 3, y0: 1, z0: 4, x1: 10, y1: 2, z1: 10, color: "deck" },
          // Ground floor residence
          { op: "hollowBox", x0: -11, y0: 1, z0: -8, x1: 11, y1: 8, z1: 2, wall: 1, color: "stucco", trim: "wood" },
          { op: "box", x0: -8, y0: 2, z0: 1, x1: 8, y1: 7, z1: 2, color: "warmGlow", emit: 0.95 },
          // Second floor cantilevered suite
          { op: "hollowBox", x0: -5, y0: 8, z0: -7, x1: 11, y1: 15, z1: 4, wall: 1, color: "stucco", trim: "limestone" },
          { op: "box", x0: -3, y0: 9, z0: 3, x1: 9, y1: 13, z1: 4, color: "glass" },
          { op: "box", x0: -6, y0: 15, z0: -8, x1: 12, y1: 16, z1: 5, color: "wood" },
          // Roof terrace hedges
          { op: "box", x0: -11, y0: 8, z0: -7, x1: -6, y1: 10, z1: 1, color: "leaf" },
          // Garden palm beside pool
          { op: "box", x0: -11, y0: 1, z0: 9, x1: -10, y1: 9, z1: 10, color: "wood" },
          { op: "sphere", cx: -10, cy: 10, cz: 9, rx: 3, ry: 2, rz: 3, color: "leaf" },
        ],
        parts: [
          {
            name: "poolside-umbrella",
            kind: "spinY",
            speed: 0.5,
            pivot: [7, 2, 7],
            ops: [
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 1, y1: 5, z1: 1, color: "wood" },
              { op: "cone", cx: 0, y0: 5, y1: 7, cz: 0, rBottom: 3.2, rTop: 0.4, color: "umbrella" },
            ],
          },
        ],
      }),
  },

  "casa-vitoriana": {
    id: "casa-vitoriana",
    categoryId: "casa",
    name: "Casarão Vitoriano",
    description: "Casa clássica azul-pastel com torreão redondo, varanda florida e lanterna balançando.",
    meta: "Casa · Animada · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Casarão Vitoriano",
        description: "Casarão vitoriano azul-claro e creme com torreão de telhado cônico, varanda e flores.",
        category: "building",
        scaleClass: "medium",
        palette: {
          skyWall: "#9cc4dc",
          cream: "#faf4e6",
          slate: "#434c5e",
          door: "#7c482c",
          warmGlow: "#ffe294",
          leaf: "#54a84e",
          flower: "#f284a8",
          gold: "#e5b84c",
        },
        ops: [
          { op: "hollowBox", x0: -8, y0: 0, z0: -6, x1: 6, y1: 11, z1: 6, wall: 1, color: "skyWall", trim: "cream" },
          { op: "roofGable", x0: -9, yBase: 11, z0: -7, x1: 7, z1: 7, rise: 6, axis: "x", color: "slate", trim: "cream" },
          // Round Victorian corner turret
          { op: "cylinder", axis: "y", cx: 6, cz: 4, y0: 0, y1: 15, radius: 4.0, color: "skyWall" },
          { op: "cone", cx: 6, y0: 15, y1: 22, cz: 4, rBottom: 4.6, rTop: 0.5, color: "slate" },
          { op: "box", x0: 6, y0: 22, z0: 4, x1: 7, y1: 23, z1: 5, color: "gold" },
          // Front wrap porch & glowing windows
          { op: "box", x0: -8, y0: 0, z0: 6, x1: 3, y1: 1, z1: 9, color: "cream" },
          { op: "pillars", x0: -8, y0: 1, z0: 6, x1: 3, y1: 6, z1: 9, color: "cream" },
          { op: "box", x0: -8, y0: 6, z0: 6, x1: 3, y1: 7, z1: 9, color: "slate" },
          { op: "box", x0: -3, y0: 1, z0: 5, x1: 0, y1: 5, z1: 6, color: "door" },
          { op: "box", x0: -6, y0: 2, z0: 5, x1: -4, y1: 5, z1: 6, color: "warmGlow", emit: 0.95 },
          { op: "box", x0: -6, y0: 8, z0: 5, x1: -3, y1: 10, z1: 6, color: "warmGlow", emit: 0.9 },
          { op: "box", x0: 5, y0: 9, z0: 7, x1: 7, y1: 13, z1: 8, color: "warmGlow", emit: 1.0 },
          { op: "box", x0: -7, y0: 1, z0: 8, x1: -4, y1: 2, z1: 9, color: "leaf" },
          { op: "box", x0: -6, y0: 2, z0: 8, x1: -5, y1: 3, z1: 9, color: "flower" },
        ],
        parts: [
          {
            name: "porch-lantern",
            kind: "swingZ",
            speed: 1.4,
            amp: 0.22,
            pivot: [-1.5, 6, 8],
            ops: [
              { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 0, z1: 1, color: "gold" },
              { op: "box", x0: 0, y0: -3, z0: 0, x1: 1, y1: -2, z1: 1, color: "warmGlow", emit: 1.4 },
            ],
          },
        ],
      }),
  },

  "casa-praia": {
    id: "casa-praia",
    categoryId: "casa",
    name: "Casa de Praia",
    description: "Casa litorânea sobre palafitas com telhado azul, prancha de surfe e catavento.",
    meta: "Casa · Animada · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Casa de Praia",
        description: "Casa praiana elevada sobre deck de madeira com telhado turquesa, prancha e catavento.",
        category: "building",
        scaleClass: "medium",
        palette: {
          white: "#faf8f2",
          deck: "#cfa068",
          woodDark: "#8c5c34",
          roof: "#3c9cb8",
          glass: "#a2e4f6",
          warmGlow: "#ffe69e",
          surf: "#f26b4e",
          sand: "#f2dfab",
        },
        ops: [
          { op: "box", x0: -9, y0: 0, z0: -7, x1: 9, y1: 1, z1: 9, color: "sand" },
          // Raised stilt deck
          { op: "pillars", x0: -8, y0: 1, z0: -6, x1: 8, y1: 4, z1: 8, color: "woodDark" },
          { op: "box", x0: -8, y0: 4, z0: -6, x1: 8, y1: 5, z1: 8, color: "deck" },
          { op: "stairs", x0: -2, y0: 1, z0: 8, steps: 3, width: 4, dir: "-z", color: "deck" },
          // Breezy beach cottage
          { op: "hollowBox", x0: -7, y0: 5, z0: -5, x1: 7, y1: 11, z1: 4, wall: 1, color: "white", trim: "roof" },
          { op: "roofGable", x0: -8, yBase: 11, z0: -6, x1: 8, z1: 5, rise: 5, axis: "x", color: "roof", trim: "white" },
          { op: "box", x0: -5, y0: 6, z0: 3, x1: 1, y1: 10, z1: 4, color: "glass" },
          { op: "box", x0: 2, y0: 6, z0: 3, x1: 5, y1: 10, z1: 4, color: "warmGlow", emit: 0.9 },
          // Surfboard leaning by the deck
          { op: "box", x0: 6, y0: 5, z0: 5, x1: 7, y1: 10, z1: 6, color: "surf" },
        ],
        parts: [
          {
            name: "beach-weathervane",
            kind: "spinY",
            speed: 1.8,
            pivot: [0, 16, 0],
            ops: [
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 1, y1: 3, z1: 1, color: "woodDark" },
              { op: "box", x0: -3, y0: 2, z0: 0, x1: 4, y1: 3, z1: 1, color: "surf" },
            ],
          },
        ],
      }),
  },

  "casa-japonesa": {
    id: "casa-japonesa",
    categoryId: "casa",
    name: "Casa Jardim Oriental",
    description: "Pavilhão tradicional de telhado curvo, portas shoji iluminadas e cerejeira florida.",
    meta: "Casa · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Casa Jardim Oriental",
        description: "Residência oriental com telhado pagode escuro, painéis iluminados e cerejeira em flor.",
        category: "building",
        scaleClass: "medium",
        palette: {
          plaster: "#f7f2e6",
          timber: "#5a3a24",
          roof: "#353c48",
          red: "#c84438",
          shoji: "#fff0bd",
          stone: "#b6b2a6",
          sakura: "#f7a8c4",
          sakuraLight: "#ffd0e2",
        },
        ops: [
          { op: "box", x0: -9, y0: 0, z0: -7, x1: 9, y1: 2, z1: 7, color: "stone" },
          { op: "hollowBox", x0: -7, y0: 2, z0: -5, x1: 7, y1: 9, z1: 5, wall: 1, color: "plaster", trim: "timber" },
          { op: "box", x0: -5, y0: 3, z0: 4, x1: 5, y1: 8, z1: 5, color: "shoji", emit: 0.95 },
          { op: "box", x0: -1, y0: 3, z0: 4, x1: 1, y1: 8, z1: 5, color: "timber" },
          // Curved sweeping pagoda roof
          { op: "box", x0: -10, y0: 9, z0: -8, x1: 10, y1: 10, z1: 8, color: "roof" },
          { op: "box", x0: -11, y0: 10, z0: -8, x1: -9, y1: 11, z1: 8, color: "roof", mirrorX: true },
          { op: "roofGable", x0: -9, yBase: 10, z0: -7, x1: 9, z1: 7, rise: 5, axis: "x", color: "roof", trim: "red" },
          // Red entry torii accent & sakura tree
          { op: "box", x0: -3, y0: 2, z0: 6, x1: 3, y1: 3, z1: 8, color: "red" },
          { op: "box", x0: 8, y0: 2, z0: 4, x1: 9, y1: 8, z1: 5, color: "timber" },
          { op: "sphere", cx: 8, cy: 9, cz: 4, rx: 3.2, ry: 2.5, rz: 3.2, color: "sakura" },
          { op: "sphere", cx: 9, cy: 10, cz: 5, rx: 2.0, ry: 1.6, rz: 2.0, color: "sakuraLight" },
        ],
      }),
  },

  // ---------------- 3. CARRO ----------------
  "carro-esportivo": {
    id: "carro-esportivo",
    categoryId: "carro",
    name: "Carro Esportivo",
    description: "Cupê vermelho rápido com aerofólio, faróis acesos e rodas giratórias.",
    meta: "Carro · Dirige no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 6.2,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Carro Esportivo",
        description: "Cupê esportivo vermelho circulando pelas estradas da ilha.",
        category: "vehicle",
        scaleClass: "small",
        palette: {
          red: "#df443a",
          redDark: "#a82d26",
          glass: "#9bdaf0",
          trim: "#22262e",
          chrome: "#dce4ec",
          headlight: "#fff2b8",
          taillight: "#ff3e36",
          tire: "#1f2228",
        },
        ops: [
          { op: "roundedBox", x0: -5, y0: 2, z0: -10, x1: 5, y1: 5, z1: 10, radius: 1.3, color: "red" },
          { op: "box", x0: -5, y0: 1, z0: -10, x1: 5, y1: 2, z1: 10, color: "redDark" },
          { op: "roundedBox", x0: -4, y0: 5, z0: -5, x1: 4, y1: 8, z1: 4, radius: 1.1, color: "red" },
          { op: "box", x0: -3, y0: 5, z0: -4, x1: 3, y1: 7, z1: 5, color: "glass" },
          { op: "box", x0: -5, y0: 6, z0: -10, x1: 5, y1: 7, z1: -8, color: "trim" },
          { op: "box", x0: 3, y0: 5, z0: -9, x1: 4, y1: 6, z1: -8, color: "trim", mirrorX: true },
          { op: "box", x0: -4, y0: 2, z0: 10, x1: 4, y1: 3, z1: 11, color: "trim" },
          { op: "box", x0: 3, y0: 3, z0: 9, x1: 5, y1: 4, z1: 10, color: "headlight", emit: 1.5, mirrorX: true },
          { op: "box", x0: 3, y0: 3, z0: -10, x1: 5, y1: 4, z1: -9, color: "taillight", emit: 1.3, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: 4, x1: 6, y1: 4, z1: 9, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: -9, x1: 6, y1: 4, z1: -4, mirrorX: true },
        ],
        parts: [
          {
            name: "front-axle",
            kind: "wheel",
            speed: 1.2,
            pivot: [0, 2, 6.5],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.0, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.0, color: "chrome", mirrorX: true },
            ],
          },
          {
            name: "rear-axle",
            kind: "wheel",
            speed: 1.2,
            pivot: [0, 2, -6.5],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.0, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.0, color: "chrome", mirrorX: true },
            ],
          },
        ],
      }),
  },

  "carro-picape": {
    id: "carro-picape",
    categoryId: "carro",
    name: "Picape Utilitária",
    description: "Caminhonete azul com caçamba carregada, para-choques cromados e rodas largas.",
    meta: "Carro · Dirige no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 5.0,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Picape Utilitária",
        description: "Caminhonete utilitária azul transportando caixas pelas estradas da ilha.",
        category: "vehicle",
        scaleClass: "small",
        palette: {
          blue: "#3e78c8",
          blueDark: "#2b5896",
          glass: "#a6e0f5",
          chrome: "#dae2eb",
          crate: "#d49c5a",
          tire: "#20232a",
          headlight: "#fff1b2",
          taillight: "#ff473c",
        },
        ops: [
          { op: "roundedBox", x0: -5, y0: 2, z0: -11, x1: 5, y1: 6, z1: 11, radius: 1.2, color: "blue" },
          { op: "clear", x0: -4, y0: 4, z0: -10, x1: 4, y1: 7, z1: -1 },
          { op: "box", x0: -3, y0: 4, z0: -9, x1: 1, y1: 7, z1: -5, color: "crate" },
          { op: "roundedBox", x0: -5, y0: 6, z0: -1, x1: 5, y1: 10, z1: 6, radius: 1.1, color: "blue" },
          { op: "box", x0: -4, y0: 7, z0: 0, x1: 4, y1: 9, z1: 7, color: "glass" },
          { op: "box", x0: -5, y0: 2, z0: 11, x1: 5, y1: 3, z1: 12, color: "chrome" },
          { op: "box", x0: -5, y0: 2, z0: -12, x1: 5, y1: 3, z1: -11, color: "chrome" },
          { op: "box", x0: 3, y0: 4, z0: 10, x1: 5, y1: 5, z1: 11, color: "headlight", emit: 1.4, mirrorX: true },
          { op: "box", x0: 3, y0: 4, z0: -11, x1: 5, y1: 5, z1: -10, color: "taillight", emit: 1.2, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: 4, x1: 6, y1: 5, z1: 10, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: -10, x1: 6, y1: 5, z1: -4, mirrorX: true },
        ],
        parts: [
          {
            name: "front-axle",
            kind: "wheel",
            speed: 1.1,
            pivot: [0, 2.5, 7],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.3, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.1, color: "chrome", mirrorX: true },
            ],
          },
          {
            name: "rear-axle",
            kind: "wheel",
            speed: 1.1,
            pivot: [0, 2.5, -7],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.3, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.1, color: "chrome", mirrorX: true },
            ],
          },
        ],
      }),
  },

  "carro-classico": {
    id: "carro-classico",
    categoryId: "carro",
    name: "Carro Clássico",
    description: "Compacto amarelo retrô com teto creme arredondado e faróis redondos.",
    meta: "Carro · Dirige no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 4.8,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Carro Clássico",
        description: "Carro clássico amarelo com teto creme passeando tranquilamente pela ilha.",
        category: "vehicle",
        scaleClass: "small",
        palette: {
          yellow: "#f2c138",
          cream: "#faf3e0",
          glass: "#a6e0f5",
          chrome: "#dce4ec",
          tire: "#1f2228",
          headlight: "#fff2b5",
          taillight: "#e3443a",
        },
        ops: [
          { op: "roundedBox", x0: -5, y0: 2, z0: -9, x1: 5, y1: 6, z1: 9, radius: 1.6, color: "yellow" },
          { op: "roundedBox", x0: -4, y0: 6, z0: -5, x1: 4, y1: 9, z1: 4, radius: 1.5, color: "cream" },
          { op: "box", x0: -3, y0: 6, z0: -4, x1: 3, y1: 8, z1: 5, color: "glass" },
          { op: "box", x0: -5, y0: 2, z0: 9, x1: 5, y1: 3, z1: 10, color: "chrome" },
          { op: "box", x0: -5, y0: 2, z0: -10, x1: 5, y1: 3, z1: -9, color: "chrome" },
          { op: "box", x0: 3, y0: 4, z0: 8, x1: 5, y1: 5, z1: 9, color: "headlight", emit: 1.4, mirrorX: true },
          { op: "box", x0: 3, y0: 4, z0: -9, x1: 5, y1: 5, z1: -8, color: "taillight", emit: 1.2, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: 3, x1: 6, y1: 4, z1: 8, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: -8, x1: 6, y1: 4, z1: -3, mirrorX: true },
        ],
        parts: [
          {
            name: "front-axle",
            kind: "wheel",
            speed: 1.15,
            pivot: [0, 2, 5.5],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.0, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.1, color: "cream", mirrorX: true },
            ],
          },
          {
            name: "rear-axle",
            kind: "wheel",
            speed: 1.15,
            pivot: [0, 2, -5.5],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.0, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.1, color: "cream", mirrorX: true },
            ],
          },
        ],
      }),
  },

  "carro-conversivel": {
    id: "carro-conversivel",
    categoryId: "carro",
    name: "Conversível de Luxo",
    description: "Conversível turquesa elegante com interior creme, para-brisa inclinado e rodas cromadas.",
    meta: "Carro · Dirige no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 6.0,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Conversível de Luxo",
        description: "Conversível turquesa passeando a céu aberto pelas estradas da ilha.",
        category: "vehicle",
        scaleClass: "small",
        palette: {
          teal: "#2fb5b0",
          tealDark: "#1f8783",
          cream: "#f5e8cc",
          glass: "#a6e4f8",
          chrome: "#e2e8f0",
          tire: "#1f2228",
          headlight: "#fff3b8",
          taillight: "#ff4438",
        },
        ops: [
          { op: "roundedBox", x0: -5, y0: 2, z0: -10, x1: 5, y1: 5, z1: 10, radius: 1.3, color: "teal" },
          { op: "box", x0: -5, y0: 1, z0: -10, x1: 5, y1: 2, z1: 10, color: "tealDark" },
          { op: "clear", x0: -4, y0: 4, z0: -4, x1: 4, y1: 6, z1: 3 },
          { op: "box", x0: -3, y0: 3, z0: -4, x1: 3, y1: 6, z1: -2, color: "cream" },
          { op: "box", x0: -4, y0: 5, z0: 3, x1: 4, y1: 7, z1: 4, color: "glass" },
          { op: "box", x0: -4, y0: 2, z0: 10, x1: 4, y1: 3, z1: 11, color: "chrome" },
          { op: "box", x0: 3, y0: 3, z0: 9, x1: 5, y1: 4, z1: 10, color: "headlight", emit: 1.5, mirrorX: true },
          { op: "box", x0: 3, y0: 3, z0: -10, x1: 5, y1: 4, z1: -9, color: "taillight", emit: 1.3, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: 4, x1: 6, y1: 4, z1: 9, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: -9, x1: 6, y1: 4, z1: -4, mirrorX: true },
        ],
        parts: [
          {
            name: "front-axle",
            kind: "wheel",
            speed: 1.2,
            pivot: [0, 2, 6.5],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.0, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.1, color: "chrome", mirrorX: true },
            ],
          },
          {
            name: "rear-axle",
            kind: "wheel",
            speed: 1.2,
            pivot: [0, 2, -6.5],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.0, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.1, color: "chrome", mirrorX: true },
            ],
          },
        ],
      }),
  },

  "carro-onibus-turistico": {
    id: "carro-onibus-turistico",
    categoryId: "carro",
    name: "Ônibus Turístico",
    description: "Ônibus vermelho de dois andares com teto panorâmico aberto percorrendo a ilha.",
    meta: "Veículo · Dirige no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 4.3,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Ônibus Turístico",
        description: "Ônibus turístico vermelho de dois andares levando visitantes pela ilha.",
        category: "vehicle",
        scaleClass: "medium",
        palette: {
          red: "#d93632",
          cream: "#faf2df",
          glass: "#9eddf4",
          seat: "#3d78c8",
          tire: "#1f2228",
          chrome: "#dce4ec",
          headlight: "#fff2b5",
        },
        ops: [
          { op: "roundedBox", x0: -5, y0: 2, z0: -12, x1: 5, y1: 12, z1: 12, radius: 1.1, color: "red" },
          { op: "box", x0: -5, y0: 7, z0: -12, x1: 5, y1: 8, z1: 12, color: "cream" },
          { op: "box", x0: -4, y0: 4, z0: -10, x1: 4, y1: 7, z1: 12, color: "glass" },
          { op: "clear", x0: -4, y0: 10, z0: -11, x1: 4, y1: 13, z1: 6 },
          { op: "box", x0: -3, y0: 9, z0: -9, x1: 3, y1: 11, z1: -7, color: "seat" },
          { op: "box", x0: -3, y0: 9, z0: -3, x1: 3, y1: 11, z1: -1, color: "seat" },
          { op: "box", x0: -3, y0: 9, z0: 3, x1: 3, y1: 11, z1: 5, color: "seat" },
          { op: "box", x0: -4, y0: 9, z0: 7, x1: 4, y1: 11, z1: 12, color: "glass" },
          { op: "box", x0: 3, y0: 3, z0: 11, x1: 5, y1: 4, z1: 12, color: "headlight", emit: 1.5, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: 5, x1: 6, y1: 5, z1: 10, mirrorX: true },
          { op: "clear", x0: 3, y0: 0, z0: -10, x1: 6, y1: 5, z1: -5, mirrorX: true },
        ],
        parts: [
          {
            name: "front-axle",
            kind: "wheel",
            speed: 1.0,
            pivot: [0, 2.5, 7.5],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.3, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.1, color: "chrome", mirrorX: true },
            ],
          },
          {
            name: "rear-axle",
            kind: "wheel",
            speed: 1.0,
            pivot: [0, 2.5, -7.5],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 0, cz: 0, radius: 2.3, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 0, cz: 0, radius: 1.1, color: "chrome", mirrorX: true },
            ],
          },
        ],
      }),
  },

  // ---------------- 4. ESTRADAS E PONTES ----------------
  "estrada-asfalto": {
    id: "estrada-asfalto",
    categoryId: "estradas",
    name: "Estrada Asfaltada",
    description: "Via asfaltada de mão dupla; cada clique adiciona e conecta a pista no mapa.",
    meta: "Estrada · Clique para pavimentar",
    kind: "road",
    pathKind: "road",
    buildPreviewBlueprint: () =>
      makeBlueprint({
        name: "Estrada Asfaltada",
        description: "Trecho de estrada asfaltada com faixa central e meio-fio.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          asphalt: "#4e535c",
          curb: "#d6d1c4",
          stripe: "#f5cf4c",
          grass: "#7ac25c",
          pole: "#454c58",
          lamp: "#fff0b0",
        },
        ops: [
          { op: "box", x0: -9, y0: 0, z0: -10, x1: 9, y1: 1, z1: 10, color: "grass" },
          { op: "box", x0: -6, y0: 1, z0: -10, x1: 6, y1: 2, z1: 10, color: "asphalt" },
          { op: "box", x0: 6, y0: 1, z0: -10, x1: 7, y1: 2, z1: 10, color: "curb", mirrorX: true },
          { op: "box", x0: -1, y0: 2, z0: -8, x1: 1, y1: 3, z1: -4, color: "stripe" },
          { op: "box", x0: -1, y0: 2, z0: -1, x1: 1, y1: 3, z1: 3, color: "stripe" },
          { op: "box", x0: -1, y0: 2, z0: 6, x1: 1, y1: 3, z1: 9, color: "stripe" },
          { op: "box", x0: 7, y0: 2, z0: 0, x1: 8, y1: 9, z1: 1, color: "pole" },
          { op: "box", x0: 5, y0: 8, z0: 0, x1: 8, y1: 9, z1: 1, color: "pole" },
          { op: "box", x0: 5, y0: 7, z0: 0, x1: 6, y1: 8, z1: 1, color: "lamp", emit: 1.4 },
        ],
      }),
  },

  "estrada-ponte-madeira": {
    id: "estrada-ponte-madeira",
    categoryId: "estradas",
    name: "Ponte de Madeira",
    description: "Ponte arqueada de tábuas de madeira com corrimão e pilares reforçados.",
    meta: "Ponte · 3D no mapa",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Ponte de Madeira",
        description: "Ponte rústica de madeira em arco com guarda-corpo e lampiões.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          wood: "#b57c46",
          woodDark: "#754b26",
          post: "#5c391b",
          water: "#4ea9de",
          lamp: "#ffe596",
        },
        ops: [
          // Shallow creek ribbon under arch
          { op: "box", x0: -6, y0: 0, z0: -6, x1: 6, y1: 1, z1: 6, color: "water" },
          // Arched wooden deck along Z
          { op: "box", x0: -4, y0: 1, z0: -11, x1: 4, y1: 2, z1: -7, color: "wood" },
          { op: "box", x0: -4, y0: 2, z0: -7, x1: 4, y1: 3, z1: -4, color: "wood" },
          { op: "box", x0: -4, y0: 3, z0: -4, x1: 4, y1: 4, z1: 4, color: "wood" },
          { op: "box", x0: -4, y0: 2, z0: 4, x1: 4, y1: 3, z1: 7, color: "wood" },
          { op: "box", x0: -4, y0: 1, z0: 7, x1: 4, y1: 2, z1: 11, color: "wood" },
          // Support piers
          { op: "box", x0: 3, y0: 0, z0: -5, x1: 4, y1: 3, z1: -4, color: "post", mirrorX: true },
          { op: "box", x0: 3, y0: 0, z0: 4, x1: 4, y1: 3, z1: 5, color: "post", mirrorX: true },
          // Handrails & corner posts
          { op: "box", x0: 3, y0: 2, z0: -10, x1: 4, y1: 5, z1: -9, color: "woodDark", mirrorX: true },
          { op: "box", x0: 3, y0: 4, z0: -4, x1: 4, y1: 7, z1: -3, color: "woodDark", mirrorX: true },
          { op: "box", x0: 3, y0: 4, z0: 3, x1: 4, y1: 7, z1: 4, color: "woodDark", mirrorX: true },
          { op: "box", x0: 3, y0: 2, z0: 9, x1: 4, y1: 5, z1: 10, color: "woodDark", mirrorX: true },
          { op: "box", x0: 3, y0: 6, z0: -4, x1: 4, y1: 7, z1: 4, color: "woodDark", mirrorX: true },
          { op: "line", x0: 3, y0: 4, z0: -10, x1: 3, y1: 6, z1: -4, radius: 0, color: "woodDark", mirrorX: true },
          { op: "line", x0: 3, y0: 6, z0: 4, x1: 3, y1: 4, z1: 10, radius: 0, color: "woodDark", mirrorX: true },
          // Warm lanterns at bridge ends
          { op: "box", x0: 3, y0: 5, z0: -10, x1: 4, y1: 6, z1: -9, color: "lamp", emit: 1.3, mirrorX: true },
          { op: "box", x0: 3, y0: 5, z0: 9, x1: 4, y1: 6, z1: 10, color: "lamp", emit: 1.3, mirrorX: true },
        ],
      }),
  },

  "estrada-ponte-pedra": {
    id: "estrada-ponte-pedra",
    categoryId: "estradas",
    name: "Ponte de Pedra",
    description: "Ponte clássica de arcos de pedra com parapeito e luminárias.",
    meta: "Ponte · 3D no mapa",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Ponte de Pedra",
        description: "Ponte monumental em arco de pedra talhada com calçamento e lampiões.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          stone: "#cfc9bc",
          stoneDark: "#9e988c",
          pave: "#7a7e86",
          iron: "#30343c",
          lamp: "#ffe8a3",
          water: "#4da6db",
        },
        ops: [
          { op: "box", x0: -6, y0: 0, z0: -6, x1: 6, y1: 1, z1: 6, color: "water" },
          { op: "box", x0: -5, y0: 0, z0: -11, x1: 5, y1: 3, z1: -5, color: "stone" },
          { op: "box", x0: -5, y0: 0, z0: 5, x1: 5, y1: 3, z1: 11, color: "stone" },
          { op: "box", x0: -5, y0: 3, z0: -7, x1: 5, y1: 5, z1: 7, color: "stone" },
          { op: "clear", x0: -5, y0: 1, z0: -4, x1: 5, y1: 4, z1: 4 },
          { op: "box", x0: -4, y0: 5, z0: -11, x1: 4, y1: 6, z1: 11, color: "pave" },
          { op: "box", x0: 4, y0: 5, z0: -11, x1: 5, y1: 7, z1: 11, color: "stoneDark", mirrorX: true },
          { op: "box", x0: 4, y0: 7, z0: -1, x1: 5, y1: 10, z1: 1, color: "iron", mirrorX: true },
          { op: "box", x0: 4, y0: 10, z0: -1, x1: 5, y1: 11, z1: 1, color: "lamp", emit: 1.4, mirrorX: true },
        ],
      }),
  },

  "estrada-ponte-estaiada": {
    id: "estrada-ponte-estaiada",
    categoryId: "estradas",
    name: "Ponte Estaiada",
    description: "Ponte moderna suspensa por cabos brancos, torres iluminadas e sinalizador giratório.",
    meta: "Ponte · Animada · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Ponte Estaiada",
        description: "Ponte estaiada branca moderna com cabos de aço tensionados e sinalizador aéreo.",
        category: "prop",
        scaleClass: "large",
        palette: {
          white: "#f6f8fa",
          asphalt: "#484e58",
          stripe: "#f5d04c",
          cable: "#cbd5e1",
          water: "#4da8de",
          beacon: "#ff5442",
        },
        ops: [
          { op: "box", x0: -7, y0: 0, z0: -8, x1: 7, y1: 1, z1: 8, color: "water" },
          { op: "box", x0: -4, y0: 3, z0: -14, x1: 4, y1: 4, z1: 14, color: "asphalt" },
          { op: "box", x0: 0, y0: 4, z0: -12, x1: 1, y1: 5, z1: 12, color: "stripe" },
          { op: "box", x0: 4, y0: 3, z0: -14, x1: 5, y1: 5, z1: 14, color: "white", mirrorX: true },
          // Twin iconic A-frame white pylons
          { op: "line", x0: 5, y0: 0, z0: 0, x1: 1, y1: 20, z1: 0, radius: 1, color: "white", mirrorX: true },
          { op: "box", x0: -4, y0: 12, z0: -1, x1: 4, y1: 13, z1: 1, color: "white" },
          // Suspension cables
          { op: "line", x0: 1, y0: 18, z0: 0, x1: 4, y1: 5, z1: 12, radius: 0, color: "cable", mirrorX: true },
          { op: "line", x0: 1, y0: 15, z0: 0, x1: 4, y1: 5, z1: 8, radius: 0, color: "cable", mirrorX: true },
          { op: "line", x0: 1, y0: 18, z0: 0, x1: 4, y1: 5, z1: -12, radius: 0, color: "cable", mirrorX: true },
          { op: "line", x0: 1, y0: 15, z0: 0, x1: 4, y1: 5, z1: -8, radius: 0, color: "cable", mirrorX: true },
        ],
        parts: [
          {
            name: "pylon-beacon",
            kind: "spinY",
            speed: 2.8,
            pivot: [0, 21, 0],
            ops: [
              { op: "box", x0: -1, y0: 0, z0: -1, x1: 1, y1: 2, z1: 1, color: "beacon", emit: 1.6 },
              { op: "box", x0: -2, y0: 1, z0: 0, x1: 2, y1: 2, z1: 1, color: "white" },
            ],
          },
        ],
      }),
  },

  "estrada-paralelepipedo": {
    id: "estrada-paralelepipedo",
    categoryId: "estradas",
    name: "Rua de Paralelepípedo",
    description: "Calçamento de pedra ideal para ligar casas, praças e o centro da cidade.",
    meta: "Estrada · Clique para pavimentar",
    kind: "road",
    pathKind: "cobblestone",
    buildPreviewBlueprint: () =>
      makeBlueprint({
        name: "Rua de Paralelepípedo",
        description: "Trecho de rua de paralelepípedos com pedras alternadas.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          stone: "#b5afa4",
          stoneDark: "#969084",
          stoneLight: "#cfc9be",
          grass: "#7cc25e",
        },
        ops: [
          { op: "box", x0: -8, y0: 0, z0: -9, x1: 8, y1: 1, z1: 9, color: "grass" },
          { op: "box", x0: -5, y0: 1, z0: -9, x1: 5, y1: 2, z1: 9, color: "stone" },
          { op: "box", x0: -4, y0: 2, z0: -7, x1: -1, y1: 3, z1: -4, color: "stoneLight" },
          { op: "box", x0: 1, y0: 2, z0: -5, x1: 4, y1: 3, z1: -2, color: "stoneDark" },
          { op: "box", x0: -3, y0: 2, z0: 0, x1: 1, y1: 3, z1: 3, color: "stoneDark" },
          { op: "box", x0: 1, y0: 2, z0: 4, x1: 4, y1: 3, z1: 7, color: "stoneLight" },
        ],
      }),
  },

  "estrada-terra": {
    id: "estrada-terra",
    categoryId: "estradas",
    name: "Estrada de Terra",
    description: "Caminho rural de terra batida perfeito para fazendas e plantações.",
    meta: "Estrada · Clique para pavimentar",
    kind: "road",
    pathKind: "dirt_trail",
    buildPreviewBlueprint: () =>
      makeBlueprint({
        name: "Estrada de Terra",
        description: "Estrada rural de terra batida margeada por cerca de madeira.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          dirt: "#b58b5c",
          dirtDark: "#966f45",
          grass: "#7ac25c",
          wood: "#7c512c",
        },
        ops: [
          { op: "box", x0: -8, y0: 0, z0: -9, x1: 8, y1: 1, z1: 9, color: "grass" },
          { op: "box", x0: -4, y0: 1, z0: -9, x1: 4, y1: 2, z1: 9, color: "dirt" },
          { op: "box", x0: -2, y0: 1, z0: -7, x1: 1, y1: 2, z1: 6, color: "dirtDark" },
          { op: "box", x0: 5, y0: 1, z0: -7, x1: 6, y1: 4, z1: -6, color: "wood", mirrorX: true },
          { op: "box", x0: 5, y0: 1, z0: 0, x1: 6, y1: 4, z1: 1, color: "wood", mirrorX: true },
          { op: "box", x0: 5, y0: 1, z0: 6, x1: 6, y1: 4, z1: 7, color: "wood", mirrorX: true },
          { op: "box", x0: 5, y0: 3, z0: -7, x1: 6, y1: 4, z1: 7, color: "wood", mirrorX: true },
        ],
      }),
  },

  // ---------------- 5. FAZENDAS ----------------
  "fazenda-celeiro": {
    id: "fazenda-celeiro",
    categoryId: "fazendas",
    name: "Celeiro com Silo",
    description: "Fazenda clássica com celeiro vermelho, portas brancas em X e silo de grãos.",
    meta: "Fazenda · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Celeiro com Silo",
        description: "Celeiro rural vermelho com telhado escuro, portas em X e silo de grãos.",
        category: "building",
        scaleClass: "large",
        palette: {
          barnRed: "#c23b34",
          barnDark: "#962924",
          white: "#f8f5ec",
          roof: "#424852",
          silo: "#b8c2cc",
          siloCap: "#758290",
          hay: "#ecc34f",
          wood: "#9c6c3e",
        },
        ops: [
          { op: "hollowBox", x0: -9, y0: 0, z0: -7, x1: 6, y1: 11, z1: 7, wall: 1, color: "barnRed", trim: "white" },
          { op: "roofGable", x0: -10, yBase: 11, z0: -8, x1: 7, z1: 8, rise: 7, axis: "z", color: "roof", trim: "white" },
          { op: "box", x0: -5, y0: 0, z0: 6, x1: 2, y1: 7, z1: 7, color: "barnDark" },
          { op: "box", x0: -5, y0: 6, z0: 7, x1: 2, y1: 7, z1: 8, color: "white" },
          { op: "box", x0: -2, y0: 0, z0: 7, x1: -1, y1: 7, z1: 8, color: "white" },
          { op: "line", x0: -5, y0: 0, z0: 7, x1: 1, y1: 6, z1: 7, radius: 0, color: "white" },
          { op: "line", x0: 1, y0: 0, z0: 7, x1: -5, y1: 6, z1: 7, radius: 0, color: "white" },
          { op: "box", x0: -3, y0: 9, z0: 6, x1: 0, y1: 12, z1: 7, color: "hay" },
          { op: "cylinder", axis: "y", cx: 10, y0: 0, y1: 18, cz: -2, radius: 3.6, color: "silo" },
          { op: "dome", cx: 10, yBase: 18, cz: -2, radius: 3.6, color: "siloCap" },
          { op: "box", x0: -12, y0: 0, z0: 2, x1: -9, y1: 3, z1: 6, color: "hay" },
          { op: "box", x0: 6, y0: 0, z0: 4, x1: 12, y1: 2, z1: 5, color: "wood" },
        ],
      }),
  },

  "fazenda-estabulo": {
    id: "fazenda-estabulo",
    categoryId: "fazendas",
    name: "Estábulo Rural",
    description: "Estábulo de madeira com cercado, cocho de água e feno fresco.",
    meta: "Fazenda · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Estábulo Rural",
        description: "Estábulo acolhedor de madeira com baias abertas, cercado e feno.",
        category: "building",
        scaleClass: "medium",
        palette: {
          wood: "#b57d48",
          woodDark: "#7a4f28",
          roof: "#8f4e36",
          hay: "#ecc654",
          water: "#54b4e6",
          stone: "#b5b0a4",
        },
        ops: [
          { op: "hollowBox", x0: -8, y0: 0, z0: -6, x1: 8, y1: 7, z1: 2, wall: 1, color: "wood", trim: "woodDark" },
          { op: "roofGable", x0: -9, yBase: 7, z0: -7, x1: 9, z1: 3, rise: 4, axis: "x", color: "roof", trim: "woodDark" },
          { op: "clear", x0: -6, y0: 0, z0: 1, x1: -2, y1: 5, z1: 3 },
          { op: "clear", x0: 2, y0: 0, z0: 1, x1: 6, y1: 5, z1: 3 },
          { op: "box", x0: -8, y0: 0, z0: 8, x1: 8, y1: 2, z1: 9, color: "woodDark" },
          { op: "box", x0: -8, y0: 0, z0: 2, x1: -7, y1: 2, z1: 9, color: "woodDark", mirrorX: true },
          { op: "box", x0: -5, y0: 0, z0: 5, x1: -1, y1: 2, z1: 7, color: "stone" },
          { op: "box", x0: -4, y0: 1, z0: 5, x1: -2, y1: 2, z1: 6, color: "water" },
          { op: "box", x0: 3, y0: 0, z0: 4, x1: 6, y1: 2, z1: 7, color: "hay" },
        ],
      }),
  },

  "fazenda-moinho": {
    id: "fazenda-moinho",
    categoryId: "fazendas",
    name: "Moinho de Vento Rural",
    description: "Moinho de pedra e madeira com janelas acesas e grandes pás girando ao vento.",
    meta: "Fazenda · Animado · Grande",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Moinho de Vento Rural",
        description: "Moinho rural de pedra com cúpula de madeira e pás gigantes girando ao vento.",
        category: "building",
        scaleClass: "large",
        palette: {
          stone: "#d8d1c2",
          stoneDark: "#b5ac9c",
          wood: "#8f5c32",
          sail: "#faf4e4",
          roof: "#7c3f2e",
          warmGlow: "#ffe294",
          hay: "#ecc34f",
        },
        ops: [
          { op: "cone", cx: 0, y0: 0, y1: 18, cz: 0, rBottom: 6.2, rTop: 3.6, color: "stone" },
          { op: "cylinder", axis: "y", cx: 0, cz: 0, y0: 0, y1: 3, radius: 6.5, color: "stoneDark" },
          { op: "dome", cx: 0, yBase: 18, cz: 0, radius: 4.0, color: "roof" },
          { op: "box", x0: -2, y0: 1, z0: 5, x1: 2, y1: 5, z1: 7, color: "wood" },
          { op: "box", x0: -1, y0: 9, z0: 4, x1: 1, y1: 12, z1: 5, color: "warmGlow", emit: 1.0 },
          { op: "box", x0: 5, y0: 0, z0: 3, x1: 8, y1: 3, z1: 6, color: "hay" },
        ],
        parts: [
          {
            name: "windmill-sails",
            kind: "spinZ",
            speed: 1.35,
            pivot: [0, 16, 4.8],
            ops: [
              { op: "box", x0: -1, y0: -1, z0: 0, x1: 1, y1: 1, z1: 1, color: "wood" },
              { op: "box", x0: 0, y0: -11, z0: 0, x1: 1, y1: 11, z1: 1, color: "wood" },
              { op: "box", x0: -11, y0: 0, z0: 0, x1: 11, y1: 1, z1: 1, color: "wood" },
              { op: "box", x0: 1, y0: 3, z0: 0, x1: 4, y1: 10, z1: 1, color: "sail" },
              { op: "box", x0: -4, y0: -10, z0: 0, x1: -1, y1: -3, z1: 1, color: "sail" },
              { op: "box", x0: 3, y0: -4, z0: 0, x1: 10, y1: -1, z1: 1, color: "sail" },
              { op: "box", x0: -10, y0: 1, z0: 0, x1: -3, y1: 4, z1: 1, color: "sail" },
            ],
          },
        ],
      }),
  },

  "fazenda-estufa": {
    id: "fazenda-estufa",
    categoryId: "fazendas",
    name: "Estufa Botânica",
    description: "Estufa envidraçada de estrutura branca repleta de flores, mudas e árvores tropicais.",
    meta: "Fazenda · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Estufa Botânica",
        description: "Estufa de vidro e ferro branco com canteiros floridos e plantas exuberantes.",
        category: "building",
        scaleClass: "medium",
        palette: {
          frame: "#f2f5f2",
          brick: "#c26c52",
          glass: "#bceaf8",
          leaf: "#4ca84a",
          leafLight: "#76d162",
          flowerPink: "#f47aa4",
          flowerYellow: "#f8d04a",
          soil: "#6e472c",
        },
        ops: [
          { op: "hollowBox", x0: -9, y0: 0, z0: -6, x1: 9, y1: 3, z1: 6, wall: 1, color: "brick", trim: "frame" },
          { op: "hollowBox", x0: -9, y0: 3, z0: -6, x1: 9, y1: 9, z1: 6, wall: 1, color: "glass", trim: "frame" },
          { op: "roofGable", x0: -9, yBase: 9, z0: -6, x1: 9, z1: 6, rise: 5, axis: "x", color: "glass", trim: "frame" },
          // Lush interior greenery visible through glass
          { op: "box", x0: -7, y0: 1, z0: -4, x1: -2, y1: 3, z1: 4, color: "soil" },
          { op: "box", x0: 2, y0: 1, z0: -4, x1: 7, y1: 3, z1: 4, color: "soil" },
          { op: "sphere", cx: -4, cy: 5, cz: 0, rx: 3, ry: 3, rz: 3, color: "leaf" },
          { op: "sphere", cx: 4, cy: 5, cz: -1, rx: 2.5, ry: 2.5, rz: 2.5, color: "leafLight" },
          { op: "box", x0: -6, y0: 4, z0: 2, x1: -4, y1: 6, z1: 3, color: "flowerPink" },
          { op: "box", x0: 3, y0: 4, z0: 1, x1: 5, y1: 6, z1: 3, color: "flowerYellow" },
        ],
      }),
  },

  // ---------------- 6. PLANTAÇÕES ----------------
  "plantacao-milho": {
    id: "plantacao-milho",
    categoryId: "plantacoes",
    name: "Plantação de Milho",
    description: "Fileiras de terra arada com pés altos de milho verde e espigas douradas.",
    meta: "Plantação · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Plantação de Milho",
        description: "Lavoura verdejante de milho em fileiras cercadas por mourões de madeira.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          soil: "#7c5234",
          soilDark: "#633f26",
          stalk: "#4b9c43",
          leaf: "#68bf58",
          corn: "#f4cb42",
          wood: "#96653a",
        },
        ops: [
          { op: "box", x0: -9, y0: 0, z0: -8, x1: 9, y1: 1, z1: 8, color: "soilDark" },
          { op: "box", x0: -8, y0: 1, z0: -6, x1: 8, y1: 2, z1: -4, color: "soil" },
          { op: "box", x0: -8, y0: 1, z0: -1, x1: 8, y1: 2, z1: 1, color: "soil" },
          { op: "box", x0: -8, y0: 1, z0: 4, x1: 8, y1: 2, z1: 6, color: "soil" },
          ...[
            [-6, -5], [-2, -5], [2, -5], [6, -5],
            [-6, 0], [-2, 0], [2, 0], [6, 0],
            [-6, 5], [-2, 5], [2, 5], [6, 5],
          ].flatMap(([cx, cz]) => [
            { op: "box", x0: cx, y0: 2, z0: cz, x1: cx + 1, y1: 8, z1: cz + 1, color: "stalk" },
            { op: "box", x0: cx - 1, y0: 5, z0: cz, x1: cx + 2, y1: 6, z1: cz + 1, color: "leaf" },
            { op: "box", x0: cx, y0: 6, z0: cz + 1, x1: cx + 1, y1: 8, z1: cz + 2, color: "corn" },
          ]),
          { op: "pillars", x0: -9, y0: 0, z0: -8, x1: 9, y1: 4, z1: 8, color: "wood" },
        ],
      }),
  },

  "plantacao-trigo": {
    id: "plantacao-trigo",
    categoryId: "plantacoes",
    name: "Campo de Trigo Dourado",
    description: "Canteiros dourados de trigo pronto para colheita com espantalho no centro.",
    meta: "Plantação · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Campo de Trigo Dourado",
        description: "Campo ensolarado de trigo maduro vigiado por um espantalho de palha.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          soil: "#80583a",
          wheat: "#eab840",
          wheatLight: "#f8d466",
          wood: "#8f5e36",
          shirt: "#4c7ec4",
          hat: "#d9a94c",
          pumpkin: "#ea7a2e",
        },
        ops: [
          { op: "box", x0: -9, y0: 0, z0: -8, x1: 9, y1: 1, z1: 8, color: "soil" },
          { op: "box", x0: -8, y0: 1, z0: -7, x1: -2, y1: 4, z1: 7, color: "wheat" },
          { op: "box", x0: 2, y0: 1, z0: -7, x1: 8, y1: 4, z1: 7, color: "wheat" },
          { op: "box", x0: -8, y0: 4, z0: -7, x1: -2, y1: 5, z1: 7, color: "wheatLight" },
          { op: "box", x0: 2, y0: 4, z0: -7, x1: 8, y1: 5, z1: 7, color: "wheatLight" },
          { op: "box", x0: 0, y0: 1, z0: 0, x1: 1, y1: 7, z1: 1, color: "wood" },
          { op: "box", x0: -3, y0: 5, z0: 0, x1: 4, y1: 6, z1: 1, color: "shirt" },
          { op: "box", x0: -1, y0: 4, z0: -1, x1: 2, y1: 7, z1: 2, color: "shirt" },
          { op: "box", x0: -1, y0: 7, z0: -1, x1: 2, y1: 9, z1: 2, color: "pumpkin" },
          { op: "box", x0: -2, y0: 9, z0: -2, x1: 3, y1: 10, z1: 3, color: "hat" },
        ],
      }),
  },

  "plantacao-horta": {
    id: "plantacao-horta",
    categoryId: "plantacoes",
    name: "Horta Orgânica",
    description: "Canteiros elevados de madeira com alfaces, tomates vermelhos e cenouras.",
    meta: "Plantação · Pequeno",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Horta Orgânica",
        description: "Horta comunitária com canteiros de madeira cultivando verduras e tomates.",
        category: "prop",
        scaleClass: "small",
        palette: {
          wood: "#b8824e",
          soil: "#6e472c",
          leaf: "#56b04d",
          leafLight: "#7cd46c",
          tomato: "#e3463c",
          carrot: "#f08530",
        },
        ops: [
          { op: "box", x0: -8, y0: 0, z0: -6, x1: -1, y1: 2, z1: 6, color: "wood" },
          { op: "box", x0: -7, y0: 1, z0: -5, x1: -2, y1: 2, z1: 5, color: "soil" },
          { op: "box", x0: 1, y0: 0, z0: -6, x1: 8, y1: 2, z1: 6, color: "wood" },
          { op: "box", x0: 2, y0: 1, z0: -5, x1: 7, y1: 2, z1: 5, color: "soil" },
          { op: "box", x0: -6, y0: 2, z0: -4, x1: -3, y1: 4, z1: -1, color: "leafLight" },
          { op: "box", x0: -6, y0: 2, z0: 1, x1: -3, y1: 4, z1: 4, color: "leaf" },
          { op: "box", x0: -5, y0: 2, z0: 2, x1: -4, y1: 3, z1: 3, color: "carrot" },
          { op: "box", x0: 3, y0: 2, z0: -4, x1: 6, y1: 6, z1: -1, color: "leaf" },
          { op: "box", x0: 3, y0: 4, z0: -3, x1: 4, y1: 5, z1: -2, color: "tomato" },
          { op: "box", x0: 3, y0: 2, z0: 1, x1: 6, y1: 6, z1: 4, color: "leaf" },
          { op: "box", x0: 5, y0: 4, z0: 2, x1: 6, y1: 5, z1: 3, color: "tomato" },
        ],
      }),
  },

  "plantacao-girassois": {
    id: "plantacao-girassois",
    categoryId: "plantacoes",
    name: "Campo de Girassóis",
    description: "Canteiros cercados com girassóis dourados que balançam suavemente na brisa.",
    meta: "Plantação · Animada · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Campo de Girassóis",
        description: "Campo vibrante de girassóis dourados balançando ao sol da ilha.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          soil: "#785032",
          stem: "#4a9c42",
          petal: "#ffd236",
          center: "#5c361c",
          wood: "#a87442",
        },
        ops: [
          { op: "box", x0: -8, y0: 0, z0: -7, x1: 8, y1: 1, z1: 7, color: "soil" },
          { op: "box", x0: -9, y0: 0, z0: -8, x1: 9, y1: 2, z1: -7, color: "wood" },
          { op: "box", x0: -9, y0: 0, z0: -8, x1: -8, y1: 2, z1: 7, color: "wood", mirrorX: true },
          ...[
            [-5, -4], [0, -4], [5, -4],
            [-5, 2], [0, 2], [5, 2],
          ].flatMap(([cx, cz]) => [
            { op: "box", x0: cx, y0: 1, z0: cz, x1: cx + 1, y1: 6, z1: cz + 1, color: "stem" },
            { op: "box", x0: cx - 1, y0: 5, z0: cz, x1: cx + 2, y1: 8, z1: cz + 1, color: "petal" },
            { op: "box", x0: cx, y0: 6, z0: cz + 1, x1: cx + 1, y1: 7, z1: cz + 2, color: "center" },
          ]),
        ],
        parts: [
          {
            name: "swaying-sunflower",
            kind: "swingZ",
            speed: 1.5,
            amp: 0.14,
            pivot: [0, 1, 0],
            ops: [
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 1, y1: 7, z1: 1, color: "stem" },
              { op: "box", x0: -1, y0: 6, z0: 0, x1: 2, y1: 9, z1: 1, color: "petal" },
              { op: "box", x0: 0, y0: 7, z0: 1, x1: 1, y1: 8, z1: 2, color: "center" },
            ],
          },
        ],
      }),
  },

  "plantacao-vinhedo": {
    id: "plantacao-vinhedo",
    categoryId: "plantacoes",
    name: "Vinhedo em Treliça",
    description: "Fileiras de parreiras com cachos de uva roxa e barris de carvalho.",
    meta: "Plantação · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Vinhedo em Treliça",
        description: "Vinhedo ensolarado com parreiras de uvas roxas e barris de madeira.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          soil: "#7d5838",
          wood: "#8f5c30",
          vine: "#4d9e44",
          grape: "#76389c",
          barrel: "#a86c3a",
          iron: "#3a3e46",
        },
        ops: [
          { op: "box", x0: -9, y0: 0, z0: -7, x1: 9, y1: 1, z1: 7, color: "soil" },
          ...[-4, 1, 5].flatMap((rz) => [
            { op: "box", x0: -7, y0: 1, z0: rz, x1: -6, y1: 6, z1: rz + 1, color: "wood" },
            { op: "box", x0: 5, y0: 1, z0: rz, x1: 6, y1: 6, z1: rz + 1, color: "wood" },
            { op: "box", x0: -7, y0: 4, z0: rz, x1: 6, y1: 6, z1: rz + 1, color: "vine" },
            { op: "box", x0: -4, y0: 3, z0: rz, x1: -2, y1: 5, z1: rz + 1, color: "grape" },
            { op: "box", x0: 1, y0: 3, z0: rz, x1: 3, y1: 5, z1: rz + 1, color: "grape" },
          ]),
          { op: "cylinder", axis: "y", cx: -8, cz: 5, y0: 1, y1: 5, radius: 1.6, color: "barrel" },
          { op: "ring", axis: "y", cx: -8, cz: 5, y0: 2, y1: 3, outerR: 1.7, innerR: 1.4, color: "iron" },
        ],
      }),
  },

  // ---------------- 7. ANIMAIS ----------------
  "animal-vaca": {
    id: "animal-vaca",
    categoryId: "animais",
    name: "Vaca Malhada",
    description: "Vaquinha malhada passeando e pastando livremente pelo gramado.",
    meta: "Animal · Anda pela ilha",
    kind: "creation",
    behaviorHint: "wander",
    wanderStyle: "walk",
    speed: 1.8,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Vaca Malhada",
        description: "Vaca malhada pastando tranquilamente pelos campos verdes.",
        category: "creature",
        scaleClass: "small",
        palette: {
          white: "#f8f5ee",
          spot: "#2a2c32",
          snout: "#f2b8b5",
          horn: "#e6d2a4",
          hoof: "#36363c",
        },
        ops: [
          { op: "box", x0: 1, y0: 0, z0: 2, x1: 3, y1: 4, z1: 4, color: "white", mirrorX: true },
          { op: "box", x0: 1, y0: 0, z0: -5, x1: 3, y1: 4, z1: -3, color: "white", mirrorX: true },
          { op: "box", x0: 1, y0: 0, z0: 2, x1: 3, y1: 1, z1: 4, color: "hoof", mirrorX: true },
          { op: "box", x0: 1, y0: 0, z0: -5, x1: 3, y1: 1, z1: -3, color: "hoof", mirrorX: true },
          { op: "roundedBox", x0: -3, y0: 4, z0: -6, x1: 3, y1: 9, z1: 5, radius: 1.0, color: "white" },
          { op: "box", x0: -3, y0: 5, z0: -2, x1: 1, y1: 8, z1: 2, color: "spot" },
          { op: "box", x0: 1, y0: 6, z0: -5, x1: 3, y1: 9, z1: -2, color: "spot" },
        ],
        parts: [
          {
            name: "cow-head",
            kind: "swingX",
            speed: 1.4,
            amp: 0.14,
            pivot: [0, 7, 5],
            ops: [
              { op: "box", x0: -2, y0: -1, z0: 0, x1: 2, y1: 3, z1: 4, color: "white" },
              { op: "box", x0: -2, y0: -1, z0: 4, x1: 2, y1: 1, z1: 5, color: "snout" },
              { op: "box", x0: 1, y0: 1, z0: 3, x1: 2, y1: 2, z1: 4, color: "spot", mirrorX: true },
              { op: "box", x0: 2, y0: 3, z0: 1, x1: 3, y1: 4, z1: 2, color: "horn", mirrorX: true },
            ],
          },
          {
            name: "cow-tail",
            kind: "swingZ",
            speed: 2.2,
            amp: 0.25,
            pivot: [0, 7, -6],
            ops: [
              { op: "box", x0: 0, y0: -3, z0: -1, x1: 1, y1: 0, z1: 0, color: "spot" },
            ],
          },
        ],
      }),
  },

  "animal-ovelha": {
    id: "animal-ovelha",
    categoryId: "animais",
    name: "Ovelha Fofa",
    description: "Ovelhinha de lã creme macia que saltita pelo campo.",
    meta: "Animal · Saltita pelo campo",
    kind: "creation",
    behaviorHint: "wander",
    wanderStyle: "hop",
    speed: 1.6,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Ovelha Fofa",
        description: "Ovelha fofa de lã clara passeando pelo gramado da ilha.",
        category: "creature",
        scaleClass: "small",
        palette: {
          wool: "#faf5e8",
          woolShade: "#e8e0cf",
          face: "#353842",
          eye: "#ffffff",
        },
        ops: [
          { op: "box", x0: 1, y0: 0, z0: 1, x1: 2, y1: 3, z1: 2, color: "face", mirrorX: true },
          { op: "box", x0: 1, y0: 0, z0: -3, x1: 2, y1: 3, z1: -2, color: "face", mirrorX: true },
          { op: "roundedBox", x0: -3, y0: 3, z0: -4, x1: 3, y1: 8, z1: 4, radius: 1.4, color: "wool" },
          { op: "box", x0: -2, y0: 7, z0: -3, x1: 2, y1: 9, z1: 3, color: "woolShade" },
        ],
        parts: [
          {
            name: "sheep-head",
            kind: "swingX",
            speed: 1.7,
            amp: 0.16,
            pivot: [0, 6, 4],
            ops: [
              { op: "box", x0: -2, y0: -1, z0: 0, x1: 2, y1: 2, z1: 3, color: "face" },
              { op: "box", x0: -2, y0: 2, z0: 0, x1: 2, y1: 3, z1: 2, color: "wool" },
              { op: "box", x0: 1, y0: 0, z0: 2, x1: 2, y1: 1, z1: 3, color: "eye", mirrorX: true },
            ],
          },
        ],
      }),
  },

  "animal-cavalo": {
    id: "animal-cavalo",
    categoryId: "animais",
    name: "Cavalo Marrom",
    description: "Cavalo castanho de crina escura trotando alegremente pela ilha.",
    meta: "Animal · Trota pelo campo",
    kind: "creation",
    behaviorHint: "wander",
    wanderStyle: "trot",
    speed: 3.1,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Cavalo Marrom",
        description: "Cavalo castanho de crina escura trotando pelos pastos.",
        category: "creature",
        scaleClass: "small",
        palette: {
          coat: "#9e5c34",
          mane: "#382418",
          hoof: "#262224",
          blaze: "#f6efe2",
        },
        ops: [
          { op: "box", x0: 1, y0: 0, z0: 3, x1: 2, y1: 5, z1: 4, color: "coat", mirrorX: true },
          { op: "box", x0: 1, y0: 0, z0: -5, x1: 2, y1: 5, z1: -4, color: "coat", mirrorX: true },
          { op: "box", x0: 1, y0: 0, z0: 3, x1: 2, y1: 1, z1: 4, color: "hoof", mirrorX: true },
          { op: "box", x0: 1, y0: 0, z0: -5, x1: 2, y1: 1, z1: -4, color: "hoof", mirrorX: true },
          { op: "roundedBox", x0: -2, y0: 5, z0: -6, x1: 3, y1: 9, z1: 5, radius: 1.0, color: "coat" },
        ],
        parts: [
          {
            name: "horse-neck",
            kind: "swingX",
            speed: 2.0,
            amp: 0.14,
            pivot: [0, 8, 4],
            ops: [
              { op: "box", x0: -1, y0: 0, z0: 0, x1: 2, y1: 5, z1: 2, color: "coat" },
              { op: "box", x0: 0, y0: 0, z0: -1, x1: 1, y1: 5, z1: 0, color: "mane" },
              { op: "box", x0: -1, y0: 3, z0: 2, x1: 2, y1: 5, z1: 5, color: "coat" },
              { op: "box", x0: 0, y0: 4, z0: 4, x1: 1, y1: 5, z1: 5, color: "blaze" },
            ],
          },
          {
            name: "horse-tail",
            kind: "swingZ",
            speed: 2.4,
            amp: 0.25,
            pivot: [0, 8, -6],
            ops: [
              { op: "box", x0: 0, y0: -4, z0: -1, x1: 1, y1: 0, z1: 0, color: "mane" },
            ],
          },
        ],
      }),
  },

  "animal-galinha": {
    id: "animal-galinha",
    categoryId: "animais",
    name: "Galinha Caipira",
    description: "Galinha branca de crista vermelha ciscando e caminhando alegremente pelo campo.",
    meta: "Animal · Anda pela ilha",
    kind: "creation",
    behaviorHint: "wander",
    wanderStyle: "hop",
    speed: 1.4,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Galinha Caipira",
        description: "Galinha caipira branca de crista vermelha ciscando pelo gramado.",
        category: "creature",
        scaleClass: "tiny",
        palette: {
          white: "#faf7f0",
          wing: "#e8e0cf",
          comb: "#e03e36",
          beak: "#f5a623",
          eye: "#22252b",
        },
        ops: [
          { op: "box", x0: 1, y0: 0, z0: 0, x1: 2, y1: 2, z1: 1, color: "beak", mirrorX: true },
          { op: "roundedBox", x0: -2, y0: 2, z0: -3, x1: 3, y1: 6, z1: 3, radius: 1.0, color: "white" },
          { op: "box", x0: 2, y0: 3, z0: -2, x1: 3, y1: 5, z1: 2, color: "wing", mirrorX: true },
          { op: "box", x0: -1, y0: 5, z0: -4, x1: 2, y1: 7, z1: -2, color: "white" },
        ],
        parts: [
          {
            name: "hen-head",
            kind: "swingX",
            speed: 3.0,
            amp: 0.24,
            pivot: [0, 5, 3],
            ops: [
              { op: "box", x0: -1, y0: 0, z0: 0, x1: 2, y1: 3, z1: 2, color: "white" },
              { op: "box", x0: 0, y0: 3, z0: 0, x1: 1, y1: 4, z1: 2, color: "comb" },
              { op: "box", x0: 0, y0: 1, z0: 2, x1: 1, y1: 2, z1: 3, color: "beak" },
            ],
          },
        ],
      }),
  },

  "animal-cachorro": {
    id: "animal-cachorro",
    categoryId: "animais",
    name: "Cachorro Dourado",
    description: "Cachorrinho dourado amigável passeando e abanando o rabo pela ilha.",
    meta: "Animal · Corre pela ilha",
    kind: "creation",
    behaviorHint: "wander",
    wanderStyle: "trot",
    speed: 2.8,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Cachorro Dourado",
        description: "Cachorro dourado amigável de coleira vermelha abanando o rabo pelos campos.",
        category: "creature",
        scaleClass: "small",
        palette: {
          fur: "#e6b45c",
          furDark: "#c7913c",
          collar: "#e0443c",
          nose: "#242428",
        },
        ops: [
          { op: "box", x0: 1, y0: 0, z0: 2, x1: 2, y1: 3, z1: 3, color: "fur", mirrorX: true },
          { op: "box", x0: 1, y0: 0, z0: -4, x1: 2, y1: 3, z1: -3, color: "fur", mirrorX: true },
          { op: "roundedBox", x0: -2, y0: 3, z0: -4, x1: 3, y1: 6, z1: 4, radius: 1.0, color: "fur" },
          { op: "box", x0: -2, y0: 4, z0: 3, x1: 3, y1: 6, z1: 4, color: "collar" },
        ],
        parts: [
          {
            name: "dog-head",
            kind: "swingX",
            speed: 2.2,
            amp: 0.16,
            pivot: [0, 5.5, 4],
            ops: [
              { op: "box", x0: -2, y0: 0, z0: 0, x1: 3, y1: 3, z1: 3, color: "fur" },
              { op: "box", x0: -1, y0: 0, z0: 3, x1: 2, y1: 2, z1: 4, color: "fur" },
              { op: "box", x0: 0, y0: 1, z0: 4, x1: 1, y1: 2, z1: 5, color: "nose" },
              { op: "box", x0: 2, y0: 1, z0: 0, x1: 3, y1: 3, z1: 2, color: "furDark", mirrorX: true },
            ],
          },
          {
            name: "dog-tail",
            kind: "swingZ",
            speed: 5.2,
            amp: 0.45,
            pivot: [0, 5.5, -4],
            ops: [
              { op: "box", x0: 0, y0: 0, z0: -3, x1: 1, y1: 2, z1: 0, color: "furDark" },
            ],
          },
        ],
      }),
  },

  // ---------------- 8. COLHEITAS ----------------
  "colheita-colheitadeira": {
    id: "colheita-colheitadeira",
    categoryId: "colheitas",
    name: "Colheitadeira Agrícola",
    description: "Colheitadeira verde e amarela com rolo ceifador giratório.",
    meta: "Colheita · Animada",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Colheitadeira Agrícola",
        description: "Colheitadeira agrícola verde com cabine envidraçada e molinete giratório.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          green: "#3e9444",
          yellow: "#f2c230",
          glass: "#9bdaf0",
          tire: "#22252b",
          steel: "#8c98a6",
          grain: "#ecc34f",
        },
        ops: [
          { op: "roundedBox", x0: -5, y0: 3, z0: -8, x1: 5, y1: 9, z1: 6, radius: 1.0, color: "green" },
          { op: "box", x0: -4, y0: 9, z0: -6, x1: 4, y1: 11, z1: 0, color: "grain" },
          { op: "box", x0: -3, y0: 9, z0: 1, x1: 3, y1: 13, z1: 6, color: "glass" },
          { op: "box", x0: -3, y0: 13, z0: 1, x1: 3, y1: 14, z1: 6, color: "green" },
          { op: "box", x0: -9, y0: 10, z0: -4, x1: -4, y1: 11, z1: -3, color: "yellow" },
          { op: "cylinder", axis: "x", x0: 4, x1: 7, cy: 3, cz: 3, radius: 3.0, color: "tire", mirrorX: true },
          { op: "cylinder", axis: "x", x0: 5, x1: 7, cy: 3, cz: 3, radius: 1.5, color: "yellow", mirrorX: true },
          { op: "cylinder", axis: "x", x0: 4, x1: 6, cy: 2, cz: -6, radius: 2.0, color: "tire", mirrorX: true },
          { op: "cylinder", axis: "x", x0: 5, x1: 6, cy: 2, cz: -6, radius: 1.0, color: "yellow", mirrorX: true },
          { op: "box", x0: -8, y0: 1, z0: 6, x1: 8, y1: 3, z1: 9, color: "steel" },
        ],
        parts: [
          {
            name: "harvester-reel",
            kind: "spinX",
            speed: 2.2,
            pivot: [0, 3.5, 9],
            ops: [
              { op: "box", x0: -8, y0: -1, z0: 0, x1: 8, y1: 1, z1: 1, color: "yellow" },
              { op: "box", x0: -8, y0: 0, z0: -1, x1: 8, y1: 1, z1: 2, color: "yellow" },
            ],
          },
        ],
      }),
  },

  "colheita-feno-aboboras": {
    id: "colheita-feno-aboboras",
    categoryId: "colheitas",
    name: "Fardos de Feno e Abóboras",
    description: "Carroça de madeira com fardos dourados de feno, abóboras e caixotes.",
    meta: "Colheita · Médio",
    kind: "creation",
    behaviorHint: "landmark",
    buildBlueprint: () =>
      makeBlueprint({
        name: "Fardos de Feno e Abóboras",
        description: "Colheita abundante com carroça de madeira, fardos de feno e abóboras recém-colhidas.",
        category: "prop",
        scaleClass: "medium",
        palette: {
          hay: "#ecc34f",
          hayDark: "#d4a634",
          wood: "#9e6b3c",
          woodDark: "#6e4724",
          pumpkin: "#ed7d2d",
          stem: "#4a8a3e",
          apple: "#d9433b",
        },
        ops: [
          { op: "box", x0: -6, y0: 2, z0: -4, x1: 4, y1: 4, z1: 4, color: "wood" },
          { op: "cylinder", axis: "z", cx: -4, cy: 2, z0: 4, z1: 5, radius: 2.0, color: "woodDark" },
          { op: "cylinder", axis: "z", cx: 2, cy: 2, z0: 4, z1: 5, radius: 2.0, color: "woodDark" },
          { op: "cylinder", axis: "z", cx: -4, cy: 2, z0: -5, z1: -4, radius: 2.0, color: "woodDark" },
          { op: "cylinder", axis: "z", cx: 2, cy: 2, z0: -5, z1: -4, radius: 2.0, color: "woodDark" },
          { op: "box", x0: -5, y0: 4, z0: -3, x1: 3, y1: 7, z1: 3, color: "hay" },
          { op: "box", x0: -4, y0: 7, z0: -2, x1: 1, y1: 9, z1: 2, color: "hayDark" },
          { op: "box", x0: 5, y0: 0, z0: -4, x1: 9, y1: 3, z1: 1, color: "hay" },
          { op: "box", x0: 5, y0: 0, z0: 2, x1: 8, y1: 3, z1: 5, color: "pumpkin" },
          { op: "box", x0: 6, y0: 3, z0: 3, x1: 7, y1: 4, z1: 4, color: "stem" },
          { op: "box", x0: -9, y0: 0, z0: 2, x1: -6, y1: 2, z1: 5, color: "woodDark" },
          { op: "box", x0: -8, y0: 2, z0: 3, x1: -7, y1: 3, z1: 4, color: "apple" },
        ],
      }),
  },

  "colheita-trator": {
    id: "colheita-trator",
    categoryId: "colheitas",
    name: "Trator Agrícola",
    description: "Trator vermelho clássico de rodas grandes giratórias pronto para o trabalho no campo.",
    meta: "Colheita · Animado · Médio",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 3.6,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Trator Agrícola",
        description: "Trator agrícola vermelho com rodas traseiras gigantes e cabine envidraçada.",
        category: "vehicle",
        scaleClass: "small",
        palette: {
          red: "#d63b32",
          dark: "#2b2f38",
          glass: "#9adbf0",
          tire: "#1e2026",
          rim: "#f2c230",
          headlight: "#fff2b5",
        },
        ops: [
          { op: "box", x0: -3, y0: 3, z0: -2, x1: 3, y1: 7, z1: 7, color: "red" },
          { op: "box", x0: -4, y0: 6, z0: -7, x1: 4, y1: 11, z1: -1, color: "glass" },
          { op: "box", x0: -4, y0: 11, z0: -7, x1: 4, y1: 12, z1: -1, color: "red" },
          { op: "box", x0: -4, y0: 3, z0: -7, x1: 4, y1: 6, z1: -1, color: "red" },
          { op: "box", x0: 2, y0: 7, z0: 4, x1: 3, y1: 12, z1: 5, color: "dark" },
          { op: "box", x0: 2, y0: 5, z0: 7, x1: 3, y1: 6, z1: 8, color: "headlight", emit: 1.4, mirrorX: true },
        ],
        parts: [
          {
            name: "rear-big-wheels",
            kind: "wheel",
            speed: 0.9,
            pivot: [0, 4, -5],
            ops: [
              { op: "cylinder", axis: "x", x0: 4, x1: 7, cy: 0, cz: 0, radius: 3.6, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 5, x1: 7, cy: 0, cz: 0, radius: 1.8, color: "rim", mirrorX: true },
            ],
          },
          {
            name: "front-wheels",
            kind: "wheel",
            speed: 1.4,
            pivot: [0, 2.5, 5],
            ops: [
              { op: "cylinder", axis: "x", x0: 3, x1: 5, cy: 0, cz: 0, radius: 2.2, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 4, x1: 5, cy: 0, cz: 0, radius: 1.0, color: "rim", mirrorX: true },
            ],
          },
        ],
      }),
  },

  // ---------------- 9. AVIÃO ----------------
  "aviao-bimotor": {
    id: "aviao-bimotor",
    categoryId: "aviao",
    name: "Avião Bimotor",
    description: "Aeronave branca e azul com duas hélices sobrevoando em círculos.",
    meta: "Avião · Voa sobre a ilha",
    kind: "creation",
    behaviorHint: "fly_circle",
    speed: 9.5,
    altitude: 22,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Avião Bimotor",
        description: "Avião bimotor branco e azul sobrevoando os céus da ilha.",
        category: "aircraft",
        scaleClass: "medium",
        palette: {
          white: "#f8fafc",
          blue: "#3d78cc",
          glass: "#9bdcf2",
          steel: "#7a8694",
          red: "#e04a3e",
        },
        ops: [
          { op: "roundedBox", x0: -2, y0: 2, z0: -10, x1: 2, y1: 6, z1: 9, radius: 1.2, color: "white" },
          { op: "box", x0: -2, y0: 3, z0: -10, x1: 2, y1: 4, z1: 8, color: "blue" },
          { op: "box", x0: -2, y0: 5, z0: 4, x1: 2, y1: 6, z1: 7, color: "glass" },
          { op: "box", x0: -12, y0: 4, z0: -1, x1: 12, y1: 5, z1: 3, color: "white" },
          { op: "box", x0: 10, y0: 4, z0: -1, x1: 12, y1: 5, z1: 3, color: "red", mirrorX: true },
          { op: "box", x0: 5, y0: 3, z0: 1, x1: 7, y1: 5, z1: 5, color: "blue", mirrorX: true },
          { op: "box", x0: -5, y0: 4, z0: -11, x1: 5, y1: 5, z1: -8, color: "white" },
          { op: "box", x0: 0, y0: 5, z0: -11, x1: 1, y1: 10, z1: -8, color: "blue" },
        ],
        parts: [
          {
            name: "prop-right",
            kind: "spinZ",
            speed: 14,
            pivot: [6, 4, 5.5],
            ops: [
              { op: "box", x0: -2, y0: 0, z0: 0, x1: 3, y1: 1, z1: 1, color: "steel" },
              { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 3, z1: 1, color: "steel" },
            ],
          },
          {
            name: "prop-left",
            kind: "spinZ",
            speed: 14,
            pivot: [-6, 4, 5.5],
            ops: [
              { op: "box", x0: -2, y0: 0, z0: 0, x1: 3, y1: 1, z1: 1, color: "steel" },
              { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 3, z1: 1, color: "steel" },
            ],
          },
        ],
      }),
  },

  "aviao-biplano": {
    id: "aviao-biplano",
    categoryId: "aviao",
    name: "Biplano Clássico",
    description: "Biplano retrô vermelho com asas duplas e hélice giratória.",
    meta: "Avião · Voa sobre a ilha",
    kind: "creation",
    behaviorHint: "fly_circle",
    speed: 8.2,
    altitude: 18,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Biplano Clássico",
        description: "Biplano clássico vermelho voando em círculos sobre a ilha.",
        category: "aircraft",
        scaleClass: "small",
        palette: {
          red: "#d94138",
          cream: "#f8f0dc",
          wood: "#946238",
          steel: "#4c5460",
        },
        ops: [
          { op: "roundedBox", x0: -2, y0: 2, z0: -8, x1: 2, y1: 5, z1: 7, radius: 1.0, color: "red" },
          { op: "box", x0: -10, y0: 2, z0: 0, x1: 10, y1: 3, z1: 4, color: "cream" },
          { op: "box", x0: -10, y0: 7, z0: 0, x1: 10, y1: 8, z1: 4, color: "red" },
          { op: "box", x0: 6, y0: 3, z0: 1, x1: 7, y1: 7, z1: 2, color: "wood", mirrorX: true },
          { op: "box", x0: -4, y0: 4, z0: -9, x1: 4, y1: 5, z1: -7, color: "cream" },
          { op: "box", x0: 0, y0: 5, z0: -9, x1: 1, y1: 8, z1: -7, color: "red" },
        ],
        parts: [
          {
            name: "nose-prop",
            kind: "spinZ",
            speed: 16,
            pivot: [0, 3.5, 7.5],
            ops: [
              { op: "box", x0: -3, y0: 0, z0: 0, x1: 4, y1: 1, z1: 1, color: "wood" },
              { op: "box", x0: 0, y0: 0, z0: 0, x1: 1, y1: 1, z1: 1, color: "steel" },
            ],
          },
        ],
      }),
  },

  "aviao-helicoptero": {
    id: "aviao-helicoptero",
    categoryId: "aviao",
    name: "Helicóptero Panorâmico",
    description: "Helicóptero amarelo e branco com rotor principal e rotor de cauda girando nos céus.",
    meta: "Aeronave · Voa sobre a ilha",
    kind: "creation",
    behaviorHint: "fly_circle",
    speed: 7.4,
    altitude: 19,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Helicóptero Panorâmico",
        description: "Helicóptero turístico amarelo e branco sobrevoando a ilha com hélices giratórias.",
        category: "aircraft",
        scaleClass: "medium",
        palette: {
          yellow: "#f5c430",
          white: "#f8fafc",
          glass: "#9adcf2",
          dark: "#2b303a",
          red: "#e0463c",
        },
        ops: [
          { op: "roundedBox", x0: -3, y0: 2, z0: -3, x1: 3, y1: 7, z1: 7, radius: 1.4, color: "yellow" },
          { op: "box", x0: -3, y0: 4, z0: -3, x1: 3, y1: 5, z1: 6, color: "white" },
          { op: "box", x0: -2, y0: 4, z0: 3, x1: 2, y1: 6, z1: 7, color: "glass" },
          { op: "box", x0: -1, y0: 4, z0: -12, x1: 1, y1: 6, z1: -3, color: "yellow" },
          { op: "box", x0: -1, y0: 5, z0: -13, x1: 1, y1: 9, z1: -11, color: "red" },
          // Landing skids
          { op: "box", x0: 3, y0: 0, z0: -2, x1: 4, y1: 1, z1: 6, color: "dark", mirrorX: true },
          { op: "box", x0: 3, y0: 1, z0: 0, x1: 4, y1: 2, z1: 1, color: "dark", mirrorX: true },
          { op: "box", x0: 3, y0: 1, z0: 4, x1: 4, y1: 2, z1: 5, color: "dark", mirrorX: true },
        ],
        parts: [
          {
            name: "main-rotor",
            kind: "spinY",
            speed: 14,
            pivot: [0, 8, 1],
            ops: [
              { op: "box", x0: 0, y0: -1, z0: 0, x1: 1, y1: 1, z1: 1, color: "dark" },
              { op: "box", x0: -11, y0: 0, z0: 0, x1: 12, y1: 1, z1: 1, color: "dark" },
              { op: "box", x0: 0, y0: 0, z0: -11, x1: 1, y1: 1, z1: 12, color: "dark" },
            ],
          },
          {
            name: "tail-rotor",
            kind: "spinX",
            speed: 16,
            pivot: [1.5, 7, -12],
            ops: [
              { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 3, z1: 1, color: "white" },
            ],
          },
        ],
      }),
  },

  // ---------------- 10. BICICLETA ----------------
  "bicicleta-urbana": {
    id: "bicicleta-urbana",
    categoryId: "bicicleta",
    name: "Bicicleta Urbana",
    description: "Bicicleta turquesa com cestinha dianteira e rodas giratórias.",
    meta: "Bicicleta · Circula no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 3.4,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Bicicleta Urbana",
        description: "Bicicleta urbana turquesa com cestinha circulando pelas ruas da ilha.",
        category: "vehicle",
        scaleClass: "tiny",
        palette: {
          frame: "#3fa89c",
          tire: "#22252c",
          chrome: "#d4dde6",
          leather: "#7c4c2a",
          basket: "#d8a862",
        },
        ops: [
          { op: "line", x0: 0, y0: 3, z0: -5, x1: 0, y1: 7, z1: -2, radius: 0, color: "frame" },
          { op: "line", x0: 0, y0: 7, z0: -2, x1: 0, y1: 7, z1: 4, radius: 0, color: "frame" },
          { op: "line", x0: 0, y0: 3, z0: -5, x1: 0, y1: 3, z1: 0, radius: 0, color: "frame" },
          { op: "line", x0: 0, y0: 3, z0: 0, x1: 0, y1: 7, z1: 4, radius: 0, color: "frame" },
          { op: "line", x0: 0, y0: 3, z0: 5, x1: 0, y1: 9, z1: 4, radius: 0, color: "chrome" },
          { op: "box", x0: -3, y0: 9, z0: 3, x1: 4, y1: 10, z1: 4, color: "chrome" },
          { op: "box", x0: -2, y0: 7, z0: 5, x1: 3, y1: 9, z1: 7, color: "basket" },
          { op: "box", x0: -1, y0: 8, z0: -3, x1: 2, y1: 9, z1: -1, color: "leather" },
        ],
        parts: [
          {
            name: "front-wheel",
            kind: "wheel",
            speed: 1.5,
            pivot: [0, 3, 5],
            ops: [
              { op: "ring", axis: "x", x0: 0, x1: 1, cy: 0, cz: 0, outerR: 3.0, innerR: 2.0, color: "tire" },
              { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 2, z1: 1, color: "chrome" },
            ],
          },
          {
            name: "rear-wheel",
            kind: "wheel",
            speed: 1.5,
            pivot: [0, 3, -5],
            ops: [
              { op: "ring", axis: "x", x0: 0, x1: 1, cy: 0, cz: 0, outerR: 3.0, innerR: 2.0, color: "tire" },
              { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 2, z1: 1, color: "chrome" },
            ],
          },
        ],
      }),
  },

  "bicicleta-esportiva": {
    id: "bicicleta-esportiva",
    categoryId: "bicicleta",
    name: "Bicicleta Esportiva",
    description: "Bicicleta amarela aerodinâmica para passeios rápidos pela ilha.",
    meta: "Bicicleta · Circula no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 4.2,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Bicicleta Esportiva",
        description: "Bicicleta esportiva amarela percorrendo as vias da ilha.",
        category: "vehicle",
        scaleClass: "tiny",
        palette: {
          yellow: "#f5c230",
          tire: "#1e2026",
          chrome: "#cbd4de",
          seat: "#262830",
        },
        ops: [
          { op: "line", x0: 0, y0: 3, z0: -5, x1: 0, y1: 7, z1: -2, radius: 0, color: "yellow" },
          { op: "line", x0: 0, y0: 7, z0: -2, x1: 0, y1: 7, z1: 4, radius: 0, color: "yellow" },
          { op: "line", x0: 0, y0: 3, z0: 0, x1: 0, y1: 7, z1: 4, radius: 0, color: "yellow" },
          { op: "line", x0: 0, y0: 3, z0: 5, x1: 0, y1: 8, z1: 4, radius: 0, color: "seat" },
          { op: "box", x0: -2, y0: 8, z0: 4, x1: 3, y1: 9, z1: 6, color: "seat" },
          { op: "box", x0: -1, y0: 8, z0: -3, x1: 2, y1: 9, z1: -1, color: "seat" },
        ],
        parts: [
          {
            name: "front-wheel",
            kind: "wheel",
            speed: 1.7,
            pivot: [0, 3, 5],
            ops: [
              { op: "ring", axis: "x", x0: 0, x1: 1, cy: 0, cz: 0, outerR: 3.0, innerR: 2.0, color: "tire" },
              { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 2, z1: 1, color: "chrome" },
            ],
          },
          {
            name: "rear-wheel",
            kind: "wheel",
            speed: 1.7,
            pivot: [0, 3, -5],
            ops: [
              { op: "ring", axis: "x", x0: 0, x1: 1, cy: 0, cz: 0, outerR: 3.0, innerR: 2.0, color: "tire" },
              { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 2, z1: 1, color: "chrome" },
            ],
          },
        ],
      }),
  },

  "bicicleta-triciclo-cafe": {
    id: "bicicleta-triciclo-cafe",
    categoryId: "bicicleta",
    name: "Triciclo de Café",
    description: "Food-bike charmosa com toldo listrado, máquina de espresso e rodas giratórias.",
    meta: "Bicicleta · Circula no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 3.0,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Triciclo de Café",
        description: "Triciclo retrô de café artesanal com toldo listrado circulando pela ilha.",
        category: "vehicle",
        scaleClass: "small",
        palette: {
          wood: "#a66d3c",
          cream: "#faf3e3",
          red: "#d94b3d",
          steel: "#c6d0da",
          tire: "#20232a",
        },
        ops: [
          { op: "box", x0: -3, y0: 3, z0: 0, x1: 3, y1: 7, z1: 6, color: "wood" },
          { op: "box", x0: -2, y0: 7, z0: 2, x1: 2, y1: 9, z1: 5, color: "steel" },
          { op: "pillars", x0: -3, y0: 7, z0: 0, x1: 3, y1: 12, z1: 6, color: "steel" },
          { op: "box", x0: -4, y0: 12, z0: -1, x1: 4, y1: 13, z1: 7, color: "red" },
          { op: "box", x0: -2, y0: 12, z0: -1, x1: 0, y1: 13, z1: 7, color: "cream" },
          { op: "box", x0: 2, y0: 12, z0: -1, x1: 3, y1: 13, z1: 7, color: "cream" },
          { op: "line", x0: 0, y0: 3, z0: -6, x1: 0, y1: 6, z1: 0, radius: 0, color: "red" },
          { op: "box", x0: -1, y0: 7, z0: -5, x1: 1, y1: 8, z1: -3, color: "wood" },
        ],
        parts: [
          {
            name: "front-wheels",
            kind: "wheel",
            speed: 1.5,
            pivot: [0, 2.5, 4],
            ops: [
              { op: "cylinder", axis: "x", x0: 3, x1: 4, cy: 0, cz: 0, radius: 2.3, color: "tire", mirrorX: true },
              { op: "cylinder", axis: "x", x0: 3, x1: 4, cy: 0, cz: 0, radius: 1.0, color: "steel", mirrorX: true },
            ],
          },
          {
            name: "rear-wheel",
            kind: "wheel",
            speed: 1.5,
            pivot: [0, 2.5, -6],
            ops: [
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 2.3, color: "tire" },
            ],
          },
        ],
      }),
  },

  // ---------------- 11. MOTO ----------------
  "moto-esportiva": {
    id: "moto-esportiva",
    categoryId: "moto",
    name: "Moto Esportiva",
    description: "Motocicleta vermelha e preta com farol aceso e escapamento cromado.",
    meta: "Moto · Circula no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 6.6,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Moto Esportiva",
        description: "Motocicleta esportiva vermelha acelerando pelas estradas da ilha.",
        category: "vehicle",
        scaleClass: "small",
        palette: {
          red: "#e04136",
          dark: "#242730",
          chrome: "#d5dee8",
          glass: "#a2ddf2",
          headlight: "#fff3b8",
          taillight: "#ff3e36",
        },
        ops: [
          { op: "box", x0: -2, y0: 2, z0: -3, x1: 2, y1: 5, z1: 3, color: "dark" },
          { op: "roundedBox", x0: -2, y0: 4, z0: -4, x1: 2, y1: 7, z1: 6, radius: 1.0, color: "red" },
          { op: "box", x0: -2, y0: 6, z0: -6, x1: 2, y1: 7, z1: -1, color: "dark" },
          { op: "box", x0: -1, y0: 6, z0: -8, x1: 1, y1: 7, z1: -6, color: "red" },
          { op: "box", x0: -1, y0: 7, z0: 4, x1: 1, y1: 9, z1: 6, color: "glass" },
          { op: "box", x0: -3, y0: 7, z0: 3, x1: 3, y1: 8, z1: 4, color: "chrome" },
          { op: "box", x0: 2, y0: 3, z0: -7, x1: 3, y1: 4, z1: -2, color: "chrome" },
          { op: "box", x0: -1, y0: 5, z0: 6, x1: 1, y1: 6, z1: 7, color: "headlight", emit: 1.5 },
          { op: "box", x0: -1, y0: 6, z0: -8, x1: 1, y1: 7, z1: -7, color: "taillight", emit: 1.3 },
        ],
        parts: [
          {
            name: "front-wheel",
            kind: "wheel",
            speed: 1.6,
            pivot: [0, 2.5, 6],
            ops: [
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 2.5, color: "dark" },
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 1.1, color: "chrome" },
            ],
          },
          {
            name: "rear-wheel",
            kind: "wheel",
            speed: 1.6,
            pivot: [0, 2.5, -6],
            ops: [
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 2.5, color: "dark" },
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 1.1, color: "chrome" },
            ],
          },
        ],
      }),
  },

  "moto-scooter": {
    id: "moto-scooter",
    categoryId: "moto",
    name: "Scooter Clássica",
    description: "Scooter retrô verde-menta com assento marrom e farol redondo.",
    meta: "Moto · Circula no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 4.8,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Scooter Clássica",
        description: "Scooter clássica verde-menta passeando pelas ruas da ilha.",
        category: "vehicle",
        scaleClass: "small",
        palette: {
          mint: "#6cc9a8",
          leather: "#8c5730",
          chrome: "#dce4ec",
          tire: "#22252b",
          headlight: "#fff2b5",
        },
        ops: [
          { op: "box", x0: -2, y0: 2, z0: -5, x1: 2, y1: 3, z1: 4, color: "mint" },
          { op: "roundedBox", x0: -2, y0: 3, z0: -6, x1: 2, y1: 6, z1: -1, radius: 1.0, color: "mint" },
          { op: "box", x0: -2, y0: 6, z0: -5, x1: 2, y1: 7, z1: -1, color: "leather" },
          { op: "box", x0: -2, y0: 3, z0: 3, x1: 2, y1: 7, z1: 5, color: "mint" },
          { op: "box", x0: -3, y0: 7, z0: 3, x1: 3, y1: 8, z1: 4, color: "chrome" },
          { op: "box", x0: -1, y0: 7, z0: 4, x1: 1, y1: 8, z1: 5, color: "headlight", emit: 1.4 },
        ],
        parts: [
          {
            name: "front-wheel",
            kind: "wheel",
            speed: 1.5,
            pivot: [0, 2, 5],
            ops: [
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 2.0, color: "tire" },
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 0.9, color: "chrome" },
            ],
          },
          {
            name: "rear-wheel",
            kind: "wheel",
            speed: 1.5,
            pivot: [0, 2, -5],
            ops: [
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 2.0, color: "tire" },
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 0.9, color: "chrome" },
            ],
          },
        ],
      }),
  },

  "moto-chopper": {
    id: "moto-chopper",
    categoryId: "moto",
    name: "Moto Chopper Custom",
    description: "Motocicleta custom azul-cobalto com garfo alongado, cromo brilhante e farol aceso.",
    meta: "Moto · Dirige no mapa",
    kind: "creation",
    behaviorHint: "vehicle_route",
    speed: 6.0,
    buildBlueprint: () =>
      makeBlueprint({
        name: "Moto Chopper Custom",
        description: "Motocicleta chopper custom azul e cromada desfilando pelas estradas da ilha.",
        category: "vehicle",
        scaleClass: "small",
        palette: {
          cobalt: "#2b62b8",
          chrome: "#e2e9f0",
          leather: "#2c2420",
          tire: "#1e2026",
          headlight: "#fff3b8",
        },
        ops: [
          { op: "box", x0: -2, y0: 2, z0: -3, x1: 2, y1: 5, z1: 3, color: "chrome" },
          { op: "roundedBox", x0: -2, y0: 5, z0: -2, x1: 2, y1: 7, z1: 4, radius: 1.0, color: "cobalt" },
          { op: "box", x0: -2, y0: 4, z0: -6, x1: 2, y1: 6, z1: -2, color: "leather" },
          { op: "line", x0: 0, y0: 3, z0: 8, x1: 0, y1: 9, z1: 4, radius: 0, color: "chrome" },
          { op: "box", x0: -4, y0: 9, z0: 3, x1: 4, y1: 10, z1: 4, color: "chrome" },
          { op: "box", x0: 2, y0: 2, z0: -7, x1: 3, y1: 3, z1: 1, color: "chrome", mirrorX: true },
          { op: "box", x0: -1, y0: 6, z0: 6, x1: 1, y1: 7, z1: 7, color: "headlight", emit: 1.5 },
        ],
        parts: [
          {
            name: "front-wheel",
            kind: "wheel",
            speed: 1.5,
            pivot: [0, 2.5, 8],
            ops: [
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 2.5, color: "tire" },
              { op: "cylinder", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, radius: 1.2, color: "chrome" },
            ],
          },
          {
            name: "rear-wheel",
            kind: "wheel",
            speed: 1.5,
            pivot: [0, 2.5, -6],
            ops: [
              { op: "cylinder", axis: "x", x0: -2, x1: 2, cy: 0, cz: 0, radius: 2.5, color: "tire" },
              { op: "cylinder", axis: "x", x0: -2, x1: 2, cy: 0, cz: 0, radius: 1.2, color: "chrome" },
            ],
          },
        ],
      }),
  },

  // ---------------- 12. PESSOAS ----------------
  "pessoa-morador": {
    id: "pessoa-morador",
    categoryId: "pessoas",
    name: "Morador da Ilha",
    description: "Pessoa caminhando e interagindo pela vizinhança e pontos de ônibus.",
    meta: "Pessoa · Caminha pela ilha",
    kind: "villager",
    villagerSpec: {
      role: "commuter",
      hatColor: "#4c82d4",
      shirtColor: "#f0b949",
      usesTransit: true,
    },
  },
  "pessoa-fazendeiro": {
    id: "pessoa-fazendeiro",
    categoryId: "pessoas",
    name: "Fazendeiro",
    description: "Trabalhador rural com chapéu de palha cuidando das plantações e fazendas.",
    meta: "Pessoa · Caminha pelo campo",
    kind: "villager",
    villagerSpec: {
      role: "gardener",
      hatColor: "#e6c360",
      shirtColor: "#4e9c54",
      usesTransit: false,
    },
  },
  "pessoa-explorador": {
    id: "pessoa-explorador",
    categoryId: "pessoas",
    name: "Explorador",
    description: "Viajante curioso percorrendo trilhas, ruas e novos lugares da ilha.",
    meta: "Pessoa · Explora a ilha",
    kind: "villager",
    villagerSpec: {
      role: "explorer",
      hatColor: "#cc5b44",
      shirtColor: "#46a69c",
      usesTransit: true,
    },
  },
  "pessoa-artista": {
    id: "pessoa-artista",
    categoryId: "pessoas",
    name: "Artista",
    description: "Morador criativo passeando pelas praças e observando as construções.",
    meta: "Pessoa · Caminha pela ilha",
    kind: "villager",
    villagerSpec: {
      role: "artist",
      hatColor: "#8b64c8",
      shirtColor: "#e8789e",
      usesTransit: true,
    },
  },
  "pessoa-chef": {
    id: "pessoa-chef",
    categoryId: "pessoas",
    name: "Chef de Cozinha",
    description: "Chef com chapéu branco passeando pelos restaurantes, praças e mercados.",
    meta: "Pessoa · Caminha pela ilha",
    kind: "villager",
    villagerSpec: {
      role: "baker",
      hatColor: "#ffffff",
      shirtColor: "#f2f4f8",
      usesTransit: true,
    },
  },
  "pessoa-esportista": {
    id: "pessoa-esportista",
    categoryId: "pessoas",
    name: "Esportista",
    description: "Visitante animado correndo pelas alamedas, parques e praias da ilha.",
    meta: "Pessoa · Explora a ilha",
    kind: "villager",
    villagerSpec: {
      role: "student",
      hatColor: "#ff6b4a",
      shirtColor: "#36b5a6",
      usesTransit: false,
    },
  },
};

export function getCatalogPreset(presetId: string): CatalogPresetSpec | null {
  if (!presetId || typeof presetId !== "string") return null;
  return Object.hasOwn(CATALOG_PRESETS, presetId) ? CATALOG_PRESETS[presetId] : null;
}

export interface SerializedCatalogItem {
  id: string;
  categoryId: CatalogCategoryId;
  name: string;
  description: string;
  meta: string;
  kind: CatalogItemKind;
  isRoad: boolean;
  pathKind?: CatalogPresetSpec["pathKind"];
  behaviorHint?: CatalogPresetSpec["behaviorHint"];
  speed?: number;
  altitude?: number;
  wanderStyle?: CatalogPresetSpec["wanderStyle"];
  blueprint?: VoxelBlueprint;
  villagerSpec?: CatalogPresetSpec["villagerSpec"];
}

let cachedCatalogItems: SerializedCatalogItem[] | null = null;

export function getSerializedCatalogItems(): SerializedCatalogItem[] {
  if (cachedCatalogItems) return cachedCatalogItems;
  cachedCatalogItems = Object.values(CATALOG_PRESETS).map((preset) => ({
    id: preset.id,
    categoryId: preset.categoryId,
    name: preset.name,
    description: preset.description,
    meta: preset.meta,
    kind: preset.kind,
    isRoad: preset.kind === "road",
    ...(preset.pathKind ? { pathKind: preset.pathKind } : {}),
    ...(preset.behaviorHint ? { behaviorHint: preset.behaviorHint } : {}),
    ...(typeof preset.speed === "number" ? { speed: preset.speed } : {}),
    ...(typeof preset.altitude === "number" ? { altitude: preset.altitude } : {}),
    ...(preset.wanderStyle ? { wanderStyle: preset.wanderStyle } : {}),
    ...(preset.buildBlueprint
      ? { blueprint: preset.buildBlueprint() }
      : preset.buildPreviewBlueprint
        ? { blueprint: preset.buildPreviewBlueprint() }
        : {}),
    ...(preset.villagerSpec ? { villagerSpec: preset.villagerSpec } : {}),
  }));
  return cachedCatalogItems;
}
