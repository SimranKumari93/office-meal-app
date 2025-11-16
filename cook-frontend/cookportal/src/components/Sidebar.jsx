import React from "react";

const items = [
  { id: "dashboard", label: "Daily Orders Board" },
  { id: "menu", label: "Menu Management" },
  { id: "employee", label: "Employee Meal Selection" },
  { id: "guest", label: "Guest Tracker" },
  { id: "supply", label: "Supply Reports" },
];

export default function Sidebar({ open, onClose, active, onNavigate }) {
  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${open ? "open" : ""}`} role="navigation">
        <div style={{padding:16, borderBottom:"1px solid rgba(0,0,0,0.04)"}}>
          <strong>Cook Portal</strong>
        </div>

        <nav style={{display:"flex",flexDirection:"column",gap:6,padding:8}}>
          {items.map(it => (
            <button
              key={it.id}
              className={`sidebar-item ${active === it.id ? "active" : ""}`}
              onClick={() => { onNavigate(it.id); onClose(); }}
            >
              {it.label}
            </button>
          ))}
        </nav>

        <div style={{marginTop:"auto",padding:12,fontSize:12,color:"var(--muted)"}}>
          © CookPortal
        </div>
      </aside>
    </>
  );
}
