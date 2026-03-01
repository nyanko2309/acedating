import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TopBar from "./TopBar";
import { S, ensureHomepageStyles } from "./homepageStyles";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

function fmtDate(x) {
  if (!x) return "";
  const d = new Date(x);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

export default function Inbox() {
  const userId = useMemo(() => localStorage.getItem("user_id"), []);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // modal / open letter on click
  const [openLetter, setOpenLetter] = useState(null);

  useEffect(() => {
    ensureHomepageStyles();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenLetter(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const load = async () => {
    if (!userId) return;
    setErr("");
    setLoading(true);

    try {
      const res = await axios.get(`${API_BASE}/api/inbox/${userId}`, { timeout: 15000 });
      const arr = Array.isArray(res.data?.items) ? res.data.items : [];

      // ensure newest first
      arr.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setItems(arr);
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "Failed to load inbox");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (letterId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/letters/${letterId}/read`,
        { user_id: userId },
        { timeout: 15000 }
      );

      const readAt = res.data?.read_at || new Date().toISOString();

      setItems((prev) => prev.map((x) => (x._id === letterId ? { ...x, read_at: readAt } : x)));
      setOpenLetter((prev) => (prev && prev._id === letterId ? { ...prev, read_at: readAt } : prev));
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to mark read");
    }
  };

  const deleteLetter = async (letterId) => {
    if (!window.confirm("Delete this letter?")) return;

    try {
      await axios.delete(`${API_BASE}/api/letters/${letterId}`, {
        params: { user_id: userId },
        timeout: 15000,
      });

      setItems((prev) => prev.filter((x) => x._id !== letterId));
      setOpenLetter((prev) => (prev && prev._id === letterId ? null : prev));
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to delete letter");
    }
  };

  useEffect(() => {
    if (!userId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Local styling that matches your existing "glass + rounded + grid row" vibe
  const T = {
    table: {
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.06)",
      borderRadius: 18,
      
    },
    head: {
      display: "grid",
      gridTemplateColumns: "220px 1fr 160px",
      gap: 12,
      padding: "10px 16px",
      fontSize: 12,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      opacity: 0.75,
      borderBottom: "1px solid rgba(255,255,255,0.10)",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "220px 1fr 160px",
      gap: 12,
      padding: "12px 16px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      alignItems: "start",
      cursor: "pointer",
      transition: "transform 160ms ease, background 160ms ease",
      
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 99,
      background: "#60a5fa",
      boxShadow: "0 0 0 4px rgba(96,165,250,0.15)",
      display: "inline-block",
    },
    pill: (bg) => ({
      fontSize: 12,
      padding: "6px 10px",
      borderRadius: 999,
      background: bg,
      border: "1px solid rgba(255,255,255,0.14)",
      whiteSpace: "nowrap",
      
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
    }),
    msg: (unread) => ({
      whiteSpace: "pre-wrap",
      overflow:"hidden",
      height:50,
      opacity: unread ? 1 : 0.88,
      lineHeight: 1.35,
    }),
    from: (unread) => ({
      fontWeight: unread ? 900 : 800,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      opacity: unread ? 1 : 0.9,
    }),
    small: { fontSize: 12, opacity: 0.75 },
    actions: { display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-start" },
  };

  const showEmptyNice = !loading && !err && items.length === 0;

  return (
    <div style={S.page}>
      <TopBar
         links={[
    { to: "/home", label: "Home" },
    { to: "/profile", label: "My Profile" },
    { to: "/saved", label: "Saved" },
    { to: "/random", label: "Let luck choose" },
    { to: "/latters", label: "Inbox" },
  ]}
      />

      <main style={{ padding: "14px" }}>
        {/* Modal */}
        {openLetter && (
          <div style={S.overlay} onMouseDown={() => setOpenLetter(null)}>
            <div style={S.modal} onMouseDown={(e) => e.stopPropagation()}>
              <div style={S.modalTop}>
                <div style={S.modalTitle}>
                  {openLetter.sender_username || openLetter.sender_name || openLetter.sender_id || "Unknown"}
                </div>
                <button type="button" style={S.modalClose} onClick={() => setOpenLetter(null)}>
                  ×
                </button>
              </div>

              <div style={S.modalBody}>
                <div style={{ opacity: 0.75, fontSize: 12, marginBottom: 10 }}>
                  {fmtDate(openLetter.created_at)}
                  {openLetter.read_at ? ` • Read: ${fmtDate(openLetter.read_at)}` : " • Unread"}
                </div>

                <div style={{ whiteSpace: "pre-wrap" }}>{openLetter.letter}</div>

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  {!openLetter.read_at && (
                    <button type="button" style={S.primaryBtn} onClick={() => markRead(openLetter._id)}>
                      Mark read
                    </button>
                  )}
                  <button type="button" style={S.secondaryBtn} onClick={() => deleteLetter(openLetter._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={S.shell}>
          <div style={S.resultsHeader}>
            <div>
              <div style={S.resultsTitle}>Inbox</div>
              <div style={S.resultsMeta}>
                {loading ? "Loading…" : `${items.length} message${items.length === 1 ? "" : "s"} • newest first`}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" style={S.secondaryBtn} onClick={load}>
                Refresh
              </button>
            </div>
          </div>

          {err && <div style={{ color: "#ffb4b4", fontWeight: 900, marginBottom: 10 }}>{err}</div>}

          {loading ? (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <div>Loading…</div>
            </div>
          ) : (
            <div style={T.table}>
              <div style={T.head}>
                <div>From</div>
                <div>Message</div>
                <div>Actions</div>
              </div>

              {/* Empty state = ONE line only */}
              {showEmptyNice ? (
                <div style={{ ...T.row, cursor: "default", opacity: 0.8 }}>
                  <div style={T.from(false)}>
                    <div style={{ fontWeight: 900 }}>—</div>
                    <div style={T.small}>No sender yet</div>
                  </div>

                  <div style={T.msg(false)}>
                    <div style={{ opacity: 0.75 }}>
                      Your inbox is empty. When someone sends you a letter, it will appear here.
                    </div>
                  </div>

                  <div>
                    <span style={T.pill("rgba(148,163,184,0.16)")}>Empty</span>
                  </div>
                </div>
              ) : (
                items.map((m) => {
                  const unread = !m.read_at;
                  const senderName = m.sender_username || m.sender_name || m.sender || m.sender_id || "Unknown";

                  return (
                    <div
                      key={m._id}
                      style={{
                        ...T.row,
                        background: unread ? "rgba(255,255,255,0.04)" : "transparent",
                      }}
                      onClick={() => setOpenLetter(m)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setOpenLetter(m);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <div style={T.from(unread)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {unread && <span title="Unread" style={T.dot} />}
                          <span>{senderName}</span>
                        </div>
                        <div style={T.small}>{fmtDate(m.created_at)}</div>
                      </div>

                      <div style={T.msg(unread)}>{m.letter}</div>

                      <div style={T.actions}>
                        {/* If read_at exists => no mark as read */}
                        {!m.read_at ? (
                          <button
                            type="button"
                            style={S.primaryBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              markRead(m._id);
                            }}
                          >
                            Mark read
                          </button>
                        ) : (
                          <span style={T.pill("rgba(34,197,94,0.18)")}>Read</span>
                        )}

                        <button
                          type="button"
                          style={S.secondaryBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLetter(m._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}