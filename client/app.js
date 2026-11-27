import { createMeadowWorldEngine } from "./voxel/meadow_engine.js";
import { createCharacterBuilderController } from "./character_builder.js";
import { createCatalogMenuController } from "./catalog_menu.js";
import { createMultiplayerClient } from "./multiplayer_client.js";

const urlParams = new URLSearchParams(location.search);
const isOgCapture = urlParams.get("og") === "1";
if (isOgCapture) {
  document.body.dataset.ogCapture = "1";
}

const worldCanvas = document.getElementById("world-canvas");

const addBtn = document.getElementById("add-btn");
const pickSpotPill = document.getElementById("pick-spot-pill");
const cancelPickBtn = document.getElementById("cancel-pick-btn");
const catalogPickPill = document.getElementById("catalog-pick-pill");
const catalogPickLabel = document.getElementById("catalog-pick-label");
const catalogUndoBtn = document.getElementById("catalog-undo-btn");
const catalogSwitchBtn = document.getElementById("catalog-switch-btn");
const catalogCancelBtn = document.getElementById("catalog-cancel-btn");
const deleteModePill = document.getElementById("delete-mode-pill");
const deleteUndoBtn = document.getElementById("delete-undo-btn");
const deleteCancelBtn = document.getElementById("delete-cancel-btn");
const selectedItemPill = document.getElementById("selected-item-pill");
const selectedItemLabel = document.getElementById("selected-item-label");
const selectedSwapBtn = document.getElementById("selected-swap-btn");
const selectedDeleteBtn = document.getElementById("selected-delete-btn");
const selectedCloseBtn = document.getElementById("selected-close-btn");

const bottomBuilder = document.getElementById("bottom-builder");
const moveSpotBtn = document.getElementById("move-spot-btn");
const closeBuilderBtn = document.getElementById("close-builder-btn");

const dropZone = document.getElementById("drop-zone");
const imageInput = document.getElementById("image-input");
const dropEmpty = document.getElementById("drop-empty");
const dropPreviewWrap = document.getElementById("drop-preview-wrap");
const dropPreviewImg = document.getElementById("drop-preview-img");
const clearImageBtn = document.getElementById("clear-image-btn");
const promptInput = document.getElementById("prompt-input");
const sculptBtn = document.getElementById("sculpt-btn");
const formError = document.getElementById("form-error");

const buildingPill = document.getElementById("building-pill");
const buildingPillLabel = document.getElementById("building-pill-label");
const buildingPillSub = document.getElementById("building-pill-sub");
const readyGotoBtn = document.getElementById("ready-goto-btn");
const readyGotoLabel = document.getElementById("ready-goto-label");
const locateMineBtn = document.getElementById("locate-mine-btn");
const locateMineLabel = document.getElementById("locate-mine-label");

const hoverCard = document.getElementById("hover-card");
const hoverName = document.getElementById("hover-name");
const hoverFeed = document.getElementById("hover-feed");
const hoverStatus = document.getElementById("hover-status");
const weaveToast = document.getElementById("weave-toast");

const camPanBtn = document.getElementById("cam-pan-btn");
const camOrbitBtn = document.getElementById("cam-orbit-btn");
const camWalkBtn = document.getElementById("cam-walk-btn");
const recenterBtn = document.getElementById("recenter-btn");
const recenterCompass = document.getElementById("recenter-compass");
const avatarBtn = document.getElementById("avatar-btn");
const avatarSwatchDot = document.getElementById("avatar-swatch-dot");
const menuBtn = document.getElementById("menu-btn");
const undoBtn = document.getElementById("undo-btn");
const deleteModeBtn = document.getElementById("delete-mode-btn");
const onlinePill = document.getElementById("online-pill");
const onlineCountEl = document.getElementById("online-count");
const interactPromptBtn = document.getElementById("interact-prompt");
const interactKeyEl = document.getElementById("interact-key");
const interactLabelEl = document.getElementById("interact-label");
const walkEscHintBtn = document.getElementById("walk-esc-hint");
const avatarDialog = document.getElementById("avatar-dialog");
const catalogDialog = document.getElementById("catalog-dialog");

const walkJoystick = document.getElementById("walk-joystick");
const walkJoystickKnob = document.getElementById("walk-joystick-knob");
const walkJoyUp = document.getElementById("walk-joy-up");
const walkJoyDown = document.getElementById("walk-joy-down");
const walkJoyLeft = document.getElementById("walk-joy-left");
const walkJoyRight = document.getElementById("walk-joy-right");

// UI states: "idle" | "picking" | "catalog_picking" | "catalog_deleting" | "composing" | "building" | "ready" | "placed"
let uiState = "idle";
let myCreationId = null;
let readyCreation = null;
let worldData = null;
let selectedImageDataUrl = null;
let chosenSpot = null;
let toastTimer = null;
let pendingCatalogPreset = null;
let pendingRoadStart = null;
let catalogPlacingInFlight = false;
let catalogPlacedCount = 0;
const recentLocalCatalogIds = new Set();

// Undo / Delete / Swap state
const actionHistory = [];
const placedPresetById = new Map();
const placedExtraPropById = new Map();
let selectedWorldItem = null;
let pendingSwapTarget = null;

// Live multi-user build queue state
let activeJob = null;
let jobPollInterval = null;
let jobPollInFlight = false;

const VISITOR_STORAGE_KEY = "geminisland_visitor_token_v1";
let cachedVisitorToken = (() => {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(VISITOR_STORAGE_KEY) : null;
  } catch {
    return null;
  }
})();

const CLIENT_TIMEZONE = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
})();

function storeVisitorToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return;
  cachedVisitorToken = token;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(VISITOR_STORAGE_KEY, token);
    }
  } catch {
    // Sandboxed iframes without storage access fall back to in-memory cachedVisitorToken
  }
}

function buildVisitorHeaders(extra = {}) {
  const headers = { ...extra };
  if (cachedVisitorToken) {
    headers["x-meadow-visitor"] = cachedVisitorToken;
  }
  if (CLIENT_TIMEZONE) {
    headers["x-meadow-tz"] = CLIENT_TIMEZONE;
  }
  return headers;
}
window.__geminIslandVisitorHeaders = buildVisitorHeaders;

function showToast(text, durationMs = 4200) {
  if (!text || isOgCapture) return;
  weaveToast.textContent = text;
  weaveToast.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    weaveToast.hidden = true;
  }, durationMs);
}

function renderActiveJobLabel() {
  if (buildingPillSub) {
    buildingPillSub.textContent = "Being built with Gemini 4 Hydrogen";
  }
  if (!activeJob) {
    buildingPillLabel.textContent = "Approving query…";
    return;
  }
  if (activeJob.status === "queued" && activeJob.position >= 1) {
    buildingPillLabel.textContent =
      activeJob.position === 1 ? "Next in queue…" : `Waiting in queue (#${activeJob.position})…`;
  } else if (activeJob.phase === "approving") {
    buildingPillLabel.textContent = "Approving query…";
  } else if (activeJob.phase === "reviewing") {
    buildingPillLabel.textContent = "Reviewing 3D model…";
  } else if (activeJob.phase === "refining") {
    buildingPillLabel.textContent = "Polishing details…";
  } else if (activeJob.phase === "placing") {
    buildingPillLabel.textContent = "Placing on island…";
  } else {
    buildingPillLabel.textContent = "Sculpting voxels…";
  }
}

function stopJobTracking() {
  activeJob = null;
  if (jobPollInterval) {
    clearInterval(jobPollInterval);
    jobPollInterval = null;
  }
}

let engine = null;
let characterBuilder = null;
let catalogMenu = null;
let mpClient = null;
let activeInteractionPrompt = null;
let lastAvatarDialogCloseMs = -1000;
let lastCatalogDialogCloseMs = -1000;
let currentCamMode = "pan";
let sawTouchInput = false;
let joyPointerId = null;

function syncAvatarSwatchDot(app) {
  if (!avatarSwatchDot || !app || typeof app !== "object") return;
  const swatchColor =
    (typeof app.topColor === "string" && app.topColor) ||
    (typeof app.hatColor === "string" && app.hatColor) ||
    "#4c82d4";
  avatarSwatchDot.style.backgroundColor = swatchColor;
}

function updateOnlinePill(count) {
  if (!onlinePill) return;
  if (isOgCapture || typeof count !== "number" || !Number.isFinite(count) || count < 1) {
    onlinePill.hidden = true;
    return;
  }
  const clean = Math.max(1, Math.trunc(count));
  if (onlineCountEl) {
    onlineCountEl.textContent = String(clean);
  }
  onlinePill.hidden = false;
}

function isMobileWalkViewport() {
  if (sawTouchInput) return true;
  if (window.matchMedia?.("(pointer: coarse)")?.matches) return true;
  return window.innerWidth <= 768;
}

function resetWalkJoystick() {
  joyPointerId = null;
  walkJoystick?.classList.remove("is-active");
  walkJoystickKnob?.setAttribute("transform", "translate(0 0)");
  walkJoyUp?.classList.remove("is-lit");
  walkJoyDown?.classList.remove("is-lit");
  walkJoyLeft?.classList.remove("is-lit");
  walkJoyRight?.classList.remove("is-lit");
  engine?.setJoystickInput(0, 0);
}

function syncWalkJoystickVisibility() {
  const show = !isOgCapture && currentCamMode === "walk" && isMobileWalkViewport();
  if (walkJoystick) {
    walkJoystick.hidden = !show;
  }
  if (show) {
    document.body.dataset.walkMobile = "1";
  } else {
    delete document.body.dataset.walkMobile;
    resetWalkJoystick();
  }
}

function syncCameraModeUI(mode) {
  currentCamMode = mode;
  const isPan = mode === "pan";
  const isOrbit = mode === "orbit";
  const isWalk = mode === "walk";
  if (camPanBtn) {
    camPanBtn.classList.toggle("is-active", isPan);
    camPanBtn.setAttribute("aria-pressed", isPan ? "true" : "false");
  }
  if (camOrbitBtn) {
    camOrbitBtn.classList.toggle("is-active", isOrbit);
    camOrbitBtn.setAttribute("aria-pressed", isOrbit ? "true" : "false");
  }
  if (camWalkBtn) {
    camWalkBtn.classList.toggle("is-active", isWalk);
    camWalkBtn.setAttribute("aria-pressed", isWalk ? "true" : "false");
  }
  syncWalkJoystickVisibility();
  if (walkEscHintBtn) {
    walkEscHintBtn.hidden = isOgCapture || !isWalk || isMobileWalkViewport();
  }
}

const demoClickTimers = new WeakMap();

function triggerCameraButtonClickFX(mode) {
  syncCameraModeUI(mode);
  const btn = mode === "walk" ? camWalkBtn : mode === "orbit" ? camOrbitBtn : camPanBtn;
  if (!btn || isOgCapture) return;
  const prevTimer = demoClickTimers.get(btn);
  if (prevTimer) clearTimeout(prevTimer);
  btn.classList.remove("is-demo-click");
  void btn.offsetWidth;
  btn.classList.add("is-demo-click");
  demoClickTimers.set(
    btn,
    setTimeout(() => {
      btn.classList.remove("is-demo-click");
    }, 740),
  );
}

const lastIncidentSentByVehicle = new Map();

async function reportTrafficIncidentToObserver(incident) {
  if (isOgCapture || !incident || typeof incident.vehicleId !== "string") return;
  const nowMs = Date.now();
  const prevMs = lastIncidentSentByVehicle.get(incident.vehicleId) || 0;
  if (nowMs - prevMs < 25_000) return;
  lastIncidentSentByVehicle.set(incident.vehicleId, nowMs);
  try {
    await fetch("/api/traffic-incident", {
      method: "POST",
      headers: buildVisitorHeaders({
        "content-type": "application/json",
        "x-meadow-client": "1",
      }),
      body: JSON.stringify({
        vehicleId: incident.vehicleId,
        peerVehicleId: incident.peerVehicleId || null,
        x: incident.x,
        z: incident.z,
        reason: incident.reason || "self_restored",
      }),
    });
  } catch {
    // Ignore transient network errors during background telemetry
  }
}

engine = createMeadowWorldEngine(
  worldCanvas,
  {
    onHoverCreation(creation, clientX, clientY, reading) {
      if (
        !creation ||
        uiState === "picking" ||
        uiState === "catalog_picking" ||
        isOgCapture ||
        (activeInteractionPrompt && engine?.isFirstPerson?.())
      ) {
        hoverCard.hidden = true;
        return;
      }
      hoverName.textContent = creation.name;
      if (reading?.summary) {
        hoverFeed.textContent = reading.summary;
        hoverFeed.hidden = false;
      } else {
        hoverFeed.hidden = true;
      }
      hoverStatus.textContent = creation.description || creation.behavior?.statusLine || "";
      hoverCard.style.left = `${clientX}px`;
      hoverCard.style.top = `${clientY}px`;
      hoverCard.hidden = false;
    },
    onSelectCreation(creation, reading) {
      if (!creation || isOgCapture) return;
      if (isRemovableCreation(creation)) {
        selectedWorldItem = {
          kind: "creation",
          id: creation.id,
          name: creation.name || "Item",
          x: creation.x ?? 0,
          z: creation.z ?? 0,
          presetId: placedPresetById.get(creation.id) || null,
          extraPropId: placedExtraPropById.get(creation.id) || null,
        };
        syncDockUI();
      } else if (selectedWorldItem) {
        selectedWorldItem = null;
        syncDockUI();
      }
      const baseDesc = creation.description || creation.behavior?.statusLine || "";
      const detail = reading?.summary
        ? baseDesc
          ? `${reading.summary} · ${baseDesc}`
          : reading.summary
        : baseDesc;
      showToast(detail ? `${creation.name} — ${detail}` : creation.name);
    },
    onClickGroundEmpty(rawX, rawZ) {
      if (isOgCapture) return;
      const nearby = findClosestRemovableAtGround(rawX, rawZ);
      if (nearby) {
        selectedWorldItem = nearby;
        syncDockUI();
        return;
      }
      if (selectedWorldItem) {
        selectedWorldItem = null;
        syncDockUI();
      }
    },
    onDeleteClick(pickedCreation, rawX, rawZ) {
      if (isOgCapture || catalogPlacingInFlight) return;
      if (pickedCreation) {
        if (!isRemovableCreation(pickedCreation)) {
          showToast("Este marco original da ilha não pode ser excluído — clique em um item colocado.", 3200);
          return;
        }
        void removeWorldItem({
          kind: "creation",
          id: pickedCreation.id,
          name: pickedCreation.name || "Item",
          x: pickedCreation.x ?? 0,
          z: pickedCreation.z ?? 0,
          presetId: placedPresetById.get(pickedCreation.id) || null,
          extraPropId: placedExtraPropById.get(pickedCreation.id) || null,
        });
        return;
      }
      if (typeof rawX === "number" && typeof rawZ === "number") {
        const nearby = findClosestRemovableAtGround(rawX, rawZ);
        if (nearby) {
          void removeWorldItem(nearby);
          return;
        }
      }
      showToast("Clique diretamente em um item colocado (casa, carro, estrada, rio, lago ou pessoa) para excluir.", 2800);
    },
    onInteractiveEvent(_creation, message) {
      if (!message || isOgCapture) return;
      showToast(message);
    },
    onPickGroundSpot(x, z, rawX, rawZ) {
      if (uiState === "catalog_picking" && pendingCatalogPreset) {
        if (catalogPlacingInFlight) return;
        const rx = typeof rawX === "number" && Number.isFinite(rawX) ? rawX : x;
        const rz = typeof rawZ === "number" && Number.isFinite(rawZ) ? rawZ : z;
        if (pendingCatalogPreset.isRoad) {
          // First click immediately lays a road right where clicked; subsequent clicks within 60m extend & connect it!
          const canConnect =
            pendingRoadStart &&
            Math.hypot(rx - pendingRoadStart.x, rz - pendingRoadStart.z) >= 3 &&
            Math.hypot(rx - pendingRoadStart.x, rz - pendingRoadStart.z) <= 60;
          if (canConnect) {
            void placeCatalogPresetAt(
              pendingCatalogPreset,
              pendingRoadStart.x,
              pendingRoadStart.z,
              rx,
              rz,
            );
          } else {
            void placeCatalogPresetAt(pendingCatalogPreset, rx, rz, null, null);
          }
          return;
        }
        const px = pendingCatalogPreset.useRawSpot ? rx : x;
        const pz = pendingCatalogPreset.useRawSpot ? rz : z;
        void placeCatalogPresetAt(pendingCatalogPreset, px, pz, null, null);
        return;
      }
      chosenSpot = { x, z };
      uiState = "composing";
      syncDockUI();
      if (window.innerWidth > 640) {
        promptInput.focus({ preventScroll: true });
      }
    },
    onAutoNudgeSpot(x, z) {
      if (chosenSpot) {
        chosenSpot = { x, z };
      }
    },
    onDragModeChange(mode) {
      syncCameraModeUI(mode);
    },
    onIntroDemoStep(mode) {
      triggerCameraButtonClickFX(mode);
    },
    onCameraChange(camState) {
      if (recenterCompass && typeof camState?.azDeltaFromHome === "number") {
        const deg = ((camState.azDeltaFromHome * 180) / Math.PI).toFixed(1);
        recenterCompass.setAttribute("transform", `rotate(${deg} 12 12)`);
      }
    },
    onInteractionPromptChange(promptInfo) {
      activeInteractionPrompt = promptInfo || null;
      if (!interactPromptBtn) return;
      if (!promptInfo || isOgCapture) {
        interactPromptBtn.hidden = true;
        return;
      }
      if (interactKeyEl) {
        interactKeyEl.textContent = promptInfo.keyHint || "E";
      }
      if (interactLabelEl) {
        interactLabelEl.textContent = promptInfo.label || "Interact";
      }
      interactPromptBtn.hidden = false;
      if (engine?.isFirstPerson?.()) {
        hoverCard.hidden = true;
      }
    },
    onLocalEmote(kind) {
      mpClient?.sendEmote(kind);
    },
    onInteriorChange(roomInfo) {
      if (roomInfo) {
        document.body.dataset.inInterior = "1";
        if (
          uiState === "picking" ||
          uiState === "catalog_picking" ||
          uiState === "catalog_deleting" ||
          uiState === "composing"
        ) {
          hideError();
          chosenSpot = null;
          pendingCatalogPreset = null;
          pendingRoadStart = null;
          pendingSwapTarget = null;
          selectedWorldItem = null;
          catalogPlacedCount = 0;
          uiState = myCreationId ? "placed" : "idle";
          syncDockUI();
        }
      } else {
        delete document.body.dataset.inInterior;
      }
      hoverCard.hidden = true;
      mpClient?.forcePoseSync();
    },
    onTrafficIncident(incident) {
      void reportTrafficIncidentToObserver(incident);
    },
  },
  { ogMode: isOgCapture },
);

window.__geminIslandCam = () => engine.getCameraState();
window.__geminIslandEngine = engine;

interactPromptBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  engine?.triggerActiveInteraction?.();
  interactPromptBtn.blur();
});

characterBuilder = createCharacterBuilderController({
  dialogEl: avatarDialog,
  onChange(app) {
    engine?.setLocalAppearance?.(app);
    syncAvatarSwatchDot(app);
  },
  onSave(app) {
    engine?.setLocalAppearance?.(app);
    syncAvatarSwatchDot(app);
    mpClient?.sendProfile(app);
  },
});

avatarDialog?.addEventListener("close", () => {
  lastAvatarDialogCloseMs = performance.now();
  avatarBtn?.blur();
  queueMicrotask(() => avatarBtn?.blur());
});

avatarDialog?.querySelector('[data-cb-action="wave"]')?.addEventListener("click", () => {
  engine?.triggerLocalWave?.();
  mpClient?.sendEmote("wave");
});

syncAvatarSwatchDot(engine?.getLocalAppearance?.() || characterBuilder?.getAppearance?.());

avatarBtn?.addEventListener("click", () => {
  if (isOgCapture) return;
  avatarBtn?.blur();
  hoverCard.hidden = true;
  resetWalkJoystick();
  engine?.releaseWalkPointerLock?.();
  characterBuilder?.open(engine?.getLocalAppearance?.());
});

function isRemovableCreation(creation) {
  if (!creation || !creation.id) return false;
  if (creation.isSeed || creation.isCompanion) return false;
  return true;
}

function distToSegment2D(px, pz, ax, az, bx, bz) {
  const dx = bx - ax;
  const dz = bz - az;
  const l2 = dx * dx + dz * dz;
  const t = l2 > 1e-6 ? Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l2)) : 0;
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t));
}

function findClosestRemovableAtGround(gx, gz) {
  if (!worldData || typeof gx !== "number" || typeof gz !== "number") return null;
  let best = null;
  let bestScore = Infinity;

  for (const pr of worldData.props || []) {
    if (pr.kind !== "pond" || !pr.id) continue;
    if (!pr.id.startsWith("user-pond-") && !pr.id.startsWith("local-pond-")) continue;
    const d = Math.hypot((pr.x || 0) - gx, (pr.z || 0) - gz);
    const hitR = (pr.radius || 6.6) + 2.2;
    if (d <= hitR && d * 0.65 < bestScore) {
      bestScore = d * 0.65;
      best = {
        kind: "pond",
        id: pr.id,
        name: "Lago",
        x: pr.x || 0,
        z: pr.z || 0,
        presetId: placedPresetById.get(pr.id) || null,
      };
    }
  }

  for (const p of worldData.paths || []) {
    if (!p.id || !Array.isArray(p.points) || p.points.length < 2) continue;
    if (!p.id.startsWith("user-") && !p.id.startsWith("local-")) continue;
    let minD = Infinity;
    for (let i = 0; i < p.points.length - 1; i++) {
      const d = distToSegment2D(gx, gz, p.points[i][0], p.points[i][1], p.points[i + 1][0], p.points[i + 1][1]);
      if (d < minD) minD = d;
    }
    const hitW = p.kind === "river" ? 3.8 : 3.2;
    if (minD <= hitW && minD < bestScore) {
      bestScore = minD;
      const mid = p.points[Math.floor(p.points.length / 2)] || p.points[0];
      best = {
        kind: "road",
        id: p.id,
        name:
          p.kind === "river"
            ? "Rio Cristalino"
            : p.kind === "creek"
              ? "Riacho com Pedras"
              : "Estrada",
        x: mid[0],
        z: mid[1],
        presetId: placedPresetById.get(p.id) || null,
      };
    }
  }

  for (const v of worldData.villagers || []) {
    if (!v.id) continue;
    if (!v.id.startsWith("v-user-") && !v.id.startsWith("local-v-")) continue;
    const d = Math.hypot((v.homeX || 0) - gx, (v.homeZ || 0) - gz);
    if (d <= 4.5 && d < bestScore) {
      bestScore = d;
      best = {
        kind: "villager",
        id: v.id,
        name: v.name || "Morador",
        x: v.homeX || 0,
        z: v.homeZ || 0,
        presetId: placedPresetById.get(v.id) || null,
      };
    }
  }

  return best;
}

function pushActionHistory(entry) {
  actionHistory.push(entry);
  if (actionHistory.length > 60) {
    actionHistory.shift();
  }
  syncActionControlsUI();
}

function syncActionControlsUI() {
  const hasHistory = actionHistory.length > 0;
  if (undoBtn) {
    undoBtn.disabled = !hasHistory || catalogPlacingInFlight;
  }
  if (catalogUndoBtn) {
    catalogUndoBtn.hidden = !hasHistory;
    catalogUndoBtn.disabled = catalogPlacingInFlight;
  }
  if (deleteUndoBtn) {
    deleteUndoBtn.hidden = !hasHistory;
    deleteUndoBtn.disabled = catalogPlacingInFlight;
  }
  if (deleteModeBtn) {
    const isDel = uiState === "catalog_deleting";
    deleteModeBtn.classList.toggle("is-danger-active", isDel);
    deleteModeBtn.setAttribute("aria-pressed", isDel ? "true" : "false");
  }
}

function updateCatalogPickLabel() {
  if (!catalogPickLabel || !pendingCatalogPreset) return;
  if (catalogPlacingInFlight) {
    catalogPickLabel.textContent = `Adicionando ${pendingCatalogPreset.name}…`;
    return;
  }
  const countSuffix = catalogPlacedCount > 0 ? ` (${catalogPlacedCount})` : "";
  if (pendingCatalogPreset.isRoad) {
    const segLabel = pendingCatalogPreset.isWater ? "continuar o rio" : "continuar a pista";
    catalogPickLabel.textContent = pendingRoadStart
      ? `${pendingCatalogPreset.name}${countSuffix} · Clique para ${segLabel}`
      : `${pendingCatalogPreset.name} · Clique no mapa para adicionar`;
    return;
  }
  catalogPickLabel.textContent = `${pendingCatalogPreset.name}${countSuffix} · Clique no mapa para adicionar`;
}

function placeCatalogPresetLocally(preset, x, z, x2, z2, options = {}) {
  const srv = catalogMenu?.getPresetData?.(preset.id);
  if (!srv) return null;

  if (!worldData || typeof worldData !== "object") {
    worldData = {
      version: 1,
      paths: [],
      props: [],
      creations: [],
      villagers: [],
      myCreationId,
    };
  }
  if (!Array.isArray(worldData.paths)) worldData.paths = [];
  if (!Array.isArray(worldData.props)) worldData.props = [];
  if (!Array.isArray(worldData.creations)) worldData.creations = [];
  if (!Array.isArray(worldData.villagers)) worldData.villagers = [];

  const clampCoord = (val) => Math.max(-135, Math.min(135, Number.isFinite(val) ? val : 0));
  const px = Number(clampCoord(x).toFixed(2));
  const pz = Number(clampCoord(z).toFixed(2));
  const now = Date.now();
  const uid = `${now.toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  let anchorX = px;
  let anchorZ = pz;
  let placedName = srv.name || preset.name;
  let placedKind = "creation";
  let placedId = "";
  let extraPropId = null;

  if (srv.kind === "pond") {
    placedKind = "pond";
    placedId = `local-pond-${uid}`;
    worldData.props = [
      ...worldData.props,
      {
        id: placedId,
        kind: "pond",
        x: px,
        z: pz,
        yaw: Number(((now % 628) / 100).toFixed(2)),
        radius: srv.pondRadius || 7.2,
      },
    ];
  } else if (srv.kind === "road" || preset.isRoad) {
    placedKind = "road";
    const isWaterPath = srv.pathKind === "river" || srv.pathKind === "creek";
    const hasSecond =
      typeof x2 === "number" && Number.isFinite(x2) && typeof z2 === "number" && Number.isFinite(z2);
    let p0x = px;
    let p0z = pz;
    let p1x = px;
    let p1z = pz;
    if (hasSecond) {
      p1x = Number(clampCoord(x2).toFixed(2));
      p1z = Number(clampCoord(z2).toFixed(2));
      if (Math.hypot(p1x - p0x, p1z - p0z) < 4) {
        p1x = Number(clampCoord(p0x + 12).toFixed(2));
        p1z = Number(clampCoord(p0z + 3).toFixed(2));
      }
    } else {
      const halfLen = isWaterPath ? 9.5 : 7;
      p0x = Number(clampCoord(px - halfLen).toFixed(2));
      p1x = Number(clampCoord(px + halfLen).toFixed(2));
    }
    const midX = Number(((p0x + p1x) * 0.5).toFixed(2));
    const midZ = Number(((p0z + p1z) * 0.5).toFixed(2));
    placedId = `local-${isWaterPath ? "water" : "road"}-${uid}`;
    worldData.paths = [
      ...worldData.paths,
      {
        id: placedId,
        kind: srv.pathKind || "road",
        points: [
          [p0x, p0z],
          [midX, midZ],
          [p1x, p1z],
        ],
        closed: false,
      },
    ];
    anchorX = p1x;
    anchorZ = p1z;
  } else if (srv.kind === "villager" && srv.villagerSpec) {
    placedKind = "villager";
    placedId = `local-v-${uid}`;
    const names = ["Lucas", "Marina", "Gabriel", "Sofia", "Pedro", "Clara", "Mateus", "Beatriz"];
    const baseName = names[worldData.villagers.length % names.length];
    placedName = `${baseName} (${srv.name || preset.name})`;
    const stopOffsets = [
      [0, 0],
      [9, 5],
      [-7, 8],
      [-6, -7],
      [7, -6],
    ];
    worldData.villagers = [
      ...worldData.villagers,
      {
        id: placedId,
        name: placedName,
        role: srv.villagerSpec.role,
        hatColor: srv.villagerSpec.hatColor,
        shirtColor: srv.villagerSpec.shirtColor,
        homeX: px,
        homeZ: pz,
        stops: stopOffsets.map(([dx, dz]) => [
          Number(clampCoord(px + dx).toFixed(2)),
          Number(clampCoord(pz + dz).toFixed(2)),
        ]),
        usesTransit: Boolean(srv.villagerSpec.usesTransit),
      },
    ];
  } else if (srv.blueprint) {
    placedKind = "creation";
    const bp = srv.blueprint;
    let finalX = px;
    let finalZ = pz;
    let behavior = {
      type: "landmark",
      facingYaw: 0,
      activity: "landmark",
      statusLine: bp.description || srv.description,
    };

    const findNearestPath = (kinds) => {
      let bestPath = null;
      let bestDist = Infinity;
      let bestPtIdx = 0;
      for (const p of worldData.paths) {
        if (!kinds.has(p.kind) || !Array.isArray(p.points) || p.points.length < 2) continue;
        for (let i = 0; i < p.points.length; i++) {
          const d = Math.hypot(p.points[i][0] - px, p.points[i][1] - pz);
          if (d < bestDist) {
            bestDist = d;
            bestPath = p;
            bestPtIdx = i;
          }
        }
      }
      return { path: bestPath, dist: bestDist, ptIdx: bestPtIdx };
    };

    if (srv.behaviorHint === "vehicle_route") {
      const asphaltHit = findNearestPath(new Set(["road"]));
      const anyRoadHit = findNearestPath(new Set(["road", "cobblestone", "cottage_road", "dirt_trail"]));
      const chosen =
        anyRoadHit.path && anyRoadHit.dist <= 14 && anyRoadHit.dist + 2 < asphaltHit.dist
          ? anyRoadHit
          : asphaltHit.path
            ? asphaltHit
            : anyRoadHit;
      if (chosen.path) {
        const isClosed = Boolean(chosen.path.closed) && chosen.path.points.length >= 4;
        const pts = chosen.path.points;
        const wps = isClosed
          ? pts.map((_, idx) => {
              const pt = pts[(idx + chosen.ptIdx) % pts.length];
              return [pt[0], pt[1]];
            })
          : chosen.ptIdx > pts.length / 2
            ? [...pts].reverse().map(([wx, wz]) => [wx, wz])
            : pts.map(([wx, wz]) => [wx, wz]);
        finalX = wps[0][0];
        finalZ = wps[0][1];
        behavior = {
          type: "vehicle_route",
          speed: srv.speed ?? 5.6,
          waypoints: wps,
          stops: [],
          loopMode: isClosed ? "loop" : "pingpong",
          statusLine: bp.description || srv.description,
        };
      } else {
        const loopR = 9;
        const wps = [
          [px, pz],
          [clampCoord(px + loopR), clampCoord(pz + loopR * 0.4)],
          [clampCoord(px + loopR * 0.4), clampCoord(pz + loopR)],
          [clampCoord(px - loopR * 0.5), clampCoord(pz + loopR * 0.5)],
        ];
        behavior = {
          type: "vehicle_route",
          speed: srv.speed ?? 5.2,
          waypoints: wps,
          stops: [],
          loopMode: "loop",
          statusLine: bp.description || srv.description,
        };
      }
    } else if (srv.behaviorHint === "water_float") {
      const riverHit = findNearestPath(new Set(["river", "creek"]));
      let nearestPond = null;
      let nearestPondDist = Infinity;
      for (const pr of worldData.props) {
        if (pr.kind !== "pond") continue;
        const d = Math.hypot(pr.x - px, pr.z - pz) - (pr.radius || 6.4);
        if (d < nearestPondDist) {
          nearestPondDist = d;
          nearestPond = pr;
        }
      }
      if (riverHit.path && riverHit.dist <= 22 && riverHit.dist <= nearestPondDist + 6) {
        const wps = riverHit.path.points.map(([wx, wz]) => [wx, wz]);
        finalX = wps[0][0];
        finalZ = wps[0][1];
        behavior = {
          type: "water_float",
          speed: srv.speed ?? 2.6,
          pondX: wps[0][0],
          pondZ: wps[0][1],
          radius: 3.5,
          waypoints: wps,
          statusLine: bp.description || srv.description,
        };
      } else if (nearestPond && nearestPondDist <= 18) {
        const orbitR = Math.max(1.8, (nearestPond.radius || 6.4) * 0.52);
        finalX = Number((nearestPond.x + orbitR).toFixed(2));
        finalZ = nearestPond.z;
        behavior = {
          type: "water_float",
          speed: srv.speed ?? 2.2,
          pondX: nearestPond.x,
          pondZ: nearestPond.z,
          radius: orbitR,
          statusLine: bp.description || srv.description,
        };
      } else {
        extraPropId = `local-pond-boat-${uid}`;
        worldData.props = [
          ...worldData.props,
          { id: extraPropId, kind: "pond", x: px, z: pz, yaw: 0, radius: 6.6 },
        ];
        const orbitR = 3.2;
        finalX = Number((px + orbitR).toFixed(2));
        finalZ = pz;
        behavior = {
          type: "water_float",
          speed: srv.speed ?? 2.2,
          pondX: px,
          pondZ: pz,
          radius: orbitR,
          statusLine: bp.description || srv.description,
        };
      }
    } else if (srv.behaviorHint === "fly_circle") {
      behavior = {
        type: "fly_circle",
        speed: srv.speed ?? 9.0,
        altitude: srv.altitude ?? 20,
        centerX: px,
        centerZ: pz,
        radius: 26,
        statusLine: bp.description || srv.description,
      };
      finalX = px + 26;
    } else if (srv.behaviorHint === "wander") {
      behavior = {
        type: "wander",
        style: srv.wanderStyle || "walk",
        speed: srv.speed ?? 1.8,
        homeX: px,
        homeZ: pz,
        radius: 10,
        targets: [
          [clampCoord(px + 6), clampCoord(pz + 4)],
          [clampCoord(px - 5), clampCoord(pz + 6)],
          [clampCoord(px - 6), clampCoord(pz - 5)],
          [clampCoord(px + 5), clampCoord(pz - 5)],
        ],
        statusLine: bp.description || srv.description,
      };
    }
    placedId = `local-cat-${uid}`;
    recentLocalCatalogIds.add(placedId);
    worldData.creations = [
      ...worldData.creations,
      {
        id: placedId,
        name: bp.name || srv.name,
        description: bp.description || srv.description,
        category: bp.category || "prop",
        scaleClass: bp.scaleClass || "medium",
        x: finalX,
        z: finalZ,
        yaw: 0,
        blueprint: bp,
        behavior,
        integratedLevel: 2,
        createdAt: now,
      },
    ];
  } else {
    return null;
  }

  placedPresetById.set(placedId, preset.id);
  if (extraPropId) {
    placedExtraPropById.set(placedId, extraPropId);
  }
  worldData.version = (worldData.version || 1) + 1;
  engine.applyWorldSnapshot(worldData);

  if (!options.silent) {
    const prevRoadStart = pendingRoadStart ? { ...pendingRoadStart } : null;
    catalogPlacedCount += 1;
    if (preset.isRoad) {
      pendingRoadStart = { x: anchorX, z: anchorZ };
    }
    if (!options.skipHistory) {
      pushActionHistory({
        action: "place",
        kind: placedKind,
        id: placedId,
        name: placedName,
        x: px,
        z: pz,
        presetId: preset.id,
        extraPropId,
        prevRoadStart,
      });
    }
    const verb = preset.isWater ? "criado" : preset.isRoad ? "adicionada" : "adicionado";
    showToast(`${placedName} ${verb}! Clique em outro ponto para adicionar mais.`, 2800);
  }
  return {
    kind: placedKind,
    id: placedId,
    name: placedName,
    x: anchorX,
    z: anchorZ,
    extraPropId,
  };
}

function removeWorldItemLocally(target) {
  if (!worldData || !target?.id) return false;
  let removed = false;
  if (target.kind === "creation") {
    const before = (worldData.creations || []).length;
    worldData.creations = (worldData.creations || []).filter((c) => c.id !== target.id);
    removed = worldData.creations.length < before;
    if (target.extraPropId) {
      worldData.props = (worldData.props || []).filter((p) => p.id !== target.extraPropId);
    }
  } else if (target.kind === "road") {
    const before = (worldData.paths || []).length;
    worldData.paths = (worldData.paths || []).filter((p) => p.id !== target.id);
    removed = worldData.paths.length < before;
  } else if (target.kind === "pond") {
    const before = (worldData.props || []).length;
    worldData.props = (worldData.props || []).filter((p) => p.id !== target.id);
    removed = worldData.props.length < before;
  } else if (target.kind === "villager") {
    const before = (worldData.villagers || []).length;
    worldData.villagers = (worldData.villagers || []).filter((v) => v.id !== target.id);
    removed = worldData.villagers.length < before;
  }
  if (!removed) return false;
  worldData.version = (worldData.version || 1) + 1;
  engine.applyWorldSnapshot(worldData);
  return true;
}

async function placeCatalogPresetAt(preset, x, z, x2, z2, options = {}) {
  if (!preset || catalogPlacingInFlight) return null;
  catalogPlacingInFlight = true;
  updateCatalogPickLabel();
  syncActionControlsUI();
  const prevRoadStart = pendingRoadStart ? { ...pendingRoadStart } : null;
  try {
    const res = await fetch("/api/catalog-place", {
      method: "POST",
      headers: buildVisitorHeaders({
        "content-type": "application/json",
        "x-meadow-client": "1",
      }),
      body: JSON.stringify({
        presetId: preset.id,
        x,
        z,
        ...(typeof x2 === "number" && typeof z2 === "number" ? { x2, z2 } : {}),
      }),
    });
    const contentType = res.headers.get("content-type") || "";
    const isStaticHostFallback =
      res.status === 404 || res.status === 405 || !contentType.includes("application/json");

    if (isStaticHostFallback) {
      const localRes = placeCatalogPresetLocally(preset, x, z, x2, z2, options);
      if (!localRes && !options.silent) {
        showToast("Não foi possível adicionar agora — tente novamente.", 4000);
      }
      catalogPlacingInFlight = false;
      updateCatalogPickLabel();
      syncActionControlsUI();
      return localRes;
    }

    const data = await res.json();
    if (data?.visitorToken) storeVisitorToken(data.visitorToken);
    if (!res.ok || !data.ok) {
      if (!options.silent) {
        showToast(data?.error || "Não foi possível adicionar agora — tente novamente.", 4000);
      }
      catalogPlacingInFlight = false;
      updateCatalogPickLabel();
      syncActionControlsUI();
      return null;
    }

    const placedId =
      data.creation?.id || data.path?.id || data.villager?.id || data.prop?.id || "";
    const placedKind = data.kind || preset.kind || "creation";
    const extraPropId = data.extraPropId || null;

    if (placedId) {
      placedPresetById.set(placedId, preset.id);
      if (extraPropId) placedExtraPropById.set(placedId, extraPropId);
    }
    if (data.creation?.id) {
      recentLocalCatalogIds.add(data.creation.id);
      setTimeout(() => recentLocalCatalogIds.delete(data.creation.id), 15_000);
    }

    if (data.world) {
      worldData = {
        ...data.world,
        myCreationId: data.world.myCreationId || myCreationId,
      };
      engine.applyWorldSnapshot(worldData);
    }

    if (!options.silent) {
      catalogPlacedCount += 1;
      if (preset.isRoad && typeof data.x === "number" && typeof data.z === "number") {
        pendingRoadStart = { x: data.x, z: data.z };
      }
      if (!options.skipHistory && placedId) {
        pushActionHistory({
          action: "place",
          kind: placedKind,
          id: placedId,
          name: data.name || preset.name,
          x: typeof data.x === "number" ? data.x : x,
          z: typeof data.z === "number" ? data.z : z,
          presetId: preset.id,
          extraPropId,
          prevRoadStart,
        });
      }
      const verb = preset.isWater ? "criado" : preset.isRoad ? "adicionada" : "adicionado";
      showToast(`${data.name || preset.name} ${verb}! Clique em outro ponto para adicionar mais.`, 2800);
    }

    catalogPlacingInFlight = false;
    updateCatalogPickLabel();
    syncActionControlsUI();
    return {
      kind: placedKind,
      id: placedId,
      name: data.name || preset.name,
      x: typeof data.x === "number" ? data.x : x,
      z: typeof data.z === "number" ? data.z : z,
      extraPropId,
    };
  } catch {
    const localRes = placeCatalogPresetLocally(preset, x, z, x2, z2, options);
    if (!localRes && !options.silent) {
      showToast("Erro de conexão ao adicionar — tente novamente.", 4000);
    }
    catalogPlacingInFlight = false;
    updateCatalogPickLabel();
    syncActionControlsUI();
    return localRes;
  }
}

async function removeWorldItem(target, options = {}) {
  if (!target?.id || !target?.kind || catalogPlacingInFlight) return false;
  catalogPlacingInFlight = true;
  syncActionControlsUI();

  const knownPresetId = target.presetId || placedPresetById.get(target.id) || null;
  const knownExtraPropId = target.extraPropId || placedExtraPropById.get(target.id) || null;

  const finalizeSuccess = (removedName, rx, rz) => {
    if (selectedWorldItem?.id === target.id) {
      selectedWorldItem = null;
    }
    if (!options.skipHistory) {
      pushActionHistory({
        action: "delete",
        kind: target.kind,
        id: target.id,
        name: removedName || target.name || "Item",
        x: typeof rx === "number" ? rx : target.x || 0,
        z: typeof rz === "number" ? rz : target.z || 0,
        presetId: knownPresetId,
      });
    }
    if (!options.silent) {
      showToast(`${removedName || target.name || "Item"} excluído da ilha!`, 2600);
    }
    catalogPlacingInFlight = false;
    syncDockUI();
    syncActionControlsUI();
  };

  try {
    const isLocalOnly = target.id.startsWith("local-");
    if (isLocalOnly) {
      const okLocal = removeWorldItemLocally({ ...target, extraPropId: knownExtraPropId });
      if (okLocal) {
        finalizeSuccess(target.name, target.x, target.z);
        return true;
      }
      catalogPlacingInFlight = false;
      syncActionControlsUI();
      return false;
    }

    const res = await fetch("/api/catalog-remove", {
      method: "POST",
      headers: buildVisitorHeaders({
        "content-type": "application/json",
        "x-meadow-client": "1",
      }),
      body: JSON.stringify({
        kind: target.kind,
        id: target.id,
        ...(knownExtraPropId ? { extraPropId: knownExtraPropId } : {}),
      }),
    });
    const contentType = res.headers.get("content-type") || "";
    const isStaticHostFallback =
      res.status === 404 || res.status === 405 || !contentType.includes("application/json");

    if (isStaticHostFallback) {
      const okLocal = removeWorldItemLocally({ ...target, extraPropId: knownExtraPropId });
      if (okLocal) {
        finalizeSuccess(target.name, target.x, target.z);
        return true;
      }
      if (!options.silent) showToast("Não foi possível excluir este item.", 3000);
      catalogPlacingInFlight = false;
      syncActionControlsUI();
      return false;
    }

    const data = await res.json();
    if (data?.visitorToken) storeVisitorToken(data.visitorToken);
    if (!res.ok || !data.ok) {
      if (!options.silent) {
        showToast(data?.error || "Não foi possível excluir este item.", 3400);
      }
      catalogPlacingInFlight = false;
      syncActionControlsUI();
      return false;
    }

    if (data.world) {
      worldData = {
        ...data.world,
        myCreationId: data.world.myCreationId || myCreationId,
      };
      engine.applyWorldSnapshot(worldData);
    }
    finalizeSuccess(data.name, data.x, data.z);
    return true;
  } catch {
    const okLocal = removeWorldItemLocally({ ...target, extraPropId: knownExtraPropId });
    if (okLocal) {
      finalizeSuccess(target.name, target.x, target.z);
      return true;
    }
    if (!options.silent) {
      showToast("Erro ao excluir item — tente novamente.", 3400);
    }
    catalogPlacingInFlight = false;
    syncActionControlsUI();
    return false;
  }
}

async function replaceWorldItem(target, newPreset) {
  if (!target?.id || !newPreset?.id || catalogPlacingInFlight) return false;
  catalogPlacingInFlight = true;
  syncActionControlsUI();

  const oldPresetId = target.presetId || placedPresetById.get(target.id) || null;
  const oldExtraPropId = target.extraPropId || placedExtraPropById.get(target.id) || null;

  const finalizeSwap = (newKind, newId, newName, newX, newZ, newExtraPropId) => {
    if (newId) {
      placedPresetById.set(newId, newPreset.id);
      if (newExtraPropId) placedExtraPropById.set(newId, newExtraPropId);
    }
    selectedWorldItem = newId
      ? {
          kind: newKind,
          id: newId,
          name: newName,
          x: newX,
          z: newZ,
          presetId: newPreset.id,
          extraPropId: newExtraPropId || null,
        }
      : null;
    pushActionHistory({
      action: "swap",
      newKind,
      newId,
      newName,
      newExtraPropId: newExtraPropId || null,
      oldName: target.name,
      oldPresetId,
      x: target.x,
      z: target.z,
    });
    showToast(`${target.name} trocado por ${newName}!`, 3000);
    catalogPlacingInFlight = false;
    syncDockUI();
    syncActionControlsUI();
  };

  try {
    if (target.id.startsWith("local-")) {
      removeWorldItemLocally({ ...target, extraPropId: oldExtraPropId });
      const placed = placeCatalogPresetLocally(newPreset, target.x, target.z, null, null, {
        silent: true,
        skipHistory: true,
      });
      if (placed) {
        finalizeSwap(placed.kind, placed.id, placed.name, placed.x, placed.z, placed.extraPropId);
        return true;
      }
      catalogPlacingInFlight = false;
      syncActionControlsUI();
      return false;
    }

    const res = await fetch("/api/catalog-replace", {
      method: "POST",
      headers: buildVisitorHeaders({
        "content-type": "application/json",
        "x-meadow-client": "1",
      }),
      body: JSON.stringify({
        targetKind: target.kind,
        targetId: target.id,
        newPresetId: newPreset.id,
        ...(oldExtraPropId ? { extraPropId: oldExtraPropId } : {}),
      }),
    });
    const contentType = res.headers.get("content-type") || "";
    const isStaticHostFallback =
      res.status === 404 || res.status === 405 || !contentType.includes("application/json");

    if (isStaticHostFallback) {
      removeWorldItemLocally({ ...target, extraPropId: oldExtraPropId });
      const placed = placeCatalogPresetLocally(newPreset, target.x, target.z, null, null, {
        silent: true,
        skipHistory: true,
      });
      if (placed) {
        finalizeSwap(placed.kind, placed.id, placed.name, placed.x, placed.z, placed.extraPropId);
        return true;
      }
      showToast("Não foi possível trocar este item.", 3200);
      catalogPlacingInFlight = false;
      syncActionControlsUI();
      return false;
    }

    const data = await res.json();
    if (data?.visitorToken) storeVisitorToken(data.visitorToken);
    if (!res.ok || !data.ok) {
      showToast(data?.error || "Não foi possível trocar este item.", 3400);
      catalogPlacingInFlight = false;
      syncActionControlsUI();
      return false;
    }

    const newId = data.creation?.id || data.path?.id || data.villager?.id || data.prop?.id || "";
    if (data.creation?.id) {
      recentLocalCatalogIds.add(data.creation.id);
      setTimeout(() => recentLocalCatalogIds.delete(data.creation.id), 15_000);
    }
    if (data.world) {
      worldData = {
        ...data.world,
        myCreationId: data.world.myCreationId || myCreationId,
      };
      engine.applyWorldSnapshot(worldData);
    }
    finalizeSwap(
      data.kind || newPreset.kind || "creation",
      newId,
      data.name || newPreset.name,
      typeof data.x === "number" ? data.x : target.x,
      typeof data.z === "number" ? data.z : target.z,
      data.extraPropId || null,
    );
    return true;
  } catch {
    removeWorldItemLocally({ ...target, extraPropId: oldExtraPropId });
    const placed = placeCatalogPresetLocally(newPreset, target.x, target.z, null, null, {
      silent: true,
      skipHistory: true,
    });
    if (placed) {
      finalizeSwap(placed.kind, placed.id, placed.name, placed.x, placed.z, placed.extraPropId);
      return true;
    }
    showToast("Erro ao trocar item — tente novamente.", 3400);
    catalogPlacingInFlight = false;
    syncActionControlsUI();
    return false;
  }
}

async function undoLastAction() {
  if (catalogPlacingInFlight || actionHistory.length === 0) return;
  const entry = actionHistory.pop();
  syncActionControlsUI();

  if (entry.action === "place") {
    const ok = await removeWorldItem(
      {
        kind: entry.kind,
        id: entry.id,
        name: entry.name,
        x: entry.x,
        z: entry.z,
        extraPropId: entry.extraPropId,
      },
      { skipHistory: true, silent: true },
    );
    if (ok) {
      if (entry.kind === "road") {
        pendingRoadStart = entry.prevRoadStart || null;
      }
      catalogPlacedCount = Math.max(0, catalogPlacedCount - 1);
      updateCatalogPickLabel();
      showToast(`Desfeito: ${entry.name} removido.`, 2400);
    } else {
      showToast("Não foi possível retroceder esta ação.", 2800);
    }
    syncActionControlsUI();
    return;
  }

  if (entry.action === "delete") {
    if (!entry.presetId) {
      showToast("Este item antigo não pode ser restaurado automaticamente.", 3000);
      syncActionControlsUI();
      return;
    }
    const srv = catalogMenu?.getPresetData?.(entry.presetId);
    if (!srv) {
      syncActionControlsUI();
      return;
    }
    const restored = await placeCatalogPresetAt(
      {
        id: entry.presetId,
        name: srv.name || entry.name,
        kind: srv.kind,
        isRoad: srv.kind === "road",
        isWater: srv.kind === "pond" || srv.pathKind === "river" || srv.pathKind === "creek",
      },
      entry.x,
      entry.z,
      null,
      null,
      { skipHistory: true, silent: true },
    );
    if (restored) {
      showToast(`Restaurado: ${entry.name} de volta ao mapa.`, 2400);
    }
    syncActionControlsUI();
    return;
  }

  if (entry.action === "swap") {
    if (entry.newId) {
      await removeWorldItem(
        {
          kind: entry.newKind,
          id: entry.newId,
          name: entry.newName,
          x: entry.x,
          z: entry.z,
          extraPropId: entry.newExtraPropId,
        },
        { skipHistory: true, silent: true },
      );
    }
    if (entry.oldPresetId) {
      const srv = catalogMenu?.getPresetData?.(entry.oldPresetId);
      if (srv) {
        await placeCatalogPresetAt(
          {
            id: entry.oldPresetId,
            name: srv.name || entry.oldName,
            kind: srv.kind,
            isRoad: srv.kind === "road",
            isWater: srv.kind === "pond" || srv.pathKind === "river" || srv.pathKind === "creek",
          },
          entry.x,
          entry.z,
          null,
          null,
          { skipHistory: true, silent: true },
        );
      }
      showToast(`Troca desfeita: ${entry.oldName} restaurado.`, 2400);
    } else {
      showToast(`Troca desfeita: ${entry.newName} removido.`, 2400);
    }
    syncActionControlsUI();
  }
}

catalogMenu = createCatalogMenuController({
  dialogEl: catalogDialog,
  onSelectPreset(preset) {
    if (!preset) return;
    hoverCard.hidden = true;
    if (pendingSwapTarget) {
      const targetToSwap = pendingSwapTarget;
      pendingSwapTarget = null;
      void replaceWorldItem(targetToSwap, preset);
      return;
    }
    if (engine.isFirstPerson()) {
      engine.setDragMode("pan");
    }
    selectedWorldItem = null;
    pendingCatalogPreset = preset;
    pendingRoadStart = null;
    catalogPlacedCount = 0;
    catalogPlacingInFlight = false;
    engine.setPreviewPrompt(preset.previewHint || preset.name);
    uiState = "catalog_picking";
    syncDockUI();
  },
});

catalogDialog?.addEventListener("close", () => {
  lastCatalogDialogCloseMs = performance.now();
  pendingSwapTarget = null;
  menuBtn?.blur();
  queueMicrotask(() => menuBtn?.blur());
});

menuBtn?.addEventListener("click", () => {
  if (isOgCapture) return;
  menuBtn?.blur();
  hoverCard.hidden = true;
  pendingSwapTarget = null;
  resetWalkJoystick();
  engine?.releaseWalkPointerLock?.();
  catalogMenu?.open(pendingCatalogPreset?.categoryId, pendingCatalogPreset?.id);
});

undoBtn?.addEventListener("click", () => {
  if (isOgCapture) return;
  undoBtn?.blur();
  void undoLastAction();
});

catalogUndoBtn?.addEventListener("click", () => {
  void undoLastAction();
});

deleteUndoBtn?.addEventListener("click", () => {
  void undoLastAction();
});

deleteModeBtn?.addEventListener("click", () => {
  if (isOgCapture) return;
  deleteModeBtn?.blur();
  hoverCard.hidden = true;
  selectedWorldItem = null;
  pendingSwapTarget = null;
  if (uiState === "catalog_deleting") {
    uiState = myCreationId ? "placed" : "idle";
    syncDockUI();
    return;
  }
  if (engine.isFirstPerson()) {
    engine.setDragMode("pan");
  }
  pendingCatalogPreset = null;
  pendingRoadStart = null;
  uiState = "catalog_deleting";
  syncDockUI();
});

deleteCancelBtn?.addEventListener("click", () => {
  uiState = myCreationId ? "placed" : "idle";
  syncDockUI();
});

selectedSwapBtn?.addEventListener("click", () => {
  if (!selectedWorldItem) return;
  pendingSwapTarget = { ...selectedWorldItem };
  const prevPresetId = selectedWorldItem.presetId || placedPresetById.get(selectedWorldItem.id) || null;
  catalogMenu?.open(undefined, prevPresetId || undefined, {
    swapLabel: selectedWorldItem.name,
  });
});

selectedDeleteBtn?.addEventListener("click", () => {
  if (!selectedWorldItem) return;
  const toDelete = { ...selectedWorldItem };
  void removeWorldItem(toDelete);
});

selectedCloseBtn?.addEventListener("click", () => {
  selectedWorldItem = null;
  syncDockUI();
});

catalogSwitchBtn?.addEventListener("click", () => {
  pendingSwapTarget = null;
  catalogMenu?.open(pendingCatalogPreset?.categoryId, pendingCatalogPreset?.id);
});

catalogCancelBtn?.addEventListener("click", () => {
  pendingCatalogPreset = null;
  pendingRoadStart = null;
  catalogPlacedCount = 0;
  catalogPlacingInFlight = false;
  uiState = myCreationId ? "placed" : "idle";
  syncDockUI();
});

walkEscHintBtn?.addEventListener("click", () => {
  hoverCard.hidden = true;
  engine?.setDragMode("pan");
  walkEscHintBtn.blur();
});

window.__geminIslandCharacterBuilder = characterBuilder;
window.__geminIslandCatalogMenu = catalogMenu;

camPanBtn?.addEventListener("click", () => {
  engine.setDragMode("pan");
});

camOrbitBtn?.addEventListener("click", () => {
  engine.setDragMode("orbit");
});

camWalkBtn?.addEventListener("click", () => {
  hoverCard.hidden = true;
  if (engine.isFirstPerson()) {
    engine.setDragMode("pan");
    return;
  }
  if (
    uiState === "picking" ||
    uiState === "catalog_picking" ||
    uiState === "catalog_deleting" ||
    uiState === "composing" ||
    selectedWorldItem
  ) {
    hideError();
    chosenSpot = null;
    pendingCatalogPreset = null;
    pendingRoadStart = null;
    pendingSwapTarget = null;
    selectedWorldItem = null;
    catalogPlacedCount = 0;
    uiState = myCreationId ? "placed" : "idle";
    syncDockUI();
  }
  engine.setDragMode("walk");
  camWalkBtn.blur();
});

recenterBtn?.addEventListener("click", () => {
  engine.recenterCamera();
  engine.setDragMode("pan");
});

window.addEventListener(
  "pointerdown",
  (e) => {
    if (e.pointerType === "touch" && !sawTouchInput) {
      sawTouchInput = true;
      syncWalkJoystickVisibility();
    }
  },
  { passive: true },
);

window.addEventListener("resize", () => {
  syncWalkJoystickVisibility();
  if (walkEscHintBtn) {
    walkEscHintBtn.hidden = isOgCapture || currentCamMode !== "walk" || isMobileWalkViewport();
  }
});

window.addEventListener("blur", () => {
  if (joyPointerId !== null) resetWalkJoystick();
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible" && joyPointerId !== null) {
    resetWalkJoystick();
  }
});

function updateWalkJoystickFromPoint(clientX, clientY) {
  if (!walkJoystick) return;
  const rect = walkJoystick.getBoundingClientRect();
  const cx = rect.left + rect.width * 0.5;
  const cy = rect.top + rect.height * 0.5;
  const maxPx = Math.max(24, rect.width * 0.31);
  const dx = clientX - cx;
  const dy = clientY - cy;
  const dist = Math.hypot(dx, dy);
  const clampedPx = Math.min(maxPx, dist);
  const ux = dist > 1e-4 ? dx / dist : 0;
  const uy = dist > 1e-4 ? dy / dist : 0;

  const maxSvg = 34;
  const svgX = ux * (clampedPx / maxPx) * maxSvg;
  const svgY = uy * (clampedPx / maxPx) * maxSvg;
  walkJoystickKnob?.setAttribute("transform", `translate(${svgX.toFixed(1)} ${svgY.toFixed(1)})`);

  const rawMag = clampedPx / maxPx;
  const deadzone = 0.08;
  const eff = rawMag <= deadzone ? 0 : (rawMag - deadzone) / (1 - deadzone);
  const moveRight = ux * eff;
  const moveFwd = -uy * eff;

  walkJoyUp?.classList.toggle("is-lit", moveFwd > 0.28);
  walkJoyDown?.classList.toggle("is-lit", moveFwd < -0.28);
  walkJoyLeft?.classList.toggle("is-lit", moveRight < -0.28);
  walkJoyRight?.classList.toggle("is-lit", moveRight > 0.28);

  engine?.setJoystickInput(moveRight, moveFwd);
}

if (walkJoystick) {
  walkJoystick.addEventListener("contextmenu", (e) => e.preventDefault());

  walkJoystick.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (joyPointerId !== null) return;
    joyPointerId = e.pointerId;
    walkJoystick.classList.add("is-active");
    hoverCard.hidden = true;
    try {
      walkJoystick.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic pointer events in tests may omit active capture handles
    }
    updateWalkJoystickFromPoint(e.clientX, e.clientY);
  });

  walkJoystick.addEventListener("pointermove", (e) => {
    if (joyPointerId !== e.pointerId) return;
    e.stopPropagation();
    e.preventDefault();
    updateWalkJoystickFromPoint(e.clientX, e.clientY);
  });

  const endJoystickGesture = (e) => {
    if (joyPointerId !== e.pointerId) return;
    e.stopPropagation();
    resetWalkJoystick();
  };

  walkJoystick.addEventListener("pointerup", endJoystickGesture);
  walkJoystick.addEventListener("pointercancel", endJoystickGesture);
  walkJoystick.addEventListener("lostpointercapture", endJoystickGesture);
}

function syncDockUI() {
  if (isOgCapture) return;

  addBtn.hidden = true;
  pickSpotPill.hidden = true;
  if (catalogPickPill) catalogPickPill.hidden = true;
  if (deleteModePill) deleteModePill.hidden = true;
  if (selectedItemPill) selectedItemPill.hidden = true;
  bottomBuilder.hidden = true;
  buildingPill.hidden = true;
  readyGotoBtn.hidden = true;
  locateMineBtn.hidden = true;

  if (
    myCreationId &&
    uiState !== "ready" &&
    uiState !== "catalog_picking" &&
    uiState !== "catalog_deleting"
  ) {
    uiState = "placed";
  }

  switch (uiState) {
    case "picking":
      pickSpotPill.hidden = false;
      engine.setSpotPickerState({
        mode: "picking",
        ...(chosenSpot ? { x: chosenSpot.x, z: chosenSpot.z } : {}),
      });
      break;
    case "catalog_picking":
      if (catalogPickPill) catalogPickPill.hidden = false;
      updateCatalogPickLabel();
      engine.setSpotPickerState({ mode: "picking" });
      break;
    case "catalog_deleting":
      if (deleteModePill) deleteModePill.hidden = false;
      engine.setSpotPickerState({ mode: "deleting" });
      break;
    case "composing":
      bottomBuilder.hidden = false;
      engine.setPreviewPrompt(promptInput.value);
      engine.setSpotPickerState({
        mode: "staked",
        x: chosenSpot?.x ?? 16,
        z: chosenSpot?.z ?? 10,
      });
      break;
    case "building":
      buildingPill.hidden = false;
      renderActiveJobLabel();
      engine.setSpotPickerState({
        mode: "building",
        x: chosenSpot?.x ?? 16,
        z: chosenSpot?.z ?? 10,
      });
      break;
    case "ready": {
      readyGotoBtn.hidden = false;
      const name = readyCreation?.name || "your creation";
      readyGotoLabel.textContent = `Ready · Go to ${name}`;
      engine.setSpotPickerState({ mode: "hidden" });
      break;
    }
    case "placed": {
      if (selectedWorldItem && selectedItemPill && selectedItemLabel) {
        selectedItemLabel.textContent = selectedWorldItem.name;
        selectedItemPill.hidden = false;
      } else {
        locateMineBtn.hidden = false;
        const mine = worldData?.creations?.find((c) => c.id === myCreationId);
        locateMineLabel.textContent = mine ? `Locate · ${mine.name}` : "Locate yours";
      }
      engine.setSpotPickerState({ mode: "hidden" });
      break;
    }
    default:
      if (selectedWorldItem && selectedItemPill && selectedItemLabel) {
        selectedItemLabel.textContent = selectedWorldItem.name;
        selectedItemPill.hidden = false;
      } else {
        addBtn.hidden = false;
      }
      engine.setSpotPickerState({ mode: "hidden" });
      break;
  }
  syncActionControlsUI();
}

async function pollActiveJob() {
  if (!activeJob || jobPollInFlight) return;
  jobPollInFlight = true;
  try {
    const res = await fetch(`/api/job?id=${encodeURIComponent(activeJob.jobId)}`, {
      headers: buildVisitorHeaders(),
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data?.visitorToken) storeVisitorToken(data.visitorToken);
    if (!data.ok || !data.job) return;

    const job = data.job;
    if (job.status === "done") {
      stopJobTracking();
      sculptBtn.disabled = false;
      if (data.world) {
        worldData = data.world;
        engine.applyWorldSnapshot(worldData);
      }
      if (data.feeds) {
        engine.applyLiveFeeds(data.feeds);
      }
      myCreationId = job.creationId || data.world?.myCreationId || myCreationId;
      readyCreation =
        job.creation || worldData?.creations?.find((c) => c.id === myCreationId) || null;
      uiState = "ready";
      syncDockUI();
      return;
    }

    if (job.status === "failed") {
      stopJobTracking();
      sculptBtn.disabled = false;
      if (job.creationId) {
        myCreationId = job.creationId;
        uiState = "placed";
        syncDockUI();
        return;
      }
      uiState = "composing";
      syncDockUI();
      showFormError(job.error || "Could not build that right now — try again.");
      return;
    }

    activeJob = { ...job };
    renderActiveJobLabel();
  } catch {
    // ignore transient poll hiccups; next tick or WS broadcast will recover
  } finally {
    jobPollInFlight = false;
  }
}

function startTrackingJob(jobInfo) {
  stopJobTracking();
  activeJob = { ...jobInfo };
  uiState = "building";
  syncDockUI();

  jobPollInterval = setInterval(() => {
    if (uiState === "building" && activeJob) {
      pollActiveJob();
    }
  }, 2500);
}

// Dynamically resize the 3D staked plot on the island as the visitor describes tiny vs colossal subjects!
promptInput.addEventListener("input", () => {
  engine.setPreviewPrompt(promptInput.value);
});

// 1. Click "+ Add" -> pick where on the island it will go
addBtn.addEventListener("click", () => {
  if (engine.isFirstPerson()) {
    engine.setDragMode("pan");
  }
  if (myCreationId) {
    uiState = "placed";
    syncDockUI();
    return;
  }
  hoverCard.hidden = true;
  engine.setPreviewPrompt(promptInput.value);
  uiState = "picking";
  syncDockUI();
});

cancelPickBtn.addEventListener("click", () => {
  chosenSpot = null;
  uiState = "idle";
  syncDockUI();
});

moveSpotBtn.addEventListener("click", () => {
  uiState = "picking";
  syncDockUI();
});

closeBuilderBtn.addEventListener("click", () => {
  hideError();
  chosenSpot = null;
  uiState = "idle";
  syncDockUI();
});

window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
    const tag = e.target instanceof HTMLElement ? e.target.tagName : "";
    if (tag !== "INPUT" && tag !== "TEXTAREA" && !catalogDialog?.open && !avatarDialog?.open) {
      if (actionHistory.length > 0) {
        e.preventDefault();
        void undoLastAction();
      }
      return;
    }
  }
  if (e.key === "Escape") {
    if (
      characterBuilder?.isOpen?.() ||
      catalogMenu?.isOpen?.() ||
      (avatarDialog &&
        (avatarDialog.open || (e.target instanceof Node && avatarDialog.contains(e.target)))) ||
      (catalogDialog &&
        (catalogDialog.open || (e.target instanceof Node && catalogDialog.contains(e.target)))) ||
      performance.now() - lastAvatarDialogCloseMs < 80 ||
      performance.now() - lastCatalogDialogCloseMs < 80
    ) {
      return;
    }
    if (
      uiState === "picking" ||
      uiState === "catalog_picking" ||
      uiState === "catalog_deleting" ||
      uiState === "composing" ||
      selectedWorldItem
    ) {
      e.preventDefault();
      hideError();
      chosenSpot = null;
      pendingCatalogPreset = null;
      pendingRoadStart = null;
      pendingSwapTarget = null;
      selectedWorldItem = null;
      catalogPlacedCount = 0;
      catalogPlacingInFlight = false;
      uiState = myCreationId ? "placed" : "idle";
      syncDockUI();
    } else if (engine.isFirstPerson()) {
      e.preventDefault();
      hoverCard.hidden = true;
      engine.setDragMode("pan");
    }
  }
});

worldCanvas.addEventListener("pointerleave", () => {
  hoverCard.hidden = true;
});

readyGotoBtn.addEventListener("click", () => {
  if (!myCreationId) return;
  hoverCard.hidden = true;
  uiState = "placed";
  syncDockUI();
  engine.focusCreationById(myCreationId);
  const mine = worldData?.creations?.find((c) => c.id === myCreationId) || readyCreation;
  if (mine) {
    const desc = mine.description || mine.behavior?.statusLine || "";
    showToast(desc ? `${mine.name} — ${desc}` : mine.name, 4600);
  }
});

locateMineBtn.addEventListener("click", () => {
  if (!myCreationId) return;
  hoverCard.hidden = true;
  engine.focusCreationById(myCreationId);
  const mine = worldData?.creations?.find((c) => c.id === myCreationId);
  if (mine) {
    const desc = mine.description || mine.behavior?.statusLine || "";
    showToast(desc ? `${mine.name} — ${desc}` : mine.name);
  }
});

async function resizeImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Unsupported image format"));
      img.onload = () => {
        const maxSide = 960;
        let { width, height } = img;
        if (width > maxSide || height > maxSide) {
          if (width >= height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }
        const c = document.createElement("canvas");
        c.width = Math.max(1, width);
        c.height = Math.max(1, height);
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.86));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function showFormError(msg) {
  formError.textContent = msg;
  formError.hidden = false;
}

function hideError() {
  formError.hidden = true;
}

async function handleSelectedFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    showFormError("Choose a PNG, JPG, or WebP image.");
    return;
  }
  hideError();
  try {
    selectedImageDataUrl = await resizeImageFile(file);
    dropPreviewImg.src = selectedImageDataUrl;
    dropEmpty.hidden = true;
    dropPreviewWrap.hidden = false;
  } catch (err) {
    showFormError(err.message || "Could not process that image.");
  }
}

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (file) handleSelectedFile(file);
});

clearImageBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  selectedImageDataUrl = null;
  imageInput.value = "";
  dropPreviewImg.removeAttribute("src");
  dropPreviewWrap.hidden = true;
  dropEmpty.hidden = false;
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer?.files?.[0];
  if (file) handleSelectedFile(file);
});

window.addEventListener("paste", (e) => {
  if (uiState !== "composing") return;
  const items = e.clipboardData?.items || [];
  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const f = item.getAsFile();
      if (f) handleSelectedFile(f);
      break;
    }
  }
});

// Enqueue build into the multi-user workshop queue -> close builder immediately so visitor can explore while watching live build stages!
sculptBtn.addEventListener("click", async () => {
  if (uiState === "building") return;
  hideError();
  const prompt = promptInput.value.trim();
  if (!prompt && !selectedImageDataUrl) {
    showFormError("Add a photo or short description first.");
    return;
  }

  engine.setPreviewPrompt(prompt);
  const spotX = chosenSpot?.x ?? null;
  const spotZ = chosenSpot?.z ?? null;

  uiState = "building";
  sculptBtn.disabled = true;
  buildingPillLabel.textContent = "Approving query…";
  if (buildingPillSub) {
    buildingPillSub.textContent = "Being built with Gemini 4 Hydrogen";
  }
  syncDockUI();

  try {
    const res = await fetch("/api/build", {
      method: "POST",
      headers: buildVisitorHeaders({
        "content-type": "application/json",
        "x-meadow-client": "1",
      }),
      body: JSON.stringify({
        prompt,
        imageDataUrl: selectedImageDataUrl || undefined,
        x: spotX,
        z: spotZ,
      }),
    });
    const data = await res.json();
    if (data?.visitorToken) storeVisitorToken(data.visitorToken);

    if (!res.ok || !data.ok) {
      sculptBtn.disabled = false;
      if (data.alreadyPlaced && data.myCreationId) {
        myCreationId = data.myCreationId;
        uiState = "placed";
        syncDockUI();
        return;
      }
      uiState = "composing";
      syncDockUI();
      showFormError(data.error || "Could not build that right now — try again.");
      return;
    }

    if (data.job) {
      startTrackingJob(data.job);
      return;
    }

    // Direct synchronous fallback if ever returned
    sculptBtn.disabled = false;
    worldData = data.world;
    myCreationId = data.creation.id;
    readyCreation = data.creation;
    if (data.feeds) engine.applyLiveFeeds(data.feeds);
    engine.applyWorldSnapshot(worldData);
    uiState = "ready";
    syncDockUI();
  } catch {
    sculptBtn.disabled = false;
    uiState = "composing";
    syncDockUI();
    showFormError("Network hiccup while building — try again.");
  }
});

promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sculptBtn.click();
  }
});

async function refreshLiveFeeds() {
  try {
    const res = await fetch("/api/feeds");
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.includes("application/json")) return;
    const data = await res.json();
    if (data.ok && data.feeds) {
      engine.applyLiveFeeds(data.feeds);
    }
  } catch {
    // ignore transient feed errors
  }
}

async function refreshDailyEligibility() {
  if (isOgCapture || uiState === "building" || uiState === "ready") return;
  try {
    const res = await fetch("/api/world", {
      headers: buildVisitorHeaders(),
    });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.includes("application/json")) return;
    const latest = await res.json();
    if (latest?.visitorToken) storeVisitorToken(latest.visitorToken);
    worldData = latest;
    myCreationId = latest.myCreationId || null;
    engine.applyWorldSnapshot(worldData);
    if (latest.myActiveJob && !myCreationId) {
      startTrackingJob(latest.myActiveJob);
    } else if (!myCreationId && uiState === "placed") {
      uiState = "idle";
      syncDockUI();
    }
  } catch {
    // ignore transient network errors
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    if (uiState === "building" && activeJob) {
      pollActiveJob();
    } else {
      refreshDailyEligibility();
    }
  }
});

function handleWorldMessage(msg) {
  if (!msg || typeof msg !== "object") return;
  if (msg.type === "queue_tick" && activeJob && uiState === "building") {
    const qIdx = Array.isArray(msg.queuedIds) ? msg.queuedIds.indexOf(activeJob.jobId) : -1;
    const activeEntry = Array.isArray(msg.sculpting)
      ? msg.sculpting.find((s) => s.jobId === activeJob.jobId)
      : null;
    if (qIdx >= 0) {
      activeJob.status = "queued";
      activeJob.phase = "queued";
      activeJob.position = qIdx + 1;
      renderActiveJobLabel();
    } else if (activeEntry) {
      activeJob.status = "sculpting";
      if (activeEntry.phase) {
        activeJob.phase = activeEntry.phase;
      } else if (activeJob.phase === "queued") {
        activeJob.phase = "sculpting";
      }
      activeJob.position = 0;
      renderActiveJobLabel();
    }
    pollActiveJob();
    return;
  }

  if ((msg.type === "creation_placed" || msg.type === "world_updated") && msg.world) {
    worldData = {
      ...msg.world,
      myCreationId,
    };
    engine.applyWorldSnapshot(worldData);
    if (uiState === "building" && activeJob) {
      pollActiveJob();
    } else if (uiState === "placed" || uiState === "ready") {
      syncDockUI();
    }
    refreshLiveFeeds();

    if (
      msg.type === "creation_placed" &&
      msg.creation &&
      msg.creation.id !== myCreationId &&
      !recentLocalCatalogIds.has(msg.creation.id) &&
      uiState !== "building"
    ) {
      showToast(`Someone added "${msg.creation.name}" to GeminIsland!`, 4200);
    }
  }
}

if (!isOgCapture) {
  mpClient = createMultiplayerClient({
    multiplayerEnabled: !isOgCapture,
    getLocalPose: () => engine?.getLocalMultiplayerPose?.(),
    getLocalProfile: () => engine?.getLocalAppearance?.(),
    getExtraHeaders: () => buildVisitorHeaders(),
    onWorldMessage: handleWorldMessage,
    onWelcome(msg) {
      engine?.syncMultiplayerWelcome?.(msg?.players || []);
      if (typeof msg?.onlineCount === "number") {
        updateOnlinePill(msg.onlineCount);
      }
    },
    onPeerJoin(player, msg) {
      engine?.upsertRemotePlayer?.(player);
      if (typeof msg?.onlineCount === "number") {
        updateOnlinePill(msg.onlineCount);
      }
    },
    onPeerPose(poseMsg) {
      engine?.updateRemotePlayerPose?.(poseMsg);
    },
    onPeerProfile(profileMsg) {
      engine?.updateRemotePlayerProfile?.(profileMsg);
    },
    onPeerEmote(emoteMsg) {
      engine?.triggerRemotePlayerEmote?.(emoteMsg);
    },
    onPeerLeave(id, msg) {
      engine?.removeRemotePlayer?.(id);
      if (typeof msg?.onlineCount === "number") {
        updateOnlinePill(msg.onlineCount);
      }
    },
    onOnlineCountChange(count) {
      updateOnlinePill(count);
    },
  });
}

window.__geminIslandMp = mpClient;

async function initWorld() {
  try {
    const res = await fetch("/api/world", {
      headers: buildVisitorHeaders(),
    });
    const ct = res.headers.get("content-type") || "";
    if (res.ok && ct.includes("application/json")) {
      worldData = await res.json();
      if (worldData?.visitorToken) storeVisitorToken(worldData.visitorToken);
      myCreationId = worldData.myCreationId || myCreationId || null;
      engine.applyWorldSnapshot(worldData);
      if (!isOgCapture) {
        if (myCreationId) {
          uiState = "placed";
          syncDockUI();
        } else if (worldData.myActiveJob) {
          startTrackingJob(worldData.myActiveJob);
        } else {
          uiState = "idle";
          syncDockUI();
        }
      }
    } else if (!isOgCapture) {
      uiState = "idle";
      syncDockUI();
    }
  } catch (err) {
    console.error("Failed to fetch initial world:", err);
  }

  refreshLiveFeeds();
  if (!isOgCapture) {
    catalogMenu?.preload?.();
    setInterval(refreshLiveFeeds, 90_000);
    setInterval(refreshDailyEligibility, 10 * 60_000);
  }
}

initWorld();
