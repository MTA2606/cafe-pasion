import { NavLink, Link } from 'react-router-dom';
import { Coffee, Shield, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, admin } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg cafe-navbar sticky-top">
      <div className="container">
        {/* Brand / Logotipo */}
        <Link to="/" className="cafe-brand">
          <div className="cafe-brand-icon">
            <Coffee size={24} />
          </div>
          <div className="cafe-brand-text">
            <span className="cafe-brand-title">CAFÉ PASIÓN</span>
            <span className="cafe-brand-subtitle">ESPECIALIDAD & DXN</span>
          </div>
        </Link>

        {/* Botón Hamburguesa para Móviles */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#cafeNavbarNav"
          aria-controls="cafeNavbarNav"
          aria-expanded="false"
          aria-label="Abrir menú de navegación"
        >
          <Menu size={26} color="#C89D54" />
        </button>

        {/* Enlaces de Navegación */}
        <div className="collapse navbar-collapse" id="cafeNavbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link nav-link-cafe ${isActive ? 'active' : ''}`}
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/nosotros"
                className={({ isActive }) => `nav-link nav-link-cafe ${isActive ? 'active' : ''}`}
              >
                Nosotros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/catalogo"
                className={({ isActive }) => `nav-link nav-link-cafe ${isActive ? 'active' : ''}`}
              >
                Catálogo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/contacto"
                className={({ isActive }) => `nav-link nav-link-cafe ${isActive ? 'active' : ''}`}
              >
                Contacto
              </NavLink>
            </li>
          </ul>

          {/* Acceso Administrativo */}
          <div className="d-flex align-items-center">
            <Link
              to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
              className="btn-nav-admin"
              title="Acceso al Panel Administrativo Privado"
            >
              <Shield size={15} />
              <span>{isAuthenticated ? `Admin (${admin?.nombre?.split(' ')[0] || 'Panel'})` : 'Panel'}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
