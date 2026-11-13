import { Link } from 'react-router-dom';
import { Coffee, MapPin, Phone, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="cafe-footer">
      <div className="container">
        <div className="row g-4 justify-content-between">
          {/* Columna 1: Presentación y Marca */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="cafe-brand-icon" style={{ width: '38px', height: '38px' }}>
                <Coffee size={20} />
              </div>
              <span className="cafe-brand-title fs-4">{settings.negocio_nombre || 'CAFÉ PASIÓN'}</span>
            </div>
            <p className="text-white-50 small mb-4">
              {settings.negocio_lema || 'Pasión por el café de especialidad, métodos artesanales y bienestar natural.'} Un espacio dedicado a los amantes del buen grano y la salud integral.
            </p>

            {/* Redes Sociales Configurables */}
            <div className="d-flex align-items-center">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="Facebook de Café Pasión"
                >
                  <span className="fw-bold small">fb</span>
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="Instagram de Café Pasión"
                >
                  <span className="fw-bold small">ig</span>
                </a>
              )}
              {settings.tiktok_url && (
                <a
                  href={settings.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="TikTok de Café Pasión"
                >
                  <span className="fw-bold small">tk</span>
                </a>
              )}
              {settings.x_url && (
                <a
                  href={settings.x_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                  title="X (Twitter) de Café Pasión"
                >
                  <span className="fw-bold small">𝕏</span>
                </a>
              )}
            </div>
          </div>

          {/* Columna 2: Categorías del Catálogo */}
          <div className="col-lg-3 col-md-6">
            <h5 className="footer-heading">Categorías</h5>
            <ul className="footer-links">
              <li>
                <Link to="/catalogo?categoria=cafes-de-especialidad">
                  Cafés de Especialidad
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=bebidas-frias-y-calientes">
                  Bebidas Frías y Calientes
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=metodos-y-accesorios">
                  Métodos y Accesorios
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=productos-dxn">
                  Productos DXN
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Horarios y Contacto Dinámico */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-heading">Atención y Visitas</h5>
            <ul className="footer-links">
              <li className="d-flex align-items-start gap-2 text-white-50 small">
                <MapPin size={18} className="text-gold flex-shrink-0 mt-1" />
                <span>{settings.direccion || 'Av. El Café 456, Centro Gastronómico'}</span>
              </li>
              <li className="d-flex align-items-start gap-2 text-white-50 small">
                <Clock size={18} className="text-gold flex-shrink-0 mt-1" />
                <span>{settings.horario_atencion || 'Lunes a Sábado: 8:00 AM - 9:00 PM'}</span>
              </li>
              <li className="d-flex align-items-center gap-2 text-white-50 small">
                <Phone size={18} className="text-gold flex-shrink-0" />
                <span>{settings.telefono || '+51 987 654 321'}</span>
              </li>
              <li className="d-flex align-items-center gap-2 small">
                <MessageCircle size={18} className="text-success flex-shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp || '51987654321'}?text=${encodeURIComponent(settings.whatsapp_mensaje || 'Hola Café Pasión')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white-50 text-decoration-none"
                >
                  WhatsApp directo: <span className="text-white fw-semibold">{settings.whatsapp}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior de Derechos */}
        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="text-white-50 mb-0">
            &copy; {currentYear} {settings.negocio_nombre || 'Café Pasión'}. Todos los derechos reservados. Catálogo informativo.
          </p>
          <div className="d-flex align-items-center gap-3">
            <Link to="/contacto" className="text-white-50 small text-decoration-none">
              Ubicación y Mapa
            </Link>
            <span className="text-white-50">|</span>
            <Link to="/admin/login" className="text-white-50 small text-decoration-none">
              Acceso Administrativo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
