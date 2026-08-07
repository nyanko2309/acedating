import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TopBar from "./TopBar";
import { useNavigate } from "react-router-dom";
import { S, ensureHomepageStyles, PLACEHOLDER_AVATAR_URL } from "./homepageStyles";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

/** ✅ NEW — small fun popup shown when a mutual like happens */
function MatchCelebration({ show, name, onClose }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.45)",
        cursor: "pointer",
      }}
    >
      <style>{`
        @keyframes matchPop { 0% { transform: scale(0.6); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
      `}</style>
      <div
        style={{
          background: "linear-gradient(135deg, rgba(236,72,153,0.95), rgba(168,85,247,0.95))",
          borderRadius: 24,
          padding: "28px 34px",
          textAlign: "center",
          color: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          animation: "matchPop 420ms cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 6 }}>💘✨</div>
        <div style={{ fontSize: 22, fontWeight: 900 }}>It's a match!</div>
        <div style={{ fontSize: 13, opacity: 0.9, marginTop: 6 }}>
          {name ? `You and ${name} saved each other` : "You saved each other"}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 10 }}>(tap anywhere to close)</div>
      </div>
    </div>
  );
}

function ProfileCard({ p, isFav, onToggleFav, onOpenImage }) {
  const navigate = useNavigate();
  const [imgOk, setImgOk] = useState(true);

  const fallback = `${PLACEHOLDER_AVATAR_URL}&seed=${encodeURIComponent(p.username || "Ace")}`;
  const imgSrc = imgOk && p.image_url ? p.image_url : fallback;

  return (
    <div
      style={S.card}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={S.cardTop}>
        <div style={S.avatar}>
          <button
            type="button"
            onClick={() => onOpenImage(imgSrc)}
            style={{
              all: "unset",
              cursor: "pointer",
              width: "100%",
              height: "100%",
              display: "block",
            }}
            title="Open image"
          >
            <img src={imgSrc} alt="profile" style={S.avatarImg} onError={() => setImgOk(false)} />
          </button>
        </div>

        <button
          type="button"
          style={{ ...S.favBtn, ...(isFav ? S.favBtnActive : null) }}
          onClick={onToggleFav}
          title={isFav ? "Unfavorite" : "Favorite"}
        >
          {isFav ? "★" : "☆"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, padding: "0 14px 14px" }}>
        <button type="button" style={S.secondaryBtn} onClick={() => navigate(`/writelatter/${p._id}`)}>
          Write a massage
        </button>
      </div>

      <div style={S.cardBody}>
        <div style={S.nameRow}>
          <div style={S.name}>{p.name}</div>
          <div style={S.user}>@{p.username}</div>
        </div>

        <div style={S.badges}>
          <span style={S.badge}>{p.age ?? "?"}</span>
          <span style={S.badge}>{p.gender ?? "—"}</span>
          <span style={S.badge}>{p.city ?? "—"}</span>
        </div>

        <div style={S.detailRow}>
          <div style={S.detailKey}>Orientation</div>
          <div style={S.detailVal}>{p.orientation ?? "—"}</div>
        </div>

        <div style={S.detailRow}>
          <div style={S.detailKey}>Looking for</div>
          <div style={S.detailVal}>{p.looking_for ?? "—"}</div>
        </div>

        {p.info ? (
          <div style={S.block}>
            <div style={S.blockTitle}>Info</div>
            <div style={S.blockText}>{p.info}</div>
          </div>
        ) : null}

        {p.contact ? (
          <div style={S.block}>
            <div style={S.blockTitle}>Contact</div>
            <div style={S.blockText}>{p.contact}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function pickRandom(list) {
  if (!list?.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

export default function Homepage() {
  const navigate = useNavigate();
  const myId = useMemo(() => String(localStorage.getItem("user_id") || ""), []);

  useEffect(() => {
    ensureHomepageStyles();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    if (!token || !userId) navigate("/", { replace: true });
  }, [navigate]);

  // Lightbox (big image)
  const [lightbox, setLightbox] = useState(null); // { url, title } | null
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Data
  const [profiles, setProfiles] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // One shown profile
  const [shown, setShown] = useState(null);

  // Favorites
  const [likedIds, setLikedIds] = useState(() => new Set());

  // ✅ NEW — match celebration popup state
  const [matchCelebration, setMatchCelebration] = useState(null); // { name } | null

  useEffect(() => {
    if (!myId) return;

    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/likes/${myId}`);
        const liked = Array.isArray(res.data?.liked) ? res.data.liked : [];
        setLikedIds(new Set(liked.map(String)));
      } catch (e) {
        console.error("Failed to load liked ids", e);
        setLikedIds(new Set());
      }
    })();
  }, [myId]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(likedIds)));
  }, [likedIds]);

  // Fetch ALL profiles once, then choose a random one
  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);

        // If your backend supports big limits, this is simplest.
        // Otherwise, tell me and I’ll adapt to cursor pagination properly.
        const params = { limit: 24 };
        const res = await axios.get(`${API_BASE}/api/allprofiles`, { params, headers: { "X-User-Id": myId } })
        const items = Array.isArray(res.data?.items) ? res.data.items : [];

        // remove self
        const pool = items.filter((p) => !(myId && String(p._id) === myId));

        setProfiles(pool);
        setShown(pickRandom(pool));
      } catch (e) {
        console.error(e);
        setProfiles([]);
        setShown(null);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [myId]);

  const showAnother = () => {
    if (!profiles.length) return;

    // try to avoid showing the same one twice in a row
    if (profiles.length === 1) return setShown(profiles[0]);

    let next = pickRandom(profiles);
    let guard = 0;
    while (shown && next && String(next._id) === String(shown._id) && guard < 10) {
      next = pickRandom(profiles);
      guard += 1;
    }
    setShown(next);
  };

  // ✅ CHANGED — accepts profileName so the popup can say who you matched with,
  // and reads res.data.match from the backend to know whether to celebrate.
  const toggleFavorite = async (profileId, profileName) => {
    if (!myId) return;

    const token = localStorage.getItem("token");
    const pid = String(profileId);
    const alreadyLiked = likedIds.has(pid);

    setLikedIds((prev) => {
      const next = new Set(prev);
      if (alreadyLiked) next.delete(pid);
      else next.add(pid);
      return next;
    });

    try {
      const headers = { "X-User-Id": myId, "X-Session-Token": token };
      if (alreadyLiked) {
        await axios.delete(`${API_BASE}/api/likes/${myId}/${pid}`, { headers });
      } else {
        const res = await axios.post(`${API_BASE}/api/likes/${myId}/${pid}`, {}, { headers });
        if (res.data?.match) {
          setMatchCelebration({ name: profileName }); // ✅ NEW
        }
      }
    } catch (e) {
      console.error(e);
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (alreadyLiked) next.add(pid);
        else next.delete(pid);
        return next;
      });
    }
  };

  return (
    <div style={S.page}>
      <TopBar
         links={[
    { to: "/home", label: "Home" },
    { to: "/profile", label: "My Profile" },
    { to: "/saved", label: "Saved" },
    { to: "/random", label: "Let luck choose" },
    { to: "/latters", label: "Inbox" },
    { to: "/info", label: "Info & Contact" },
  ]}
      />

      {/* ✅ NEW — match celebration popup */}
      <MatchCelebration
        show={!!matchCelebration}
        name={matchCelebration?.name}
        onClose={() => setMatchCelebration(null)}
      />

      <main style={{ padding: "14px" }}>
        {/* Lightbox */}
        {lightbox && (
          <div style={S.overlay} onMouseDown={() => setLightbox(null)}>
            <div style={S.modal} onMouseDown={(e) => e.stopPropagation()}>
              <div style={S.modalTop}>
                <div style={S.modalTitle}>{lightbox.title || "Profile image"}</div>
                <button type="button" style={S.modalClose} onClick={() => setLightbox(null)} aria-label="Close">
                  ×
                </button>
              </div>

              <div style={S.modalBody}>
                <div style={S.modalImgWrap}>
                  <img src={lightbox.url} alt="profile large" style={S.modalImg} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={S.shell}>
          <div style={S.resultsHeader}>
            <div style={S.resultsTitle}>Random Profile</div>
            <div style={S.resultsMeta}>
              {initialLoading ? "Fetching profiles…" : profiles.length ? `${profiles.length} profiles in pool` : "No profiles"}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 12, backgroundColor: "purple", width: 50 }}>
            <button type="button" style={S.primaryBtn} onClick={showAnother} disabled={!profiles.length}>
              Show another
            </button>
          </div>

          {initialLoading ? (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <div>Loading…</div>
            </div>
          ) : shown ? (
            <div style={{ maxWidth: 520 }}>
              <ProfileCard
                p={shown}
                isFav={likedIds.has(String(shown._id))}
                onToggleFav={() => toggleFavorite(shown._id, shown.name || shown.username)}
                onOpenImage={(url) =>
                  setLightbox({
                    url,
                    title: shown.name ? `${shown.name} (@${shown.username})` : `@${shown.username}`,
                  })
                }
              />
            </div>
          ) : (
            <div style={S.empty}>
              <div style={S.emptyTitle}>No profiles to show</div>
              <div style={S.emptyText}>Create some profiles first, or make sure your API returns items.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}