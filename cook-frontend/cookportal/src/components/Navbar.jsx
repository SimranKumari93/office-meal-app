import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header className="navbar">
      <div style={{display:"flex",alignItems:"center",gap:12}}>
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
          style={{padding:8,borderRadius:8,background:"transparent",border:"1px solid rgba(0,0,0,0.06)",cursor:"pointer"}}
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
