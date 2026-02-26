import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function TopBar({
  brandText = "SPADES",
  brandIcon = "♠",
  homePath = "/home",
  links = [
    { to: "/home", label: "Home" },
    { to: "/profile", label: "Profile" },
    { to: "/saved", label: "Saved" },
  ],
  showLogout = true,
}) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    "sp-navbtn" + (isActive ? " is-active" : "");

  return (
    <>
      <style>{`
        .sp-topbar {
          width: 100%;
          padding: 14px 16px;
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
          background:
            linear-gradient(90deg, rgba(18,2,24,0.68), rgba(11,16,38,0.58));
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }

        .sp-topbar__inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .sp-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          cursor: pointer;
          padding: 10px 12px;
          border-radius: 14px;
          color: rgba(255,255,255,0.92);
          box-shadow: 0 12px 40px rgba(0,0,0,0.22);
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          white-space: nowrap;
        }

        .sp-brand:hover {
          transform: translateY(-1px);
          border-color: rgba(255,255,255,0.20);
          box-shadow: 0 18px 60px rgba(0,0,0,0.30);
        }

        .sp-brand__icon { font-size: 20px; }
        .sp-brand__text { font-size: 16px; font-weight: 900; letter-spacing: 0.4px; }

        .sp-navbar-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 12px 40px rgba(0,0,0,0.22);
          flex-wrap: wrap;
        }

        .sp-navbtn {
          appearance: none;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 14px;
          padding: 10px 14px;
          min-height: 40px;
          line-height: 1;
          font-size: 14px;
          font-weight: 800;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.92);
          text-decoration: none;
          white-space: nowrap;

          cursor: pointer;
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease, background-color .16s ease;
        }

        a.sp-navbtn:visited { color: rgba(255,255,255,0.92); }

        .sp-navbtn:hover {
          transform: translateY(-1px);
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.10);
          box-shadow: 0 14px 45px rgba(0,0,0,0.26);
        }

        .sp-navbtn.is-active {
          border-color: rgba(255,110,199,0.60);
          box-shadow: 0 0 0 3px rgba(255,110,199,0.18);
          background:
            linear-gradient(135deg, rgba(255,110,199,0.22), rgba(167,139,250,0.18), rgba(125,211,252,0.14));
        }

        .sp-navbtn--danger {
          border-color: rgba(255,80,80,0.28);
          color: rgba(255,160,160,0.95);
        }

        .sp-navbtn--danger:hover {
          border-color: rgba(255,80,80,0.42);
          background: rgba(255,80,80,0.12);
          box-shadow: 0 14px 45px rgba(255,80,80,0.12);
        }

        /* Mobile: keep it clean */
        @media (max-width: 720px) {
          .sp-topbar__inner { flex-direction: column; align-items: stretch; }
          .sp-brand { width: 100%; justify-content: center; }
          .sp-navbar-buttons { justify-content: center; }
        }

        /* Nice focus ring */
        .sp-brand:focus, .sp-navbtn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255,110,199,0.22);
        }
      `}</style>

      <header className="sp-topbar">
        <div className="sp-topbar__inner">
          <button
            className="sp-brand"
            type="button"
            onClick={() => navigate(homePath)}
            aria-label="Home"
          >
            <span className="sp-brand__icon">{brandIcon}</span>
            <span className="sp-brand__text">{brandText}</span>
          </button>

          <nav className="sp-navbar-buttons" aria-label="Main navigation">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}

            {showLogout && (
              <button
                className="sp-navbtn sp-navbtn--danger"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}