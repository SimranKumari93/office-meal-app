import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ForgotPin from "./pages/ForgotPin";
import ChangePin from "./pages/ChangePin";

/* Simple router-like state (replace with React Router if you want) */
const ROUTES = {
  LOGIN: "login",
  HOME: "home",
  ADMIN: "admin",
  FORGOT: "forgot",
  CHANGE_PIN: "change-pin",
};

export default function App() {
  const [route, setRoute] = useState(ROUTES.LOGIN);
  const [user, setUser] = useState(null); // { employee_id, name, role }
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) axios.defaults.headers.common["Authorization"] = `Token ${token}`;
  }, []);

  // If a token exists, verify it by fetching /api/me/ and restore session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    // attempt to fetch current user
    axios.get("http://127.0.0.1:8000/api/me/")
      .then(res => {
        if (res.data) {
          setUser(res.data);
          setRoute(res.data?.role === 'admin' ? ROUTES.ADMIN : ROUTES.HOME);
        }
      })
      .catch(() => {
        // invalid token or server unreachable -> clear token
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      });
  }, []);

  const onLogin = (userObj) => {
    // userObj expected to contain { employeeId, pin, name } from Login form
    // call backend login endpoint to authenticate and retrieve token + user
    const payload = {
      employee_id: userObj.employeeId || userObj.employee_id || userObj.employee,
      password: userObj.pin || userObj.password,
    };

    axios.post("http://127.0.0.1:8000/login/", payload).then((res) => {
      console.log('LOGIN RESPONSE', res);
      if (res.data && res.data.token) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;
        setUser(res.data.user);
        setRoute(res.data.user?.role === "admin" ? ROUTES.ADMIN : ROUTES.HOME);
      } else {
        alert("Login failed: invalid response from server.");
      }
    }).catch((err) => {
      alert(err?.response?.data?.error || "Login failed");
    });
  };

  const logout = () => {
    setUser(null);
    setRoute(ROUTES.LOGIN);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
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
  {route === ROUTES.FORGOT && <ForgotPin onBack={() => setRoute(ROUTES.LOGIN)} />}
  {route === ROUTES.CHANGE_PIN && <ChangePin onBack={() => setRoute(ROUTES.HOME)} />}
        {route === ROUTES.HOME && user && <Home user={user} />}
        {route === ROUTES.ADMIN && user && <AdminDashboard user={user} />}
        {![ROUTES.LOGIN, ROUTES.HOME, ROUTES.ADMIN, ROUTES.FORGOT, ROUTES.CHANGE_PIN].includes(route) && <NotFound />}
      </main>
    </div>
  );
}
