import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function TopBar({
  brandText = "SPADES",
  brandIcon = "♠",
  homePath = "/home",
  links = [
    { to: "/home", label: "Home" },
    { to: "/profile", label: "My Profile" },
    { to: "/saved", label: "Saved" },
    { to: "/random", label: "Let luck choose" },
    { to: "/latters", label: "Letters" },
    { to: "/Infopage", label: "Info and contacts" },
  ],
  showLogout = true,
}) {
  const navigate = useNavigate();

  // ✅ NEW — controls whether the mobile menu is open. Only matters below
  // the 720px breakpoint; on desktop the CSS keeps everything visible
  // regardless of this value.
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  // ✅ NEW — close the menu whenever a link (or logout) is tapped, so
  // navigating doesn't leave the drawer hanging open on the next page.
  const closeMenu = () => setMenuOpen(false);

  // ✅ NEW — close on Escape, same as the rest of the app's modals.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // ✅ NEW — lock background scroll while the mobile drawer is open,
  // same pattern as the lightbox/filter modals elsewhere in the app.
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClass = ({ isActive }) => "sp-navbtn" + (isActive ? " is-active" : "");

  return (
    <>
      <style>{`
        .sp-topbar{
          width:100%;
          padding:14px 16px;
          position: sticky;
          top:0;
          z-index:100000;
          backdrop-filter: blur(4px);
          background: linear-gradient(90deg, rgba(16,2,22,0.93), rgba(10,14,34,0.90));
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }

        .sp-topbar__inner{
          max-width:1100px;
          margin:0 auto;
          display:flex;
          align-items:center;
          justify-content:flex-start;
          gap:16px;
          flex-wrap:wrap;
        }

        .sp-brand{
          display:inline-flex;
          align-items:center;
          gap:10px;
          border:1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
          cursor:pointer;
          padding:10px 12px;
          border-radius:14px;
          color: rgba(255,255,255,0.92);
          box-shadow: 0 12px 40px rgba(0,0,0,0.22);
          white-space:nowrap;
          flex:0 0 auto;
        }
        .sp-brand__icon{ font-size:20px; }
        .sp-brand__text{ font-size:16px; font-weight:900; letter-spacing:0.4px; }

        /* Nav is a plain flex row on desktop — no big pill container
           behind it, so individual items carry the weight instead of
           the whole bar. Becomes a slide-in drawer on mobile (see the
           media query below). */
        .sp-navbar-buttons{
          display:flex;
          align-items:center;
          gap:6px;
          flex-wrap:wrap;
          flex: 1 1 auto;
        }

        /* Ghost by default: quiet text, no border/fill until hovered or active. */
        .sp-navbtn{
          appearance:none;
          border:1px solid transparent;
          border-radius:12px;
          padding:9px 14px;
          min-height:38px;
          line-height:1;
          font-size:14px;
          font-weight:700;

          display:inline-flex;
          align-items:center;
          justify-content:center;

          background: transparent;
          color: rgba(255,255,255,0.78);
          text-decoration:none;
          white-space:nowrap;

          cursor:pointer;
          transition: transform .16s ease, background-color .16s ease, color .16s ease, border-color .16s ease;
        }

        .sp-navbtn:hover{
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.96);
        }

        /* Only the active route reads as selected — solid plum fill. */
        .sp-navbtn.is-active{
          background: rgba(111, 76, 139, 0.38);
          border-color: rgba(111, 76, 139, 0.65);
          color: #ffffff;
          box-shadow: 0 0 0 3px rgba(111, 76, 139, 0.20);
        }

        /* Logout: quiet text link. Sits far-right on desktop (via
           margin-left:auto inside the flex row), moves under the links
           inside the mobile drawer via the media query. */
        .sp-logout{
          margin-left: auto;
          appearance:none;
          border:none;
          background:transparent;
          padding: 8px 10px;
          font-size:13px;
          font-weight:700;
          color: rgba(255,255,255,0.55);
          cursor:pointer;
          white-space:nowrap;
          transition: color .16s ease;
        }
        .sp-logout:hover{
          color: rgba(255,140,140,0.95);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* ✅ NEW — hamburger toggle button, hidden on desktop */
        .sp-menu-toggle{
          display:none;
          appearance:none;
          border:1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          border-radius:12px;
          width:42px;
          height:42px;
          padding:0;
          margin-left:auto;
          cursor:pointer;
          align-items:center;
          justify-content:center;
          flex:0 0 auto;
        }
        .sp-menu-toggle:hover{
          background: rgba(255,255,255,0.10);
        }

        .sp-menu-toggle__bars{
          position:relative;
          width:20px;
          height:14px;
        }
        .sp-menu-toggle__bars span{
          position:absolute;
          left:0;
          right:0;
          height:2px;
          border-radius:2px;
          background: rgba(255,255,255,0.92);
          transition: transform .22s ease, opacity .22s ease, top .22s ease;
        }
        .sp-menu-toggle__bars span:nth-child(1){ top:0; }
        .sp-menu-toggle__bars span:nth-child(2){ top:6px; }
        .sp-menu-toggle__bars span:nth-child(3){ top:12px; }

        /* Morph into an "X" when open */
        .sp-menu-toggle.is-open .sp-menu-toggle__bars span:nth-child(1){
          top:6px;
          transform: rotate(45deg);
        }
        .sp-menu-toggle.is-open .sp-menu-toggle__bars span:nth-child(2){
          opacity:0;
        }
        .sp-menu-toggle.is-open .sp-menu-toggle__bars span:nth-child(3){
          top:6px;
          transform: rotate(-45deg);
        }

        /* ✅ NEW — dimmed backdrop shown behind the open mobile drawer;
           hidden entirely on desktop. */
        .sp-menu-backdrop{
          display:none;
        }

        @media (max-width: 720px){
          .sp-topbar{ padding: 10px 14px; }

          .sp-topbar__inner{
            gap:10px;
            flex-wrap: nowrap;
          }

          .sp-brand{ flex: 1 1 auto; justify-content:flex-start; }

          /* Hamburger appears only on mobile */
          .sp-menu-toggle{ display:inline-flex; }

          /* Nav collapses into a slide-in drawer, closed by default */
          .sp-navbar-buttons{
            position: fixed;
            top: 0;
            right: 0;
            height: 100dvh;
            width: min(78vw, 300px);
            flex-direction: column;
            align-items: stretch;
            justify-content: flex-start;
            gap: 4px;

            background: linear-gradient(160deg, rgba(20,4,28,0.98), rgba(12,16,38,0.98));
            border-left: 1px solid rgba(255,255,255,0.10);
            box-shadow: -20px 0 60px rgba(0,0,0,0.45);

            padding: 78px 14px 20px;
            box-sizing: border-box;

            transform: translateX(100%);
            transition: transform .26s cubic-bezier(.32,.72,.35,1);
            z-index: 100002;
          }

          .sp-navbar-buttons.is-open{
            transform: translateX(0%);
          }

          .sp-navbtn{
            width:100%;
            justify-content:flex-start;
            padding: 12px 14px;
            font-size: 15px;
          }

          /* Backdrop dims the page behind the open drawer; tapping it closes it */
          .sp-menu-backdrop{
            display:block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            opacity: 0;
            pointer-events: none;
            transition: opacity .22s ease;
            z-index: 100001;
          }
          .sp-menu-backdrop.is-open{
            opacity: 1;
            pointer-events: auto;
          }

          /* Logout moves inside the drawer, under the links, full width */
          .sp-logout{
            margin-left: 0;
            margin-top: 10px;
            width: 100%;
            text-align: left;
            padding: 12px 14px;
            border-top: 1px solid rgba(255,255,255,0.10);
          }
        }
      `}</style>

      <header className="sp-topbar">
        <div className="sp-topbar__inner">
          <button className="sp-brand" type="button" onClick={() => navigate(homePath)} aria-label="Home">
            <span className="sp-brand__icon">{brandIcon}</span>
            <span className="sp-brand__text">{brandText}</span>
          </button>

          {/* ✅ NEW — hamburger toggle, only visible under 720px via CSS */}
          <button
            type="button"
            className={`sp-menu-toggle${menuOpen ? " is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="sp-menu-toggle__bars">
              <span />
              <span />
              <span />
            </span>
          </button>

          {/* On desktop this renders as the normal inline nav row.
              On mobile the media query turns it into a fixed slide-in
              drawer, toggled open/closed by .is-open. */}
          <nav
            className={`sp-navbar-buttons${menuOpen ? " is-open" : ""}`}
            aria-label="Main navigation"
          >
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={closeMenu}>
                {l.label}
              </NavLink>
            ))}

            {showLogout && (
              <button
                className="sp-logout"
                type="button"
                onClick={() => {
                  closeMenu();
                  logout();
                }}
              >
                Logout
              </button>
            )}
          </nav>

          {/* ✅ NEW — tap-to-close backdrop behind the open drawer (mobile only) */}
          <div
            className={`sp-menu-backdrop${menuOpen ? " is-open" : ""}`}
            onClick={closeMenu}
          />
        </div>
      </header>
    </>
  );
}