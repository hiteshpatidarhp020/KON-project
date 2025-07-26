import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPaymentPanel = () => {
  const [requests, setRequests] = useState([]);
  const [fines, setFines] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [stopDate, setStopDate] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedFineId, setSelectedFineId] = useState(null);

  // 🔁 ADDED: Filters
  const [requestMonthFilter, setRequestMonthFilter] = useState('');
  const [requestNameFilter, setRequestNameFilter] = useState('');
  const [fineMonthFilter, setFineMonthFilter] = useState('');
  const [fineNameFilter, setFineNameFilter] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchRequests = async () => {
    const res = await axios.get('http://localhost:3001/payment_requests');
    setRequests(res.data);
  };

  const fetchFines = async () => {
    const res = await axios.get('http://localhost:3001/fines');
    setFines(res.data);
  };

  useEffect(() => {
    fetchRequests();
    fetchFines();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFines((prev) => [...prev]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id, status) => {
    await axios.put(`http://localhost:3001/payment_requests/${id}`, { status });
    fetchRequests();
  };

  const handleStartFine = async () => {
    if (!startDate || !selectedUserId) return;
    try {
      await axios.post('http://localhost:3001/fines/start', {
        user_id: selectedUserId,
        start_date: startDate,
      });
      setStartDate('');
      setSelectedUserId(null);
      fetchFines();
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong while starting fine');
    }
  };

  const handleStopFine = async () => {
    if (!stopDate || !selectedFineId) return;
    await axios.post('http://localhost:3001/fines/stop', {
      fine_id: selectedFineId,
      end_date: stopDate,
    });
    setStopDate('');
    setSelectedFineId(null);
    fetchFines();
  };

  const generateMonthOptions = () => {
    const months = [];
    const current = new Date();
    current.setDate(1);
    for (let i = 0; i < 12; i++) {
      const month = current.toLocaleString('default', { month: 'long' });
      const year = current.getFullYear();
      const value = `${year}-${String(current.getMonth() + 1).padStart(2, '0')}`;
      months.push(
        <option key={value} value={value}>
          {month} {year}
        </option>
      );
      current.setMonth(current.getMonth() - 1);
    }
    return months;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🛠 Admin Payment Requests</h2>

      {/* 🔁 ADDED Filters for Payment Requests */}
      <div style={{ marginBottom: '10px' }}>
        <label><strong>📅 Filter by Month:</strong> </label>
        <select value={requestMonthFilter} onChange={(e) => setRequestMonthFilter(e.target.value)}>
          <option value="">All</option>
          {generateMonthOptions()}
        </select>

        <label style={{ marginLeft: '20px' }}><strong>🔍 Filter by Name:</strong> </label>
        <input
          type="text"
          placeholder="Search by name"
          value={requestNameFilter}
          onChange={(e) => setRequestNameFilter(e.target.value)}
        />
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Member</th>
            <th>Month</th>
            <th>Amount</th>
            <th>Requested On</th>
            <th>Status</th>
            <th>Approved On</th>
            <th>Action</th>
            <th>Start Fine</th>
          </tr>
        </thead>
        <tbody>
          {requests
            .filter(req => {
              const nameMatch = req.name.toLowerCase().includes(requestNameFilter.toLowerCase());
              const monthMatch = requestMonthFilter
                ? req.month_year === requestMonthFilter
                : true;
              return nameMatch && monthMatch;
            })
            .map((req) => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.month_year}</td>
                <td>{req.amount}</td>
                <td>{formatDate(req.request_date)}</td>
                <td>{req.status}</td>
                <td>{req.approved_date ? formatDate(req.approved_date) : '-'}</td>
                <td>
                  {req.status === 'pending' ? (
                    <>
                      <button onClick={() => handleAction(req.id, 'approved')}>Approve</button>{' '}
                      <button onClick={() => handleAction(req.id, 'rejected')}>Reject</button>
                    </>
                  ) : (
                    <span>✅ {req.status}</span>
                  )}
                </td>
                <td>
                  <input
                    type="date"
                    value={selectedUserId === req.user_id ? startDate : ''}
                    onChange={(e) => {
                      setSelectedUserId(req.user_id);
                      setStartDate(e.target.value);
                    }}
                    max={today}
                  />
                  <button onClick={handleStartFine} disabled={!startDate || selectedUserId !== req.user_id}>
                    Start
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '40px' }}>💰 Fine Records</h3>

      {/* 🔁 Filters for Fine Records */}
      <div style={{ margin: '20px 0' }}>
        <label><strong>📅 Filter by Month:</strong> </label>
        <select value={fineMonthFilter} onChange={(e) => setFineMonthFilter(e.target.value)}>
          <option value="">All Months</option>
          {generateMonthOptions()}
        </select>

        <label style={{ marginLeft: '20px' }}><strong>🔍 Filter by Name:</strong> </label>
        <input
          type="text"
          placeholder="Search by name"
          value={fineNameFilter}
          onChange={(e) => setFineNameFilter(e.target.value)}
        />
      </div>

      <table border="1" cellPadding="5">
  <thead>
    <tr>
      <th>Member</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>Total Fine (₹)</th>
      <th>Status</th>
      <th>Stop Action</th>
    </tr>
  </thead>
  <tbody>
    {fines
      .filter((f) => {
        const nameMatch = f.name.toLowerCase().includes(fineNameFilter.toLowerCase());
        if (!fineMonthFilter) return nameMatch;
        const date = new Date(f.start_date);
        const selected = new Date(fineMonthFilter + '-01');
        const sameMonth = date.getMonth() === selected.getMonth();
        const sameYear = date.getFullYear() === selected.getFullYear();
        return nameMatch && sameMonth && sameYear;
      })
      .map((f) => {
        const currentFine =
          f.status === 'active'
            ? (() => {
                const start = new Date(f.start_date);
                const now = new Date();
                const days = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
                return days * 5;
              })()
            : f.amount || 0;

        return (
          <tr key={f.id}>
            <td>{f.name}</td>
            <td>{formatDate(f.start_date)}</td>
            <td>{f.end_date ? formatDate(f.end_date) : '-'}</td>
            <td>{currentFine}</td>
            <td>
              {f.status === 'active' ? (
                <span style={{ color: 'red', fontWeight: 'bold' }}>Pending</span>
              ) : (
                <span style={{ color: 'green', fontWeight: 'bold' }}>Paid</span>
              )}
            </td>
            <td>
              {f.status === 'active' ? (
                <div>
                  <input
                    type="date"
                    min={f.start_date}
                    max={today}
                    value={selectedFineId === f.id ? stopDate : ''}
                    onChange={(e) => {
                      setSelectedFineId(f.id);
                      setStopDate(e.target.value);
                    }}
                  />
                  <button onClick={handleStopFine} disabled={!stopDate || selectedFineId !== f.id}>
                    Stop
                  </button>
                </div>
              ) : (
                '—'
              )}
            </td>
          </tr>
        );
      })}
  </tbody>
</table>

    </div>
  );
};

export default AdminPaymentPanel;
