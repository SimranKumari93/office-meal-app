import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children, route, setRoute }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // close mobile sidebar when route changes
  useEffect(()=> setMobileOpen(false), [route]);

  return (
    <div className="app-layout">
      <Navbar />
      <div style={{display:"flex",alignItems:"flex-start"}}>
        <Sidebar open={mobileOpen} active={route} onNavigate={setRoute} />
        <main className="layout-main">
          {children}
        </main>
      </div>
    </div>
  );
}
