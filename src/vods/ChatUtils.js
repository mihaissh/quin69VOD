// Utility functions for Chat component
// Moved to utils for reuse across components

export const CHAT_BASE_BG = "#131314";

export function hexToRgb(hex) {
  if (!hex) return null;
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized.length === 3 ? normalized.split("").map(c => c + c).join("") : normalized, 16);
  if (Number.isNaN(bigint)) return null;
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

export function relativeLuminance({ r, g, b }) {
  const srgb = [r, g, b].map(v => v / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function contrastRatio(hexA, hexB) {
  const rgbA = hexToRgb(hexA);
  const rgbB = hexToRgb(hexB);
  if (!rgbA || !rgbB) return 21; // default high contrast
  const L1 = relativeLuminance(rgbA) + 0.05;
  const L2 = relativeLuminance(rgbB) + 0.05;
  return L1 > L2 ? L1 / L2 : L2 / L1;
}

export function ensureAccessibleTextColor(userHex) {
  if (!userHex || typeof userHex !== "string" || !userHex.startsWith("#")) return "#e5e7eb"; // zinc-200
  try {
    const ratio = contrastRatio(userHex, CHAT_BASE_BG);
    if (ratio < 4.5) return "#e5e7eb"; // fallback to light gray for readability
    return userHex;
  } catch (e) {
    return "#e5e7eb";
  }
}

