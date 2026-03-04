// ProfilePage.js
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import TopBar from "./TopBar";
import { S } from "./Profilepagestyles";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

/** ===== options ===== */
const ORIENTATION_OPTIONS = ["Ace", "Aro", "Aroace", "Demi", "Grey-asexual"];

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

const PREFERENCE_OPTIONS = [
  { value: "woman", label: "woman" },
  { value: "man", label: "man" },
  { value: "non-binary", label: "non-binary" },
  { value: "other", label: "other" },
  { value: "any", label: "doesn't matter" },
];

const AGE_OPTIONS = Array.from({ length: 83 }, (_, i) => {
  const n = i + 18;
  return { value: String(n), label: String(n) };
});

function normalizeOptions(options) {
  return (options || []).map((o) => (typeof o === "string" ? { value: o, label: o } : o));
}

function labelFromOptions(options, value) {
  if (value === null || value === undefined || value === "") return "";
  const opts = normalizeOptions(options);
  const found = opts.find((o) => String(o.value) === String(value));
  return found?.label ?? String(value);
}

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

  // avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);

  // editable fields
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState(""); // string for select
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [orientation, setOrientation] = useState("");
  const [romanticOrientation, setRomanticOrientation] = useState(""); // ✅ NEW
  const [lookingFor, setLookingFor] = useState("");
  const [preference, setPreference] = useState("");
  const [info, setInfo] = useState("");
  const [contact, setContact] = useState(""); // ✅ free text

  // store both url + public_id so we can delete old image later
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

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form,
    });

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
        setAge(p?.age === null || p?.age === undefined ? "" : String(p.age));
        setCity(p?.city || "");
        setGender(p?.gender || "");
        setOrientation(p?.orientation || "");
        setRomanticOrientation(p?.romantic_orientation || ""); // ✅ NEW
        setLookingFor(p?.looking_for || "");
        setPreference(p?.preference || "");
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
    setAge(profile?.age === null || profile?.age === undefined ? "" : String(profile.age));
    setCity(profile?.city || "");
    setGender(profile?.gender || "");
    setOrientation(profile?.orientation || "");
    setRomanticOrientation(profile?.romantic_orientation || ""); // ✅ NEW
    setLookingFor(profile?.looking_for || "");
    setPreference(profile?.preference || "");
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

      if (avatarFile) {
        setUploadingAvatar(true);
        const up = await uploadAvatarToCloudinary(avatarFile);
        finalUrl = up.url;
        finalPublicId = up.publicId;
        setUploadingAvatar(false);
      }

      const payload = {
        username,
        name,
        age: age === "" ? null : Number(age),
        city,
        gender,
        orientation,
        romantic_orientation: romanticOrientation, // ✅ NEW
        looking_for: lookingFor,
        preference: preference === "any" ? "" : preference,
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

      const changed = oldPublicId && oldPublicId !== finalPublicId;
      if (changed) {
        await axios.post(`${API_BASE}/api/cloudinary/delete`, { public_id: oldPublicId }, { headers });
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
          { to: "/random", label: "Let luck choose" },
          { to: "/latters", label: "Inbox" },
          { to: "/info", label: "Info & Contact" },
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
                    <button style={S.btnGhost} onClick={cancelEdit} type="button" disabled={saving || uploadingAvatar}>
                      Cancel
                    </button>
                    <button style={S.btn} onClick={saveProfile} type="button" disabled={saving || uploadingAvatar}>
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
                    <div style={S.hint}>If you upload a file, it will override this URL.</div>
                  </div>
                )}
              </div>

              <div style={S.formCol}>
                {/* keep username+name as text */}
                <Field label="Username" value={username} setValue={setUsername} edit={edit} />
                <Field label="Name" value={name} setValue={setName} edit={edit} />

                {/* dropdowns */}
                <SelectField label="Age" value={age} setValue={setAge} edit={edit} options={AGE_OPTIONS} />
                <SelectField label="City / Area" value={city} setValue={setCity} edit={edit} options={CITY_OPTIONS} />
                <SelectField label="Gender" value={gender} setValue={setGender} edit={edit} options={GENDER_OPTIONS} />

                <SelectField
                  label="Sexual orientation"
                  value={orientation}
                  setValue={setOrientation}
                  edit={edit}
                  options={ORIENTATION_OPTIONS}
                />

                {/* ✅ NEW */}
                <SelectField
                  label="Romantic orientation"
                  value={romanticOrientation}
                  setValue={setRomanticOrientation}
                  edit={edit}
                  options={ROMANTIC_ORIENTATION_OPTIONS}
                  placeholder="Romantic orientation"
                />

                <SelectField
                  label="Looking for"
                  value={lookingFor}
                  setValue={setLookingFor}
                  edit={edit}
                  options={LOOKING_FOR_OPTIONS}
                />

                <SelectField
                  label="Preference (what gender can see you)"
                  value={preference}
                  setValue={setPreference}
                  edit={edit}
                  options={PREFERENCE_OPTIONS}
                  placeholder="Preference (what gender can see you)"
                />

                {/* contact is FREE TEXT */}
                <Field label="Contact" value={contact} setValue={setContact} edit={edit} />

                {/* free text */}
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

function SelectField({ label, value, setValue, edit, options, placeholder }) {
  const opts = normalizeOptions(options);
  const display = labelFromOptions(opts, value);

  return (
    <div style={S.field}>
      <div style={S.label}>{label}</div>
      {!edit ? (
        <div style={S.value}>{display || "—"}</div>
      ) : (
        <select style={S.input} value={value ?? ""} onChange={(e) => setValue(e.target.value)}>
          <option value="">{placeholder || `Select ${label}`}</option>
          {opts.map((o) => (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
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
            rows={4}
          />
          <div style={S.hint}>
            {value.length}/{maxLength}
          </div>
        </>
      )}
    </div>
  );
}