 import React, { useState } from 'react';
import axios from 'axios';
const AppSettings = () => {
  const [percentage, setPercentage] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [monthSetting, setMonthSetting] = useState('');
  const [resetId, setResetId] = useState('');
  const [newPassword, setNewPassword] = useState('');
const [month1, setMonth1] = useState('');
const [month2, setMonth2] = useState('');
const [month3, setMonth3] = useState('');

  // ✅ Submit Handlers
  const handlePercentageSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:3001/api/settings/percentage', { percentage });
      alert(res.data.message);
    } catch (err) {
      alert('❌ Failed to update percentage');
    }
  };

  const handleMonthlyPaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:3001/api/settings/monthly-payment', { monthlyPayment });
      alert(res.data.message);
    } catch (err) {
      alert('❌ Failed to update monthly payment');
    }
  };

 const handleMonthSettingsSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.put('http://localhost:3001/api/settings/month-settings', {
      month1,
      month2,
      month3
    });
    alert(res.data.message);
  } catch (err) {
    alert('❌ Failed to update month settings');
  }
};
    const handlePasswordReset = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`http://localhost:3001/users/reset-password/${resetId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Password reset successful!');
      setResetId('');
      setNewPassword('');
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    console.error('Password reset failed:', error);
    alert('Something went wrong. Try again.');
  }
};

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>⚙️ App Settings</h2>

      {/* 🔢 Percentage Setting */}
      <form onSubmit={handlePercentageSubmit} style={{ marginBottom: '15px' }}>
        <label>Percentage Setting:</label><br />
        <input
          type="number"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          placeholder="e.g., 10"
          required
        />
        <button type="submit" style={{ marginLeft: '10px' }}>Save</button>
      </form>

      {/* 💸 Monthly Payment */}
      <form onSubmit={handleMonthlyPaymentSubmit} style={{ marginBottom: '15px' }}>
        <label>Monthly Payment:</label><br />
        <input
          type="number"
          value={monthlyPayment}
          onChange={(e) => setMonthlyPayment(e.target.value)}
          placeholder="e.g., 500"
          required
        />
        <button type="submit" style={{ marginLeft: '10px' }}>Save</button>
      </form>

      {/* 📅 Month Setting */}
      <form onSubmit={handleMonthSettingsSubmit} style={{ marginBottom: '30px' }}>
  <label>Month Settings:</label><br />
  <select value={month1} onChange={(e) => setMonth1(e.target.value)} required>
    <option value="">Month 1</option>
    {Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>{i + 1}</option>
    ))}
  </select>
  <select value={month2} onChange={(e) => setMonth2(e.target.value)} required>
    <option value="">Month 2</option>
    {Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>{i + 1}</option>
    ))}
  </select>
  <select value={month3} onChange={(e) => setMonth3(e.target.value)} required>
    <option value="">Month 3</option>
    {Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>{i + 1}</option>
    ))}
  </select>
  <button type="submit" style={{ marginLeft: '10px' }}>Save</button>
</form>


      <hr />

      {/* 🔐 Password Reset */}
      <h3>Password Reset</h3>
     <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h3>🔐 Reset Password</h3>
      <form onSubmit={handlePasswordReset}>
        <div style={{ marginBottom: '10px' }}>
          <label>User ID:</label><br />
          <input
            type="text"
            value={resetId}
            onChange={(e) => setResetId(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>New Password:</label><br />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{
          backgroundColor: '#dc3545',
          color: '#fff',
          padding: '6px 12px',
          border: 'none',
          borderRadius: '4px'
        }}>
          Reset Password
        </button>
      </form>
    </div>
    </div>
  );
};

export default AppSettings;