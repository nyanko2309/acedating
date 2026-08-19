// LoginPage.js
import React, { useMemo, useState } from "react";
import axios from "axios";
import { loginPageCss } from "./LoginPagestyles";
import { Link } from "react-router-dom";

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

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

  return data.secure_url;
}

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";
const BASE_URL_Login = `${API_BASE}/api/login`;
const BASE_URL_SignUp = `${API_BASE}/api/signup`;

// ✅ NEW — "Any" removed; leaving all boxes unchecked now means "anyone"
const PREFERENCE_OPTIONS = ["Woman", "Man", "Non-binary", "Other"];

const widerCardOverrideCss = `
  .wrapper {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;
  }
  .card-switch {
    margin: 0 auto !important;
  }
  .flip-card__front,
  .flip-card__back {
    width: min(760px, 94vw) !important;
  }
`;

// ✅ NEW — mobile-only overrides (uses !important to beat loginPageCss).
// Tweak the 480px breakpoint or values as needed.
const LOGIN_MOBILE_CSS = `
@media (max-width: 480px) {
  .page-header {
    padding: 0 10px !important;
  }

  .page-title {
    font-size: 26px !important;
    letter-spacing: 1px !important;
  }

  .page-sub {
    font-size: 12px !important;
    line-height: 1.4 !important;
  }

  .wrapper {
    padding: 0 8px !important;
  }

  .flip-card__front,
  .flip-card__back {
    padding: 16px 14px !important;
    width: 96vw !important;
  }

  .title {
    font-size: 20px !important;
  }

  .notice {
    font-size: 11px !important;
  }

  .flip-card__form {
    gap: 10px !important;
  }

  .flip-card__input,
  select.flip-card__input,
  textarea.flip-card__input {
    width: 100% !important;
    box-sizing: border-box !important;
    font-size: 16px !important; /* prevents iOS auto-zoom on focus */
  }

  .flip-card__btn,
  .flip-card__btn2 {
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .avatar-upload-row {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 10px !important;
  }

  .avatar-upload-row input[type="file"] {
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .preference-checkbox-row {
    gap: 8px !important;
  }

  .preference-checkbox-row label {
    font-size: 12px !important;
  }
}
`;

const ABOUT_QUESTIONS = [
  {
    key: "lookingFor",
    label: "What am I looking for here?",
    placeholder: "e.g. friendship, a QPR, someone to talk to…",
  },
  {
    key: "orientationDetail",
    label: "My orientation, in my own words (sexual + romantic)",
    placeholder: "e.g. demisexual, biromantic — happy to explain more if asked",
  },
  {
    key: "hobbies",
    label: "Hobbies / what I like doing in my free time",
    placeholder: "e.g. reading, hiking, video games, painting…",
  },
  {
    key: "values",
    label: "What matters to me in a relationship / my values",
    placeholder: "e.g. honesty, patience, having our own space…",
  },
  {
    key: "boundaries",
    label: "Boundaries I want respected",
    placeholder: "e.g. no pressure to explain my identity, no rushing physical closeness…",
  },
];

function LoginPage() {
  const [loadingPopup, setLoadingPopup] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading…");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [signupOrientation, setSignupOrientation] = useState("");
  const [signupRomanticOrientation, setSignupRomanticOrientation] = useState("");
  const [signupLookingFor, setSignupLookingFor] = useState("");
  // ✅ CHANGED — was a single string, now a Set of selected preferences
  const [signupPreferenceSet, setSignupPreferenceSet] = useState(() => new Set());
  const [signupAvatarFile, setSignupAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [signupAvatarPreview, setSignupAvatarPreview] = useState(null);
  const [signupCity, setSignupCity] = useState("");
  const [signupGender, setSignupGender] = useState("");
  const [signupContact, setSignupContact] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  const [aboutAnswers, setAboutAnswers] = useState(() =>
    Object.fromEntries(ABOUT_QUESTIONS.map((q) => [q.key, ""]))
  );

  const setAboutAnswer = (key, value) => {
    setAboutAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const allAboutAnswersEmpty = useMemo(
    () => ABOUT_QUESTIONS.every((q) => !aboutAnswers[q.key]?.trim()),
    [aboutAnswers]
  );

  const buildCombinedInfo = () => {
    return ABOUT_QUESTIONS.filter((q) => aboutAnswers[q.key]?.trim())
      .map((q) => `${q.label}\n${aboutAnswers[q.key].trim()}`)
      .join("\n\n");
  };

  // ✅ NEW — toggle a preference checkbox on/off
  const togglePreference = (value) => {
    setSignupPreferenceSet((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoadingText("Logging you in…");
    setLoadingPopup(true);

    try {
      const res = await axios.post(
        BASE_URL_Login,
        { username: loginUsername, password: loginPassword },
        { timeout: 15000 }
      );

      if (res.data.user_id) localStorage.setItem("user_id", res.data.user_id);
      if (res.data.token) localStorage.setItem("token", res.data.token);

      setLoadingText("Opening home…");
      window.location.assign("/info");
      setTimeout(() => setLoadingPopup(false), 120000);
    } catch (err) {
      setLoadingPopup(false);
      const errorMsg =
        err?.code === "ECONNABORTED"
          ? "Server is taking too long. Please try again."
          : err?.response?.data?.error || err.message || "Login failed";
      alert(errorMsg);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (allAboutAnswersEmpty) {
      alert("Please answer at least one of the \"About me\" questions before signing up.");
      return;
    }

    try {
      let finalImageUrl = null;

      if (signupAvatarFile) {
        setLoadingText("Uploading your image…");
        setLoadingPopup(true);
        setUploadingAvatar(true);

        finalImageUrl = await uploadAvatarToCloudinary(signupAvatarFile);

        setUploadingAvatar(false);
      }

      setLoadingText("Creating your account…");
      setLoadingPopup(true);

      const payload = {
        username: signupUsername,
        password: signupPassword,
        name: signupName,
        age: Number(signupAge),

        orientation: signupOrientation,
        romantic_orientation: signupRomanticOrientation,

        looking_for: signupLookingFor,
        // ✅ CHANGED — sends an array now; empty array = visible to everyone
        preference: Array.from(signupPreferenceSet),
        image_url: finalImageUrl,
        city: signupCity,
        gender: signupGender,
        info: buildCombinedInfo(),
        contact: signupContact,
        email: signupEmail,
      };

      await axios.post(BASE_URL_SignUp, payload, { timeout: 120000 });

      setLoadingText("Logging you in…");
      const loginRes = await axios.post(
        BASE_URL_Login,
        { username: signupUsername, password: signupPassword },
        { timeout: 15000 }
      );

      if (loginRes.data.user_id) localStorage.setItem("user_id", loginRes.data.user_id);
      if (loginRes.data.token) localStorage.setItem("token", loginRes.data.token);

      setLoadingText("Opening home…");
      window.location.assign("/info");
      setTimeout(() => setLoadingPopup(false), 120000);
    } catch (err) {
      setLoadingPopup(false);
      setUploadingAvatar(false);
      const errorMsg =
        err?.code === "ECONNABORTED"
          ? "Server is taking too long. Please try again."
          : err?.response?.data?.error || err.message || "Sign up failed";
      alert(errorMsg);
    }
  };

  return (
    <>
      <style>{loginPageCss}</style>
      <style>{widerCardOverrideCss}</style>
      {/* ✅ NEW — mobile media-query overrides */}
      <style>{LOGIN_MOBILE_CSS}</style>

      {loadingPopup && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner" />
            {loadingText}
          </div>
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">♠SPADES♠</h1>

        <p className="page-sub">
          This is a student project. You’re welcome to support me and send some money if you want (
          
           <a href="https://www.bitpay.co.il/app/me/5B084B7C-5DD9-17A9-2656-4AFB88B5A9EBF7B5"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            bit here
          </a>
          ).
          <br />
          If you want anything improved, you’re welcome to write to me at{" "}
          <a href="mailto:yanazlatin.work@gmail.com">yanazlatin.work@gmail.com</a>
        </p>
      </div>

      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input type="checkbox" className="toggle" />
            <span className="slider"></span>
            <span className="card-side"></span>

            <div className="flip-card__inner">
              {/* FRONT = LOGIN */}
              <div className="flip-card__front">
                <div className="title">Log in</div>
                <div className="notice">⚠ Login and Sign-up may take a few tries — the server can be slow.</div>

                <form className="flip-card__form" onSubmit={handleLogin}>
                  <input
                    className="flip-card__input"
                    name="username"
                    placeholder="user_name"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />

                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />

                  <button className="flip-card__btn" type="submit">
                    Let's go!
                  </button>
                  <Link to="/forgot" className="flip-card__btn2">
                    Reset password
                  </Link>
                </form>
              </div>

              {/* BACK = SIGNUP */}
              <div className="flip-card__back">
                <div className="title">Sign up</div>

                <form className="flip-card__form" onSubmit={handleSignup}>
                  <input
                    className="flip-card__input"
                    placeholder="Username"
                    type="text"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                  />

                  <input
                    className="flip-card__input"
                    placeholder="Password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />

                  <input
                    className="flip-card__input"
                    placeholder="Email (optional, used for password reset)"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />

                  <input
                    className="flip-card__input"
                    placeholder="Name"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />

                  <input
                    className="flip-card__input"
                    placeholder="Age"
                    type="number"
                    min="18"
                    max="120"
                    value={signupAge}
                    onChange={(e) => setSignupAge(e.target.value)}
                    required
                  />

                  <select
                    className="flip-card__input"
                    value={signupOrientation}
                    onChange={(e) => setSignupOrientation(e.target.value)}
                    required
                  >
                    <option value="">Sexual orientation</option>
                    <option value="Ace">ace</option>
                    <option value="Aro">aro</option>
                    <option value="Aroace">aroace</option>
                    <option value="Demi">demi</option>
                    <option value="Grey-asexual">grey-asexual</option>
                  </select>

                  <select
                    className="flip-card__input"
                    value={signupRomanticOrientation}
                    onChange={(e) => setSignupRomanticOrientation(e.target.value)}
                  >
                    <option value="">Romantic orientation</option>
                    <option value="Aromantic">aromantic</option>
                    <option value="Demiromantic">demiromantic</option>
                    <option value="Grey-romantic">grey-romantic</option>
                    <option value="Heteroromantic">heteroromantic</option>
                    <option value="Homoromantic">homoromantic</option>
                    <option value="Biromantic">biromantic</option>
                    <option value="Panromantic">panromantic</option>
                    <option value="Queerromantic">queerromantic</option>
                    <option value="Questioning">questioning</option>
                    <option value="Other">other</option>
                  </select>

                  <select
                    className="flip-card__input"
                    value={signupLookingFor}
                    onChange={(e) => setSignupLookingFor(e.target.value)}
                    required
                  >
                    <option value="">Looking for</option>
                    <option value="Friendship">Friendship</option>
                    <option value="Monogamy-romance">monogamy romance</option>
                    <option value="Qpr">QPR</option>
                    <option value="Polyamory-romance">polyamory romance</option>
                  </select>

                  {/* ✅ NEW — multi-select checkboxes replacing the single dropdown */}
                  <div style={{ width: "min(320px, 100%)" }}>
                    <div className="helper" style={{ fontWeight: 800, marginBottom: 4 }}>
                      Preference (who can see you)
                    </div>
                    <div
                      className="preference-checkbox-row"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      {PREFERENCE_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={signupPreferenceSet.has(opt)}
                            onChange={() => togglePreference(opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="helper">
                    Pick any genders you want to be visible to. Leave all unchecked to be visible to everyone.
                  </div>

                  <div className="helper" style={{ marginTop: 2, fontWeight: 800 }}>
                    Profile image
                  </div>

                  <div
                    className="avatar-upload-row"
                    style={{
                      width: "min(320px, 100%)",
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 14,
                        overflow: "hidden",
                        border: "2px solid var(--main-color)",
                        background: "#f1f5f9",
                        boxShadow: "4px 4px var(--main-color)",
                        flex: "0 0 auto",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 900,
                      }}
                    >
                      {signupAvatarPreview ? (
                        <img
                          src={signupAvatarPreview}
                          alt="preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.8, lineHeight: 1.1 }}>
                          add profile image
                        </span>
                      )}
                    </div>

                    <input
                      className="flip-card__input"
                      style={{ margin: 0 }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        setSignupAvatarFile(f);
                        if (f) {
                          const url = URL.createObjectURL(f);
                          setSignupAvatarPreview(url);
                        } else {
                          setSignupAvatarPreview(null);
                        }
                      }}
                    />
                  </div>

                  <div className="helper">
                    {signupAvatarFile ? `Selected: ${signupAvatarFile.name}` : "Optional: choose an image to upload"}
                    {uploadingAvatar ? " • Uploading…" : ""}
                  </div>

                  <select
                    className="flip-card__input"
                    value={signupCity}
                    onChange={(e) => setSignupCity(e.target.value)}
                    required
                  >
                    <option value="">City / area</option>
                    <option value="gush-dan">Gush Dan (Tel Aviv / Ramat Gan / Givatayim / Holon / Bat Yam)</option>
                    <option value="tel-aviv">Tel Aviv (city)</option>
                    <option value="jerusalem-area">Jerusalem area</option>
                    <option value="hasharon">HaSharon (Herzliya / Raanana / Kfar Saba / Netanya)</option>
                    <option value="shfela">HaShfela (Rishon / Rehovot / Ramla / Lod)</option>
                    <option value="haifa-krayot">Haifa & Krayot</option>
                    <option value="north-galilee-golan">North (Galilee / Golan)</option>
                    <option value="south-ashdod-ashkelon">South coast (Ashdod / Ashkelon)</option>
                    <option value="negev-beer-sheva">Negev (Beer Sheva area)</option>
                    <option value="eilat-arava">Eilat / Arava</option>
                    <option value="west-bank">West Bank</option>
                    <option value="other-israel">Other / Not sure</option>
                  </select>

                  <select
                    className="flip-card__input"
                    value={signupGender}
                    onChange={(e) => setSignupGender(e.target.value)}
                    required
                  >
                    <option value="">Gender</option>
                    <option value="Man">Man</option>
                    <option value="Woman">Woman</option>
                    <option value="Non-binary">non binary</option>
                    <option value="Other">other</option>
                  </select>

                  <div style={{ width: "100%", marginTop: 6 }}>
                    <div className="helper" style={{ fontWeight: 800 }}>
                      About me — answer at least one 🙂
                    </div>
                    <div className="helper" style={{ marginBottom: 8 }}>
                      These get combined into your profile's "About" section. Empty questions are just skipped.
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      {ABOUT_QUESTIONS.map((q) => (
                        <div key={q.key}>
                          <div className="helper" style={{ marginBottom: 4 }}>
                            {q.label}
                          </div>
                          <textarea
                            className="flip-card__input"
                            placeholder={q.placeholder}
                            value={aboutAnswers[q.key]}
                            onChange={(e) => setAboutAnswer(q.key, e.target.value)}
                            rows={2}
                            maxLength={300}
                            style={{ height: 60, resize: "none", width: "100%" }}
                          />
                        </div>
                      ))}
                    </div>

                    {allAboutAnswersEmpty && (
                      <div className="helper" style={{ color: "#c0392b", marginTop: 6, fontWeight: 800 }}>
                        Please answer at least one question above before signing up.
                      </div>
                    )}
                  </div>

                  <input
                    className="flip-card__input"
                    placeholder="Contact info for my matches (e.g. Discord / IG / Email)"
                    type="text"
                    value={signupContact}
                    onChange={(e) => setSignupContact(e.target.value)}
                    required
                  />

                  <button
                    className="flip-card__btn"
                    type="submit"
                    disabled={uploadingAvatar || allAboutAnswersEmpty}
                  >
                    {uploadingAvatar ? "Uploading…" : "Confirm!"}
                  </button>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </>
  );
}

export default LoginPage;