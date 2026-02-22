import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TopBar from "./TopBar";

const API_BASE = "http://127.0.0.1:8000";

export default function ProfilePage() {
  const userId = useMemo(() => localStorage.getItem("user_id"), []);
  const token = useMemo(() => localStorage.getItem("token"), []);

  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);

  // ✅ avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);

  // editable fields
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [orientation, setOrientation] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [info, setInfo] = useState("");
  const [contact, setContact] = useState("");

  // ✅ store both url + public_id so we can delete old image later
  const [imageUrl, setImageUrl] = useState("");
  const [imagePublicId, setImagePublicId] = useState("");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId ? { "X-User-Id": userId } : {}),
  };

  const PROFILE_URL = userId ? `${API_BASE}/api/profile/${userId}` : null;

  async function uploadAvatarToCloudinary(file) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Missing Cloudinary env vars. Add REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET in .env, then restart React."
      );
    }

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: form }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Cloudinary upload failed");

    return { url: data.secure_url, publicId: data.public_id };
  }

  useEffect(() => {
    if (!userId) {
      window.location.href = "/";
      return;
    }

    let alive = true;

    async function fetchProfile() {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(PROFILE_URL, { headers });
        if (!alive) return;

        const p = res.data;
        setProfile(p);

        setUsername(p?.username || "");
        setName(p?.name || "");
        setAge(p?.age ?? "");
        setCity(p?.city || "");
        setGender(p?.gender || "");
        setOrientation(p?.orientation || "");
        setLookingFor(p?.looking_for || "");
        setInfo(p?.info || "");
        setContact(p?.contact || "");

        setImageUrl(p?.image_url || "");
        setImagePublicId(p?.image_public_id || "");
      } catch (err) {
        const msg = err?.response?.data?.error || err.message || "Failed to load profile";
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      alive = false;
    };
  }, [userId, PROFILE_URL]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelEdit = () => {
    if (!profile) return;
    setEdit(false);

    setUsername(profile?.username || "");
    setName(profile?.name || "");
    setAge(profile?.age ?? "");
    setCity(profile?.city || "");
    setGender(profile?.gender || "");
    setOrientation(profile?.orientation || "");
    setLookingFor(profile?.looking_for || "");
    setInfo(profile?.info || "");
    setContact(profile?.contact || "");

    setImageUrl(profile?.image_url || "");
    setImagePublicId(profile?.image_public_id || "");
    setAvatarFile(null);
  };

  const saveProfile = async () => {
    setSaving(true);
    setError("");

    const oldPublicId = profile?.image_public_id || "";

    try {
      let finalUrl = imageUrl || "";
      let finalPublicId = imagePublicId || "";

      // ✅ if file selected, upload and override imageUrl/publicId
      if (avatarFile) {
        setUploadingAvatar(true);
        const up = await uploadAvatarToCloudinary(avatarFile);
        finalUrl = up.url;
        finalPublicId = up.publicId;
        setUploadingAvatar(false);
      }

      // 1) save new profile data in DB (including public_id)
      const payload = {
        username,
        name,
        age: age === "" ? null : Number(age),
        city,
        gender,
        orientation,
        looking_for: lookingFor,
        info,
        contact,
        image_url: finalUrl,
        image_public_id: finalPublicId,
      };

      const res = await axios.put(PROFILE_URL, payload, { headers });

      setProfile(res.data);
      setEdit(false);
      setAvatarFile(null);

      setImageUrl(res.data?.image_url || finalUrl);
      setImagePublicId(res.data?.image_public_id || finalPublicId);

      // 2) delete old image from cloud (server-side)
      const changed = oldPublicId && oldPublicId !== finalPublicId;
      if (changed) {
        await axios.post(
          `${API_BASE}/api/cloudinary/delete`,
          { public_id: oldPublicId },
          { headers }
        );
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Failed to save profile";
      setError(msg);
    } finally {
      setUploadingAvatar(false);
      setSaving(false);
    }
  };

  return (
    <div style={S.page}>
       <TopBar
       links={[
         { to: "/home", label: "Home" },
         { to: "/profile", label: "My Profile" },
         { to: "/saved", label: "Saved" },
       ]}
       />

      <main style={S.main}>
        <div style={S.card}>
          <div style={S.headerRow}>
            <div>
              <div style={S.title}>Your Profile</div>
              <div style={S.sub}>View and edit your public profile info.</div>
            </div>

            {!loading && (
              <div style={{ display: "flex", gap: 8 }}>
                {!edit ? (
                  <button style={S.btn} onClick={() => setEdit(true)} type="button">
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      style={S.btnGhost}
                      onClick={cancelEdit}
                      type="button"
                      disabled={saving || uploadingAvatar}
                    >
                      Cancel
                    </button>
                    <button
                      style={S.btn}
                      onClick={saveProfile}
                      type="button"
                      disabled={saving || uploadingAvatar}
                    >
                      {uploadingAvatar ? "Uploading…" : saving ? "Saving…" : "Save"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {error && <div style={S.error}>{error}</div>}

          {loading ? (
            <div style={S.loading}>Loading…</div>
          ) : (
            <div style={S.grid}>
              <div style={S.avatarCol}>
                <div style={S.avatarWrap}>
                  <img
                    src={imageUrl || "https://via.placeholder.com/220x220?text=No+Image"}
                    alt="avatar"
                    style={S.avatar}
                  />
                </div>

                {edit && (
                  <div style={{ width: "100%" }}>
                    <div style={S.label}>Upload new image</div>
                    <input
                      style={S.input}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    />
                    {avatarFile && <div style={S.hint}>Selected: {avatarFile.name}</div>}

                    <div style={{ height: 10 }} />

                    <div style={S.label}>Or paste Image URL</div>
                    <input
                      style={S.input}
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                    />
                    <div style={S.hint}>
                      If you upload a file, it will override this URL.
                    </div>
                  </div>
                )}
              </div>

              <div style={S.formCol}>
                <Field label="Username" value={username} setValue={setUsername} edit={edit} />
                <Field label="Name" value={name} setValue={setName} edit={edit} />
                <Field label="Age" value={age} setValue={setAge} edit={edit} type="number" />
                <Field label="City / Area" value={city} setValue={setCity} edit={edit} />
                <Field label="Gender" value={gender} setValue={setGender} edit={edit} />
                <Field label="Orientation" value={orientation} setValue={setOrientation} edit={edit} />
                <Field label="Looking for" value={lookingFor} setValue={setLookingFor} edit={edit} />
                <Field label="Contact" value={contact} setValue={setContact} edit={edit} />
                <TextField label="Info" value={info} setValue={setInfo} edit={edit} maxLength={1000} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, setValue, edit, type = "text" }) {
  return (
    <div style={S.field}>
      <div style={S.label}>{label}</div>
      {!edit ? (
        <div style={S.value}>{value || "—"}</div>
      ) : (
        <input style={S.input} value={value} onChange={(e) => setValue(e.target.value)} type={type} />
      )}
    </div>
  );
}

function TextField({ label, value, setValue, edit, maxLength }) {
  return (
    
    <div style={{ ...S.field, gridColumn: "1 / -1" }}>
      <div style={S.label}>{label}</div>
      {!edit ? (
        <div style={S.valueMultiline}>{value || "—"}</div>
      ) : (
        <>
          <textarea
            style={S.textarea}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={maxLength}
            rows={5}
          />
          <div style={S.hint}>
            {value.length}/{maxLength}
          </div>
        </>
      )}
    </div>
  );
}

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(115deg, #dfdfdf 10%, #280239 90%)",
  },
  main: { padding: 14, display: "flex", justifyContent: "center" },
  card: {
    width: "min(980px, 96vw)",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 10px 35px rgba(0,0,0,0.18)",
  },
  headerRow: { display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  title: { fontSize: 22, fontWeight: 900, color: "#0f172a" },
  sub: { fontSize: 13, color: "#475569", marginTop: 4 },
  error: {
    marginTop: 12,
    background: "rgba(255,80,100,0.12)",
    border: "1px solid rgba(255,80,100,0.28)",
    color: "#7f1d1d",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 13,
  },
  loading: { padding: 18, fontWeight: 800, color: "#0f172a" },
  grid: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 14,
  },
  avatarCol: { display: "flex", flexDirection: "column", gap: 10 },
  avatarWrap: {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#f1f5f9",
  },
  avatar: { width: "100%", height: "100%", objectFit: "cover" },
  formCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 900, color: "#334155" },
  value: {
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 700,
    color: "#0f172a",
  },
  valueMultiline: {
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 600,
    color: "#0f172a",
    whiteSpace: "pre-wrap",
    minHeight: 110,
  },
  input: {
    width: "100%",
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 700,
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.14)",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 700,
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  hint: { fontSize: 12, color: "#64748b", marginTop: 4 },
  btn: {
    height: 38,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(15,23,42,0.20)",
    background: "rgba(15,23,42,0.10)",
    fontWeight: 900,
    cursor: "pointer",
  },
  btnGhost: {
    height: 38,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(15,23,42,0.18)",
    background: "transparent",
    fontWeight: 900,
    cursor: "pointer",
  },
};