import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    fetch(`${API_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem('admin_token');
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  function login(newToken) {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('admin_token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
