import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000"; // change if needed

export default function MenuCard({ user, day = "Monday", date, onSummaryChange }) {
  // props:
  // user: { id, employee_id, name }
  // day: weekday name, date: 'YYYY-MM-DD'
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({ breakfast: null, lunch: null, dinner: null });
  const [confirmed, setConfirmed] = useState({ breakfast: false, lunch: false, dinner: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/api/menu/?day=${day}`)
      .then((res) => {
        setMenu(res.data || null);
      })
      .catch(() => setMenu(null))
      .finally(() => setLoading(false));
  }, [day]);

  // handle local selection per meal
  const handleSelect = (meal, opt) => {
    if (confirmed[meal]) return;
    setSelections((s) => ({ ...s, [meal]: opt }));
  };

  // Confirm single meal: save to backend as an upsert for the whole day's meal preferences
  const handleConfirm = async (meal) => {
    const choice = selections[meal];
    if (!choice) return alert("Please select Veg / Non-Veg / Salad before confirming.");
    if (!user || !(user.employee_id || user.id)) return alert("Please login first.");

    setSaving(true);
    const emp = user.employee_id || user.id;
    const payload = {
      employee: emp,
      date,
      breakfast: !!selections.breakfast,
      breakfast_type: selections.breakfast || null,
      lunch: !!selections.lunch,
      lunch_type: selections.lunch || null,
      dinner: !!selections.dinner,
      dinner_type: selections.dinner || null,
    };

    try {
      await axios.post(`${API_BASE}/api/meal-preferences/`, payload);
      // mark confirmed locally
      setConfirmed((c) => ({ ...c, [meal]: true }));
      // update summary in parent (increment corresponding meal count)
      onSummaryChange && onSummaryChange({ type: meal, confirmed: true });
    } catch (err) {
      console.error("save error", err);
      alert("Failed to save preference. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card">Loading menu...</div>;
  if (!menu) return <div className="card">No menu available for {day}. (Cook hasn't published menu yet.)</div>;

  const meals = ["breakfast", "lunch", "dinner"];

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{menu.day || day} — Menu</h3>

      {meals.map((m) => (
        <div key={m} className="menu-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div className="menu-title">{m.charAt(0).toUpperCase() + m.slice(1)}</div>
            <div className="menu-items" style={{ marginTop: 6 }}>
              <div><strong>Veg:</strong> {menu[m]?.veg || "—"}</div>
              <div><strong>Non-Veg:</strong> {menu[m]?.nonveg || menu[m]?.nonVeg || "—"}</div>
              <div><strong>Salad:</strong> {menu[m]?.salad || "—"}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["Veg", "Non-Veg", "Salad"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(m, opt)}
                  disabled={confirmed[m]}
                  className={`pill ${selections[m] === opt ? "selected" : ""}`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => handleConfirm(m)}
                disabled={confirmed[m] || saving}
                className={`confirm-btn ${confirmed[m] ? "confirmed" : ""}`}
              >
                {confirmed[m] ? "Confirmed ✅" : "Confirm"}
              </button>
              {confirmed[m] && <div style={{ color: "var(--muted)", fontSize: 13 }}>Saved</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



/* -----PREVIOUS CODE ------*/ 

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000/api"; // change if needed

// export default function MenuCard({ day = "Monday" }) {
//   const [menu, setMenu] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     axios.get(`${API_BASE}/menu/?day=${day}`)
//       .then(res => setMenu(res.data))
//       .catch(() => setMenu(null))
//       .finally(() => setLoading(false));
//   }, [day]);

//   if (loading) return <div className="card">Loading menu...</div>;
//   if (!menu) return <div className="card">No menu available for {day}</div>;

//   const meals = ["breakfast", "lunch", "dinner"];
//   return (
//     <div className="card">
//       <h3 style={{marginTop:0}}>{menu.day || day} — Menu</h3>
//       {meals.map(m => (
//         <div key={m} className="menu-row">
//           <div className="menu-title">{m.charAt(0).toUpperCase()+m.slice(1)}</div>
//           <div className="menu-items">
//             <div><strong>Veg:</strong> {menu[m]?.veg || "—"}</div>
//             <div><strong>Non-Veg:</strong> {menu[m]?.nonveg || menu[m]?.nonVeg || "—"}</div>
//             <div><strong>Salad:</strong> {menu[m]?.salad || "—"}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
