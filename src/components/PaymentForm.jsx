import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ userId }) => {
  const [monthYear, setMonthYear] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!monthYear) {
      setMessage('❌ Please select a month.');
      return;
    }

    try {
      // Check existing request
      const checkRes = await axios.get('http://localhost:3001/payment_requests/check', {
        params: {
          user_id: userId,
          month_year: monthYear
        }
      });

      const existing = checkRes.data;

      if (existing && existing.status && existing.status !== 'rejected') {
        setMessage(`❌ Payment already submitted. Status: ${existing.status}`);
        return;
      }

      const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);


    await axios.post('http://localhost:3001/payment_requests', {
  user_id: userId,
  amount: 300,
  month_year: monthYear,
  request_date: localDate
});


      setMessage('✅ Payment request submitted successfully!');
    } catch (err) {
      console.error('Submit Error:', err);
      if (err.response?.data?.error) {
        setMessage(`❌ ${err.response.data.error}`);
      } else {
        setMessage('❌ Something went wrong.');
      }
    }
  };

  return (
    <div>
      <h3>Submit Payment</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="month"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
          required
        />
        <button type="submit">Submit ₹300 Payment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PaymentForm;
