import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';

import LoginMember from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import AutoLogout from './components/AutoLogout';
import LoginAdmin from './components/loginAdmin';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <AutoLogout user={user} setUser={setUser}>
        <Routes>
          <Route path="/adminlogin" element={<LoginAdmin setUser={setUser} />} />
          <Route path="/memberlogin" element={<LoginMember setUser={setUser} />} />
          <Route
            path="/admindashboard"
            element={
              <PrivateRoute user={user} allowedRoles={['admin']}>
                <AdminDashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/member"
            element={
              <PrivateRoute user={user} allowedRoles={['admin', 'member']}>
                <MemberDashboard user={user} />
              </PrivateRoute>
            }
          />
        </Routes>
      </AutoLogout>
    </Router>
  );
}

export default App;
