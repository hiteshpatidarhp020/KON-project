import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminFineSummary from "./AdminFineSummary";
import AdminMonthlySummary from "./AdminMonthlySummary";
import AdminPaymentPanel from "./AdminPaymentPanel";
import UserList from "./UserList";
import AppSettings from "./AppSettings";

const AdminDashboard = ({ setUser }) => {
  const [activeTab, setActiveTab] = useState("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (setUser) setUser(null); // Clear user from parent state if available
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/adminlogin");
  };

  const tabStyle = (tabName) => ({
    padding: "10px 20px",
    cursor: "pointer",
    borderBottom: activeTab === tabName ? "2px solid #007BFF" : "2px solid transparent",
    backgroundColor: activeTab === tabName ? "#f0f8ff" : "#fff",
    fontWeight: activeTab === tabName ? "bold" : "normal",
    color: activeTab === tabName ? "#007BFF" : "#333",
    transition: "0.2s",
  });

  return (
    <div>
      {/* Header with Logout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
        <div style={tabStyle("user")} onClick={() => setActiveTab("user")}>User List</div>
        <div style={tabStyle("payment")} onClick={() => setActiveTab("payment")}>Payment Panel</div>
        <div style={tabStyle("summary")} onClick={() => setActiveTab("summary")}>Monthly Summary</div>
        <div style={tabStyle("appSettign")} onClick={() => setActiveTab("appSettign")}>App Settign</div>
        {/* <div style={tabStyle("fine")} onClick={() => setActiveTab("fine")}>Fine Summary</div> */}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "user" && <UserList />}
        {activeTab === "payment" && <AdminPaymentPanel />}
        {activeTab === "summary" && <AdminMonthlySummary />}
        {activeTab === "appSettign" && <AppSettings />}
        {/* {activeTab === "fine" && <AdminFineSummary />} */}
      </div>
    </div>
  );
};

export default AdminDashboard;
