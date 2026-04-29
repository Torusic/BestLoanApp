import React, { useState } from "react";
import Logout from "../AuthPages/Logout";


function Dashboard() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <button onClick={() => setShowLogout(true)}>
        Logout
      </button>

      {showLogout && (
        <Logout setShowLogout={setShowLogout} />
      )}
    </>
  );
}

export default Dashboard;