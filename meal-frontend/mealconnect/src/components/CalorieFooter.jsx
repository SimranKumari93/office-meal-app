import React, { useMemo } from "react";

/* calculate totals from selections */
export default function CalorieFooter({ selections }) {
  const totals = useMemo(() => {
    let breakfast = 0, lunch = 0, dinner = 0;
    const sum = (arr) => arr.reduce((s, it) => s + (it.calories || 0), 0);
    breakfast = sum(selections.Breakfast || []);
    lunch = sum(selections.Lunch || []);
    dinner = sum(selections.Dinner || []);
    return { breakfast, lunch, dinner, totalCalories: breakfast + lunch + dinner };
  }, [selections]);

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ padding: 12, borderRadius: 12, background: "rgba(255,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700 }}>Total Calories:</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "crimson" }}>{totals.totalCalories} Cal</div>
        </div>
      </div>

      <button className="btn" style={{ marginTop: 14, width: "100%", borderRadius: 12 }}>
        Finalize Menu
      </button>
    </div>
  );
}
