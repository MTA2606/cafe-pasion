import { Link } from 'react-router-dom';
import { Coffee, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center p-4 text-center animate-fade-in"
      style={{ minHeight: '70vh' }}
    >
      <div className="card-cafe p-5 bg-white shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="cafe-brand-icon mx-auto mb-3" style={{ width: '58px', height: '58px' }}>
          <Coffee size={30} />
        </div>
        <h1 className="display-4 fw-bold font-title text-gold mb-2">404</h1>
        <h3 className="font-title mb-3">Página no encontrada</h3>
        <p className="text-muted-cafe mb-4">
          La página que buscas no existe o ha sido movida. Puedes volver al catálogo o a la página de inicio.
        </p>
        <Link to="/" className="btn btn-cafe-dorado px-4">
          <Home size={18} />
          <span>Volver al Inicio</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
