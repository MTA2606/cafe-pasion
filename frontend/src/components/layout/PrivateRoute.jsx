import { Navigate, Outlet } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '100vh', backgroundColor: 'var(--cafe-crema)' }}
      >
        <div className="spinner-border text-gold mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <div className="d-flex align-items-center gap-2 text-muted-cafe">
          <Coffee size={20} />
          <span className="fw-semibold">Verificando credenciales de Café Pasión...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
