// src/pages/homepageStyles.js
export const PLACEHOLDER_AVATAR_URL =
  "https://api.dicebear.com/7.x/thumbs/svg?seed=ace";

// ---- Design tokens ----------------------------------------------------
const CARD_BG = "#46364F";
const CARD_BG_SOFT = "rgba(70, 54, 79, 0.94)";

const PLUM = "#6F4C8B";
const PLUM_HOVER = "#5C3F74";
const PLUM_TINT = "rgba(111, 76, 139, 0.30)";
const PLUM_TINT_SOFT = "rgba(111, 76, 139, 0.16)";
const PLUM_BORDER = "rgba(111, 76, 139, 0.55)";
const PLUM_RING = "rgba(111, 76, 139, 0.35)";

const SAGE = "#88A97F";
const SAGE_TINT = "rgba(135, 155, 125, 0.16)";
const SAGE_BORDER = "#879B7D";
const SAGE_DARK = "#3E4C39";

const CTA_PLUM = "#76509A";
const CTA_PLUM_HOVER = "#6B4789";

const TEXT_PRIMARY = "#F7F5F8";
const TEXT_SECONDARY = "#C9C4CC";
const LABEL_SOFT = "rgba(201, 196, 204, 0.68)";
const USERNAME_MUTED = "rgba(201, 196, 204, 0.62)";

const RADIUS = 18;
const SP_1 = 8;
const SP_2 = 16;
const SP_3 = 24;
const SP_4 = 32;

export const S = {
  page: {
    minHeight: "100vh",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    color: TEXT_PRIMARY,
    // A soft cream/white overlay sits over the illustration so the page reads
    // calm rather than busy — strongest near the center where content lives,
    // letting the leaves stay visible mainly toward the edges.
    background:
      'radial-gradient(ellipse at center, rgba(250,248,251,0.74) 0%, rgba(250,248,251,0.44) 55%, rgba(250,248,251,0.20) 100%), url("/bgdesign.png")',
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundPosition: "center, center",
    backgroundSize: "cover, cover",
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
  dot: { width: 8, height: 8, borderRadius: 999, background: SAGE },
  statsText: { fontSize: 12, opacity: 0.92 },

  shell: { maxWidth: 1100, margin: "0 auto", padding: `0 ${SP_2}px ${SP_4}px` },

  // ===== Unified search + filters toolbar =====
  // Sage-tinted so the toolbar feels connected to the botanical theme rather
  // than a neutral grey UI slab.
  controlBar: {
    display: "flex",
    gap: SP_1,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 0,
    background: "rgba(136, 169, 127, 0.14)",
    border: "1px solid rgba(136, 169, 127, 0.35)",
    borderRadius: RADIUS,
    padding: 6,
    backdropFilter: "blur(6px)",
  },
  searchInputWrap: {
    position: "relative",
    flex: 1,
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    display: "flex",
    alignItems: "center",
    color: SAGE_DARK,
    opacity: 0.75,
    pointerEvents: "none",
  },
  quickSearchInput: {
    width: "100%",
    padding: "10px 14px 10px 34px",
    borderRadius: RADIUS - 6,
    border: "1px solid rgba(136, 169, 127, 0.30)",
    outline: "none",
    fontSize: 14,
    background: "rgba(136, 169, 127, 0.10)",
    color: SAGE_DARK,
    fontWeight: 600,
  },
  // Filter button defaults to pale sage — "filter state" belongs to the
  // sage/metadata family, not the plum action family.
  filterToggleBtn: {
    padding: "10px 14px",
    borderRadius: RADIUS - 6,
    border: "1px solid rgba(136, 169, 127, 0.40)",
    background: "rgba(136, 169, 127, 0.16)",
    color: SAGE_DARK,
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 13,
    whiteSpace: "nowrap",
    transition: "background-color .15s ease, border-color .15s ease",
  },
  filterToggleBtnActive: {
    background: "rgba(136, 169, 127, 0.40)",
    border: "1px solid rgba(136, 169, 127, 0.70)",
    boxShadow: "0 0 0 3px rgba(136, 169, 127, 0.18)",
  },

  // ===== Filters modal (opened from controlBar) =====
  filterModalCard: {
    background: "rgba(34, 22, 42, 0.98)",
    borderRadius: RADIUS,
    padding: SP_3,
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.14)",
    width: "min(720px, 92vw)",
    maxHeight: "85vh",
    overflow: "auto",
    position: "relative",
  },
  filterModalBody: {
    marginTop: 4,
  },

  filtersCard: {
    background: "rgba(34, 22, 42, 0.79)",
    borderRadius: RADIUS,
    padding: SP_3,
    boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.14)",
    marginTop: SP_1,
    position: "relative",
    overflow: "visible",
    zIndex: 900,
  },
  filtersHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: SP_2,
    marginBottom: SP_2,
  },
  filtersTitle: { fontSize: 16, fontWeight: 900, color: TEXT_PRIMARY },
  filtersHint: { fontSize: 12, color: TEXT_SECONDARY, marginTop: 4 },

  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr 1fr",
    gap: SP_2,
  },

  searchWrap: { gridColumn: "1 / -1" },
  searchRow: { display: "flex", gap: SP_1, alignItems: "center" },
  searchInput: {
    flex: 1,
    padding: "12px 12px",
    borderRadius: RADIUS - 4,
    border: "1px solid rgba(255,255,255,0.16)",
    outline: "none",
    fontSize: 14,
    background: "rgba(255,255,255,0.08)",
    color: TEXT_PRIMARY,
  },

  // Solid plum CTA — reserved for the one clear "go" action in the modal.
  primaryBtn: {
    padding: "12px 14px",
    borderRadius: RADIUS - 4,
    border: `1px solid ${PLUM_BORDER}`,
    background: PLUM,
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 14,
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: RADIUS - 6,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.05)",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 13,
    color: TEXT_SECONDARY,
    transition: "background-color .15s ease, border-color .15s ease",
  },
  linkBtn: {
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 12,
    color: TEXT_PRIMARY,
    textDecoration: "underline",
    textUnderlineOffset: 2,
  },

  msWrap: {
    position: "relative",
    zIndex: 1000,
  },
  msLabel: { fontSize: 12, fontWeight: 900, color: TEXT_SECONDARY, marginBottom: 6 },

  msButtonLeft: { display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  msButtonTitle: {
    fontSize: 14,
    color: TEXT_PRIMARY,
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
    zIndex: 1000,
    background: "rgba(56, 42, 64, 0.97)",
    borderRadius: RADIUS - 2,
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    overflow: "auto",
  },
  msButton: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: RADIUS - 4,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    cursor: "pointer",
    display: "flex",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    textAlign: "left",
    color: TEXT_PRIMARY,
  },
  // Applied when the dropdown already has an active selection — sage, to
  // match the "active filters" family (the transient open state still gets
  // a light border via CSS, kept separate from this data-driven highlight).
  msButtonActive: {
    border: `1px solid ${SAGE_BORDER}`,
    boxShadow: `0 0 0 3px rgba(135, 155, 125, 0.25)`,
  },
  msPanelTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    background: "rgba(255,255,255,0.04)",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
  },
  msPanelHint: { fontSize: 12, color: TEXT_SECONDARY },
  msList: { maxHeight: 220, overflow: "auto", padding: 8 },
  msRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "8px 8px",
    borderRadius: 10,
    cursor: "pointer",
    color: TEXT_PRIMARY,
  },
  msCheck: { width: 16, height: 16 },
  msRowText: { fontSize: 13, color: TEXT_PRIMARY },

  // Filter chips = "active filters" → sage, same family as profile tags.
  chips: { display: "flex", flexWrap: "wrap", gap: SP_1, marginTop: SP_1 },
  chip: {
    border: "1px solid rgba(136,169,127,0.45)",
    background: "rgba(136,169,127,0.12)",
    borderRadius: 999,
    padding: "7px 12px",
    cursor: "pointer",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: TEXT_PRIMARY,
    fontWeight: 700,
  },
  chipX: { opacity: 0.7, fontWeight: 900 },

  ageWrap: { minWidth: 220 },
  ageRow: { display: "flex", alignItems: "center", gap: SP_1 },
  ageInput: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: RADIUS - 4,
    border: "1px solid rgba(255,255,255,0.16)",
    outline: "none",
    fontSize: 14,
    background: "rgba(255,255,255,0.08)",
    color: TEXT_PRIMARY,
  },
  ageDash: { color: TEXT_SECONDARY, fontWeight: 900 },
  ageHint: { fontSize: 12, color: TEXT_SECONDARY, marginTop: 6 },

  resultsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 12,
    padding: "0 2px",
  },
  // Small pill counter — sits right above the arrows/card, reading as part of
  // the profile-browsing controls rather than generic page text.
  resultsMeta: {
    fontSize: 12,
    fontWeight: 800,
    color: TEXT_PRIMARY,
    background: "rgba(70, 54, 79, 0.55)",
    border: "1px solid rgba(255,255,255,0.14)",
    padding: "6px 14px",
    borderRadius: 999,
  },

  loadingBox: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: RADIUS,
    padding: SP_2,
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
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
    borderRadius: RADIUS,
    padding: SP_3,
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    display: "grid",
    gap: SP_1,
  },
  emptyTitle: { fontSize: 16, fontWeight: 900, color: TEXT_PRIMARY },
  emptyText: { fontSize: 13, color: TEXT_SECONDARY },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: SP_2,
  },

  // ===== Single-profile "swipe" view =====
  swipeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  // Sits close to the card and matches its color family, so the controls
  // read as attached to profile-browsing rather than generic page nav.
  // Both arrows always share the same style — no disabled/dimmed state —
  // since browsing now loops in both directions.
  sideNavBtn: {
    flex: "0 0 auto",
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: `1px solid ${PLUM_BORDER}`,
    background: CARD_BG_SOFT,
    color: TEXT_PRIMARY,
    fontSize: 22,
    fontWeight: 900,
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
    opacity: 1,
    transition: "transform .15s ease, background-color .15s ease",
  },
  singleCardWrap: {
    maxWidth: 680,
    width: "100%",
    margin: "0 auto",
    position: "relative",
  },
  // Two faint static "ghost" cards peeking out behind the real one — hints
  // there's a stack of profiles to browse through, not just one flat card.
  stackCardFar: {
    position: "absolute",
    top: 22,
    left: "80%",
    transform: "translateX(-50%)",
    width: "50%",
    height: 606,
    borderRadius: RADIUS,
    background: "#867991",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 14px 30px rgba(0,0,0,0.28)",
    opacity: 0.45,
    zIndex: 0,
    transform: "translateX(-49%) rotate(7deg)",
    pointerEvents: "none",
    
  },
  stackCardNear: {
    position: "absolute",
    top: 11,
    left: "57%",
    transform: "translateX(-50%)",
    width: "92%",
    height: 624,
    borderRadius: RADIUS,
    background: "#81718e",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 16px 36px rgba(0,0,0,0.32)",
    opacity: 1,
    zIndex: 1,
    transform: "translateX(-50%) rotate(3deg)",
    pointerEvents: "none",
  },
  cardAnimWrap: {
    position: "relative",
    zIndex: 2,
    transformOrigin: "bottom center",
  },

  // Solid, readable card — but not a flat slab: a subtle top-to-bottom tonal
  // shift plus faint sage/plum corner washes give it some depth. Fixed
  // height keeps every profile the same size; long bios/contact info scroll
  // internally (see cardBody).
  card: {
    background:
      "radial-gradient(circle at 100% 0%, rgba(136,169,127,0.07), transparent 45%), " +
      "radial-gradient(circle at 0% 100%, rgba(111,76,139,0.10), transparent 50%), " +
      "linear-gradient(180deg, #46364F 0%, #4C3B57 100%)",
    borderRadius: RADIUS,
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow:
      "0 26px 60px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -50px 70px -50px rgba(0,0,0,0.25)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: 640,
    minHeight: 640,
    maxHeight: 640,
    zIndex: 0,
  },

  // Lightbox
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.72)",
    display: "grid",
    placeItems: "center",
    zIndex: 1000,
    padding: 18,
  },

  modalTitle: { fontWeight: 900, fontSize: 13, opacity: 0.95 },
  modalClose: {
    border: "1px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.10)",
    color: "white",
    borderRadius: RADIUS - 4,
    width: 36,
    height: 36,
    cursor: "pointer",
    fontSize: 18,
    lineHeight: "36px",
  },
  modal: {
    width: "min(900px, 92vw)",
    maxHeight: "85vh",
    background: "rgba(37, 28, 40, 0.98)",
    borderRadius: RADIUS,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(255,255,255,0.14)",
  },

  modalTop: {
    flex: "0 0 auto",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  modalBody: {
    flex: "1 1 auto",
    minHeight: 0,
    padding: 12,
    overflow: "auto",
  },

  modalImgWrap: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalImg: {
    maxWidth: "70%",
    maxHeight: "70%",
    width: "auto",
    height: "auto",
    objectFit: "contain",
    borderRadius: 12,
    display: "block",
  },

  // Avatar + name + username on the left, compact Message + Favorite
  // actions on the right — reads as a profile header, not a form.
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SP_2,
    gap: 14,
    flex: "0 0 auto",
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 24,
    background: "rgba(255,255,255,0.10)",
    border: "2px solid rgba(255,255,255,0.28)",
    boxShadow: "0 8px 22px rgba(0,0,0,0.35)",
    overflow: "hidden",
    display: "grid",
    placeItems: "center",
    flex: "0 0 auto",
    alignSelf: "center",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarFallback: { fontWeight: 900, color: TEXT_PRIMARY, fontSize: 18 },

  nameBlock: {
    flex: "1 1 auto",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    justifyContent: "center",
  },
  name: {
    fontWeight: 900,
    fontSize: 21,
    color: TEXT_PRIMARY,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  user: { fontSize: 13, color: USERNAME_MUTED },

  favBtn: {
    border: "2px solid rgba(255,110,199,0.55)",
    background: "rgba(255,110,199,0.18)",
    color: "rgba(255,255,255,0.96)",
    borderRadius: RADIUS - 6,
    width: 44,
    height: 44,
    cursor: "pointer",
    fontSize: 21,
    lineHeight: "40px",
    boxShadow: "0 4px 16px rgba(255,110,199,0.25)",
    transition: "transform .15s ease, background-color .15s ease, border-color .15s ease, box-shadow .15s ease",
    flex: "0 0 auto",
    alignSelf: "center",
  },
  favBtnActive: {
    background: "rgba(255,110,199,0.28)",
    border: "2px solid rgba(255,110,199,0.70)",
    color: "rgba(255,255,255,1)",
  },

  // Compact header action cluster: Message (primary, filled plum) sits next
  // to the Favorite icon — a natural profile-card header, not a form bar.
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: "0 0 auto",
  },
  msgBtnCompact: {
    height: 44,
    padding: "0 16px",
    borderRadius: RADIUS - 6,
    border: `1px solid ${CTA_PLUM}`,
    background: CTA_PLUM,
    color: "white",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 13,
    whiteSpace: "nowrap",
    boxShadow: "0 6px 16px rgba(118,80,154,0.30)",
    transition: "background-color .15s ease",
  },

  cardBody: {
    padding: `0 ${SP_2}px ${SP_2}px`,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    flex: "1 1 auto",
    minHeight: 0,
    overflowY: "auto",
  },

  // Tags — sage, per the "supporting accent" role.
  badges: { display: "flex", flexWrap: "wrap", gap: SP_1 },
  badge: {
    fontSize: 12,
    fontWeight: 700,
    padding: "7px 13px",
    borderRadius: 999,
    background: SAGE_TINT,
    border: `1px solid ${SAGE_BORDER}`,
    color: TEXT_PRIMARY,
  },

  // Orientation / romantic orientation / looking for — aligned label+value
  // columns instead of pushed to opposite edges.
  detailGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  detailRow: {
    display: "grid",
    gridTemplateColumns: "190px 1fr",
    gap: 12,
    alignItems: "baseline",
  },
  detailKey: {
    fontSize: 11,
    color: LABEL_SOFT,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  detailVal: { fontSize: 14, color: TEXT_PRIMARY, fontWeight: 700 },

  block: {
    padding: SP_2,
    borderRadius: RADIUS - 4,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    maxHeight: 200,
    overflowY: "auto",
  },
  blockTitle: {
    fontSize: 11,
    fontWeight: 800,
    color: LABEL_SOFT,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  blockText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    lineHeight: 1.5,
  },

  // About: no boxed container — a top divider instead, so the card doesn't
  // feel like a card inside a card. Height is still capped (shorter than a
  // full free scroll) so the Contact block below always keeps its room.
  aboutSection: {
    borderTop: "1px solid rgba(136,169,127,0.22)",
    paddingTop: 24,
    maxHeight: 150,
    overflowY: "auto",
  },
  aboutTitle: {
    fontSize: 11,
    fontWeight: 800,
    color: LABEL_SOFT,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },
  aboutText: {
    fontSize: 14,
    color: TEXT_PRIMARY,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    lineHeight: 1.5,
  },
};

export function ensureHomepageStyles() {
  if (typeof document === "undefined") return;

  // Always (re)write the content instead of bailing out when the tag already
  // exists — otherwise a stale tag from an earlier load / hot reload can
  // silently keep old CSS forever.
  let style = document.getElementById("hp-inline-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "hp-inline-style";
    document.head.appendChild(style);
  }

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
    .__hp_card__:hover{
      transform: translateY(-2px);
      box-shadow: 0 26px 70px rgba(0,0,0,0.42);
    }

    /* Placeholder contrast */
    input::placeholder { color: rgba(255,255,255,0.68); opacity: 1; }
    /* Quick search sits on a sage-tinted surface with dark sage text */
    .__hp_quick_search__::placeholder { color: rgba(62, 76, 57, 0.55); opacity: 1; }

    /* Focus ring uses plum, per the "important actions/selected states" rule */
    input:focus, button:focus, select:focus, textarea:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(111,76,139,0.45);
    }

    /* Secondary controls (Clear all, dropdown triggers, etc.) pick up a
       soft sage hover — sage as warmth/metadata, never the main action. */
    .__hp_secondary_btn__:hover {
      background: rgba(136,169,127,0.14) !important;
      border-color: rgba(136,169,127,0.40) !important;
      color: #F7F5F8 !important;
    }
    .__hp_ms_button__:hover {
      background: rgba(136,169,127,0.10) !important;
      border-color: rgba(136,169,127,0.35) !important;
    }
    .__hp_filter_btn__:hover {
      background: rgba(136,169,127,0.26) !important;
    }

    /* ===== Fan-style card transition for Next / Prev ===== */
    @keyframes hpFanInRight {
      0%   { opacity: 0;   transform: translateX(110px) translateY(10px) rotate(16deg) scale(0.92); }
      55%  { opacity: 1;   transform: translateX(-10px) translateY(-4px) rotate(-4deg) scale(1.02); }
      80%  { opacity: 1;   transform: translateX(4px)   translateY(0)    rotate(1.5deg) scale(1.0); }
      100% { opacity: 1;   transform: translateX(0)      translateY(0)    rotate(0deg)   scale(1); }
    }
    @keyframes hpFanInLeft {
      0%   { opacity: 0;   transform: translateX(-110px) translateY(10px) rotate(-16deg) scale(0.92); }
      55%  { opacity: 1;   transform: translateX(10px)   translateY(-4px) rotate(4deg)   scale(1.02); }
      80%  { opacity: 1;   transform: translateX(-4px)   translateY(0)    rotate(-1.5deg) scale(1.0); }
      100% { opacity: 1;   transform: translateX(0)      translateY(0)    rotate(0deg)    scale(1); }
    }
    .__hp_fan_right__ { animation: hpFanInRight 0.42s cubic-bezier(.2,.75,.25,1); }
    .__hp_fan_left__  { animation: hpFanInLeft 0.42s cubic-bezier(.2,.75,.25,1); }

    /* Side nav button feedback */
    .__hp_side_nav__:hover:not(:disabled) { background: #56405f; transform: translateY(-1px); }
    .__hp_side_nav__:active { transform: scale(0.92); }

    /* Message button feedback — subtle darken, no dramatic brightening */
    .__hp_msg_btn__:hover { background: #6B4789; }
    .__hp_msg_btn__:active { transform: scale(0.97); }

    /* Fav/save star: idle pulse hints it's clickable, hover/active give
       tactile feedback, and toggling it on plays a little bounce-pop. */
    @keyframes hpFavIdlePulse {
      0%, 100% { box-shadow: 0 4px 16px rgba(255,110,199,0.25), 0 0 0 0 rgba(255,110,199,0.0); transform: scale(1); }
      50%      { box-shadow: 0 4px 16px rgba(255,110,199,0.25), 0 0 0 5px rgba(255,110,199,0.30); transform: scale(1.02); }
    }
    .__hp_fav_btn__ {
      animation: hpFavIdlePulse 1.9s ease-in-out infinite;
    }
    .__hp_fav_btn__:hover {
      transform: scale(1.28) !important;
      background: rgba(255,110,199,0.32) !important;
      border-color: rgba(255,110,199,0.85) !important;
      box-shadow: 0 6px 22px rgba(255,110,199,0.45) !important;
      animation-play-state: paused;
    }
    .__hp_fav_btn__:active {
      transform: scale(0.80) !important;
    }
    @keyframes hpFavPopIn {
      0%   { transform: scale(0.6); }
      45%  { transform: scale(1.55); }
      70%  { transform: scale(0.88); }
      100% { transform: scale(1); }
    }
    .__hp_fav_btn_active__ {
      animation: hpFavPopIn 0.45s cubic-bezier(.3,1.6,.4,1);
    }

    /* Heart burst shown on favorite/save */
    @keyframes hpHeartBurst {
      0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.2) rotate(-8deg); }
      25%  { opacity: 1; transform: translate(-50%, -50%) scale(1.35) rotate(4deg); }
      55%  { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
      100% { opacity: 0; transform: translate(-50%, -85%) scale(1.15) rotate(0deg); }
    }
    .__hp_heart_burst__{
      position: absolute;
      top: 42%;
      left: 50%;
      font-size: 96px;
      line-height: 1;
      pointer-events: none;
      color: rgba(255,110,199,0.95);
      text-shadow: 0 0 30px rgba(255,110,199,0.85), 0 0 70px rgba(167,139,250,0.65);
      animation: hpHeartBurst 0.7s ease forwards;
      z-index: 60;
    }

    @keyframes hpBurstRing {
      0%   { opacity: 0.55; transform: translate(-50%, -50%) scale(0.4); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(2.2); }
    }
    .__hp_heart_ring__{
      position: absolute;
      top: 42%;
      left: 50%;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(255,110,199,0.35), rgba(167,139,250,0.15) 60%, transparent 70%);
      animation: hpBurstRing 0.7s ease forwards;
      z-index: 55;
    }
  `;
}