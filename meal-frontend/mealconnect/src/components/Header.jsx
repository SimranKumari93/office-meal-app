import React from "react";

export default function Header({ theme, setTheme, user }) {
  return (
    <header className="navbar">
      <div className="brand" style={{ cursor: "pointer" }}>
        <div className="logo">MC</div>
        <div>
          <h1>MealConnect</h1>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Office Meal Manager</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          title="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="theme-btn"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>{user?.name}</div>
          <div className="nav-avatar">
            <img src="/images/user.svg" alt="avatar" width={36} height={36} />
          </div>
        </div>
      </div>
    </header>
  );
}
