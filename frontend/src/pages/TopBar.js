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
          padding: 12px 16px;
            width: 100%;
        }

        .sp-topbar__inner {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: space-between;
        }

        .sp-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 0;
          background: transparent;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 10px;
        }

        .sp-brand__icon { font-size: 20px; }
        .sp-brand__text { font-size: 18px; font-weight: 700; }

        .sp-navbar-buttons {
          display: flex;
          align-items: center;
          gap: 30px;
          padding: 10px 12px;
          background: #4c244f;
          border-radius: 12px;
          flex-wrap: wrap;
          width: 100%;
          margin-left: auto;
        }

        .sp-navbtn {
          appearance: none;
          border: 2px solid transparent;
          border-radius: 10px;
          padding: 10px 14px;
          min-height: 42px;
          line-height: 1;
          font-size: 16px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          background: #111;
          color: #fff;
          text-decoration: none;
          white-space: nowrap;

          cursor: pointer;
          transition: filter .2s ease, background-color .2s ease, border-color .2s ease;
        }

        a.sp-navbtn:visited { color: #fff; }

        .sp-navbtn:hover {
          background: #444;
          filter: brightness(0.9);
        }

        .sp-navbtn.is-active {
          border-color: #fff;
        }

        .sp-navbtn--danger {
          color: #ff4d4d;
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
              <button className="sp-navbtn sp-navbtn--danger" type="button" onClick={logout}>
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}