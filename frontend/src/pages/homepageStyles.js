// src/pages/homepageStyles.js
export const PLACEHOLDER_AVATAR_URL =
  "https://api.dicebear.com/7.x/thumbs/svg?seed=ace";

export const S = {
    
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #0b1220 0%, #0b1220 230px, #f6f7fb 230px, #f6f7fb 100%)",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    color: "#0f172a",
  },
  topBar: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "22px 18px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  brand: { display: "flex", alignItems: "center", gap: 12, color: "white" },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: 20,
  },
  brandTitle: { fontWeight: 800, letterSpacing: 0.2, fontSize: 16, lineHeight: 1.1 },
  brandSub: { opacity: 0.8, fontSize: 12, marginTop: 3 },
  statsPill: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "white",
    whiteSpace: "nowrap",
  },
  dot: { width: 8, height: 8, borderRadius: 999, background: "#22c55e" },
  statsText: { fontSize: 12, opacity: 0.92 },

  shell: { maxWidth: 1100, margin: "0 auto", padding: "0 18px 40px" },

  filtersCard: {
    background: "white",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 12px 40px rgba(15,23,42,0.10)",
    border: "1px solid rgba(15,23,42,0.06)",
    marginTop: 8,
  },
  filtersHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  filtersTitle: { fontSize: 16, fontWeight: 800 },
  filtersHint: { fontSize: 12, color: "#475569", marginTop: 4 },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: 12,
  },

  searchWrap: { gridColumn: "1 / -1" },
  searchRow: { display: "flex", gap: 10, alignItems: "center" },
  searchInput: {
    flex: 1,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    outline: "none",
    fontSize: 14,
    background: "#fbfcff",
  },

  primaryBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.10)",
    background: "#0b1220",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "white",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    color: "#0f172a",
  },
  linkBtn: {
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 12,
    color: "#0b1220",
    textDecoration: "underline",
  },

  msWrap: { position: "relative", minWidth: 220 },
  msLabel: { fontSize: 12, fontWeight: 800, color: "#334155", marginBottom: 6 },
  msButton: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "#fbfcff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    textAlign: "left",
  },
  msButtonLeft: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  msButtonTitle: {
    fontSize: 14,
    color: "#0f172a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  chev: { opacity: 0.7, transition: "transform .15s ease" },
  msPanel: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    zIndex: 20,
    background: "white",
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.12)",
    boxShadow: "0 20px 60px rgba(15,23,42,0.14)",
    overflow: "hidden",
  },
  msPanelTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    background: "#f8fafc",
    borderBottom: "1px solid rgba(15,23,42,0.06)",
  },
  msPanelHint: { fontSize: 12, color: "#475569" },
  msList: { maxHeight: 220, overflow: "auto", padding: 8 },
  msRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "8px 8px",
    borderRadius: 10,
    cursor: "pointer",
  },
  msCheck: { width: 16, height: 16 },
  msRowText: { fontSize: 13, color: "#0f172a" },

  chips: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: {
    border: "1px solid rgba(15,23,42,0.10)",
    background: "white",
    borderRadius: 999,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#0f172a",
  },
  chipX: { opacity: 0.6, fontWeight: 900 },

  ageWrap: { minWidth: 220 },
  ageRow: { display: "flex", alignItems: "center", gap: 8 },
  ageInput: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    outline: "none",
    fontSize: 14,
    background: "#fbfcff",
  },
  ageDash: { color: "#64748b", fontWeight: 800 },
  ageHint: { fontSize: 12, color: "#64748b", marginTop: 6 },

  resultsHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 10,
    padding: "0 2px",
  },
  resultsTitle: { fontSize: 16, fontWeight: 900, color: "#0f172a" },
  resultsMeta: { fontSize: 12, color: "#64748b" },

  loadingBox: {
    background: "white",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 12px 40px rgba(15,23,42,0.08)",
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: 999,
    border: "2px solid rgba(15,23,42,0.18)",
    borderTopColor: "rgba(15,23,42,0.75)",
    animation: "spin 0.9s linear infinite",
  },

  empty: {
    background: "white",
    borderRadius: 18,
    padding: 22,
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 12px 40px rgba(15,23,42,0.08)",
    display: "grid",
    gap: 10,
  },
  emptyTitle: { fontSize: 16, fontWeight: 900 },
  emptyText: { fontSize: 13, color: "#475569" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },
  card: {
    background: "white",
    borderRadius: 18,
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "0 12px 40px rgba(15,23,42,0.08)",
    overflow: "hidden",
    transition: "transform .15s ease",
    display: "flex",
    flexDirection: "column",
    minHeight: 220,
  },
    // lightbox
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.72)",
    display: "grid",
    placeItems: "center",
    zIndex: 9999,
    padding: 18,
  },
  modal: {
    width: "min(960px, 96vw)",
    maxHeight: "90vh",
    background: "white",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 30px 120px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  modalTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    background: "#0b1220",
    color: "white",
  },
  modalTitle: { fontWeight: 900, fontSize: 13, opacity: 0.95 },
  modalClose: {
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.10)",
    color: "white",
    borderRadius: 12,
    width: 36,
    height: 36,
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "36px",
  },
  modalBody: { background: "#0b1220" },
  modalImgWrap: {
    width: "100%",
    height: "min(72vh, 720px)",
    display: "grid",
    placeItems: "center",
  },
  modalImg: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    display: "block",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 14,
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 16,
    background: "#f1f5f9",
    border: "1px solid rgba(15,23,42,0.06)",
    overflow: "hidden",
    display: "grid",
    placeItems: "center",
    flex: "0 0 auto",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarFallback: { fontWeight: 900, color: "#0f172a", fontSize: 18 },

  favBtn: {
    border: "1px solid rgba(15,23,42,0.10)",
    background: "white",
    borderRadius: 12,
    width: 40,
    height: 40,
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "40px",
  },
  favBtnActive: {
    background: "#fff7ed",
    border: "1px solid rgba(249,115,22,0.35)",
    color: "#f97316",
  },

  cardBody: { padding: "0 14px 14px", display: "grid", gap: 10 },
  nameRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  },
  name: { fontWeight: 900, fontSize: 15, color: "#0f172a" },
  user: { fontSize: 12, color: "#64748b" },

  badges: { display: "flex", flexWrap: "wrap", gap: 6 },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#f8fafc",
    border: "1px solid rgba(15,23,42,0.06)",
    color: "#0f172a",
  },

  detailRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  },
  detailKey: { fontSize: 12, color: "#64748b", fontWeight: 800 },
  detailVal: { fontSize: 12, color: "#0f172a" },

  block: {
    padding: 10,
    borderRadius: 14,
    background: "#fbfcff",
    border: "1px solid rgba(15,23,42,0.06)",
  },
  blockTitle: { fontSize: 12, fontWeight: 900, color: "#334155", marginBottom: 4 },
  blockText: { fontSize: 13, color: "#0f172a", whiteSpace: "pre-wrap", wordBreak: "break-word" },
};

export function ensureHomepageStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("hp-inline-style")) return;

  const style = document.createElement("style");
  style.id = "hp-inline-style";
  style.textContent = `
    @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
    @media (max-width: 1050px) {
      .__hp_grid__ { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 720px) {
      .__hp_grid__ { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}
