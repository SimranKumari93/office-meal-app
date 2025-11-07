import React, { useState } from "react";

/* MealForm: allows toggling Breakfast/Lunch/Dinner and selecting preference per meal */
export default function MealForm({ initial, onSave }) {
  const [state, setState] = useState({
    breakfast: initial?.breakfast || false,
    lunch: initial?.lunch || false,
    dinner: initial?.dinner || false,
    preference: initial?.preference || "Veg"
  });

  const toggle = (k) => setState(s => ({...s, [k]: !s[k]}));
  const setPref = (pref) => setState(s=>({...s, preference: pref}));

  return (
    <div className="card">
      <div className="dashboard-header">
        <div>
          <div className="date-small">Tomorrow, Nov 07</div>
          <div className="welcome">Coming to Office</div>
        </div>
      </div>

      <div className="meal-list">
        {["breakfast","lunch","dinner"].map(meal=>(
          <div className="meal-row" key={meal}>
            <div className="meal-info">
              <div className="meal-title" style={{textTransform:"capitalize"}}>{meal}</div>
              <div className="pills">
                {["Veg","Non-Veg","Salad"].map(p=>(
                  <div key={p} onClick={()=>setPref(p)} className={`pill ${state.preference===p ? "selected":""}`}>{p}</div>
                ))}
              </div>
            </div>

            <div className="meal-controls">
              <div className={`switch ${state[meal] ? "on":""}`} onClick={()=>toggle(meal)}>
                <div className="knob" />
              </div>
            </div>
          </div>
        ))}

        <div style={{marginTop:12}}>
          <button className="guest-btn" onClick={()=>onSave && onSave(state)}>
            <span style={{fontSize:18}}>＋</span> Add Guest
          </button>
        </div>
      </div>
    </div>
  );
}
