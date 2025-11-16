import React, { useEffect, useState } from "react";

/*
  Reads menu, orders, guests from localStorage.
  Calculates totals and shows summary cards similar to screenshot.
*/
export default function Dashboard() {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [guests, setGuests] = useState(0);

  useEffect(() => {
    const m = JSON.parse(localStorage.getItem("cp_menu") || "[]");
    const o = JSON.parse(localStorage.getItem("cp_orders") || '{"breakfast":0,"lunch":0,"dinner":0}');
    const g = parseInt(localStorage.getItem("cp_guests") || "0");
    setMenu(m);
    setOrders(o);
    setGuests(g);
  }, []);

  const totalEmployee = orders.breakfast + orders.lunch + orders.dinner;
  const totalDiners = totalEmployee + guests;
  const prepared = menu.reduce((s,i)=> s + (parseInt(i.prepared||0) || 0), 0);
  const servingsRemaining = Math.max(0, prepared - totalDiners);

  return (
    <div className="page">
      <div className="card">
        <h2 style={{marginTop:0}}>Canteen Dashboard</h2>
        <p style={{color:"var(--muted)"}}>Daily Orders Dashboard (simulated)</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:12}}>
          <div className="stat-card">
            <div style={{color:"var(--muted)"}}>Total Employee Orders</div>
            <div style={{fontSize:28,fontWeight:700}}>{totalEmployee}</div>
          </div>

          <div className="stat-card">
            <div style={{color:"var(--muted)"}}>Expected Guests (Cook Input)</div>
            <div style={{fontSize:28,fontWeight:700}}>{guests}</div>
          </div>

          <div className="stat-card">
            <div style={{color:"var(--muted)"}}>Total Expected Diners</div>
            <div style={{fontSize:28,fontWeight:700}}>{totalDiners}</div>
          </div>
        </div>

        <h3 style={{marginTop:20}}>Preparation Summary</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginTop:10}}>
          <div className="stat-card">
            <div style={{color:"var(--muted)"}}>Total Menu Servings Prepared</div>
            <div style={{fontSize:28,fontWeight:700}}>{prepared}</div>
          </div>
          <div className="stat-card">
            <div style={{color:"var(--muted)"}}>Servings Remaining (Est.)</div>
            <div style={{fontSize:28,fontWeight:700,color:"#16a34a"}}>{servingsRemaining}</div>
          </div>
        </div>

        <h3 style={{marginTop:20}}>Orders by Meal Slot</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:10}}>
          <div className="card centered">
            <div style={{fontSize:18,fontWeight:700}}>Breakfast</div>
            <div style={{fontSize:22,color:"#16a34a"}}>{orders.breakfast}</div>
          </div>
          <div className="card centered">
            <div style={{fontSize:18,fontWeight:700}}>Lunch</div>
            <div style={{fontSize:22,color:"#16a34a"}}>{orders.lunch}</div>
          </div>
          <div className="card centered">
            <div style={{fontSize:18,fontWeight:700}}>Dinner</div>
            <div style={{fontSize:22,color:"#16a34a"}}>{orders.dinner}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
