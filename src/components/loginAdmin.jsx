import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginAdmin({ setUser }) {
  const [phone, setPhone] = useState('');
  const [pass_user, setPassUser] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, pass_user }),
    });

    const data = await res.json();

    if (res.ok && data.role === 'admin') {
      const userData = { userId: data.userId, role: data.role };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/admindashboard');
    } else {
      alert('Only admin can login from here.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Admin Login</h2>
      <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
      <input type="password" placeholder="Password" value={pass_user} onChange={e => setPassUser(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginAdmin;
