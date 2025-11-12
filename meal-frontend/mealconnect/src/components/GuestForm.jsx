import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export default function GuestForm({ invitedById, date, onGuestAdded }) {
  const [guestName, setGuestName] = useState("");
  const [mealTime, setMealTime] = useState("Lunch");
  const [preference, setPreference] = useState("Veg");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e && e.preventDefault();
    setSaving(true);
    // optimistic local update: notify parent immediately so summary increments even if backend fails
    onGuestAdded && onGuestAdded({ meal_time: mealTime, meal_type: preference });
    setGuestName("");

    try {
      await axios.post(`${API_BASE}/guest-entries/`, {
        invited_by: invitedById,
        guest_name: guestName,
        date,
        meal_time: mealTime,
        meal_type: preference,
      });
      alert("Guest added.");
    } catch (err) {
      console.error(err);
      // keep optimistic update but inform user
      alert("Guest saved locally but failed to persist to server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card guest-form" onSubmit={submit}>
      <h3 style={{ marginTop: 0 }}>Add Guest</h3>
      <input className="input" placeholder="Guest Name (optional)" value={guestName} onChange={(e) => setGuestName(e.target.value)} />

      <div>
        <div style={{marginBottom:8,fontWeight:600}}>Meal Time</div>
        <div style={{display:'flex',gap:8,marginBottom:10}}>
          {['Breakfast','Lunch','Dinner'].map(mt=> (
            <button type="button" key={mt} onClick={()=>setMealTime(mt)} className={`pill ${mealTime===mt? 'selected':''}`}>{mt}</button>
          ))}
        </div>
      </div>
curl http://127.0.0.1:8000/api/summary/daily/?date=2025-11-10
      <div>
        <div style={{marginBottom:8,fontWeight:600}}>Preference</div>
        <div style={{display:'flex',gap:8,marginBottom:10}}>
          {['Veg','Non-Veg','Salad'].map(p=> (
            <button type="button" key={p} onClick={()=>setPreference(p)} className={`pill ${preference===p? 'selected':''}`}>{p}</button>
          ))}
        </div>
      </div>

      <button className="btn" type="submit" disabled={saving}>Add Guest</button>
    </form>
  );
}



/* ---PREVIOUS CODE---- */

// import React, { useState } from "react";
// import axios from "axios";
// const API_BASE = "http://127.0.0.1:8000/api";

// export default function GuestForm({ invitedById, date, onGuestAdded }) {
//   const [name, setName] = useState("");
//   const [mealTime, setMealTime] = useState("Lunch");
//   const [preference, setPreference] = useState("Veg");
//   const [saving, setSaving] = useState(false);

//   const saveGuest = async (e) => {
//     e && e.preventDefault();
//     setSaving(true);
//     try {
//       await axios.post(`${API_BASE}/guest-entries/`, {
//         invited_by: invitedById,
//         guest_name: name,
//         date,
//         meal_type: preference,
//         meal_time: mealTime
//       });
//       onGuestAdded && onGuestAdded({ meal_time: mealTime, meal_type: preference });
//       setName("");
//       alert("Guest added");
//     } catch (err) {
//       alert("Failed to add guest");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <form className="card guest-form" onSubmit={saveGuest}>
//       <h3 style={{marginTop:0}}>Add Guest</h3>
//       <input className="input" placeholder="Guest Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
//       <select className="input" value={mealTime} onChange={e=>setMealTime(e.target.value)}>
//         <option>Breakfast</option><option>Lunch</option><option>Dinner</option>
//       </select>
//       <select className="input" value={preference} onChange={e=>setPreference(e.target.value)}>
//         <option>Veg</option><option>Non-Veg</option><option>Salad</option>
//       </select>
//       <button className="btn" type="submit" disabled={saving}>Add Guest</button>
//     </form>
//   );
// }


// // import React, { useState } from "react";

// // export default function GuestForm({ onSave }) {
// //   const [g, setG] = useState({ name:"", meal_time:"Lunch", preference:"Veg" });

// //   function submit(e){
// //     e.preventDefault();
// //     onSave && onSave(g);
// //   }

// //   return (
// //     <div className="card" style={{marginTop:14}}>
// //       <h3 style={{marginTop:0}}>Guest Meal</h3>
// //       <form className="guest-form" onSubmit={submit}>
// //         <input className="input" placeholder="Guest Name (optional)" value={g.name} onChange={e=>setG({...g,name:e.target.value})} />
// //         <select className="input" value={g.meal_time} onChange={e=>setG({...g,meal_time:e.target.value})}>
// //           <option>Breakfast</option><option>Lunch</option><option>Dinner</option>
// //         </select>
// //         <select className="input" value={g.preference} onChange={e=>setG({...g,preference:e.target.value})}>
// //           <option>Veg</option><option>Non-Veg</option><option>Salad</option>
// //         </select>
// //         <button className="btn" type="submit">Save</button>
// //       </form>
// //     </div>
// //   );
// // }
