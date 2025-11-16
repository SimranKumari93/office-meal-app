import React, { useEffect, useState } from "react";

/*
 Employee selection uses cp_menu as source.
 Selecting a dish increments cp_orders for that slot and persists.
*/
export default function EmployeeMeals() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState({ breakfast:0, lunch:0, dinner:0 });

  useEffect(()=>{
    setMenu(JSON.parse(localStorage.getItem("cp_menu") || "[]"));
    setOrders(JSON.parse(localStorage.getItem("cp_orders") || '{"breakfast":0,"lunch":0,"dinner":0}'));
  },[]);

  const select = (slot) => {
    const next = {...orders, [slot]: (orders[slot] || 0) + 1};
    setOrders(next);
    localStorage.setItem("cp_orders", JSON.stringify(next));
    alert("Meal selected for " + slot);
  };

  const grouped = {
    breakfast: menu.filter(m=>m.slot==="breakfast"),
    lunch: menu.filter(m=>m.slot==="lunch"),
    dinner: menu.filter(m=>m.slot==="dinner"),
  };

  return (
    <div className="page">
      <div className="card">
        <h2 style={{marginTop:0}}>Employee Meal Selection (Sim.)</h2>
        <p style={{color:"var(--muted)"}}>This screen simulates an employee selecting a meal. Selecting increments order counts.</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:12}}>
          {["breakfast","lunch","dinner"].map(slot=>(
            <div key={slot} className="meal-box">
              <h3 style={{marginTop:0,textTransform:"capitalize"}}>{slot} Menu</h3>

              {grouped[slot].length === 0 ? (
                <p style={{color:"var(--muted)"}}>No dishes available. Update the Menu.</p>
              ) : (
                grouped[slot].map(d=>(
                  <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                    <div>
                      <div style={{fontWeight:700}}>{d.name}</div>
                      <div style={{color:"var(--muted)",fontSize:13}}>{d.calories} Kcal / Serve</div>
                    </div>
                    <button className="btn small" onClick={()=>select(slot)}>Select</button>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
