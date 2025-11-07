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
            <div style={{fontSize:14,color:"var(--muted)"}}>{user.name}</div>
            <button onClick={onLogout} style={{padding:"8px 12px",borderRadius:8,cursor:"pointer"}}>Logout</button>
          </>
        ) : (
          <button onClick={() => onRoute("login")} style={{padding:"8px 12px",borderRadius:8,cursor:"pointer"}}>Login</button>
        )}
      </div>
    </header>
  );
}
