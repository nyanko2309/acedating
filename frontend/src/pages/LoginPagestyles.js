// LoginPagestyles.js
// keeps the EXACT same CSS design you had, just moved into a JS string.
// IMPORTANT: background image is now from public using PUBLIC_URL.

const bgUrl = `${process.env.PUBLIC_URL}/bgdesign.png`;

export const loginPageCss = `
/* ===== Muted Green + Purple Theme (copy-paste) ===== */

.wrapper {
  /* accents */
  --accent-green: #2f6f55;
  --accent-purple: #6a5aa8;

  /* focus + interactive */
  --input-focus: var(--accent-purple);

  /* neutrals */
  --font-color: #1f2320;
  --font-color-sub: #5c615d;

  /* surfaces */
  --bg-color: #f6f5f2;

  /* borders/shadows */
  --main-color: #2e2a3a;
}

html, body { height: 100%; }

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 14px 14px 24px;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;

  background-image: url("${bgUrl}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
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
  color: #51315c;
  text-shadow: 0 2px 0 rgba(0,0,0,0.25);
}

.page-sub{
  margin: 0;
  font-size: 13px;
  line-height: 1.35;
  color: rgba(255,255,255,0.92);
  background: rgba(46, 42, 58, 0.32); /* muted purple glass */
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px;
  padding: 10px 12px;
  backdrop-filter: blur(3px);
}

.page-sub a{
  color: #51315c;
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
  margin-top: 6px;
}

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

/* toggle ON: muted green */
.toggle:checked + .slider {
  background-color: var(--accent-green);
}
.toggle:checked + .slider:before { transform: translateX(30px); }
.toggle:checked ~ .card-side:before { text-decoration: none; }
.toggle:checked ~ .card-side:after { text-decoration: underline; }

.flip-card__inner {
  width: min(380px, 92vw);
  min-height: 560px;
  max-height: 86svh;
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
    min-height: 650px;
    max-height: 88svh;
  }
}

.toggle:checked ~ .flip-card__inner { transform: rotateY(180deg); }

.flip-card__front,
.flip-card__back {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  padding: 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  background: rgba(246, 245, 242, 0.92);
  border-radius: 12px;
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  overflow: hidden;
  backdrop-filter: blur(4px);
}

.flip-card__back {
  transform: rotateY(180deg);
  justify-content: flex-start;
  padding-top: 16px;
  overflow-y: auto;
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
  color: #51315c;
}

.flip-card__input {
  width: min(320px, 100%);
  height: 42px;
  border-radius: 10px;
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
  border-radius: 10px;
  border: 2px solid var(--main-color);
  background-color: var(--accent-green);
  box-shadow: 4px 4px var(--main-color);
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition: transform 0.06s ease, filter 0.2s ease;
}

.flip-card__btn:hover { filter: brightness(1.03); }

.flip-card__btn:focus-visible{
  outline: 3px solid rgba(106, 90, 168, 0.35);
  outline-offset: 3px;
}

.flip-card__btn:active {
  box-shadow: 0px 0px var(--main-color);
  transform: translate(3px, 3px);
}

.loading-overlay{
  position: fixed;
  inset: 0;
  background: rgba(46,42,58,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.loading-box{
  background: rgba(246,245,242,0.96);
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  border-radius: 12px;
  padding: 18px 18px;
  width: min(320px, 90vw);
  text-align: center;
  font-weight: 800;
  color: var(--font-color);
}

.spinner{
  width: 28px;
  height: 28px;
  border: 3px solid rgba(46,42,58,0.18);
  border-top-color: rgba(106, 90, 168, 0.85);
  border-radius: 50%;
  margin: 0 auto 10px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin{ to { transform: rotate(360deg); } }

.helper {
  width: min(320px, 100%);
  font-size: 12px;
  color: var(--accent-green);
  opacity: 0.9;
  text-align: left;
  box-sizing: border-box;
  margin-top: -6px;
}

.notice {
  width: min(320px, 100%);
  margin: -4px auto 6px;
  font-size: 12px;
  font-weight: 800;
  color: #b91c1c; /* muted red */
  text-align: center;
}
`;