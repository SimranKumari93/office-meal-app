import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api"; // backend API root

export default function MenuCard({ day = "Monday", user = null, date = null, onSummaryChange = null }) {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  // store user choices + confirmed meals
  const [mealSelections, setMealSelections] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });
  const [confirmedMeals, setConfirmedMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  // fetch daily menu
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/menu/?day=${day}`)
      .then((res) => setMenu(res.data))
      .catch(() => setMenu(null))
      .finally(() => setLoading(false));
  }, [day]);

  // load persisted selections for this user+date if present (localStorage)
  useEffect(() => {
    if (!user || !date) return;
    const key = `meal_prefs_${user.employee_id || user.id}_${date}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.selections) setMealSelections(parsed.selections);
        if (parsed.confirmed) setConfirmedMeals(parsed.confirmed);
      } catch(e){}
    }

    // listen for menu updates (from cook portal)
    const handler = (ev) => {
      // if menu updated for this day, refresh
      if (ev?.detail?.day === day) {
        setMenu(ev.detail.menu);
      }
    };
    window.addEventListener('office:menus:updated', handler);
    return () => window.removeEventListener('office:menus:updated', handler);
  }, [user, date, day]);

  // handle independent meal selection
  const handleMealChange = (mealType, value) => {
    if (confirmedMeals[mealType]) return; // block changes if confirmed
    setMealSelections((prev) => ({ ...prev, [mealType]: value }));
  };

  // toggle confirmation
  const toggleConfirm = (mealType) => {
    if (!mealSelections[mealType]) return alert("Please select a meal first!");
    const newConfirmed = !confirmedMeals[mealType];
    setConfirmedMeals((prev) => ({
      ...prev,
      [mealType]: newConfirmed,
    }));

    // notify parent summary and attempt to persist to backend
    const payload = { type: mealType, choice: mealSelections[mealType], confirmed: newConfirmed };
    if (onSummaryChange) onSummaryChange(payload);

    // attempt to save full preference for the day (upsert). Build payload using all current selections
    if (newConfirmed && user && (user.employee_id || user.id)) {
      const emp = user.employee_id || user.id;
      const payload = {
        employee: emp,
        date,
        breakfast: !!mealSelections.breakfast,
        breakfast_type: mealSelections.breakfast || null,
        lunch: !!mealSelections.lunch,
        lunch_type: mealSelections.lunch || null,
        dinner: !!mealSelections.dinner,
        dinner_type: mealSelections.dinner || null,
      };

      axios.post(`${API_BASE}/meal-preferences/`, payload).then((res) => {
        // could use response for further UI state if needed
      }).catch((err) => {
        console.warn('Failed to persist meal preference (soft):', err?.message || err);
      });

      // persist locally
      try {
        const key = `meal_prefs_${emp}_${date}`;
        const saveObj = { selections: { ...mealSelections }, confirmed: { ...confirmedMeals, [mealType]: newConfirmed } };
        localStorage.setItem(key, JSON.stringify(saveObj));
      } catch(e){/* ignore */}
    }
  };

  if (loading) return <div className="card">Loading menu...</div>;
  if (!menu) return <div className="card">No menu available for {day}</div>;

  const meals = ["breakfast", "lunch", "dinner"];

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{menu.day || day} — Menu</h3>

      {meals.map((m) => (
        <div key={m} className="menu-row">
          <div className="menu-title">
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </div>

          <div className="menu-items">
            {["Veg", "Non-Veg", "Salad"].map((option) => (
              <button
                key={option}
                className={`meal-btn ${
                  mealSelections[m] === option ? "selected" : ""
                } ${confirmedMeals[m] ? "locked" : ""}`}
                onClick={() => handleMealChange(m, option)}
                disabled={confirmedMeals[m]}
              >
                {option}
              </button>
            ))}

            <button
              className={`confirm-btn ${
                confirmedMeals[m] ? "confirmed" : ""
              }`}
              onClick={() => toggleConfirm(m)}
            >
              {confirmedMeals[m] ? "Confirmed ✅" : "Confirm"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
