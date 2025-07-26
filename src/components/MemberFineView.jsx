import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MemberFineView = ({ userId }) => {
  const [fineData, setFineData] = useState(null);
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const fetchMyFine = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/fines/summary/${monthYear}`);
      const myData = res.data.find(row => row.user_id === userId);
      setFineData(myData || null);
    } catch (err) {
      alert('Error fetching fine data');
    }
  };

  useEffect(() => {
    fetchMyFine();
  }, [monthYear]);

  if (!fineData) return <p>Loading fine info...</p>;

  return (
    <div>
      <h2>🧾 My Fine Details</h2>

      <label>
        Select Month:{' '}
        <input
          type="month"
          value={monthYear}
          onChange={e => setMonthYear(e.target.value)}
        />
      </label>

      <div style={{ marginTop: '10px' }}>
        <p><strong>Month:</strong> {monthYear}</p>
        <p><strong>Payment Status:</strong> {fineData.status}</p>
        <p><strong>Submitted On:</strong> {fineData.request_date ? fineData.request_date.split('T')[0] : 'Not Submitted'}</p>
        <p>
          <strong>Fine:</strong>{' '}
          <span style={{ color: fineData.fine > 0 ? 'red' : 'green' }}>
            ₹{fineData.fine}
          </span>
        </p>
      </div>
    </div>
  );
};

export default MemberFineView;
