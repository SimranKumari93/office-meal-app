import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import MenuManagement from "./pages/MenuManagement";
import EmployeeMeals from "./pages/EmployeeMeals";
import GuestTracker from "./pages/GuestTracker";
import SupplyReports from "./pages/SupplyReports";
import "./styles/index.css";
// import Login from "./components/Login";
// import Home from "./pages/Home";
// import NotFound from "./pages/NotFound";
// import ForgotPin from "./pages/ForgotPin";
// import ChangePin from "./pages/ChangePin";


export default function App() {
  const [route, setRoute] = useState("dashboard");

  const render = () => {
    switch(route) {
      case "dashboard": return <Dashboard />;
      case "menu": return <MenuManagement />;
      case "employee": return <EmployeeMeals />;
      case "guest": return <GuestTracker />;
      case "supply": return <SupplyReports />;
      default: return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <Layout route={route} setRoute={setRoute}>
        {render()}
      </Layout>
    </ThemeProvider>
  );
}
