import React, { useState } from "react";
import MealForm from "./MealForm";
import GuestForm from "./GuestForm";

export default function Dashboard({ user }) {
  const [guestOpen, setGuestOpen] = useState(false);
  const [summary, setSummary] = useState({Breakfast:50,Lunch:60,Dinner:35,Guests:5});

  function handleMealSave(state){
    // Call backend API to save meal preference (replace with axios)
    console.log("Save meal state", state);
    alert("Preferences saved (demo).");
  }

  function handleGuestSave(g){
    console.log("Guest added", g);
    alert("Guest added (demo).");
    setGuestOpen(false);
  }

  return (
    <div className="page-wrapper">
      <div style={{marginBottom:12}}>
        <div className="dashboard-header">
          <div>
            <div className="date-small">Tomorrow, Nov 07</div>
            <div className="welcome">Hi, {user.name}</div>
          </div>
        </div>
      </div>

      <MealForm initial={{}} onSave={handleMealSave} />

      <div style={{marginTop:14}} className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:700}}>Today's Summary</div>
          <div style={{color:"var(--muted)"}}>Kitchen View</div>
        </div>

        <div style={{marginTop:12}} className="grid-2">
          <div className="stat-card"><div className="stat-number">{summary.Breakfast}</div><div style={{color:"var(--muted)"}}>Breakfast</div></div>
          <div className="stat-card"><div className="stat-number">{summary.Lunch}</div><div style={{color:"var(--muted)"}}>Lunch</div></div>
          <div className="stat-card"><div className="stat-number">{summary.Dinner}</div><div style={{color:"var(--muted)"}}>Dinner</div></div>
          <div className="stat-card"><div className="stat-number">{summary.Guests}</div><div style={{color:"var(--muted)"}}>Guests</div></div>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <button className="guest-btn" onClick={()=>setGuestOpen(true)}>＋ Add Guest</button>
      </div>

      {guestOpen && <GuestForm onSave={handleGuestSave} />}
    </div>
  );
}
