import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentStatus = ({ userId }) => {
  const [requests, setRequests] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/payment_requests/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => console.error('Error fetching user:', err));
  }, [userId]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/payment_requests/user/${userId}`)
      .then(res => setRequests(res.data))
      .catch(err => console.error('Error fetching requests:', err));
  }, [userId]);

  if (!user) return <div>Loading user info...</div>;

  const filteredRequests = selectedMonth
    ? requests.filter(r => r.request_date?.startsWith(selectedMonth))
    : requests;

  return (
    <div>
      {/* <h3>Welcome, {user.name} (ID: {user.id})</h3> */}
      <h3>My Payment History</h3>

      {/* Month Filter */}
      <div style={{ marginBottom: '1em' }}>
        <label>
          Select Month:{' '}
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          />
        </label>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Month</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Requested</th>
            <th>Approved</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map(r => (
            <tr key={r.id}>
              <td>{r.month_year}</td>
              <td>{r.amount}</td>
              <td>{r.status}</td>
              <td>{r.request_date?.slice(0, 10)}</td>
              <td>{r.approved_date ? r.approved_date.slice(0, 10) : '-'}</td>
              <td>{user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentStatus;
