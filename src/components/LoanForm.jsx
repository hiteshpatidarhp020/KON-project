// LoanForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoansStatus from './LoanStatus'; // If needed

const LoanForm = () => {
  const [users, setUsers] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);

  const [formData, setFormData] = useState({
    userId: '',
    loanAmount: '',
    applicationName: '',
    duration: '',
    interestRate: 1.5,
    interestAmount: 0,
    totalAmount: 0,
    applicant_signature: null,
    guarantor1: '',
    guarantor2: '',
    guarantor1Sign: null,
    guarantor2Sign: null,
  });

  useEffect(() => {
    // Fetch users
    axios.get('http://localhost:3001/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err));

    // Fetch interest rate setting
    axios.get('http://localhost:3001/app_setting')
      .then((res) => {
        const rate = res.data.interestRate;
        setFormData(prev => ({ ...prev, interestRate: rate }));
      })
      .catch((err) => {
        console.error('Error fetching interest rate:', err);
      });

    // Fetch month settings
    axios.get('http://localhost:3001/get_months/month-settings')
      .then((res) => {
        const { month1, month2, month3 } = res.data;
        setMonthOptions([month1, month2, month3]);
      })
      .catch((err) => {
        console.error('Error fetching month settings:', err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const updatedForm = {
      ...formData,
      [name]: files ? files[0] : value,
    };

    if (name === 'loanAmount' || name === 'duration') {
      const loanAmount = parseFloat(name === 'loanAmount' ? value : formData.loanAmount) || 0;
      const duration = parseFloat(name === 'duration' ? value : formData.duration) || 0;
      const interest = (loanAmount * updatedForm.interestRate * duration) / 100;
      const total = loanAmount + interest;

      updatedForm.interestAmount = interest.toFixed(2);
      updatedForm.totalAmount = total.toFixed(2);
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    for (const key in formData) {
      submitData.append(key, formData[key]);
    }

    try {
      await axios.post('http://localhost:3001/loans', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Loan request submitted!');
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Failed to submit loan request.');
    }
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      loanAmount: '',
      applicationName: '',
      duration: '',
      interestRate: 1.5,
      interestAmount: 0,
      totalAmount: 0,
      applicant_signature: null,
      guarantor1: '',
      guarantor2: '',
      guarantor1Sign: null,
      guarantor2Sign: null,
    });

    document.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Loan Request Form</h2>

        <label>Applicant Name</label>
        <select
          name="userId"
          onChange={(e) => {
            const selectedUserId = e.target.value;
            const selectedUser = users.find((u) => u.id.toString() === selectedUserId);
            setFormData((prev) => ({
              ...prev,
              userId: selectedUserId,
              applicationName: selectedUser ? selectedUser.name : '',
            }));
          }}
          value={formData.userId}
          required
          className="w-full p-2 border"
        >
          <option value="">Select Applicant</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <input
          type="number"
          name="loanAmount"
          max="10000"
          placeholder="Loan Amount (Max ₹10,000)"
          value={formData.loanAmount}
          onChange={handleChange}
          required
          className="w-full p-2 border"
        />

        <input
          type="text"
          value={`${formData.interestRate}%`}
          readOnly
          className="w-full p-2 border bg-gray-100"
        />

        <label>Duration (Months)</label>
        <select
          name="duration"
          onChange={handleChange}
          value={formData.duration}
          required
          className="w-full p-2 border"
        >
          <option value="">Select Duration</option>
          {monthOptions.map((month, index) => (
            <option key={index} value={month}>{month} Months</option>
          ))}
        </select>

        <input
          type="text"
          value={`₹ ${formData.interestAmount}`}
          readOnly
          className="w-full p-2 border bg-gray-100"
          placeholder="Interest Amount"
        />

        <input
          type="text"
          value={`₹ ${formData.totalAmount}`}
          readOnly
          className="w-full p-2 border bg-gray-100"
          placeholder="Total Repayable Amount"
        />

        <label>Guarantor 1</label>
        <select name="guarantor1" onChange={handleChange} value={formData.guarantor1} required className="w-full p-2 border">
          <option value="">Select Guarantor 1</option>
          {users.map(user => (
            <option key={user.id} value={user.name}>{user.name}</option>
          ))}
        </select>

        <label>Applicant Signature</label>
        <input
          type="file"
          name="applicant_signature"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full p-2 border"
        />

        <input
          type="file"
          name="guarantor1Sign"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full p-2 border"
        />

        <label>Guarantor 2</label>
        <select name="guarantor2" onChange={handleChange} value={formData.guarantor2} required className="w-full p-2 border">
          <option value="">Select Guarantor 2</option>
          {users.map(user => (
            <option key={user.id} value={user.name}>{user.name}</option>
          ))}
        </select>

        <input
          type="file"
          name="guarantor2Sign"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full p-2 border"
        />

        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Submit Loan Request
        </button>
      </form>

      <LoansStatus hideActionsBtn={true} />
    </div>
  );
};

export default LoanForm;
