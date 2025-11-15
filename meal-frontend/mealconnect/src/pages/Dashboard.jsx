import React, { useState } from "react";
import DateSelector from "../components/DateSelector";
import MealTabs from "../components/MealTabs";
import CategoryFilter from "../components/CategoryFilter";
import MenuGrid from "../components/MenuGrid";
import CalorieFooter from "../components/CalorieFooter";

export default function Dashboard({ user }) {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const [date, setDate] = useState(tomorrow);
  const [activeMeal, setActiveMeal] = useState("Lunch"); // default selected
  const [category, setCategory] = useState("All");

  // selections: { Breakfast: [], Lunch: [], Dinner: [] }
  const [selections, setSelections] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
  });

  const addItem = (mealSlot, item) => {
    setSelections((prev) => {
      if (prev[mealSlot].find((i) => i.id === item.id)) return prev;
      return { ...prev, [mealSlot]: [...prev[mealSlot], item] };
    });
  };

  const removeItem = (mealSlot, itemId) => {
    setSelections((prev) => ({
      ...prev,
      [mealSlot]: prev[mealSlot].filter((i) => i.id !== itemId),
    }));
  };

  const changeDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d);
  };

  return (
    <div className="page-wrapper">
      <div className="dashboard-header card">
        <div>
          <div className="date-small">
            Planning for: {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          </div>
          <h1 className="dashboard-title">Dashboard</h1>
        </div>
      </div>

      <DateSelector date={date} onChangeDays={changeDate} />

      <div className="card" style={{ padding: 20 }}>
        <h3>Employee Menu Planning</h3>

        {/* Top boxes showing selected items */}
        <div className="menu-selection-boxes" style={{ display: "flex", gap: 14, marginTop: 12, marginBottom: 16 }}>
          {["Breakfast", "Lunch", "Dinner"].map((slot) => (
            <div key={slot} className="card" style={{ flex: 1, minHeight: 80, display: "flex", flexDirection: "column", justifyContent: "center", padding: 18 }}>
              <div style={{ fontWeight: 700 }}>{slot} Menu</div>
              <div style={{ color: "var(--muted)", marginTop: 8 }}>
                {selections[slot].length === 0 ? `No items selected for ${slot}.` : selections[slot].map(i => i.name).join(", ")}
              </div>
            </div>
          ))}
        </div>

        {/* Meal Tabs and Category Filter */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>Adding to:</div>
            <MealTabs active={activeMeal} setActive={setActiveMeal} />
          </div>

          <CategoryFilter category={category} setCategory={setCategory} />
        </div>

        {/* Menu Grid */}
        <div style={{ marginTop: 16 }}>
          <MenuGrid
            selectedCategory={category}
            dietaryFilter="all"
            addItem={(item) => addItem(activeMeal, item)}
            mealSlot={activeMeal}
            removeItem={removeItem}
            selections={selections}
          />
        </div>
      </div>

      {/* Employee summary + calorie footer */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 14, marginTop: 14 }}>
        {/* Left: simulated employee summary (kept simple) */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Employee Meal Summary (Simulated)</h3>
          <p style={{ color: "var(--muted)" }}>Tracking today's registrations out of <strong>250</strong> staff.</p>

          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            {[
              { label: "Breakfast", count: 115, color: "var(--accent-2)" },
              { label: "Lunch", count: 144, color: "var(--accent)" },
              { label: "Dinner", count: 55, color: "#f87171" }
            ].map((s) => (
              <div key={s.label} style={{ flex: 1, padding: 16, borderRadius: 12, background: "var(--card)" }}>
                <div style={{ color: "var(--muted)" }}>{s.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{s.count}</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>/250 staff</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick actions */}
        <div>
          <div className="card" style={{ padding: 18 }}>
            <h4 style={{ marginTop: 0 }}>Next Day Menu Calorie Intake</h4>
            <p style={{ color: "var(--muted)" }}>Total estimated calories for the selected menu items.</p>
            <CalorieFooter selections={selections} />
          </div>
        </div>
      </div>
    </div>
  );
}
