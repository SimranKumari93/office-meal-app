// import React, { useEffect, useState } from "react";
// import MenuCard from "./MenuCard";
// import GuestForm from "./GuestForm";
// import axios from "axios";

// const API_BASE = "http://127.0.0.1:8000";

// export default function Dashboard({ user }) {
//   const tomorrow = new Date(Date.now() + 24*60*60*1000);
//   const date = tomorrow.toISOString().split("T")[0];
//   const dayName = new Date(date).toLocaleString('en-US',{ weekday: 'long' });

//   const [summary, setSummary] = useState({ Breakfast:0, Lunch:0, Dinner:0, Guests:0 });
//   const [showGuest, setShowGuest] = useState(false);

//   useEffect(() => {
//     // fetch aggregated summary (backend endpoint)
//     axios.get(`${API_BASE}/api/summary/?date=${date}`)
//       .then(res => {
//         if (res.data) setSummary(res.data);
//       })
//       .catch(()=>{ /* ignore — will use default */ });
//   }, [date]);

//   const handleSummaryChange = (payload) => {
//     // payload: { type: 'breakfast'|'lunch'|'dinner', confirmed: true }
//     if (payload.confirmed) {
//       const key = payload.type.charAt(0).toUpperCase() + payload.type.slice(1);
//       setSummary(s => ({ ...s, [key]: (s[key] || 0) + 1 }));
//     }
//   };

//   const handleGuestAdded = (g) => {
//     setSummary(s => ({ ...s, Guests: (s.Guests || 0) + 1 }));
//   };

//   return (
//     <div className="page-wrapper">
//       <div className="dashboard-header">
//         <div>
//           <div className="date-small">Tomorrow — {date} ({dayName})</div>
//           <div className="welcome">Hi, {user?.name}</div>
//         </div>
//       </div>

//       <div style={{display:"grid", gap:14}}>
//         <MenuCard user={user} day={dayName} date={date} onSummaryChange={handleSummaryChange} />
//         <div style={{display:"flex", gap:12}}>
//           <div className="card" style={{flex:1}}>
//             <h4 style={{marginTop:0}}>Today's Summary</h4>
//             <div style={{display:"flex",gap:10,marginTop:10}}>
//               <div className="stat-card"><div className="stat-number">{summary.Breakfast}</div><div className="muted">Breakfast</div></div>
//               <div className="stat-card"><div className="stat-number">{summary.Lunch}</div><div className="muted">Lunch</div></div>
//               <div className="stat-card"><div className="stat-number">{summary.Dinner}</div><div className="muted">Dinner</div></div>
//               <div className="stat-card"><div className="stat-number">{summary.Guests}</div><div className="muted">Guests</div></div>
//             </div>
//           </div>

//           <div style={{width:280}}>
//             <div className="card">
//               <h4 style={{marginTop:0}}>Quick Actions</h4>
//               <button className="btn" onClick={()=>setShowGuest(s=>!s)}>{showGuest? "Hide Guest":"Add Guest"}</button>
//             </div>
//             {showGuest && <GuestForm invitedById={user?.id} date={date} onGuestAdded={handleGuestAdded} />}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


  /* ---- PREVIOUS CODE ------ */  
  import React, { useState, useEffect } from "react";
import MealSelection from "./MealSelection";
import GuestForm from "./GuestForm";
import MenuCard from "./MenuCard";
import AwarenessCarousel from "./AwarenessCarousel";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export default function Dashboard({ user }) {
  const tomorrow = new Date(Date.now() + 24*60*60*1000);
  const date = tomorrow.toISOString().split("T")[0];

  const [summary, setSummary] = useState({Breakfast:0,Lunch:0,Dinner:0,Guests:0});
  const [showGuest, setShowGuest] = useState(false);

  useEffect(()=> {
    // fetch daily summary from backend if available
    axios.get(`${API_BASE}/summary/daily/?date=${date}`).then(res=>{
      if(res.data) {
        const mc = res.data.meal_counts || { breakfast:0, lunch:0, dinner:0, attendance_lunch_count:0 };
        const guestList = res.data.guest_breakdown || [];
        const guestTotal = guestList.reduce((s,g)=> s + (g.count||0), 0);
        setSummary({
          Breakfast: mc.breakfast || 0,
          Lunch: (mc.lunch || 0) + (mc.attendance_lunch_count || 0),
          Dinner: mc.dinner || 0,
          Guests: guestTotal
        });
      }
    }).catch(()=>{ /* ignore */ });
  },[date]);

  const handleSummaryChange = (payload) => {
    // payload { type: 'breakfast'|'lunch'|'dinner', choice, confirmed }
    if(payload.confirmed){
      const key = payload.type.charAt(0).toUpperCase() + payload.type.slice(1);
      setSummary(s => ({...s, [key]: (s[key] || 0) + 1}));
    }
  };

  const handleGuestAdded = (guestPayload) => {
    setSummary(s => ({...s, Guests: (s.Guests || 0) + 1}));
  };

  return (
    <div className="page-wrapper">
      <div className="dashboard-header">
        <div>
          <div className="date-small">Tomorrow — {date}</div>
          <div className="welcome">Hi {user?.employee_id || user?.id}</div>
        </div>
      </div>

      <div style={{display:"grid",gap:14}}>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          <div style={{flex:"1 1 320px"}}><MenuCard day={new Date(date).toLocaleString('en-US',{weekday:'long'})} /></div>
          <div style={{flex:"1 1 320px"}}><AwarenessCarousel /></div>
        </div>

  <MealSelection user={user} date={date} onSummaryChange={handleSummaryChange} />
        <div style={{display:"flex",gap:12}}>
          <div className="card" style={{flex:1}}>
            <h4 style={{marginTop:0}}>Today's Summary</h4>
            <div style={{display:"flex",gap:10,marginTop:10}}>
              <div className="stat-card"><div className="stat-number">{summary.Breakfast}</div><div className="muted">Breakfast</div></div>
              <div className="stat-card"><div className="stat-number">{summary.Lunch}</div><div className="muted">Lunch</div></div>
              <div className="stat-card"><div className="stat-number">{summary.Dinner}</div><div className="muted">Dinner</div></div>
              <div className="stat-card"><div className="stat-number">{summary.Guests}</div><div className="muted">Guests</div></div>
            </div>
          </div>

          <div style={{width:260}}>
            <div className="card">
              <h4 style={{marginTop:0}}>Quick Actions</h4>
              <button className="btn" onClick={()=>setShowGuest(s=>!s)}>{showGuest? "Hide Guest":"Add Guest"}</button>
            </div>
            {showGuest && <GuestForm invitedById={user?.id} date={date} onGuestAdded={handleGuestAdded} />}
          </div>
        </div>
      </div>
    </div>
  );
}






// import React, { useState } from "react";
// import MealForm from "./MealForm";
// import GuestForm from "./GuestForm";

// export default function Dashboard({ user }) {
//   const [guestOpen, setGuestOpen] = useState(false);
//   const [summary, setSummary] = useState({Breakfast:50,Lunch:60,Dinner:35,Guests:5});

//   function handleMealSave(state){
//     // Call backend API to save meal preference (replace with axios)
//     console.log("Save meal state", state);
//     alert("Preferences saved (demo).");
//   }

//   function handleGuestSave(g){
//     console.log("Guest added", g);
//     alert("Guest added (demo).");
//     setGuestOpen(false);
//   }

//   return (
//     <div className="page-wrapper">
//       <div style={{marginBottom:12}}>
//         <div className="dashboard-header">
//           <div>
//             <div className="date-small">Tomorrow, Nov 07</div>
//             <div className="welcome">Hi, {user.name}</div>
//           </div>
//         </div>
//       </div>

//       <MealForm initial={{}} onSave={handleMealSave} />

//       <div style={{marginTop:14}} className="card">
//         <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
//           <div style={{fontWeight:700}}>Today's Summary</div>
//           <div style={{color:"var(--muted)"}}>Kitchen View</div>
//         </div>

//         <div style={{marginTop:12}} className="grid-2">
//           <div className="stat-card"><div className="stat-number">{summary.Breakfast}</div><div style={{color:"var(--muted)"}}>Breakfast</div></div>
//           <div className="stat-card"><div className="stat-number">{summary.Lunch}</div><div style={{color:"var(--muted)"}}>Lunch</div></div>
//           <div className="stat-card"><div className="stat-number">{summary.Dinner}</div><div style={{color:"var(--muted)"}}>Dinner</div></div>
//           <div className="stat-card"><div className="stat-number">{summary.Guests}</div><div style={{color:"var(--muted)"}}>Guests</div></div>
//         </div>
//       </div>

//       <div style={{marginTop:12}}>
//         <button className="guest-btn" onClick={()=>setGuestOpen(true)}>＋ Add Guest</button>
//       </div>

//       {guestOpen && <GuestForm onSave={handleGuestSave} />}
//     </div>
//   );
// }
