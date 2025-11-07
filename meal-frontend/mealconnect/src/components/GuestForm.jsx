import React, { useState } from "react";

export default function GuestForm({ onSave }) {
  const [g, setG] = useState({ name:"", meal_time:"Lunch", preference:"Veg" });

  function submit(e){
    e.preventDefault();
    onSave && onSave(g);
  }

  return (
    <div className="card" style={{marginTop:14}}>
      <h3 style={{marginTop:0}}>Guest Meal</h3>
      <form className="guest-form" onSubmit={submit}>
        <input className="input" placeholder="Guest Name (optional)" value={g.name} onChange={e=>setG({...g,name:e.target.value})} />
        <select className="input" value={g.meal_time} onChange={e=>setG({...g,meal_time:e.target.value})}>
          <option>Breakfast</option><option>Lunch</option><option>Dinner</option>
        </select>
        <select className="input" value={g.preference} onChange={e=>setG({...g,preference:e.target.value})}>
          <option>Veg</option><option>Non-Veg</option><option>Salad</option>
        </select>
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  );
}
