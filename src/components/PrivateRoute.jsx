import { Navigate } from 'react-router-dom';

function PrivateRoute({ user, allowedRoles, children }) {
  if (!user) return <Navigate to="/memberlogin" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/memberlogin" />;
  return children;
}

export default PrivateRoute;
