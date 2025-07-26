import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoansStatus = ({ hideActionsbtn = false }) => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [search, setSearch] = useState({
    loanId: '',
    applicationName: '',
  });

  // Fetch loan data
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = () => {
    axios.get('http://localhost:3001/api/loantable')
      .then((res) => {
        setLoans(res.data);
        setFilteredLoans(res.data);
      })
      .catch((err) => console.error('Error fetching loans:', err));
  };

  // Filter based on search
 useEffect(() => {
  const filtered = loans.filter((loan) => {
    const loanIdMatch = search.loanId.trim() === '' || loan.id?.toString() === search.loanId.trim();
    const appNameMatch = search.applicationName.trim() === '' ||
      (loan.application_name ?? '').toLowerCase().includes(search.applicationName.trim().toLowerCase());
    return loanIdMatch && appNameMatch;
  });

  setFilteredLoans(filtered);
}, [search, loans]);


  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update loan status
  const updateStatus = (loanId, status) => {
  const confirmMessage = `Are you sure you want to mark this loan as ${status.toUpperCase()}?`;

  if (!window.confirm(confirmMessage)) {
    return; // Stop if user cancels
  }

  axios.put(`http://localhost:3001/loans_status/${loanId}/status`, { status })
    .then(() => {
      alert(`Loan status updated to ${status.toUpperCase()}`);
      fetchLoans(); // Refresh list
    })
    .catch((err) => {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    });
};

// Inside the component, before return
const totalInterestAmount = filteredLoans.reduce((total, loan) => {
  if (loan.status !== 'rejected') {
    return total + parseFloat(loan.interest_amount || 0);
  }
  return total;
}, 0);

const totalRequestCharge = filteredLoans.reduce((total, loan) => {
  if (loan.status !== 'rejected') {
    return total + parseFloat(loan.request_charge || 0);
  }
  return total;
}, 0);


const grandTotal = totalInterestAmount + totalRequestCharge;
  return (
    <div style={{ padding: '20px' }}>
      <h2>Loan List</h2>
     <h3>Total Interest Amount: {totalInterestAmount.toFixed(2)}</h3>
<h3>Total Request Charge: {totalRequestCharge.toFixed(2)}</h3>
<h3>Loans Total: {grandTotal.toFixed(2)}</h3>



      <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          name="loanId"
          placeholder="Search by Loan ID (exact)"
          value={search.loanId}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="applicationName"
          placeholder="Search by Application Name (exact)"
          value={search.applicationName}
          onChange={handleSearchChange}
        />
      </div>

      {filteredLoans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              
              <th>Loan ID</th>
              <th>Application Name</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Interest Amount</th>
              <th>Duration Months</th>
              <th>Interest Rate (%)</th>
              <th>Total Return</th>
              <th>Request Charge</th>
              <th>Request Date</th>
              <th>Applicant Signature</th>
              <th>Guarantors</th>
              <th>Status</th>
             {!hideActionsbtn && ( <th >Actions</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan) => (
              <tr key={loan.id}>
                
                <td>{loan.id}</td>
                <td>{loan.application_name}</td>
                <td>{loan.user_id}</td>
                <td>{loan.loan_amount}</td>
                <td>{loan.interest_amount}</td>
                <td>{loan.duration_months}</td>
                <td>{loan.interest_rate}</td>
                <td>{loan.total_return_amount}</td>
                <td>{loan.request_charge}</td>
                <td>
                  {loan.request_date
                    ? new Date(loan.request_date).toISOString().split('T')[0]
                    : ''}
                </td>
                <td>
                  <div>
                     <h5>Signature</h5>
                    {loan.applicant_signature && (
                      <img
                        src={`http://localhost:3001/uploads/${loan.applicant_signature}`}
                        alt="Applicant Signature"
                        width={100}
                      />
                    )}
                  </div>
                </td>
                <td>
                  {loan.guarantors && loan.guarantors.length > 0 ? (
                    <ul style={{ paddingLeft: '16px', margin: 0, display: 'flex', gap: '16px' }}>
                      {loan.guarantors.map((g) => (
                        <h5 key={g.id}>
                          {g.name}
                          <br />
                          {g.signature && (
                            <img
                              src={`http://localhost:3001/uploads/${g.signature}`}
                              alt="Guarantor Signature"
                              width={100}
                            />
                          )}
                        </h5>
                      ))}
                    </ul>
                  ) : (
                    <p>No guarantors</p>
                  )}
                </td>
                <td>{loan.status}</td>
                {!hideActionsbtn && (
                <td hideActionsbtn={hideActionsbtn}>
                  {loan.status === 'pending' ? (
                    <>
                      <button onClick={() => updateStatus(loan.id, 'approved')} style={{ marginRight: '5px' }}>Approve</button>
                      <button onClick={() => updateStatus(loan.id, 'rejected')}>Reject</button>
                    </>
                  ) : (
                    <em>—</em>
                  )}
                </td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoansStatus;
