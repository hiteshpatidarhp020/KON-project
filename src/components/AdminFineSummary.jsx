import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminFineSummary = () => {
  const [fineData, setFineData] = useState([]);
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchFineSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/fines/summary/${monthYear}`);
      setFineData(res.data);
    } catch (err) {
      alert('Error fetching fine summary');
    }
  };

  useEffect(() => {
    fetchFineSummary();
  }, [monthYear]);

  return (
    <div>
      <h2>💸 Fine Summary – {monthYear}</h2>

      <label>
        Select Month:{' '}
        <input
          type="month"
          value={monthYear}
          onChange={e => setMonthYear(e.target.value)}
        />
      </label>

      <table border="1" cellPadding="6" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Member</th>
            <th>Paid On</th>
            <th>Status</th>
            <th>Fine (₹)</th>
          </tr>
        </thead>
        <tbody>
          {fineData.map(user => (
            <tr key={user.user_id}>
              <td>{user.name}</td>
              <td>{user.request_date ? user.request_date.split('T')[0] : '-'}</td>
              <td>{user.status}</td>
              <td style={{ color: user.fine > 0 ? 'red' : 'green' }}>
                ₹{user.fine}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFineSummary;
