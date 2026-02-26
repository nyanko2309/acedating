import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TopBar from "./TopBar";


const API_BASE =process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

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
    color: "rgba(255,255,255,0.92)",
    background:
      "radial-gradient(1200px 800px at 20% 10%, rgba(255,110,199,0.28), transparent 60%)," +
      "radial-gradient(900px 700px at 85% 20%, rgba(193, 117, 186, 0.22), transparent 55%)," +
      "radial-gradient(1000px 800px at 40% 95%, rgba(167,139,250,0.22), transparent 55%)," +
      "linear-gradient(120deg, #514c53, #1c151e 60%, #3d0153)",
  
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

  title: { fontSize: 22, fontWeight: 950, color: "rgba(255,255,255,0.92)" },
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

  loading: { padding: 18, fontWeight: 900, color: "rgba(255,255,255,0.90)" },

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

  avatar: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

  formCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },

  field: { display: "flex", flexDirection: "column", gap: 6 },

  label: { fontSize: 12, fontWeight: 950, color: "rgba(255,255,255,0.78)" },

  value: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 14,
    padding: "10px 12px",
    fontWeight: 800,
    color: "rgba(255,255,255,0.92)",
  },

  valueMultiline: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 14,
    padding: "10px 12px",
    fontWeight: 700,
    color: "rgba(255,255,255,0.90)",
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
    color: "rgba(255,255,255,0.92)",
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
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    minHeight: 120,
  },

  hint: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 },

  btn: {
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background:
      "linear-gradient(135deg, rgba(255,110,199,0.26), rgba(167,139,250,0.20), rgba(125,211,252,0.16))",
    color: "rgba(255,255,255,0.92)",
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
    color: "rgba(255,255,255,0.90)",
    fontWeight: 950,
    cursor: "pointer",
    backdropFilter: "blur(10px)",
  },
};