import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminMonthlySummary = () => {
  const [summary, setSummary] = useState([]);
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [monthTotal, setMonthTotal] = useState(0);
  const [allTimeTotal, setAllTimeTotal] = useState(0);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/admin/monthly-summary/${monthYear}`);
      setSummary(res.data);

      // Calculate total of only approved entries
      const total = res.data
        .filter(user => user.last_status === 'approved')
        .reduce((sum, user) => sum + Number(user.total_paid), 0);

      setMonthTotal(total);
    } catch (err) {
      console.error('Error fetching monthly summary', err);
    }
  };

  const fetchAllTimeTotal = async () => {
    try {
      const res = await axios.get('http://localhost:3001/admin/total-approved');
      setAllTimeTotal(res.data.total_approved || 0);
    } catch (err) {
      console.error('Error fetching all-time total', err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchAllTimeTotal();
  }, [monthYear]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Monthly Payment Summary</h2>

      <label>
        Select Month:{' '}
        <input
          type="month"
          value={monthYear}
          onChange={e => setMonthYear(e.target.value)}
        />
      </label>

      <table border="1" cellPadding="5" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Member</th>
            <th>Paid Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>₹{user.total_paid}</td>
              <td>
                {user.last_status === 'approved' ? (
                  <span style={{ color: 'green' }}>✅ Paid</span>
                ) : (
                  <span style={{ color: 'red' }}>❌ Not Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '30px' }}>
        <h3>✅ Total Approved This Month: ₹{monthTotal}</h3>
        <h3>📅 Total Approved All Time: ₹{allTimeTotal}</h3>
      </div>
    </div>
  );
};

export default AdminMonthlySummary;
