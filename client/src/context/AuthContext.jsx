import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('hsh_admin_token');
    if (token) {
      api
        .get('/admin/me')
        .then((res) => setAdmin(res.data.data))
        .catch(() => localStorage.removeItem('hsh_admin_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    localStorage.setItem('hsh_admin_token', res.data.token);
    setAdmin(res.data.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('hsh_admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
