import React, { useState, useEffect } from "react";
import axios from "axios";
const API_BASE = "http://127.0.0.1:8000/api";

const weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

export default function CookPortal() {
  const [day, setDay] = useState(weekdays[0]);
  const [menu, setMenu] = useState({breakfast:{veg:"",nonveg:"",salad:""}, lunch:{veg:"",nonveg:"",salad:""}, dinner:{veg:"",nonveg:"",salad:""}});
  const [saving, setSaving] = useState(false);

  useEffect(()=> {
    // try backend first, fall back to localStorage
    axios.get(`${API_BASE}/menu/?day=${day}`).then(res => {
      if (res.data) setMenu(res.data);
    }).catch(()=> {
      const stored = localStorage.getItem('office_menus');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed[day]) setMenu(parsed[day]);
        } catch(e){}
      }
    });
  }, [day]);

  const handleChange = (meal, key, value) => {
    setMenu(m => ({...m, [meal]: {...m[meal], [key]: value}}));
  };

  const save = async () => {
    setSaving(true);
    try {
      // save locally first
      const stored = localStorage.getItem('office_menus');
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[day] = menu;
      localStorage.setItem('office_menus', JSON.stringify(parsed));

      // broadcast an event so other components can refresh
      window.dispatchEvent(new CustomEvent('office:menus:updated', { detail: { day, menu } }));

  // attempt backend save (best-effort) - backend Menu model expects a `data` JSON field
  await axios.post(`${API_BASE}/menu/`, { day, data: menu }).catch(()=>{});
      alert("Menu saved (local). Backend save attempted.");
    } catch (err) {
      alert("Save failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2 style={{marginTop:0}}>Cook Portal — Update Menu</h2>
        <div style={{marginBottom:12}}>
          <label>Choose Day: </label>
          <select value={day} onChange={e=>setDay(e.target.value)} className="input">
            {weekdays.map(d=> <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {["breakfast","lunch","dinner"].map(meal=>(
          <div key={meal} style={{marginBottom:10}}>
            <h4 style={{marginBottom:6,textTransform:"capitalize"}}>{meal}</h4>
            <input className="input" placeholder="Veg" value={menu[meal]?.veg || ""} onChange={e=>handleChange(meal,"veg",e.target.value)} />
            <input className="input" placeholder="Non-Veg" value={menu[meal]?.nonveg || menu[meal]?.nonVeg || ""} onChange={e=>handleChange(meal,"nonveg",e.target.value)} />
            <input className="input" placeholder="Salad" value={menu[meal]?.salad || ""} onChange={e=>handleChange(meal,"salad",e.target.value)} />
          </div>
        ))}

        <button className="btn" onClick={save} disabled={saving}>{saving? "Saving...":"Save Menu"}</button>
      </div>
    </div>
  );
}
