// src/pages/homepageStyles.js
export const PLACEHOLDER_AVATAR_URL =
  "https://api.dicebear.com/7.x/thumbs/svg?seed=ace";

export const S = {
  page: {
    minHeight: "100vh",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    color: "rgba(255,255,255,0.92)",
    background:
      "radial-gradient(1200px 800px at 20% 10%, rgba(255, 46, 248, 0.28), transparent 60%)," +
      "radial-gradient(900px 700px at 85% 20%, rgba(121, 49, 255, 0.22), transparent 55%)," +
      "radial-gradient(1000px 800px at 40% 95%, rgba(206, 139, 250, 0.22), transparent 55%)," +
            "linear-gradient(120deg, #edc2ff, #693782 60%, #1d1620)",

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
  brandTitle: { fontWeight: 900, letterSpacing: 0.3, fontSize: 16, lineHeight: 1.1 },
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
    backdropFilter: "blur(10px)",
  },
  dot: { width: 8, height: 8, borderRadius: 999, background: "#22c55e" },
  statsText: { fontSize: 12, opacity: 0.92 },

  shell: { maxWidth: 1100, margin: "0 auto", padding: "0 18px 40px" },

  filtersCard: {
    background: "rgba(91, 69, 103, 0.47)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.14)",
    marginTop: 8,
    position: "relative",
    overflow: "visible",
    zIndex: 1000,
    //backdropFilter: "blur(10px)",
  },
  filtersHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  filtersTitle: { fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.92)" },
  filtersHint: { fontSize: 12, color: "rgba(255,255,255,0.70)", marginTop: 4 },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr",
    gap: 12,
  },

  searchWrap: { gridColumn: "1 / -1" },
  searchRow: { display: "flex", gap: 10, alignItems: "center" },
  searchInput: {
    flex: 1,
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    outline: "none",
    fontSize: 14,
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
  },

  primaryBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background:
      "linear-gradient(135deg, rgba(255,110,199,0.28), rgba(167,139,250,0.22), rgba(125,211,252,0.18))",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 14,
    backdropFilter: "blur(10px)",
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.05)",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 13,
    color: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(10px)",
  },
  linkBtn: {
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
    color: "rgba(255,255,255,0.92)",
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },

msWrap: {
  position: "relative",
  zIndex: 2000,
},
  msLabel: { fontSize: 12, fontWeight: 900, color: "rgba(255,255,255,0.80)", marginBottom: 6 },
  msButton: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255, 255, 255, 0.06)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    textAlign: "left",
    color: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
  },
  msButtonLeft: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  msButtonTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.92)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  chev: { opacity: 0.8, transition: "transform .15s ease" },
  msPanel: {
  position: "absolute",
  top: "calc(100% + 8px)",
  left: 0,
  right: 0,
  zIndex: 99999,
  background: "rgba(56, 42, 64, 0.92)",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  overflow: "visible",
  },

  msPanelTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    zIndex: 99999,

    background: "rgba(255,255,255,0.06)",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  },
  msPanelHint: { fontSize: 12, color: "rgba(255,255,255,0.72)" },
  msList: { maxHeight: 220, overflow: "auto", padding: 8 },
  msRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "8px 8px",
    borderRadius: 10,
    cursor: "pointer",
    color: "rgba(255,255,255,0.90)",
  },
  msCheck: { width: 16, height: 16 },
  msRowText: { fontSize: 13, color: "rgba(255,255,255,0.90)" },

  chips: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 },
  chip: {
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "rgba(255,255,255,0.88)",
    //backdropFilter: "blur(10px)",
  },
  chipX: { opacity: 0.7, fontWeight: 900 },

  ageWrap: { minWidth: 220 },
  ageRow: { display: "flex", alignItems: "center", gap: 8 },
  ageInput: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    outline: "none",
    fontSize: 14,
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
  },
  ageDash: { color: "rgba(255,255,255,0.65)", fontWeight: 900 },
  ageHint: { fontSize: 12, color: "rgba(255,255,255,0.70)", marginTop: 6 },

  resultsHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 12,
    padding: "0 2px",
  },
  resultsTitle: { fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.92)" },
  resultsMeta: { fontSize: 12, color: "rgba(255,255,255,0.70)" },

  loadingBox: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 18,
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    backdropFilter: "blur(10px)",
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: 999,
    border: "2px solid rgba(255,255,255,0.22)",
    borderTopColor: "rgba(255,255,255,0.82)",
    animation: "spin 0.9s linear infinite",
  },

  empty: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 22,
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    display: "grid",
    gap: 10,
    //backdropFilter: "blur(10px)",
  },
  emptyTitle: { fontSize: 16, fontWeight: 900, color: "rgba(255,255,255,0.92)" },
  emptyText: { fontSize: 13, color: "rgba(255,255,255,0.70)" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },

  // Add className="__hp_card__" on each card wrapper to get glow+hover
  card: {
    background: "rgba(122, 91, 119, 0.37)",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
    overflow: "hidden",
    transition: "transform .18s ease, box-shadow .18s ease",
    display: "flex",
    flexDirection: "column",
    minHeight: 240,
    zIndex: 0,
    //backdropFilter: "blur(10px)",
  },

  // Lightbox
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
    background: "rgba(255,255,255,0.92)",
    borderRadius: 18,
    overflowY: "auto",
    boxShadow: "0 30px 120px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.14)",
   // backdropFilter: "blur(10px)",
  },
  modalTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    background: "rgba(12, 8, 20, 0.92)",
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
  modalBody: { background: "rgba(12, 8, 20, 0.92)" },
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
    width: 58,
    height: 58,
    borderRadius: 18,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.22)",
    overflow: "hidden",
    display: "grid",
    placeItems: "center",
    flex: "0 0 auto",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarFallback: { fontWeight: 900, color: "rgba(255,255,255,0.92)", fontSize: 18 },

  favBtn: {
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.92)",
    borderRadius: 12,
    width: 40,
    height: 40,
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "40px",
    backdropFilter: "blur(10px)",
  },
  favBtnActive: {
    background: "rgba(255,110,199,0.16)",
    border: "1px solid rgba(255,110,199,0.40)",
    color: "rgba(255,255,255,0.95)",
  },

  cardBody: { padding: "0 14px 14px", display: "grid", gap: 10 },

  nameRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  },
  name: { fontWeight: 900, fontSize: 16, color: "rgba(255,255,255,0.92)" },
  user: { fontSize: 12, color: "rgba(255,255,255,0.65)" },

  badges: { display: "flex", flexWrap: "wrap", gap: 6 },
  badge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "rgba(255,255,255,0.88)",
  },

  detailRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  },
  detailKey: { fontSize: 12, color: "rgba(255,255,255,0.60)", fontWeight: 900 },
  detailVal: { fontSize: 12, color: "rgba(255,255,255,0.86)" },

  block: {
    padding: 10,
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    maxHeight:240,
    overflowY: "auto",
  },
  blockTitle: { fontSize: 12, fontWeight: 900, color: "rgba(255,255,255,0.78)", marginBottom: 4 },
  blockText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.86)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};

export function ensureHomepageStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("hp-inline-style")) return;

  const style = document.createElement("style");
  style.id = "hp-inline-style";
  style.textContent = `
    @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }

    /* 1 column on phone */
    @media (max-width: 720px) {
      .__hp_grid__ { grid-template-columns: 1fr !important; }
    }

    /* Card glow + hover (add className="__hp_card__" on card wrapper) */
    .__hp_card__{
      position: relative;
    }
    .__hp_card__::before{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      border-radius: 20px;
      padding:1px;
      background: linear-gradient(135deg,
        rgba(255,110,199,0.55),
        rgba(125,211,252,0.45),
        rgba(167,139,250,0.50)
      );
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.65;
    }
    .__hp_card__:hover{
      transform: translateY(-4px);
      box-shadow: 0 26px 90px rgba(0,0,0,0.36);
    }

    /* Nicer focus ring */
    input:focus, button:focus, select:focus, textarea:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255,110,199,0.22);
    }
  `;
  document.head.appendChild(style);
}