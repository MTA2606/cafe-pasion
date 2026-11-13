import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('cafe_pasion_token'));
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('cafe_pasion_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Validar el token con el backend al cargar la app
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('cafe_pasion_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data && res.data.success) {
          setAdmin(res.data.admin);
          localStorage.setItem('cafe_pasion_admin', JSON.stringify(res.data.admin));
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error al verificar sesión de administrador:', error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token: newToken, admin: adminData } = res.data;
        setToken(newToken);
        setAdmin(adminData);
        localStorage.setItem('cafe_pasion_token', newToken);
        localStorage.setItem('cafe_pasion_admin', JSON.stringify(adminData));
        return { success: true };
      }
      return { success: false, message: res.data.message || 'Error al iniciar sesión' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Error de conexión con el servidor';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('cafe_pasion_token');
    localStorage.removeItem('cafe_pasion_admin');
  };

  const value = {
    token,
    admin,
    loading,
    isAuthenticated: Boolean(token && admin),
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
