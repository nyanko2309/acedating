import React, { useEffect } from "react";
import TopBar from "./TopBar";
import { S, ensureHomepageStyles } from "./homepageStyles";

const WHATSAPP_LINK =
  "https://api.whatsapp.com/send/?phone=%2B9720549276236&text&type=phone_number&app_absent=0";

const BIT_LINK =
  "https://www.bitpay.co.il/app/me/5B084B7C-5DD9-17A9-2656-4AFB88B5A9EBF7B5";

export default function InfoContact() {
  useEffect(() => {
    ensureHomepageStyles();
  }, []);

  const T = {
    wrap: { padding: "14px" },
    card: {
      background: "rgba(130, 102, 145, 0.83)",
      borderRadius: 18,
      padding: 18,
      boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
      border: "1px solid rgba(255,255,255,0.14)",
      marginTop: 8,
    },
    title: { fontSize: 18, fontWeight: 900, margin: 0, color: "rgba(255,255,255,0.92)" },
    sub: { marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.4 },
    grid: {
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      gap: 14,
      marginTop: 14,
    },
    box: {
      background: "rgba(255,255,255,0.08)",
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.14)",
      padding: 14,
    },
    boxTitle: { fontSize: 13, fontWeight: 900, color: "rgba(255,255,255,0.88)", margin: 0 },
    p: { marginTop: 10, marginBottom: 0, fontSize: 13, color: "#0f4d2a", lineHeight: 1.5, fontWeight: 600 },
    ul: { marginTop: 10, marginBottom: 0, paddingLeft: 18, color: "#0f4d2a", lineHeight: 1.5, fontWeight: 600 },
    li: { marginBottom: 8 },
    warn: {
      marginTop: 12,
      padding: "12px 12px",
      borderRadius: 16,
      border: "1px solid rgba(255,110,199,0.35)",
      background: "rgba(255, 110, 199, 0.23)",
      color: "rgba(255,255,255,0.92)",
      fontWeight: 800,
      lineHeight: 1.45,
    },
    fine: { marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.70)", lineHeight: 1.45 },
    btnRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 },
    bigBtn: {
      ...S.primaryBtn,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      textDecoration: "none",
      padding: "12px 14px",
    },
    miniBtn: {
      ...S.secondaryBtn,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      textDecoration: "none",
    },
    divider: {
      height: 1,
      background: "rgba(255,255,255,0.12)",
      marginTop: 12,
      marginBottom: 12,
    },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.16)",
      color: "rgba(255,255,255,0.88)",
      fontSize: 12,
      fontWeight: 900,
      whiteSpace: "nowrap",
    },
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

      <main style={T.wrap}>
        <div style={S.shell}>
          <div style={T.card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <h2 style={T.title}>Info & Contact</h2>
                <div style={T.sub}>
                  A small free project made by <b>Yana Zlatin</b>. Thanks for being here 💜
                </div>
              </div>
              <div style={T.pill}>Free • Student project • Early version</div>
            </div>

            <div style={T.grid} className="__hp_grid__">
              {/* LEFT */}
              <div style={T.box}>
                <h3 style={T.boxTitle}>How it works (right now)</h3>
                <ul style={T.ul}>
                  <li style={T.li}>
                    The site is <b>free</b>, so to keep database space small:
                    <br />
                    <b>only one picture</b> and <b>one letter per user</b> are supported for now.
                  </li>
                  <li style={T.li}>
                    If you choose a <b>preference</b>, only that gender will be able to see you.
                    <br />
                    If you choose <b>“doesn’t matter”</b>, everyone can see you.
                  </li>
                  <li style={T.li}>
                    If you find bugs or weird behavior — please report it 🙏
                  </li>
                </ul>

                <div style={T.divider} />

                <div style={T.warn}>
                  ⚠️ <b>Privacy & safety note:</b> this site currently has <b>no serious security</b>.
                  <br />
                  Please don’t share personal information (full name, address, private socials, etc).
                </div>

                <div style={T.fine}>
                  Tip: Keep your “Info” cute + general. Use the “Contact” field carefully.
                </div>

                <div style={T.divider} />

                <h3 style={T.boxTitle}>Privacy basics</h3>
                <ul style={T.ul}>
                  <li style={T.li}>
                    There's currently no way to verify anyone's identity or age on this site — use your own judgment about who you talk to and what you share.
                  </li>
                  <li style={T.li}>
                    Any info you enter here (profile details, letters, contact info, etc.) is entered entirely at your own discretion and your own risk. You're responsible for what you choose to share and with whom — this project has no way to control or take responsibility for what happens with it once it's shared.
                  </li>
                  <li style={T.li}>
                    You're responsible for the content you post — don't post identifying details about other people without their consent.
                  </li>
                  <li style={T.li}>
                    Nothing on this site is professional advice (legal, medical, or otherwise) — use it at your own discretion.
                  </li>
                  <li style={T.li}>
                    Uptime and full security aren't guaranteed — this is a small volunteer project, not a professionally maintained platform.
                  </li>
                </ul>
                <div style={T.fine}>
                  Adapted from <a href="https://www.aspec.org.il/terms" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.85)" }}>aspec.org.il's terms</a>.
                </div>
              </div>

              {/* RIGHT */}
              <div style={T.box}>
                <h3 style={T.boxTitle}>Contact me</h3>
                <p style={T.p}>
                  Fastest way: WhatsApp.
                </p>

                <div style={T.btnRow}>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" style={T.bigBtn}>
                    💬 Message me on WhatsApp
                  </a>
                </div>

                <div style={T.divider} />

                <h3 style={T.boxTitle}>Boost my ego (optional)</h3>
                <p style={T.p}>
                  If you want to pay me to boost my ego, I’ll be happy 😄
                </p>

                <div style={T.btnRow}>
                  <a href={BIT_LINK} target="_blank" rel="noreferrer" style={T.miniBtn}>
                    💚 Support via Bit
                  </a>
                </div>

                <div style={T.divider} />

                <h3 style={T.boxTitle}>Bug reports</h3>
                <p style={T.p}>
                  Please include:
                </p>
                <ul style={T.ul}>
                  <li style={T.li}>What you clicked</li>
                  <li style={T.li}>What you expected</li>
                  <li style={T.li}>What happened instead</li>
                </ul>

                <div style={T.fine}>
                  Thank you for helping me improve this 🫶
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}