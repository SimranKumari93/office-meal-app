import React from "react";

export default function DateSelector({ date, onChangeDays }) {
  const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="card" style={{ margin: "12px 0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Planning for: {dateStr}</div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="small-btn" onClick={() => onChangeDays(-1)}>◀</button>
        <button className="small-btn" onClick={() => onChangeDays(1)}>▶</button>
      </div>
    </div>
  );
}
