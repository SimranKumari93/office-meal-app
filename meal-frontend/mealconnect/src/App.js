import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

/* Simple router-like state (replace with React Router if you want) */
const ROUTES = {
  LOGIN: "login",
  HOME: "home",
  ADMIN: "admin",
};

export default function App() {
  const [route, setRoute] = useState(ROUTES.LOGIN);
  const [user, setUser] = useState(null); // { employee_id, name, role }
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const onLogin = (userObj) => {
    setUser(userObj);
    setRoute(userObj?.role === "admin" ? ROUTES.ADMIN : ROUTES.HOME);
  };

  const logout = () => {
    setUser(null);
    setRoute(ROUTES.LOGIN);
  };

  return (
    <div className="app-root">
      <Navbar
        user={user}
        onRoute={(r) => setRoute(r)}
        onLogout={logout}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="main-area">
        {route === ROUTES.LOGIN && <Login onLogin={onLogin} onRoute={setRoute} />}
        {route === ROUTES.HOME && user && <Home user={user} />}
        {route === ROUTES.ADMIN && user && <AdminDashboard user={user} />}
        {![ROUTES.LOGIN, ROUTES.HOME, ROUTES.ADMIN].includes(route) && <NotFound />}
      </main>
    </div>
  );
}
