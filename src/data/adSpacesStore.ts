// ─── Ad Spaces Store ─────────────────────────────────────────────────
// Manages ad codes per slot, persisted to localStorage.
// Admin can paste raw HTML/JS (e.g. AdSense, banner tags) per slot.

const AD_SPACES_KEY = "lankalust_ad_spaces";

export interface AdSpaceSlot {
  key: string;
  label: string;
  area: string;
  type: "single" | "rotating";
  size: string; // e.g. "320×50"
  codes: string[]; // 1 for single, up to 4 for rotating
  enabled: boolean;
}

// ─── Default slots definition ─────────────────────────────────────
export const defaultSlots: AdSpaceSlot[] = [
  // Global
  { key: "top-leaderboard",   label: "Top Leaderboard",        area: "Global",  type: "single",   size: "320×50",  codes: [""], enabled: false },
  { key: "bottom-mobile",     label: "Bottom Mobile Banner",   area: "Global",  type: "single",   size: "320×100", codes: [""], enabled: false },
  { key: "sliding-bottom",    label: "Sliding Bottom Strip",   area: "Global",  type: "single",   size: "320×50",  codes: [""], enabled: false },
  // Ads section
  { key: "detail-below-image", label: "Detail Page Below Image", area: "Ads",    type: "single",   size: "320×100", codes: [""], enabled: false },
  { key: "ad-detail-bottom",  label: "Ad Detail Bottom",       area: "Ads",     type: "single",   size: "300×250", codes: [""], enabled: false },
  { key: "home-in-content",   label: "Home Feed (every 4 rows)",area: "Ads",    type: "rotating",  size: "320×200", codes: ["", "", "", ""], enabled: false },
  { key: "category-in-content", label: "Category Feed (every 4 rows)", area: "Ads", type: "rotating", size: "320×200", codes: ["", "", "", ""], enabled: false },
  // Profile
  { key: "profile-bottom",    label: "Profile Page Bottom",    area: "Profile", type: "single",   size: "300×250", codes: [""], enabled: false },
  // Dating
  { key: "dating-in-content", label: "Dating Feed (every 4 rows)",  area: "Dating", type: "rotating", size: "320×50",  codes: ["", "", "", ""], enabled: false },
  { key: "dating-profile-bottom", label: "Dating Profile Bottom", area: "Dating", type: "single",  size: "320×250", codes: [""], enabled: false },
  // WalKatha
  { key: "walkatha-in-content", label: "Stories Feed (every 4 rows)", area: "WalKatha", type: "rotating", size: "320×100", codes: ["", "", "", ""], enabled: false },
  { key: "walkatha-story-content-1", label: "Story Body 25%",   area: "WalKatha", type: "single", size: "320×90",  codes: [""], enabled: false },
  { key: "walkatha-story-content-2", label: "Story Body 50%",   area: "WalKatha", type: "single", size: "320×90",  codes: [""], enabled: false },
  { key: "walkatha-story-content-3", label: "Story Body 75%",   area: "WalKatha", type: "single", size: "320×90",  codes: [""], enabled: false },
  { key: "walkatha-story-content-4", label: "Story Body End",   area: "WalKatha", type: "single", size: "320×90",  codes: [""], enabled: false },
  // Chat
  { key: "chatbox-horizontal", label: "Chat User List (every 10)", area: "Chat", type: "rotating", size: "320×50",  codes: ["", "", "", ""], enabled: false },
];

// ─── CRUD ─────────────────────────────────────────────────────────
export function getAdSpaces(): AdSpaceSlot[] {
  try {
    const stored = localStorage.getItem(AD_SPACES_KEY);
    if (!stored) {
      localStorage.setItem(AD_SPACES_KEY, JSON.stringify(defaultSlots));
      return [...defaultSlots];
    }
    const parsed: AdSpaceSlot[] = JSON.parse(stored);
    // Ensure all default keys exist (in case new slots were added)
    const keys = new Set(parsed.map((s) => s.key));
    for (const def of defaultSlots) {
      if (!keys.has(def.key)) parsed.push({ ...def });
    }
    // Migrate: ensure rotating slots have 4 code slots & all slots have a size
    let migrated = false;
    for (const slot of parsed) {
      if (slot.type === "rotating" && slot.codes.length < 4) {
        while (slot.codes.length < 4) slot.codes.push("");
        migrated = true;
      }
      if (!slot.size) {
        const def = defaultSlots.find((d) => d.key === slot.key);
        slot.size = def?.size || "320×50";
        migrated = true;
      }
    }
    if (migrated) saveAdSpaces(parsed);
    return parsed;
  } catch {
    return [...defaultSlots];
  }
}

export const AD_SPACES_CHANGED = "lankalust_ad_spaces_changed";

export function saveAdSpaces(slots: AdSpaceSlot[]) {
  localStorage.setItem(AD_SPACES_KEY, JSON.stringify(slots));
  // Notify all ad components to re-read
  window.dispatchEvent(new Event(AD_SPACES_CHANGED));
}

export function getSlot(key: string): AdSpaceSlot | undefined {
  return getAdSpaces().find((s) => s.key === key);
}

export function updateSlot(key: string, updates: Partial<Omit<AdSpaceSlot, "key">>): boolean {
  const slots = getAdSpaces();
  const idx = slots.findIndex((s) => s.key === key);
  if (idx === -1) return false;
  slots[idx] = { ...slots[idx], ...updates };
  saveAdSpaces(slots);
  return true;
}

/** For rotating ads: pick code by index (cycles through available codes) */
export function getRotatingCode(key: string, index: number): string {
  const slot = getSlot(key);
  if (!slot || !slot.enabled) return "";
  const activeCodes = slot.codes.filter((c) => c.trim());
  if (activeCodes.length === 0) return "";
  return activeCodes[index % activeCodes.length];
}

/** For single ads: get the first code */
export function getSingleCode(key: string): string {
  const slot = getSlot(key);
  if (!slot || !slot.enabled) return "";
  return slot.codes[0]?.trim() || "";
}

// ─── Sample ad HTML generators ────────────────────────────────────
/** Parse "320×250" → { w: 320, h: 250 } */
function parseSize(size: string): { w: number; h: number } {
  const parts = size.split(/[×x]/i);
  return { w: parseInt(parts[0]) || 320, h: parseInt(parts[1]) || 50 };
}

function sampleBanner(slotKey: string, label: string, w: number, h: number): string {
  const fs = h <= 50 ? 10 : h <= 100 ? 11 : 12;
  const iconFs = h <= 50 ? 11 : 13;
  const gap = h <= 50 ? 4 : 8;
  const dir = h >= 200 ? "flex-direction:column;" : "";
  return `<div style="width:${w}px;max-width:100%;height:${h}px;background:#1a1a2e;border:2px dashed #6d28d9;border-radius:8px;display:flex;align-items:center;justify-content:center;gap:${gap}px;padding:4px 12px;box-sizing:border-box;margin:0 auto;${dir}"><span style="color:#a78bfa;font-weight:700;font-size:${iconFs}px">📢 AD</span><span style="color:#d4d4d8;font-size:${fs}px;text-align:center">${label}</span><span style="color:#6d28d9;font-size:9px;opacity:.6">${w}×${h} [${slotKey}]</span></div>`;
}

function sampleRotating(slotKey: string, label: string, n: number, w: number, h: number): string {
  const colors = ["#6d28d9", "#2563eb", "#059669", "#d97706"];
  const c = colors[(n - 1) % 4];
  const fs = h <= 50 ? 10 : h <= 100 ? 11 : 12;
  const numFs = h <= 50 ? 12 : 14;
  const gap = h <= 50 ? 4 : 8;
  const dir = h >= 200 ? "flex-direction:column;" : "";
  return `<div style="width:${w}px;max-width:100%;height:${h}px;background:linear-gradient(135deg,${c}22,${c}08);border:2px dashed ${c};border-radius:8px;display:flex;align-items:center;justify-content:center;gap:${gap}px;padding:4px 12px;box-sizing:border-box;margin:0 auto;${dir}"><span style="color:${c};font-weight:800;font-size:${numFs}px">AD ${n}</span><span style="color:#d4d4d8;font-size:${fs}px;text-align:center">${label}</span><span style="color:${c};font-size:9px;opacity:.5">${w}×${h} [${slotKey}]</span></div>`;
}

/** Fill all slots with visible sample/placeholder ad codes and enable them */
export function loadSampleAds(): void {
  const slots = getAdSpaces();
  for (const slot of slots) {
    slot.enabled = true;
    const { w, h } = parseSize(slot.size);
    if (slot.type === "single") {
      slot.codes = [sampleBanner(slot.key, slot.label, w, h)];
    } else {
      slot.codes = [
        sampleRotating(slot.key, slot.label, 1, w, h),
        sampleRotating(slot.key, slot.label, 2, w, h),
        sampleRotating(slot.key, slot.label, 3, w, h),
        sampleRotating(slot.key, slot.label, 4, w, h),
      ];
    }
  }
  saveAdSpaces(slots);
}

/** Clear all ad codes (set to empty) and disable all slots */
export function clearAllAds(): void {
  const slots = getAdSpaces();
  for (const slot of slots) {
    slot.enabled = false;
    slot.codes = slot.type === "rotating" ? ["", "", "", ""] : [""];
  }
  saveAdSpaces(slots);
}
