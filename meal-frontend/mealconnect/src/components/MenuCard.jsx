import React from "react";

export default function MenuCard({ item, onAdd, added }) {
  return (
    <div className="menu-item-card card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="menu-item-image" style={{ width: 64, height: 64, borderRadius: 8, background: "#ff9f43", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
          {item.name.split(" ").slice(0,2).map(s => s[0]).join("")}
        </div>

        <div>
          <div style={{ fontWeight: 700 }}>{item.name}</div>
          <div style={{ color: "var(--muted)", marginTop: 6 }}>{item.calories} Kcal / Serve</div>
          <div style={{ marginTop: 6 }}>
            {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#f6c02c" }}>★</span>)}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontWeight: 800, color: "crimson" }}>{item.calories} Cal</div>
        <button className="pill" onClick={onAdd} disabled={added} style={{ background: added ? "#d1ffd7" : "#10b981", color: added ? "#065f46" : "#fff", border: "none" }}>
          {added ? "Added" : "Add"}
        </button>
      </div>
    </div>
  );
}
