// src/pages/Homepage.js

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import TopBar from "./TopBar";
import { useNavigate } from "react-router-dom";
import { S, ensureHomepageStyles, PLACEHOLDER_AVATAR_URL } from "./homepageStyles";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

const PAGE_SIZE = 24;
const ORIENTATION_OPTIONS = ["ace", "aro", "aroace", "demi", "grey-asexual"];
const LOOKING_FOR_OPTIONS = ["friendship", "monogamy-romance", "qpr", "polyamory-romance"];
const GENDER_OPTIONS = ["male", "female", "non-binary", "other"];
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

function normalizeText(x) {
  return (x ?? "").toString().toLowerCase();
}

function clampNum(val, min, max) {
  const n = Number(val);
  if (Number.isNaN(n)) return "";
  return Math.min(max, Math.max(min, n));
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
        style={S.msButton}
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

function ProfileCard({ p, isFav, onToggleFav, onOpenImage }) {
  const [imgOk, setImgOk] = useState(true);

  const fallback = `${PLACEHOLDER_AVATAR_URL}&seed=${encodeURIComponent(p.username || "ace")}`;
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

export default function Savedpage() {
  const navigate = useNavigate();
  const myId = useMemo(() => String(localStorage.getItem("user_id") || ""), []);

  useEffect(() => {
    ensureHomepageStyles();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    if (!token || !userId) navigate("/", { replace: true }); // your login route is "/"
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

  // Data + pagination
  const [profiles, setProfiles] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Search
  const [q, setQ] = useState("");

  // Multi-choice filters as Sets
  const [citySet, setCitySet] = useState(() => new Set());
  const [orientationSet, setOrientationSet] = useState(() => new Set());
  const [lookingForSet, setLookingForSet] = useState(() => new Set());
  const [genderSet, setGenderSet] = useState(() => new Set());

  // Age range
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");

  // Favorites (local-only MVP)
// ✅ Likes from Mongo
const [likedIds, setLikedIds] = useState(() => new Set());

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

 const fetchSaved = async () => {
  try {
    setInitialLoading(true);
    const res = await axios.get(`${API_BASE}/api/profilessaved/${myId}`);
    console.log("Res items:", res);
    const items = Array.isArray(res.data?.items) ? res.data.items : [];
    setProfiles(items);
    console.log("SAVED items:", items);
  } catch (e) {
    console.error(e);
    setProfiles([]);
    
  } finally {
    setInitialLoading(false);
  }
};

useEffect(() => {
  if (!myId) return;
  fetchSaved();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [myId]);

  const filtered = useMemo(() => {
    const qq = normalizeText(q).trim();

    return profiles.filter((p) => {
     if (myId && String(p._id) === myId) return false;
      const pCity = (p.city ?? "").toString();
      const pOri = (p.orientation ?? "").toString();
      const pLF = (p.looking_for ?? "").toString();
      const pGender = (p.gender ?? "").toString();
      const pAge = Number(p.age);

      if (citySet.size && !citySet.has(pCity)) return false;
      if (orientationSet.size && !orientationSet.has(pOri)) return false;
      if (lookingForSet.size && !lookingForSet.has(pLF)) return false;
      if (genderSet.size && !genderSet.has(pGender)) return false;

      if (ageMin !== "" && !Number.isNaN(pAge) && pAge < Number(ageMin)) return false;
      if (ageMax !== "" && !Number.isNaN(pAge) && pAge > Number(ageMax)) return false;

      if (qq) {
        const blob = [p.username, p.name, p.city, p.orientation, p.looking_for, p.gender, p.info, p.contact]
          .map(normalizeText)
          .join(" ");
        if (!blob.includes(qq)) return false;
      }

      return true;
    });
  }, [profiles, q, citySet, orientationSet, lookingForSet, genderSet, ageMin, ageMax]);

  const totalPosts = filtered.length;

  const toggleFavorite = async (profileId) => {
  if (!myId) return;

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
    if (alreadyLiked) {
      await axios.delete(`${API_BASE}/api/likes/${myId}/${pid}`);
    } else {
      await axios.post(`${API_BASE}/api/likes/${myId}/${pid}`);
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

  const clearFilters = () => {
    setQ("");
    setCitySet(new Set());
    setOrientationSet(new Set());
    setLookingForSet(new Set());
    setGenderSet(new Set());
    setAgeMin("");
    setAgeMax("");
  };

  const cityOptions = useMemo(() => CITY_OPTIONS, []);
  const orientationOptions = useMemo(() => ORIENTATION_OPTIONS.map((x) => ({ value: x, label: x })), []);
  const lookingForOptions = useMemo(
    () => LOOKING_FOR_OPTIONS.map((x) => ({ value: x, label: x.replaceAll("-", " ") })),
    []
  );
  const genderOptions = useMemo(() => GENDER_OPTIONS.map((x) => ({ value: x, label: x.replaceAll("-", " ") })), []);

return (
  <div style={S.page}>
    <TopBar
  links={[
    { to: "/home", label: "Home" },
    { to: "/profile", label: "My Profile" },
    { to: "/saved", label: "Saved" },
  ]}
  />

    <main style={{ padding: "14px" }}>
      {/* Lightbox */}
      {lightbox && (
        <div style={S.overlay} onMouseDown={() => setLightbox(null)}>
          <div style={S.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={S.modalTop}>
              <div style={S.modalTitle}>{lightbox.title || "Profile image"}</div>
              <button
                type="button"
                style={S.modalClose}
                onClick={() => setLightbox(null)}
                aria-label="Close"
              >
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
        {/* Filters card */}
        <div style={S.filtersCard}>
          <div style={S.filtersHeader}>
            <div>
              <div style={S.filtersTitle}>Search & Filters</div>
              <div style={S.filtersHint}>
                All filters are multi-select. If you pick none, it means “any”.
              </div>
            </div>

            <button type="button" style={S.secondaryBtn} onClick={clearFilters}>
              Clear all
            </button>
          </div>

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
                <button type="button" style={S.primaryBtn} onClick={() => {}}>
                  Search
                </button>
              </div>
            </div>

            <MultiSelect label="City / Area" options={cityOptions} valueSet={citySet} onChangeSet={setCitySet} placeholder="Any area" />
            <MultiSelect label="Orientation" options={orientationOptions} valueSet={orientationSet} onChangeSet={setOrientationSet} placeholder="Any orientation" />
            <MultiSelect label="Looking for" options={lookingForOptions} valueSet={lookingForSet} onChangeSet={setLookingForSet} placeholder="Any" />
            <MultiSelect label="Gender" options={genderOptions} valueSet={genderSet} onChangeSet={setGenderSet} placeholder="Any" />

            <div style={S.ageWrap}>
              <div style={S.msLabel}>Age range</div>
              <div style={S.ageRow}>
                <input
                  style={S.ageInput}
                  type="number"
                  min="18"
                  max="120"
                  value={ageMin}
                  onChange={(e) =>
                    setAgeMin(e.target.value === "" ? "" : String(clampNum(e.target.value, 18, 120)))
                  }
                />
                <span style={S.ageDash}>—</span>
                <input
                  style={S.ageInput}
                  type="number"
                  min="18"
                  max="120"
                  value={ageMax}
                  onChange={(e) =>
                    setAgeMax(e.target.value === "" ? "" : String(clampNum(e.target.value, 18, 120)))
                  }
                />
              </div>
              <div style={S.ageHint}>Tip: set only min or max if you want</div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={S.resultsHeader}>
          <div style={S.resultsTitle}>Results</div>
          <div style={S.resultsMeta}>
            {initialLoading ? "Fetching profiles…" : `Showing ${totalPosts} of ${profiles.length}`}
          </div>
        </div>

        {initialLoading ? (
          <div style={S.loadingBox}>
            <div style={S.spinner} />
            <div>Loading…</div>
          </div>
        ) : filtered.length ? (
          <>
            <div style={S.grid} className="__hp_grid__">
              {filtered.map((p) => (
                <ProfileCard
                  key={p._id}
                  p={p}
                  isFav={likedIds.has(String(p._id))}
                  onToggleFav={() => toggleFavorite(p._id)}
                  onOpenImage={(url) =>
                    setLightbox({
                      url,
                      title: p.name ? `${p.name} (@${p.username})` : `@${p.username}`,
                    })
                  }
                />
              ))}
            </div>

          </>
        ) : (
          <div style={S.empty}>
            <div style={S.emptyTitle}>No matches</div>
            <div style={S.emptyText}>
              Try clearing some filters, widening the age range, or searching fewer words.
            </div>
            <button type="button" style={S.secondaryBtn} onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  </div>
);
}
