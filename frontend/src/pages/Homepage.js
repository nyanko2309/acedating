// src/pages/Homepage.js

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import TopBar from "./TopBar";

import { useNavigate } from "react-router-dom";
import { S, ensureHomepageStyles, PLACEHOLDER_AVATAR_URL } from "./homepageStyles";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";
const PAGE_SIZE = 24;
const ORIENTATION_OPTIONS = ["Ace", "Aro", "Aroace", "Demi", "Grey-asexual"];
const LOOKING_FOR_OPTIONS = ["Friendship", "Monogamy-romance", "Qpr", "Polyamory-romance"];
const GENDER_OPTIONS = ["Man", "Woman", "Non-binary", "Other"];
const CITY_OPTIONS = [
  { value: "gush-dan", label: "Gush Dan (Tel Aviv / Ramat Gan / Holon / Bat Yam...)" },
  { value: "jerusalem-area", label: "Jerusalem area" },
  { value: "hasharon", label: "HaSharon (Herzliya / Raanana / Kfar Saba / Netanya)" },
  { value: "shfela", label: "HaShfela (Rishon / Rehovot / Ramla / Lod)" },
  { value: "haifa-krayot", label: "Haifa & Krayot" },
  { value: "north-galilee-golan", label: "North (Galilee / Golan)" },
  { value: "south-coast", label: "South coast (Ashdod / Ashkelon)" },
  { value: "negev-beer-sheva", label: "Negev (Beer Sheva area)" },
  { value: "eilat-arava", label: "Eilat / Arava" },
  { value: "other-israel", label: "Other / Not sure" },
];
const ROMANTIC_ORIENTATION_OPTIONS = [
  "Aromantic",
  "Demiromantic",
  "Grey-romantic",
  "Heteroromantic",
  "Homoromantic",
  "Biromantic",
  "Panromantic",
  "Queerromantic",
  "Questioning",
  "Other",
];

function normalizeText(x) {
  return (x ?? "").toString().toLowerCase();
}

function clampNum(val, min, max) {
  const n = Number(val);
  if (Number.isNaN(n)) return "";
  return Math.min(max, Math.max(min, n));
}

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

/** MultiSelect dropdown with checkboxes + chips */
function MultiSelect({ label, options, valueSet, onChangeSet, placeholder = "Any" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selectedCount = valueSet.size;
  const isActive = open || selectedCount > 0;

  const toggle = (v) => {
    const next = new Set(valueSet);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChangeSet(next);
  };

  const clear = () => onChangeSet(new Set());

  const selectedLabels = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o.label]));
    return Array.from(valueSet).map((v) => ({ value: v, label: map.get(v) ?? v }));
  }, [options, valueSet]);

  return (
    <div style={S.msWrap} ref={ref}>
      <div style={S.msLabel}>{label}</div>

      <button
        type="button"
        className="__hp_ms_button__"
        style={{ ...S.msButton, ...(isActive ? S.msButtonActive : null) }}
        onClick={() => setOpen((x) => !x)}
        title={selectedCount ? `${selectedCount} selected` : "None selected"}
      >
        <div style={S.msButtonLeft}>
          <span style={S.msButtonTitle}>{selectedCount ? `${selectedCount} selected` : placeholder}</span>
        </div>
        <span style={{ ...S.chev, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
      </button>

      {open && (
        <div style={S.msPanel}>
          <div style={S.msPanelTop}>
            <div style={S.msPanelHint}>Pick multiple</div>
            <button type="button" style={S.linkBtn} onClick={clear}>
              Clear
            </button>
          </div>

          <div style={S.msList}>
            {options.map((o) => (
              <label key={o.value} style={S.msRow}>
                <input
                  type="checkbox"
                  checked={valueSet.has(o.value)}
                  onChange={() => toggle(o.value)}
                  style={S.msCheck}
                />
                <span style={S.msRowText}>{o.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedLabels.length > 0 && (
        <div style={S.chips}>
          {selectedLabels.map((x) => (
            <button key={x.value} type="button" style={S.chip} onClick={() => toggle(x.value)} title="Remove">
              {x.label} <span style={S.chipX}>×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileCard({ p, isFav, onToggleFav, onOpenImage, onWriteMessage }) {
  const [imgOk, setImgOk] = useState(true);
  const fallback = `${PLACEHOLDER_AVATAR_URL}&seed=${encodeURIComponent(p.username || "Ace")}`;
  const imgSrc = imgOk && p.image_url ? p.image_url : fallback;

  return (
    <div style={S.card} className="__hp_card__">
      {/* Avatar + display name + username on the left, compact actions on the right */}
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

        <div style={S.nameBlock}>
          <div style={S.name}>{p.name}</div>
          <div style={S.user}>@{p.username}</div>
        </div>

        <div style={S.headerActions}>
          <button type="button" className="__hp_msg_btn__" style={S.msgBtnCompact} onClick={onWriteMessage}>
            Message
          </button>
          <button
            type="button"
            className={`__hp_fav_btn__ ${isFav ? "__hp_fav_btn_active__" : ""}`}
            style={{ ...S.favBtn, ...(isFav ? S.favBtnActive : null) }}
            onClick={onToggleFav}
            title={isFav ? "Saved" : "Save"}
          >
            {isFav ? "★" : "☆"}
          </button>
        </div>
      </div>

      <div style={S.cardBody}>
        {/* 3. Short profile summary / tags */}
        <div style={S.badges}>
          <span style={S.badge}>{p.age ?? "?"}</span>
          <span style={S.badge}>{p.gender ?? "—"}</span>
          <span style={S.badge}>{p.city ?? "—"}</span>
        </div>

        {/* 4. Orientation / romantic orientation / looking for */}
        <div style={S.detailGrid}>
          <div style={S.detailRow}>
            <div style={S.detailKey}>Orientation</div>
            <div style={S.detailVal}>{p.orientation ?? "—"}</div>
          </div>
          <div style={S.detailRow}>
            <div style={S.detailKey}>Romantic orientation</div>
            <div style={S.detailVal}>{p.romantic_orientation ?? "—"}</div>
          </div>
          <div style={S.detailRow}>
            <div style={S.detailKey}>Looking for</div>
            <div style={S.detailVal}>{p.looking_for ?? "—"}</div>
          </div>
        </div>

        {/* 5. About section */}
        {p.info ? (
          <div style={S.aboutSection}>
            <div style={S.aboutTitle}>About</div>
            <div style={S.aboutText}>{p.info}</div>
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

export default function Homepage() {
  const navigate = useNavigate();
  const myId = useMemo(() => String(localStorage.getItem("user_id") || ""), []);

  useEffect(() => {
    ensureHomepageStyles();
  }, []);

  // ---- Real session verification (not just "is something in localStorage") ----
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/verify-session`, {
          headers: { "X-User-Id": userId, "X-Session-Token": token },
        });
        if (!res.data?.valid) throw new Error("invalid session");
        setSessionChecked(true);
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate("/", { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // Lightbox (big image)
  const [lightbox, setLightbox] = useState(null); // { url, title } | null

  // Filters modal open/closed
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ✅ NEW — match celebration popup state
  const [matchCelebration, setMatchCelebration] = useState(null); // { name } | null

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setLightbox(null);
        setFiltersOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Data + pagination
  const [profiles, setProfiles] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Search
  const [q, setQ] = useState("");

  // Multi-choice filters as Sets
  const [citySet, setCitySet] = useState(() => new Set());
  const [orientationSet, setOrientationSet] = useState(() => new Set());
  const [lookingForSet, setLookingForSet] = useState(() => new Set());
  const [genderSet, setGenderSet] = useState(() => new Set());
  const [romanticOrientationSet, setRomanticOrientationSet] = useState(() => new Set());
  // Age range
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");

  // Which profile (in the filtered list) is currently shown
  const [currentIndex, setCurrentIndex] = useState(0);

  // Swipe/save animation state
  const [slideDir, setSlideDir] = useState("right"); // "right" (next) | "left" (prev)
  const [animKey, setAnimKey] = useState(0);
  const [heartBurst, setHeartBurst] = useState(false);

  // Favorites (local-only MVP)
  const [likedIds, setLikedIds] = useState(() => new Set());

  useEffect(() => {
    if (!myId || !sessionChecked) return;

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
  }, [myId, sessionChecked]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(Array.from(likedIds)));
  }, [likedIds]);

  const fetchPage = async (reset = false) => {
    if (!reset && (loadingMore || !hasMore)) return;

    try {
      if (reset) {
        setInitialLoading(true);
        setLoadingMore(false);
        setProfiles([]);
        setCursor(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const params = { limit: PAGE_SIZE };
      if (!reset && cursor) params.cursor = cursor;

      const res = await axios.get(`${API_BASE}/api/allprofiles`, { params, headers: { "X-User-Id": myId } });

      const items = Array.isArray(res.data?.items) ? res.data.items : [];
      const next = res.data?.next_cursor ?? null;
      const more = !!res.data?.has_more;

      setProfiles((prev) => (reset ? items : [...prev, ...items]));
      setCursor(next);
      setHasMore(more);
    } catch (e) {
      console.error(e);
      if (reset) setProfiles([]);
      setHasMore(false);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load — wait until session is verified
  useEffect(() => {
    if (!sessionChecked) return;
    fetchPage(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionChecked]);

  const filtered = useMemo(() => {
    const qq = normalizeText(q).trim();

    return profiles.filter((p) => {
      if (myId && String(p._id) === myId) return false;
      const pCity = (p.city ?? "").toString();
      const pOri = (p.orientation ?? "").toString();
      const pLF = (p.looking_for ?? "").toString();
      const pGender = (p.gender ?? "").toString();
      const pAge = Number(p.age);
      const pRom = (p.romantic_orientation ?? "").toString();

      if (citySet.size && !citySet.has(pCity)) return false;
      if (orientationSet.size && !orientationSet.has(pOri)) return false;
      if (lookingForSet.size && !lookingForSet.has(pLF)) return false;
      if (genderSet.size && !genderSet.has(pGender)) return false;
      if (romanticOrientationSet.size && !romanticOrientationSet.has(pRom)) return false;

      if (ageMin !== "" && !Number.isNaN(pAge) && pAge < Number(ageMin)) return false;
      if (ageMax !== "" && !Number.isNaN(pAge) && pAge > Number(ageMax)) return false;

      if (qq) {
        const blob = [p.username, p.name, p.city, p.orientation, p.looking_for, p.gender, p.info, p.contact, p.romantic_orientation]
          .map(normalizeText)
          .join(" ");
        if (!blob.includes(qq)) return false;
      }

      return true;
    });
  }, [profiles, q, citySet, orientationSet, lookingForSet, genderSet, ageMin, ageMax, romanticOrientationSet]);

  const totalPosts = filtered.length;

  // Reset to the first profile whenever the filter/search criteria change
  useEffect(() => {
    setCurrentIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, citySet, orientationSet, lookingForSet, genderSet, romanticOrientationSet, ageMin, ageMax]);

  // Prefetch more profiles as the user nears the end of the current filtered list
  useEffect(() => {
    if (initialLoading) return;
    const remaining = filtered.length - currentIndex;
    if (remaining <= 5 && hasMore && !loadingMore) {
      fetchPage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, filtered.length, hasMore, loadingMore, initialLoading]);

  // ✅ CHANGED — accepts profileName so the popup can say who you matched with,
  // and reads res.data.match from the backend to know whether to celebrate.
  const toggleFavorite = async (profileId, profileName) => {
    if (!myId) return;

    const token = localStorage.getItem("token");
    const pid = String(profileId);
    const alreadyLiked = likedIds.has(pid);

    // optimistic UI
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
      // rollback
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (alreadyLiked) next.add(pid);
        else next.delete(pid);
        return next;
      });
    }
  };

  // Advance to the next profile — loops back to the first profile at the end
  const goNext = () => {
    setSlideDir("right");
    setAnimKey((k) => k + 1);
    setCurrentIndex((i) => {
      if (filtered.length === 0) return 0;
      return (i + 1) % filtered.length;
    });
  };

  const goPrev = () => {
    setSlideDir("left");
    setAnimKey((k) => k + 1);
    setCurrentIndex((i) => {
      if (filtered.length === 0) return 0;
      return (i - 1 + filtered.length) % filtered.length;
    });
  };

  // Save = favorite this profile (with a little celebration) + move to the next one
  // ✅ CHANGED — accepts profileName, passes it to toggleFavorite
  const handleSave = async (profileId, profileName) => {
    setHeartBurst(true);
    window.setTimeout(() => setHeartBurst(false), 700);
    await toggleFavorite(profileId, profileName);
    goNext();
  };

  const clearFilters = () => {
    setQ("");
    setCitySet(new Set());
    setOrientationSet(new Set());
    setLookingForSet(new Set());
    setGenderSet(new Set());
    setAgeMin("");
    setAgeMax("");
    setRomanticOrientationSet(new Set());
  };

  const cityOptions = useMemo(() => CITY_OPTIONS, []);
  const orientationOptions = useMemo(() => ORIENTATION_OPTIONS.map((x) => ({ value: x, label: x })), []);
  const lookingForOptions = useMemo(
    () => LOOKING_FOR_OPTIONS.map((x) => ({ value: x, label: x.replaceAll("-", " ") })),
    []
  );
  const genderOptions = useMemo(() => GENDER_OPTIONS.map((x) => ({ value: x, label: x.replaceAll("-", " ") })), []);
  const romanticOrientationOptions = useMemo(
    () => ROMANTIC_ORIENTATION_OPTIONS.map((x) => ({ value: x, label: x })),
    []
  );

  const activeFilterCount =
    citySet.size +
    orientationSet.size +
    lookingForSet.size +
    genderSet.size +
    romanticOrientationSet.size +
    (ageMin !== "" ? 1 : 0) +
    (ageMax !== "" ? 1 : 0);

  const current = filtered[currentIndex];
  const isOutOfProfiles = !initialLoading && filtered.length === 0;

  // Don't render the page at all until we've confirmed the session is real
  if (!sessionChecked) {
    return (
      <div style={S.page}>
        <main style={{ padding: "14px" }}>
          <div style={S.shell}>
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <div>Checking your session…</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

        {/* Filters modal */}
        {filtersOpen && (
          <div style={S.overlay} onMouseDown={() => setFiltersOpen(false)}>
            <div style={S.filterModalCard} onMouseDown={(e) => e.stopPropagation()}>
              <div style={S.filtersHeader}>
                <div>
                  <div style={S.filtersTitle}>Search & Filters</div>
                  <div style={S.filtersHint}>
                    All filters are multi-select. If you pick none, it means “any”.
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" className="__hp_secondary_btn__" style={S.secondaryBtn} onClick={clearFilters}>
                    Clear all
                  </button>
                  <button type="button" style={S.modalClose} onClick={() => setFiltersOpen(false)} aria-label="Close">
                    ×
                  </button>
                </div>
              </div>

              <div style={S.filterModalBody}>
                <div style={S.filtersGrid}>
                  <div style={S.searchWrap}>
                    <div style={S.msLabel}>Search</div>
                    <div style={S.searchRow}>
                      <input
                        style={S.searchInput}
                        placeholder="type… (name, city, info, contact, etc)"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                      />
                    </div>
                  </div>

                  <MultiSelect label="City / Area" options={cityOptions} valueSet={citySet} onChangeSet={setCitySet} placeholder="Any area" />
                  <MultiSelect label="Orientation" options={orientationOptions} valueSet={orientationSet} onChangeSet={setOrientationSet} placeholder="Any orientation" />
                  <MultiSelect label="Looking for" options={lookingForOptions} valueSet={lookingForSet} onChangeSet={setLookingForSet} placeholder="Any" />
                  <MultiSelect label="Gender" options={genderOptions} valueSet={genderSet} onChangeSet={setGenderSet} placeholder="Any" />
                  <MultiSelect label="Romantic orientation" options={romanticOrientationOptions} valueSet={romanticOrientationSet} onChangeSet={setRomanticOrientationSet} placeholder="Any romantic orientation" />

                  <div style={S.ageWrap}>
                    <div style={S.msLabel}>Age range</div>
                    <div style={S.ageRow}>
                      <input
                        style={S.ageInput}
                        type="number"
                        value={ageMin}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "" || /^\d+$/.test(v)) setAgeMin(v);
                        }}
                        onBlur={() => {
                          if (ageMin === "") return;
                          setAgeMin(String(clampNum(ageMin, 18, 120)));
                        }}
                      />
                      <span style={S.ageDash}>—</span>
                      <input
                        style={S.ageInput}
                        type="number"
                        value={ageMax}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "" || /^\d+$/.test(v)) setAgeMax(v);
                        }}
                        onBlur={() => {
                          if (ageMax === "") return;
                          setAgeMax(String(clampNum(ageMax, 18, 120)));
                        }}
                      />
                    </div>
                    <div style={S.ageHint}>Tip: set only min or max if you want</div>
                  </div>
                </div>

                <button type="button" style={{ ...S.primaryBtn, width: "100%", marginTop: 16 }} onClick={() => setFiltersOpen(false)}>
                  Show {totalPosts} result{totalPosts === 1 ? "" : "s"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={S.shell}>
          {/* Unified search + filters toolbar */}
          <div style={S.controlBar}>
            <div style={S.searchInputWrap}>
              <span style={S.searchIcon}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                className="__hp_quick_search__"
                style={S.quickSearchInput}
                placeholder="Quick search…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="__hp_filter_btn__"
              style={{ ...S.filterToggleBtn, ...(filtersOpen || activeFilterCount ? S.filterToggleBtnActive : null) }}
              onClick={() => setFiltersOpen(true)}
            >
              ⚙ Filters{activeFilterCount ? ` · ${activeFilterCount}` : ""}
            </button>
          </div>

          <div style={S.resultsHeader}>
            <div style={S.resultsMeta}>
              {initialLoading
                ? "Fetching profiles…"
                : current
                ? `Profile ${currentIndex + 1} of ${totalPosts}`
                : `${totalPosts} match${totalPosts === 1 ? "" : "es"}`}
            </div>
          </div>

          {initialLoading ? (
            <div style={S.loadingBox}>
              <div style={S.spinner} />
              <div>Loading…</div>
            </div>
          ) : current ? (
            <div style={S.swipeRow}>
              <button
                type="button"
                className="__hp_side_nav__"
                style={S.sideNavBtn}
                onClick={goPrev}
                aria-label="Previous profile"
              >
                ‹
              </button>

              <div style={S.singleCardWrap}>
                <div style={S.stackCardFar} />
                <div style={S.stackCardNear} />

                <div
                  key={animKey}
                  className={slideDir === "right" ? "__hp_fan_right__" : "__hp_fan_left__"}
                  style={S.cardAnimWrap}
                >
                  <ProfileCard
                    key={current._id}
                    p={current}
                    isFav={likedIds.has(String(current._id))}
                    onToggleFav={() => handleSave(current._id, current.name || current.username)}
                    onWriteMessage={() => navigate(`/writelatter/${current._id}`)}
                    onOpenImage={(url) =>
                      setLightbox({
                        url,
                        title: current.name ? `${current.name} (@${current.username})` : `@${current.username}`,
                      })
                    }
                  />

                  {heartBurst && (
                    <>
                      <div className="__hp_heart_ring__" />
                      <div className="__hp_heart_burst__">★</div>
                    </>
                  )}
                </div>

                {loadingMore && (
                  <div style={{ ...S.loadingBox, marginTop: 12 }}>
                    <div style={S.spinner} />
                    <div>Loading more…</div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="__hp_side_nav__"
                style={S.sideNavBtn}
                onClick={goNext}
                aria-label="Next profile"
              >
                ›
              </button>
            </div>
          ) : (
            <div style={S.empty}>
              <div style={S.emptyTitle}>{isOutOfProfiles ? "No matches" : "Loading…"}</div>
              <div style={S.emptyText}>
                {hasMore
                  ? "Loading more profiles…"
                  : "Try clearing some filters, widening the age range, or searching fewer words."}
              </div>
              <button type="button" className="__hp_secondary_btn__" style={S.secondaryBtn} onClick={clearFilters}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}