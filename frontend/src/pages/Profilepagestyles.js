// ProfilePage.styles.js
export const S = {
  page: {
    minHeight: "100vh",
    color: "rgba(15, 15, 15, 0.92)",
    background: 'url("/bgdesign.png")',
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },

  main: { padding: 16, display: "flex", justifyContent: "center" },

  card: {
    width: "min(980px, 96vw)",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 20,
    padding: 18,
    boxShadow: "0 18px 70px rgba(0,0,0,0.26)",
    backdropFilter: "blur(12px)",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
  },

  title: { fontSize: 22, fontWeight: 950, color: "rgba(40, 2, 66, 0.92)" },
  sub: { fontSize: 13, color: "rgba(255,255,255,0.70)", marginTop: 4 },

  error: {
    marginTop: 12,
    background: "rgba(255,80,100,0.14)",
    border: "1px solid rgba(255,80,100,0.30)",
    color: "rgba(255,220,225,0.95)",
    padding: "10px 12px",
    borderRadius: 14,
    fontWeight: 800,
    fontSize: 13,
  },

  loading: { padding: 18, fontWeight: 900, color: "rgba(40, 2, 66, 0.92)" },

  grid: {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: 16,
  },

  avatarCol: { display: "flex", flexDirection: "column", gap: 10 },

  avatarWrap: {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    boxShadow: "0 14px 50px rgba(0,0,0,0.22)",
  },

  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  formCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },

  field: { display: "flex", flexDirection: "column", gap: 6 },

  label: { fontSize: 12, fontWeight: 950, color: "rgba(40, 2, 66, 0.92)" },

  value: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 14,
    padding: "10px 12px",
    fontWeight: 800,
    color: "rgba(40, 2, 66, 0.92)",
  },

  valueMultiline: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 14,
    padding: "10px 12px",
    fontWeight: 700,
    color: "rgba(40, 2, 66, 0.92)",
    whiteSpace: "pre-wrap",
    minHeight: 110,
  },

  input: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 14,
    padding: "10px 12px",
    fontWeight: 800,
    color: "rgba(40, 2, 66, 0.92)",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 14,
    padding: "10px 12px",
    fontWeight: 800,
    color: "rgba(40, 2, 66, 0.92)",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    minHeight: 120,
  },

  hint: { fontSize: 12, color: "rgba(71, 47, 89, 0.65)", marginTop: 4 },

  btn: {
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background:
      "linear-gradient(135deg, rgba(255,110,199,0.26), rgba(167,139,250,0.20), rgba(125,211,252,0.16))",
    color: "rgba(40, 2, 66, 0.92)",
    fontWeight: 950,
    cursor: "pointer",
    backdropFilter: "blur(10px)",
  },

  btnGhost: {
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(40, 2, 66, 0.92)",
    fontWeight: 950,
    cursor: "pointer",
    backdropFilter: "blur(10px)",
  },
};