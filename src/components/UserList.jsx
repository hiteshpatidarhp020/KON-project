import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserForm from './UserForm';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:3001/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      alert("Deleted successfully");
      // optionally refresh data here
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };


  return (
    <div>
      <h2>Members</h2>
      <UserForm
        selectedUser={editingUser}
        onSave={fetchUsers}
        onCancel={() => setEditingUser(null)}
      />
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Join Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.join_date?.slice(0, 10)}</td>
              <td >
                <button onClick={() => setEditingUser(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
           
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default UserList;
