
// Drop-in replacement for your current LoginPagestyles.js.
// No LoginPage.js changes are required.
//
// Main fixes:
// - CSS variables are global, so the loading overlay/header can use them too.
// - The flip switch/card wrapper now has real width instead of being trapped in a 50px label.
// - Signup stays scrollable without stretching the whole page.
// - Added the missing .flip-card__btn2 styling.
// - Added disabled/focus/file-input states.
// - Uses the same dark-plum + sage + soft botanical feel as the profile page.
// - Adds a subtle CSS-only watercolor wash to the card (no imported texture).

const bgUrl = `${process.env.PUBLIC_URL}/bgdesign.png`;

export const loginPageCss = `
:root {
  --accent-green: #78946f;
  --accent-green-deep: #526c4d;
  --accent-green-soft: #dfe9dc;

  --accent-purple: #8057a6;
  --accent-purple-deep: #51315c;
  --accent-purple-soft: #b99aca;

  --ink: #f8f5fa;
  --ink-muted: rgba(248, 245, 250, 0.70);
  --ink-dark: #252129;
  --ink-dark-muted: #626762;

  --card: #49384f;
  --card-deep: #3f3047;
  --card-border: rgba(255, 255, 255, 0.13);

  --field: rgba(247, 247, 241, 0.92);
  --field-border: rgba(120, 148, 111, 0.56);

  --danger: #a64652;

  --shadow-soft: 0 18px 50px rgba(31, 21, 37, 0.24);
  --shadow-control: 0 5px 14px rgba(28, 20, 34, 0.16);

  --radius-card: 22px;
  --radius-control: 12px;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
}

html {
  background: #f7f7f2;
}

body {
  margin: 0;
  min-height: 100vh;
  padding: 18px 14px 30px;
  font-family: 'Poppins', sans-serif;
  color: var(--ink-dark);

  background-image:
    linear-gradient(rgba(255,255,255,0.18), rgba(255,255,255,0.18)),
    url("${bgUrl}");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
}

button,
input,
select,
textarea {
  font: inherit;
}

/* =========================
   PAGE INTRO
   ========================= */

.page-header {
  width: min(760px, 94vw);
  margin: 0 auto 16px;
  text-align: center;
}

.page-title {
  margin: 0 0 10px;
  font-size: clamp(30px, 6vw, 44px);
  line-height: 1;
  font-weight: 900;
  letter-spacing: 2px;
  color: var(--accent-purple-deep);
  text-shadow: 0 2px 0 rgba(255,255,255,0.34);
}

.page-sub {
  margin: 0;
  padding: 11px 14px;

  color: rgba(255,255,255,0.94);
  font-size: 13px;
  line-height: 1.5;

  background:
    linear-gradient(
      110deg,
      rgba(50, 36, 58, 0.74),
      rgba(41, 41, 61, 0.68)
    );
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 14px;
  box-shadow: 0 8px 22px rgba(31, 21, 37, 0.14);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.page-sub a {
  color: #e2c5ed;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.page-sub a:hover {
  color: #ffffff;
}

/* =========================
   OUTER CARD / SWITCH
   ========================= */

.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.card-switch {
  width: min(760px, 94vw);
}

.switch {
  position: relative;
  display: block;
  width: 100%;
  padding-top: 58px;
}

/* Visually hidden checkbox, still keyboard accessible */
.toggle {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.slider {
  position: absolute;
  top: 14px;
  left: 50%;
  z-index: 5;

  width: 54px;
  height: 26px;
  transform: translateX(-50%);

  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 999px;
  background: rgba(71, 54, 81, 0.92);
  box-shadow: var(--shadow-control);

  cursor: pointer;
  transition:
    background-color 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.slider::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;

  width: 18px;
  height: 18px;

  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 30%, #ffffff 0 24%, #e3d7e8 68%);
  box-shadow: 0 2px 6px rgba(22, 15, 28, 0.30);

  transition: transform 220ms cubic-bezier(.2,.8,.2,1);
}

.toggle:checked + .slider {
  background: rgba(89, 118, 82, 0.95);
  border-color: rgba(220, 239, 216, 0.34);
}

.toggle:checked + .slider::before {
  transform: translateX(28px);
}

.toggle:focus-visible + .slider {
  outline: 3px solid rgba(128, 87, 166, 0.34);
  outline-offset: 4px;
}

.card-side {
  position: absolute;
  top: 13px;
  left: 50%;
  z-index: 4;
  width: 0;
  height: 28px;
}

.card-side::before,
.card-side::after {
  position: absolute;
  top: 1px;
  width: 92px;

  font-size: 14px;
  font-weight: 800;
  line-height: 24px;
  color: var(--accent-purple-deep);
  white-space: nowrap;

  transition: color 180ms ease, opacity 180ms ease;
}

.card-side::before {
  content: "Log in";
  right: 43px;
  text-align: right;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.card-side::after {
  content: "Sign up";
  left: 43px;
  text-align: left;
  opacity: 0.62;
}

.toggle:checked ~ .card-side::before {
  text-decoration: none;
  opacity: 0.62;
}

.toggle:checked ~ .card-side::after {
  text-decoration: underline;
  text-underline-offset: 4px;
  opacity: 1;
}

/* =========================
   FLIP CARD
   ========================= */

.flip-card__inner {
  position: relative;
  width: 100%;
  height: clamp(560px, 74svh, 720px);

  perspective: 1200px;
  transform-style: preserve-3d;
  transition: transform 650ms cubic-bezier(.2,.75,.2,1);
}

.toggle:checked ~ .flip-card__inner {
  transform: rotateY(180deg);
}

.flip-card__front,
.flip-card__back {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
  padding: 28px;

  display: flex;
  flex-direction: column;

  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  color: var(--ink);

  /* CSS-only watercolor wash */
  background:
    radial-gradient(
      ellipse at 10% 8%,
      rgba(142, 174, 127, 0.17) 0%,
      rgba(142, 174, 127, 0.07) 30%,
      transparent 54%
    ),
    radial-gradient(
      ellipse at 92% 10%,
      rgba(181, 111, 180, 0.16) 0%,
      rgba(181, 111, 180, 0.06) 27%,
      transparent 52%
    ),
    radial-gradient(
      ellipse at 84% 84%,
      rgba(128, 87, 166, 0.14) 0%,
      transparent 49%
    ),
    radial-gradient(
      ellipse at 15% 88%,
      rgba(255,255,255,0.055) 0%,
      transparent 40%
    ),
    linear-gradient(145deg, var(--card) 0%, var(--card-deep) 100%);

  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-soft);

  overflow: hidden;
}

.flip-card__front {
  justify-content: center;
}

.flip-card__back {
  transform: rotateY(180deg);
  justify-content: flex-start;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  -webkit-overflow-scrolling: touch;
}

/* Soft custom scrollbar */
.flip-card__back {
  scrollbar-width: thin;
  scrollbar-color: rgba(211, 195, 219, 0.60) rgba(255,255,255,0.06);
}

.flip-card__back::-webkit-scrollbar {
  width: 10px;
}

.flip-card__back::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
  border-radius: 999px;
}

.flip-card__back::-webkit-scrollbar-thumb {
  background: rgba(220, 207, 226, 0.58);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 999px;
}

/* =========================
   FORM
   ========================= */

.title {
  margin: 2px 0 14px;
  color: #ffffff;
  font-size: clamp(24px, 4vw, 30px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: 0.3px;
  text-align: center;
}

.flip-card__form {
  width: min(560px, 100%);
  margin-inline: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.flip-card__input {
  width: 100%;
  min-height: 46px;
  padding: 10px 13px;

  color: var(--ink-dark);
  font-size: 14px;
  font-weight: 600;

  background:
    linear-gradient(
      110deg,
      rgba(244, 248, 241, 0.96),
      rgba(238, 243, 235, 0.93)
    );
  border: 1px solid var(--field-border);
  border-radius: var(--radius-control);
  box-shadow:
    0 4px 12px rgba(24, 31, 23, 0.10),
    inset 0 1px 0 rgba(255,255,255,0.72);

  outline: none;

  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease,
    transform 160ms ease;
}

.flip-card__input::placeholder {
  color: var(--ink-dark-muted);
  opacity: 0.80;
}

.flip-card__input:hover {
  border-color: rgba(91, 116, 83, 0.72);
}

.flip-card__input:focus {
  border-color: var(--accent-purple);
  box-shadow:
    0 0 0 3px rgba(128, 87, 166, 0.17),
    0 5px 14px rgba(24, 31, 23, 0.10);
}

select.flip-card__input {
  cursor: pointer;
}

textarea.flip-card__input {
  min-height: 72px;
  height: auto !important;
  line-height: 1.45;
  resize: vertical;
}

/* Make the browser file control fit the rest of the UI */
input[type="file"].flip-card__input {
  padding: 6px;
  min-height: 46px;
  cursor: pointer;
}

input[type="file"].flip-card__input::file-selector-button {
  margin-right: 10px;
  padding: 7px 11px;

  border: 0;
  border-radius: 8px;
  background: var(--accent-green);
  color: #fff;

  font-weight: 800;
  cursor: pointer;
}

.helper {
  width: 100%;
  margin-top: -4px;

  color: rgba(231, 239, 228, 0.80);
  font-size: 12px;
  line-height: 1.45;
  text-align: left;
}

.notice {
  width: min(560px, 100%);
  margin: -4px auto 12px;
  padding: 9px 11px;

  color: #ffe9ec;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.4;
  text-align: center;

  background: rgba(166, 70, 82, 0.20);
  border: 1px solid rgba(255, 190, 199, 0.22);
  border-radius: 10px;
}

/* =========================
   BUTTONS
   ========================= */

.flip-card__btn {
  width: min(220px, 100%);
  min-height: 46px;
  margin-top: 8px;
  padding: 10px 18px;

  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 12px;

  color: #fff;
  font-size: 16px;
  font-weight: 800;

  background:
    linear-gradient(135deg, #7d559f, #6e488f);
  box-shadow:
    0 8px 18px rgba(37, 22, 47, 0.24),
    inset 0 1px 0 rgba(255,255,255,0.13);

  cursor: pointer;

  transition:
    transform 120ms ease,
    filter 160ms ease,
    box-shadow 160ms ease;
}

.flip-card__btn:hover:not(:disabled) {
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.flip-card__btn:focus-visible,
.flip-card__btn2:focus-visible {
  outline: 3px solid rgba(215, 195, 225, 0.44);
  outline-offset: 3px;
}

.flip-card__btn:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: 0 4px 10px rgba(37, 22, 47, 0.18);
}

.flip-card__btn:disabled {
  opacity: 0.48;
  cursor: not-allowed;
  filter: grayscale(0.18);
}

/* This class exists in LoginPage.js but was missing from your old CSS */
.flip-card__btn2 {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 40px;
  padding: 8px 14px;

  color: #e5efdf;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;

  border: 1px solid rgba(166, 193, 155, 0.34);
  border-radius: 10px;
  background: rgba(120, 148, 111, 0.12);

  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 120ms ease;
}

.flip-card__btn2:hover {
  background: rgba(120, 148, 111, 0.22);
  border-color: rgba(191, 214, 181, 0.50);
  transform: translateY(-1px);
}

/* =========================
   LOADING OVERLAY
   ========================= */

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: grid;
  place-items: center;
  padding: 18px;

  background: rgba(30, 23, 36, 0.60);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.loading-box {
  width: min(340px, 92vw);
  padding: 22px;

  color: var(--ink-dark);
  font-weight: 800;
  text-align: center;

  background: rgba(247, 247, 242, 0.97);
  border: 1px solid rgba(81, 49, 92, 0.20);
  border-radius: 16px;
  box-shadow: 0 18px 45px rgba(27, 20, 32, 0.26);
}

.spinner {
  width: 30px;
  height: 30px;
  margin: 0 auto 11px;

  border: 3px solid rgba(81, 49, 92, 0.15);
  border-top-color: var(--accent-purple);
  border-radius: 50%;

  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* =========================
   RESPONSIVE
   ========================= */

@media (max-width: 700px) {
  body {
    padding-inline: 10px;
  }

  .page-header,
  .card-switch {
    width: min(100%, 94vw);
  }

  .flip-card__front,
  .flip-card__back {
    padding: 22px 18px;
  }

  .flip-card__inner {
    height: clamp(560px, 76svh, 700px);
  }
}

@media (max-width: 420px) {
  body {
    padding-top: 12px;
  }

  .page-header {
    margin-bottom: 10px;
  }

  .page-sub {
    font-size: 12px;
    padding: 9px 10px;
  }

  .switch {
    padding-top: 52px;
  }

  .slider {
    top: 12px;
  }

  .card-side {
    top: 11px;
  }

  .card-side::before,
  .card-side::after {
    width: 78px;
    font-size: 13px;
  }

  .card-side::before {
    right: 40px;
  }

  .card-side::after {
    left: 40px;
  }

  .flip-card__inner {
    height: 76svh;
    min-height: 570px;
  }

  .flip-card__front,
  .flip-card__back {
    padding: 20px 14px;
    border-radius: 18px;
  }

  .flip-card__form {
    gap: 10px;
  }

  .flip-card__input {
    min-height: 44px;
    font-size: 14px;
  }

  .title {
    margin-bottom: 10px;
  }
}

/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  .flip-card__inner,
  .slider,
  .slider::before,
  .flip-card__btn,
  .flip-card__btn2,
  .flip-card__input {
    transition: none !important;
  }

  .spinner {
    animation-duration: 1.4s;
  }
}
`;


