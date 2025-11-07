import React from "react";

export default function AdminDashboard() {
  // Replace with API-driven data
  const stats = {Breakfast:120,Lunch:200,Dinner:80,Guests:12};

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2 style={{marginTop:0}}>Admin Dashboard</h2>
        <div style={{marginTop:12}} className="grid-2">
          <div className="stat-card"><div className="stat-number">{stats.Breakfast}</div><div style={{color:"var(--muted)"}}>Breakfast</div></div>
          <div className="stat-card"><div className="stat-number">{stats.Lunch}</div><div style={{color:"var(--muted)"}}>Lunch</div></div>
          <div className="stat-card"><div className="stat-number">{stats.Dinner}</div><div style={{color:"var(--muted)"}}>Dinner</div></div>
          <div className="stat-card"><div className="stat-number">{stats.Guests}</div><div style={{color:"var(--muted)"}}>Guests</div></div>
        </div>

        <div style={{marginTop:18}}>
          <div style={{fontWeight:700}}>Weekly Trends</div>
          <div style={{height:120,display:"flex",alignItems:"end",gap:8,marginTop:10}}>
            {[40,60,55,70,50,80,65].map((v,i)=>(
              <div key={i} style={{width:18,height:v,background:"linear-gradient(180deg,#7cc3ff,#2756d6)",borderRadius:6}} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
