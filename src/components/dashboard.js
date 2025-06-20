import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Fixed Logout Button */}
      <div className="dashboard-header">
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="sidebar">
        <button onClick={() => navigate("/dashboard/upload")}>Upload</button>
        <button onClick={() => navigate("/dashboard/browse")}>Browse</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
      </div>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
