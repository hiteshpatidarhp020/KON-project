import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [search, setSearch] = useState({
    loanId: '',
    applicationName: '',
  });

  useEffect(() => {
    axios.get('http://localhost:3001/api/loantable')
      .then(res => {
        setLoans(res.data);
        setFilteredLoans(res.data);
      })
      .catch(err => console.error('Error fetching loans:', err));
  }, []);

  // Handle search inputs
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filtering
  useEffect(() => {
    const filtered = loans.filter((loan) => {
      const loanIdMatch = search.loanId.trim() === '' || loan.id?.toString() === search.loanId.trim();
      const appNameMatch = search.applicationName.trim() === '' ||
        (loan.application_name ?? '').toLowerCase().includes(search.applicationName.trim().toLowerCase());
      return loanIdMatch && appNameMatch;
    });

    setFilteredLoans(filtered);
  }, [search, loans]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Loan List</h2>

      {/* Filter Inputs */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          name="loanId"
          placeholder="Search by Loan ID"
          value={search.loanId}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="applicationName"
          placeholder="Search by Application Name"
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
                <td>{new Date(loan.request_date).toISOString().split('T')[0]}</td>
                <td>
                  <div>
                    <h6>Applicant Signature</h6>
                    <img
                      src={`http://localhost:3001/uploads/${loan.applicant_signature}`}
                      alt="Applicant Signature"
                      width={100}
                    />
                  </div>
                </td>
                <td>
                  {loan.guarantors && loan.guarantors.length > 0 ? (
                    <ul style={{ paddingLeft: '16px', margin: 0, display: 'flex', gap: '16px' }}>
                      {loan.guarantors.map((g) => (
                        <li key={g.id}>
                          {g.name}
                          <br />
                          <img
                            src={`http://localhost:3001/uploads/${g.signature}`}
                            alt="Guarantor Signature"
                            width={100}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No guarantors</p>
                  )}
                </td>
                <td>{loan.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Loans;
