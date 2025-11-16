import React, { useEffect, useState } from "react";

/*
 guest count persisted as cp_guests
*/
export default function GuestTracker() {
  const [guests, setGuests] = useState(0);
  useEffect(()=> {
    setGuests(parseInt(localStorage.getItem("cp_guests") || "0"));
  },[]);

  const update = () => {
    const v = parseInt(prompt("Set expected guest count", guests) || guests);
    if (isNaN(v)) return;
    setGuests(v);
    localStorage.setItem("cp_guests", String(v));
  };

  const orders = JSON.parse(localStorage.getItem("cp_orders") || '{"breakfast":0,"lunch":0,"dinner":0}');
  const totalEmployee = orders.breakfast + orders.lunch + orders.dinner;

  return (
    <div className="page">
      <div className="card">
        <h2 style={{marginTop:0}}>Guest Tracker</h2>
        <p style={{color:"var(--muted)"}}>Enter expected number of non-employee guests.</p>

        <div style={{background:"#ecfdf5",padding:16,borderRadius:8,marginTop:12}}>
          <label style={{fontWeight:700,marginRight:8}}>Expected Guest Count:</label>
          <input type="number" value={guests} onChange={(e)=>setGuests(Number(e.target.value))} style={{width:80}}/>
          <button className="btn" onClick={update} style={{marginLeft:12}}>Update Guest Count</button>
        </div>

        <div style={{marginTop:16,background:"#e6f2ff",padding:18,borderRadius:8,textAlign:"center"}}>
          <div style={{fontWeight:700}}>Current Total Expected Diners:</div>
          <div style={{fontSize:20,fontWeight:800}}>{totalEmployee + guests} (Employee Orders: {totalEmployee} + Guests: {guests})</div>
        </div>
      </div>
    </div>
  );
}
