import { useState } from "react";
import AdminFineSummary from "./AdminFineSummary";
import AdminMonthlySummary from "./AdminMonthlySummary";
import AdminPaymentPanel from "./AdminPaymentPanel";
import UserList from "./UserList";
import LoanForm from "./LoanForm";
import LoansStatus from "./LoanStatus";
import LoansChart from "./TotalsChart";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("user");
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
      {/* Tab Navigation */}
      <div style={{ display: "flex", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
        <div style={tabStyle("user")} onClick={() => setActiveTab("user")}>User List</div>
        <div style={tabStyle("payment")} onClick={() => setActiveTab("payment")}>Payment Panel</div>
        <div style={tabStyle("summary")} onClick={() => setActiveTab("summary")}>Monthly Summary</div>
        <div style={tabStyle("loansStatus")} onClick={() => setActiveTab("loansStatus")}>loans Status</div>
        <div style={tabStyle("fine")} onClick={() => setActiveTab("fine")}>            LoanForm
        </div>
      </div>
<LoansChart/>
      {/* Tab Content */}
      <div> <h1>Admin </h1>
        {activeTab === "user" && <UserList disableActions={false} />}
        {activeTab === "payment" && (
          <>

            <AdminPaymentPanel />
          </>
        )}
        {activeTab === "summary" && (
          <>

            <AdminMonthlySummary />
          </>
        )}
        {/* {activeTab === "fine" && (
          <>
           
            <LoanForm />
          </>
        )}*/ }


        {activeTab === "fine" && (
          <>

            <LoanForm />
          </>
        )}
        {activeTab === "loansStatus" && (
          <>

            <LoansStatus hideActionsbtn={true} />
          </>
        )}


      </div>
    </div>
  );
};

export default Admin;
