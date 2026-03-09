import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import TopBar from "./TopBar";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const canSubmit = useMemo(() => {
    return username.trim().length >= 2 && newPass.length >= 3 && newPass === newPass2;
  }, [username, newPass, newPass2]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const u = username.trim();
    if (!u) return setErr("Please enter your username.");
    if (newPass.length < 3) return setErr("Password must be at least 6 characters.");
    if (newPass !== newPass2) return setErr("Passwords do not match.");

    setLoading(true);
    try {
      // backend should NOT reveal whether username exists (avoid user enumeration),
      // but for a small app you can still return a clear message.
      await axios.post(`${API_BASE}/api/reset-password`, {
        username: u,
        new_password: newPass,
      });

      setMsg("Password updated. You can log in now.");
      setTimeout(() => navigate("/", { replace: true }), 900);
    } catch (e2) {
      const m = e2?.response?.data?.error || e2.message || "Reset failed";
      setErr(m);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220" }}>
    
      <main style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
        <div
          style={{
            background: "#0f172a",
            border: "1px solid rgba(148,163,184,0.25)",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0" }}>Forgot password</div>
          <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 13 }}>
            Enter your username and choose a new password.
          </div>

          {err && (
            <div
              style={{
                marginTop: 12,
                background: "#2b0f14",
                border: "1px solid #6b1f2b",
                color: "#ffd6dd",
                padding: "10px 12px",
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              {err}
            </div>
          )}

          {msg && (
            <div
              style={{
                marginTop: 12,
                background: "#0f2b1a",
                border: "1px solid #1f6b3a",
                color: "#d9ffe9",
                padding: "10px 12px",
                borderRadius: 12,
                fontSize: 14,
              }}
            >
              {msg}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ marginTop: 14, display: "grid", gap: 10 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "#cbd5e1", fontSize: 13 }}>Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your username"
                style={inputStyle}
                autoComplete="username"
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "#cbd5e1", fontSize: 13 }}>New password</span>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="new password"
                style={inputStyle}
                autoComplete="new-password"
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ color: "#cbd5e1", fontSize: 13 }}>Confirm new password</span>
              <input
                type="password"
                value={newPass2}
                onChange={(e) => setNewPass2(e.target.value)}
                placeholder="repeat new password"
                style={inputStyle}
                autoComplete="new-password"
              />
            </label>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              style={{
                marginTop: 6,
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.25)",
                background: loading || !canSubmit ? "rgba(148,163,184,0.15)" : "#2563eb",
                color: "#fff",
                fontWeight: 800,
                cursor: loading || !canSubmit ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Updating…" : "Reset password"}
            </button>

            <div style={{ marginTop: 6, fontSize: 13, color: "#94a3b8" }}>
              Back to <Link to="/" style={{ color: "#93c5fd" }}>login</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.25)",
  background: "rgba(2,6,23,0.6)",
  color: "#e2e8f0",
  outline: "none",
};