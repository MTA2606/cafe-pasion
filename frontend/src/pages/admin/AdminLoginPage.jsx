import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Coffee, Lock, Mail, ArrowLeft, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirigir automáticamente si ya existe una sesión activa
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Por favor, ingresa tu correo y tu contraseña');
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(res.message || 'Credenciales de acceso no válidas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor de Café Pasión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center p-3 animate-fade-in"
      style={{
        minHeight: '100vh',
        background: `radial-gradient(circle at top, rgba(200, 157, 84, 0.12), transparent 70%), var(--cafe-crema)`
      }}
    >
      <div
        className="card-cafe p-4 p-md-5 shadow-lg bg-white border-0"
        style={{ maxWidth: '440px', width: '100%', borderRadius: '24px' }}
      >
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none d-inline-block mb-3" title="Volver al inicio">
            <div className="cafe-brand-icon mx-auto shadow" style={{ width: '60px', height: '60px' }}>
              <Coffee size={32} />
            </div>
          </Link>
          <span className="badge-categoria mb-2">Panel Privado</span>
          <h3 className="font-title mb-1 text-espresso">Café Pasión</h3>
          <p className="text-muted-cafe small mb-0">Gestión de Catálogo, Productos y Configuración</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 small py-2 px-3 mb-4 rounded-3" role="alert">
            <AlertCircle size={18} className="flex-shrink-0 text-danger" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Correo Electrónico */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-espresso">Correo Electrónico</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className="form-control border-start-0 bg-light py-2"
                placeholder="admin@cafepasion.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Contraseña con botón mostrar/ocultar */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-espresso">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0 bg-light py-2"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-group-text bg-light border-start-0 text-muted"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            className="btn btn-cafe-dorado w-100 py-3 mb-3 fs-6 shadow-sm"
            disabled={submitting}
          >
            {submitting ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            ) : (
              <ShieldCheck size={18} className="me-1" />
            )}
            <span>{submitting ? 'Verificando credenciales...' : 'Acceder al Panel'}</span>
          </button>
        </form>

        <div className="text-center pt-3 border-top mt-2">
          <Link to="/" className="text-muted-cafe small text-decoration-none d-inline-flex align-items-center gap-1">
            <ArrowLeft size={14} />
            <span>Volver a la tienda pública de Café Pasión</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
