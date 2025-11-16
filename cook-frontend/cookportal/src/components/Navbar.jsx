import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar({ onToggleSidebar }) {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header className="navbar">
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button className="menu-burger" onClick={onToggleSidebar} aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>

        <div className="brand" style={{display:"flex",alignItems:"center",gap:12}}>
          <div className="logo">CP</div>
          <div>
            <div style={{fontWeight:700}}>Cook Portal</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>Canteen Cook Dashboard</div>
          </div>
        </div>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button
          className="theme-btn"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div className="nav-avatar" title="Profile">
          <img src="/images/user.svg" alt="user" width={36} height={36} />
        </div>
      </div>
    </header>
  );
}
