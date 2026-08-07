import React from "react";
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
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

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

        /* Nav is now a plain flex row — no big pill container behind it,
           so individual items carry the weight instead of the whole bar. */
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

        /* Only "Home" (the active route) reads as selected — solid plum fill. */
        .sp-navbtn.is-active{
          background: rgba(111, 76, 139, 0.38);
          border-color: rgba(111, 76, 139, 0.65);
          color: #ffffff;
          box-shadow: 0 0 0 3px rgba(111, 76, 139, 0.20);
        }

        /* Logout: quiet text link, pushed to the far right, no pill. */
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

        @media (max-width: 720px){
          .sp-topbar__inner{ gap:10px; }
          .sp-brand{ width: 100%; justify-content:center; }
          .sp-navbar-buttons{ width: 100%; justify-content:center; }
          .sp-logout{ margin-left: 0; width: 100%; text-align: center; }
        }
      `}</style>

      <header className="sp-topbar">
        <div className="sp-topbar__inner">
          <button className="sp-brand" type="button" onClick={() => navigate(homePath)} aria-label="Home">
            <span className="sp-brand__icon">{brandIcon}</span>
            <span className="sp-brand__text">{brandText}</span>
          </button>

          <nav className="sp-navbar-buttons" aria-label="Main navigation">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {showLogout && (
            <button className="sp-logout" type="button" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </header>
    </>
  );
}