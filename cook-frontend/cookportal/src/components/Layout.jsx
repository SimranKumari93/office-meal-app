import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children, route, setRoute }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggle = () => setSidebarOpen(s => !s);
  const close = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <Navbar onToggleSidebar={toggle} />
      <Sidebar open={sidebarOpen} onClose={close} active={route} onNavigate={setRoute} />
      <main className="layout-main" onClick={() => sidebarOpen && close()}>
        {children}
      </main>
    </div>
  );
}
