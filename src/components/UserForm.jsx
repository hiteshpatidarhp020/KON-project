import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = ({ selectedUser, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    join_date: ''
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData(selectedUser);
    }
  }, [selectedUser]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await axios.put(`http://localhost:3001/users/${selectedUser.id}`, formData);
      } else {
        await axios.post('http://localhost:3001/users', formData);
      }
      onSave();
      setFormData({ name: '', email: '', phone: '', join_date: '' });
    } catch (err) {
      alert('Error saving user');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
      <input name="join_date" type="date" value={formData.join_date} onChange={handleChange} required />
      <button type="submit">{selectedUser ? 'Update' : 'Add'} User</button>
      {selectedUser && <button onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default UserForm;
