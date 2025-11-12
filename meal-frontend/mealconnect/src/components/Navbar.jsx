import React from "react";

export default function Navbar({ user, onRoute, onLogout, theme, setTheme }) {
  return (
    <header className="navbar">
      <div className="brand" style={{cursor:"pointer"}} onClick={()=>onRoute(user? (user.role==="admin"?"admin":"home") : "login")}>
        <div className="logo">MC</div>
        <div>
          <h1>MealConnect</h1>
          <div style={{fontSize:12,color:"var(--muted)"}}>Office Meal Manager</div>
        </div>
      </div>

      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <button
          title="Toggle theme"
          onClick={() => setTheme(theme==="dark" ? "light" : "dark")}
          style={{padding:8,borderRadius:8,background:"transparent",border:"1px solid rgba(0,0,0,0.06)",cursor:"pointer"}}
        >
          {theme==="dark" ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            <div style={{fontSize:14,color:"var(--muted)",marginRight:8}} className="nav-username">{user.name}</div>
            <div
              title="Logout"
              role="button"
              tabIndex={0}
              aria-label="Logout"
              onClick={onLogout}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onLogout(); }}
              className="nav-avatar"
            >
              <img src="/images/user.svg" alt="user avatar" width={36} height={36} />
            </div>
          </>
        ) : (
          <div
            title="Login"
            role="button"
            tabIndex={0}
            aria-label="Login"
            onClick={() => onRoute && onRoute('login')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onRoute && onRoute('login'); }}
            className="nav-avatar"
          >
            <img src="/images/user.svg" alt="login avatar" width={36} height={36} />
          </div>
        )}
      </div>
    </header>
  );
}
