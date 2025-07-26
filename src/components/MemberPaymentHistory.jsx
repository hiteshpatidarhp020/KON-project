import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MemberPaymentHistory = ({ userId }) => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/fines/history/${userId}`);
      setHistory(res.data);
    } catch (err) {
      alert('Error fetching payment history');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>📅 My Payment History</h2>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Month</th>
            <th>Payment Status</th>
            <th>Submitted On</th>
            <th>Fine (₹)</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index}>
              <td>{entry.month_year}</td>
              <td>{entry.status}</td>
              <td>{entry.request_date ? entry.request_date.split('T')[0] : 'Not Submitted'}</td>
              <td style={{ color: entry.fine > 0 ? 'red' : 'green' }}>
                ₹{entry.fine}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberPaymentHistory;
