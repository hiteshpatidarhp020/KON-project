import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = ({ user, setUser, children }) => {
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate(user?.role === 'admin' ? '/adminlogin' : '/memberlogin');
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, 10 * 60 * 1000); // 2 minutes
  };

  useEffect(() => {
    if (!user) return;

    resetTimer();

    const events = ['mousemove', 'keydown', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, [user]);

  return children;
};

export default AutoLogout;
