import React from "react";
import Dashboard from "../pages/Dashboard";

export default function Home({ user }) {
  return <Dashboard user={user} />;
}


// import React from "react";
// import NewDashboard from "../components/NewDashboard";

// export default function Home({ user }) {
//   return <NewDashboard user={user} />;
// }