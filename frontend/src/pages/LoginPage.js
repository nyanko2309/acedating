import React, { useState } from "react";
import axios from "axios";

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
  // preset already sets folder=profiles, so no need to send folder

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Cloudinary upload failed");

  return data.secure_url; // save to Mongo as image_url
}

const API_BASE =process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

const BASE_URL_Login = `${API_BASE}/api/login`;
const BASE_URL_SignUp = `${API_BASE}/api/signup`;

function LoginPage() {
  // LOGIN
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SIGN UP
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [signupOrientation, setSignupOrientation] = useState("");
  const [signupLookingFor, setSignupLookingFor] = useState("");
  const [signupAvatarFile, setSignupAvatarFile] = useState(null); // ✅ file upload
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [signupCity, setSignupCity] = useState("");
  const [signupGender, setSignupGender] = useState("");
  const [signupInfo, setSignupInfo] = useState("");
  const [signupContact, setSignupContact] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(BASE_URL_Login, {
        username: loginUsername,
        password: loginPassword,
      });

      if (res.data.user_id) localStorage.setItem("user_id", res.data.user_id);
      if (res.data.token) localStorage.setItem("token", res.data.token);

      //alert(res.data.message || "Logged in!");
      window.location.href = "/home";
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err.message || "Login failed";
      alert(errorMsg);
    }
  };

  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    let finalImageUrl = null;

    // ✅ if file selected, upload to Cloudinary and use that URL
    if (signupAvatarFile) {
      setUploadingAvatar(true);
      finalImageUrl = await uploadAvatarToCloudinary(signupAvatarFile);
      setUploadingAvatar(false);
    }

    const payload = {
      username: signupUsername,
      password: signupPassword,
      name: signupName,
      age: Number(signupAge),
      orientation: signupOrientation,
      looking_for: signupLookingFor,
      image_url: finalImageUrl,
      city: signupCity,
      gender: signupGender,
      info: signupInfo,
      contact: signupContact,
    };

    await axios.post(BASE_URL_SignUp, payload);

    // auto-login after signup
    const loginRes = await axios.post(BASE_URL_Login, {
      username: signupUsername,
      password: signupPassword,
    });

    if (loginRes.data.user_id) localStorage.setItem("user_id", loginRes.data.user_id);
    if (loginRes.data.token) localStorage.setItem("token", loginRes.data.token);

    window.location.href = "/home";
  } catch (err) {
    setUploadingAvatar(false);
    const errorMsg = err?.response?.data?.error || err.message || "Sign up failed";
    alert(errorMsg);
  }
};

  return (
    <>
      <style>{`
  .wrapper {
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
}

html, body { height: 100%; }

body {
  margin: 0;
  min-height: 100vh;

  /* ✅ closer to top (not vertically centered) */
  display: flex;
  justify-content: center;
  align-items: flex-start;

  /* ✅ tweak this to move up/down */
  padding: 14px 14px 24px;
  box-sizing: border-box;

  font-family: 'Poppins', sans-serif;
  background: linear-gradient(115deg, #dfdfdf 10%, #280239 90%);
}

.page-header{
  width: 100%;
  max-width: 420px;
  margin: 0 auto 14px;
  text-align: center;
  padding: 6px 10px 0;
  box-sizing: border-box;
}

.page-title{
  margin: 0 0 8px;
  font-size: clamp(28px, 7vw, 40px);
  font-weight: 900;
  letter-spacing: 2px;
  color: #ffffff;
  text-shadow: 0 2px 0 rgba(0,0,0,0.25);
}

.page-sub{
  margin: 0;
  font-size: 13px;
  line-height: 1.35;
  color: rgba(255,255,255,0.92);
  background: rgba(0,0,0,0.22);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px;
  padding: 10px 12px;
}

.page-sub a{
  color: #ffffff;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

@media (max-width: 420px){
  .page-header{ margin-bottom: 10px; }
  .page-sub{ font-size: 12px; }
}
  
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;

  /* ✅ optional tiny push down/up */
  margin-top: 6px;
}

/* ---- Switch ---- */
.switch {
  transform: none;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 50px;
  height: 20px;
}

.card-side::before {
  position: absolute;
  content: 'Log in';
  left: -70px;
  top: 0;
  width: 100px;
  height: 560px;
  text-decoration: underline;
  color: var(--font-color);
  font-weight: 600;
}

.card-side::after {
  position: absolute;
  content: 'Sign up';
  height: 560px;
  left: 70px;
  top: 0;
  width: 100px;
  text-decoration: none;
  color: var(--font-color);
  font-weight: 600;
}

@media (max-width: 420px) {
  .card-side::before,
  .card-side::after { display: none; }
}

.toggle { opacity: 0; width: 0; height: 0; }

.slider {
  box-sizing: border-box;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--bg-color);
  transition: 0.3s;
}

.slider:before {
  box-sizing: border-box;
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  border: 2px solid var(--main-color);
  border-radius: 5px;
  left: -2px;
  bottom: 2px;
  background-color: var(--bg-color);
  box-shadow: 0 3px 0 var(--main-color);
  transition: 0.3s;
}

.toggle:checked + .slider { background-color: var(--input-focus); }
.toggle:checked + .slider:before { transform: translateX(30px); }
.toggle:checked ~ .card-side:before { text-decoration: none; }
.toggle:checked ~ .card-side:after { text-decoration: underline; }

/* ---- Flip card (IMPORTANT: keep stable height for 3D) ---- */
.flip-card__inner {
  width: min(380px, 92vw);

  /* ✅ responsive height for phone */
  min-height: 560px;
  max-height: 86svh;   /* better than vh on mobile toolbars */
  height: auto;

  position: relative;
  background-color: transparent;
  perspective: 1000px;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

@media (max-width: 420px) {
  .flip-card__inner {
    min-height: 600px;
    max-height: 88svh;
  }
}

.toggle:checked ~ .flip-card__inner {
  transform: rotateY(180deg);
}

.flip-card__front,
.flip-card__back {
  position: absolute;
  top: 0; left: 0;
  width: 100%;

  /* ✅ FIX: was "height: 300;" (missing px). Must fill the inner */
  height: 100%;

  padding: 18px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;

  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  background: lightgrey;
  border-radius: 10px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  overflow: hidden;
}

.flip-card__back {
  transform: rotateY(180deg);
  justify-content: flex-start; /* ✅ signup is long, start from top */
  padding-top: 16px;
  overflow-y: auto;            /* ✅ scroll inside */
  -webkit-overflow-scrolling: touch;
}

.flip-card__form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.title {
  margin: 8px 0;
  font-size: 24px;
  font-weight: 900;
  text-align: center;
  color: var(--main-color);
}

.flip-card__input {
  width: min(320px, 100%);
  height: 42px;
  border-radius: 8px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 8px 10px;
  outline: none;
  box-sizing: border-box;
}

.flip-card__input::placeholder { color: var(--font-color-sub); opacity: 0.85; }
.flip-card__input:focus { border: 2px solid var(--input-focus); }

textarea.flip-card__input {
  height: 90px !important;
  resize: none;
}

.flip-card__btn {
  margin: 10px 0 0;
  width: min(220px, 100%);
  height: 44px;
  border-radius: 8px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color);
  cursor: pointer;
}

.flip-card__btn:active {
  box-shadow: 0px 0px var(--main-color);
  transform: translate(3px, 3px);
}

.helper {
  width: min(320px, 100%);
  font-size: 12px;
  color: #333;
  opacity: 0.85;
  text-align: left;
  box-sizing: border-box;
  margin-top: -6px;
}
`}</style>
<div className="page-header">
  <h1 className="page-title">♠SPADES♠</h1>

  <p className="page-sub">
    This is a student project. You’re welcome to support me and send some money if you want
    (<a href="BIT_LINK_HERE" target="_blank" rel="noreferrer">bit link here</a>).
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
                    <option value="">Orientation</option>
                    <option value="ace">ace</option>
                    <option value="aro">aro</option>
                    <option value="aroace">aroace</option>
                    <option value="demi">demi</option>
                    <option value="grey-asexual">grey-asexual</option>
                  </select>

                  <select
                    className="flip-card__input"
                    value={signupLookingFor}
                    onChange={(e) => setSignupLookingFor(e.target.value)}
                    required
                  >
                    <option value="">Looking for</option>
                    <option value="friendship">friendship</option>
                    <option value="monogamy-romance">monogamy romance</option>
                    <option value="qpr">QPR</option>
                    <option value="polyamory-romance">polyamory romance</option>
                  </select>

                  {/* ✅ File upload (Cloudinary) */}
                  <input
                    className="flip-card__input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSignupAvatarFile(e.target.files?.[0] || null)}
                  />
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
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="non-binary">non binary</option>
                    <option value="other">other</option>
                  </select>

                  <textarea
                    className="flip-card__input"
                    placeholder="Info (max 1000 characters)"
                    value={signupInfo}
                    onChange={(e) => setSignupInfo(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    required
                    style={{ height: 80, resize: "none" }}
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
