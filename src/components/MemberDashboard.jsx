import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from './PaymentForm';
import PaymentStatus from './PaymentStatus';
import LoanForm from './LoanForm';

const MemberDashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");
  const [fullUser, setFullUser] = useState(null);

  useEffect(() => {
    if (!user || !user.userId) {
      navigate("/memberlogin");
    } else {
      axios
        .get(`http://localhost:3001/payment_requests/users/${user.userId}`)
        .then(res => setFullUser(res.data))
        .catch(err => {
          console.error("Failed to fetch user details:", err);
          navigate("/memberlogin");
        });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    if (setUser) setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/memberlogin");
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

  if (!fullUser) return <div>Loading user info...</div>;

  return (
    <div>
      {/* Header and Logout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Members Dashboard</h1>
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

      {/* User Info */}
      <p>Welcome, {fullUser.name} (ID: {fullUser.id})</p>
      <p>Role: {user?.role === 'admin' ? 'Admin' : 'Member'}</p>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
        <div style={tabStyle("user")} onClick={() => setActiveTab("user")}>Payment Form</div>
        <div style={tabStyle("payment")} onClick={() => setActiveTab("payment")}>Payment Status</div>
        <div style={tabStyle("loanForm")} onClick={() => setActiveTab("loanForm")}>Loan Form</div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "user" && <PaymentForm userId={user?.userId} />}
        {activeTab === "payment" && <PaymentStatus userId={user?.userId} />}
        {activeTab === "loanForm" && <LoanForm fullUser={fullUser} />}
      </div>
    </div>
  );
};

export default MemberDashboard;
