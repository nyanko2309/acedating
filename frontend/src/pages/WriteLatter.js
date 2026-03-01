import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "./TopBar";
import { S, ensureHomepageStyles } from "./homepageStyles";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function WriteLatter() {
  const navigate = useNavigate();
  const { profile_id } = useParams(); // receiver id
  const userId = useMemo(() => localStorage.getItem("user_id"), []);
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [letter, setLetter] = useState("");
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [alreadySent, setAlreadySent] = useState(false);

  // receiver display
  const [rxLoading, setRxLoading] = useState(true);
  const [receiver, setReceiver] = useState(null); // { name, username, ... }

  useEffect(() => {
    ensureHomepageStyles();
  }, []);

  useEffect(() => {
    if (!profile_id) return;

    (async () => {
      setRxLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/profile/${profile_id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 15000,
        });
        setReceiver(res.data || null);
      } catch (e) {
        // fallback: we can still send, just show id
        setReceiver(null);
      } finally {
        setRxLoading(false);
      }
    })();
  }, [profile_id, token]);

  const send = async () => {
    if (!userId) return setError("Missing user_id. Please login again.");
    if (!profile_id) return setError("Missing profile id.");
    if (!letter.trim()) return setError("Letter is empty.");

    setError("");
    setInfo("");
    setSending(true);

    try {
      await axios.post(
        `${API_BASE}/api/writelatter/${userId}/${profile_id}`,
        { letter: letter.trim() },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          timeout: 15000,
        }
      );

      setInfo("Letter sent ✨");
      navigate("/home");
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.error || err.message || "Failed to send letter";

      if (status === 409) {
        setAlreadySent(true);
        setError("");
        setInfo("You already sent a letter to this user. You can’t send another one.");
        return;
      }

      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const T = {
    wrap: { padding: "14px" },
    card: {
      ...S.filtersCard, // reuse your glass card look
      maxWidth: 820,
      margin: "0 auto",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 10,
    },
    title: { fontSize: 18, fontWeight: 900, margin: 0 },
    sub: { opacity: 0.75, fontSize: 12, marginTop: 4 },
    toPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 10px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.06)",
      fontSize: 13,
      fontWeight: 800,
    },
    textarea: {
      width: "100%",
      minHeight: 190,
      resize: "vertical",
      padding: 12,
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.16)",
      background: "rgba(0,0,0,0.18)",
      color: "white",
      outline: "none",
      lineHeight: 1.4,
    },
    metaRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      marginTop: 8,
      fontSize: 12,
      opacity: 0.75,
    },
    banner: (type) => ({
      marginTop: 10,
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.14)",
      background:
        type === "error"
          ? "rgba(239,68,68,0.14)"
          : type === "info"
          ? "rgba(59,130,246,0.14)"
          : "rgba(255,255,255,0.08)",
      fontWeight: 800,
    }),
  };

  const receiverLabel = (() => {
    if (rxLoading) return "Loading…";
    if (!receiver) return profile_id;
    const name = receiver.name || "Unknown";
    const user = receiver.username ? `@${receiver.username}` : "";
    return `${name}${user ? ` (${user})` : ""}`;
  })();

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

      <main style={T.wrap}>
        <div style={S.shell}>
          <div style={T.card}>
            <div style={S.filtersHeader}>
              <div>
                <div style={S.filtersTitle}>Write a letter</div>
                <div style={S.filtersHint}>
                  Keep it short, friendly, and easy to reply to.
                </div>
              </div>

              <button type="button" style={S.secondaryBtn} onClick={() => navigate(-1)} disabled={sending}>
                Back
              </button>
            </div>

            <div style={{ padding: "0 14px 14px" }}>
              <div style={T.headerRow}>
                <div style={T.toPill}>
                  <span style={{ opacity: 0.8 }}>To</span>
                  <span>{receiverLabel}</span>
                </div>

                <button
                  type="button"
                  style={S.primaryBtn}
                  onClick={send}
                  disabled={sending || alreadySent}
                  title={alreadySent ? "You already sent a letter to this user" : "Send letter"}
                >
                  {alreadySent ? "Already sent" : sending ? "Sending…" : "Send"}
                </button>
              </div>

              {info && <div style={T.banner("info")}>{info}</div>}
              {error && <div style={T.banner("error")}>{error}</div>}

              <textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                placeholder="Write a short intro… (who you are, what you’re looking for, a fun detail)"
                maxLength={2000}
                disabled={sending || alreadySent}
                style={{ ...T.textarea, marginTop: 12, opacity: alreadySent ? 0.7 : 1 }}
              />

              <div style={T.metaRow}>
                <div>
                  IN ORDER TO KEEP THE SITE FREE ONLY ONE LATTER TO USER CAN EXIST AT A TIME SO MAKE IT COUNT!
                </div>
                <div>
                  {letter.length}/2000
                </div>
              </div>

              {alreadySent && (
                <div style={{ ...T.banner("info"), marginTop: 12 }}>
                  If you want to write again, you’ll need to delete the previous letter first (from Inbox / Sent area if you add one).
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}