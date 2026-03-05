// LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { loginPageCss } from "./LoginPagestyles";

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

function LoginPage() {
  // loading popup
  const [loadingPopup, setLoadingPopup] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading…");

  // LOGIN
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SIGN UP
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [signupOrientation, setSignupOrientation] = useState("");
  const [signupRomanticOrientation, setSignupRomanticOrientation] = useState(""); // ✅ NEW
  const [signupLookingFor, setSignupLookingFor] = useState("");
  const [signupPreference, setSignupPreference] = useState("");
  const [signupAvatarFile, setSignupAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [signupAvatarPreview, setSignupAvatarPreview] = useState(null);
  const [signupCity, setSignupCity] = useState("");
  const [signupGender, setSignupGender] = useState("");
  const [signupInfo, setSignupInfo] = useState("");
  const [signupContact, setSignupContact] = useState("");

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
        romantic_orientation: signupRomanticOrientation, // ✅ NEW

        looking_for: signupLookingFor,
        preference: signupPreference === "any" ? "" : signupPreference,
        image_url: finalImageUrl,
        city: signupCity,
        gender: signupGender,
        info: signupInfo,
        contact: signupContact,
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
          <a
            href="https://www.bitpay.co.il/app/me/5B084B7C-5DD9-17A9-2656-4AFB88B5A9EBF7B5"
            target="_blank"
            rel="noreferrer"
          >
            Support via Bit 💚
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

                  {/* ✅ NEW */}
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

                  <select
                    className="flip-card__input"
                    value={signupPreference}
                    onChange={(e) => setSignupPreference(e.target.value)}
                  >
                    <option value="">Preference (what gender can see you)</option>
                    <option value="woman">woman</option>
                    <option value="man">man</option>
                    <option value="non-binary">non-binary</option>
                    <option value="other">other</option>
                    <option value="any">doesnt matter</option>
                  </select>

                  <div className="helper">
                    This controls who will see you in their results. Leave as “doesn’t matter” to allow everyone.
                  </div>

                  <div className="helper" style={{ marginTop: 2, fontWeight: 800 }}>
                    Profile image
                  </div>

                  <div
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
                    <option value="man">man</option>
                    <option value="woman">woman</option>
                    <option value="non-binary">non binary</option>
                    <option value="other">other</option>
                  </select>

                  <textarea
                    className="flip-card__input"
                    placeholder={
                      "Info (max 1000 characters)\n\n" +
                      "כמה משפטים עליי — אפשר לענות לפי השאלות:\n\n" +
                      "• מה אני מחפש/ת פה? \n\n" +
                      "• האוריינטציה שלי: מינית + רומנטית \n\n" +
                      "• תחביבים ומה אני אוהב/ת לעשות בזמן פנוי\n\n" +
                      "• מה חשוב לי בקשר / בערכים\n\n" +
                      "• גבולות שחשוב לי שיכבדו\n\n" +
                      "טיפ קטן: אפשר גם לכתוב מה גורם לי להרגיש בטוח/ה ונעים בקשר 🙂"
                    }
                    value={signupInfo}
                    onChange={(e) => setSignupInfo(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    required
                    style={{ height: 90, resize: "none" }}
                  />

                  <input
                    className="flip-card__input"
                    placeholder="Contact (e.g. Discord / IG / Email)"
                    type="text"
                    value={signupContact}
                    onChange={(e) => setSignupContact(e.target.value)}
                    required
                  />

                  <button className="flip-card__btn" type="submit" disabled={uploadingAvatar}>
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