import { Coffee, MessageCircle, Eye, Star, Check } from 'lucide-react';
import { getImageUrl } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export const ProductCard = ({ product, onOpenDetail }) => {
  const { settings } = useSettings();

  if (!product) return null;

  const {
    id,
    nombre,
    descripcion_corta,
    precio,
    imagen_principal,
    categoria_nombre,
    destacado
  } = product;

  // Enlace directo a WhatsApp con mensaje predeterminado del producto
  const rawNumber = settings.whatsapp || '51987654321';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const inquiryMessage = encodeURIComponent(
    `¡Hola Café Pasión! Me interesa consultar sobre el producto: "${nombre}" (Precio: S/ ${Number(precio).toFixed(2)}). ¿Tienen disponibilidad?`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${inquiryMessage}`;

  return (
    <div className="card-cafe h-100 d-flex flex-column position-relative">
      {/* Contenedor de Imagen y Badges */}
      <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
        <img
          src={getImageUrl(imagen_principal)}
          alt={nombre}
          className="w-100 h-100 object-fit-cover transition-smooth"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80';
          }}
          loading="lazy"
        />

        {/* Badge de Categoría */}
        <span className="position-absolute top-0 start-0 m-3 badge-categoria shadow-sm">
          {categoria_nombre || 'Especialidad'}
        </span>

        {/* Badge de Destacado */}
        {destacado ? (
          <span
            className="position-absolute top-0 end-0 m-3 badge bg-warning text-dark fw-bold d-inline-flex align-items-center gap-1 shadow-sm px-2 py-1 rounded-pill"
            style={{ fontSize: '0.75rem', letterSpacing: '0.02em' }}
          >
            <Star size={12} fill="#2C1810" />
            <span>Destacado</span>
          </span>
        ) : null}
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-4 d-flex flex-column flex-grow-1">
        <h5 className="font-title mb-2 text-espresso" title={nombre} style={{ fontSize: '1.15rem', minHeight: '2.8rem' }}>
          {nombre}
        </h5>

        <p className="text-muted-cafe small mb-3 flex-grow-1" style={{ lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {descripcion_corta}
        </p>

        {/* Precio y Disponibilidad */}
        <div className="d-flex align-items-center justify-content-between mb-3 pt-2 border-top border-light-subtle">
          <div>
            <span className="text-muted small d-block" style={{ fontSize: '0.78rem' }}>Precio de carta:</span>
            <span className="fs-4 fw-bold text-espresso">
              S/ {Number(precio).toFixed(2)}
            </span>
          </div>
          <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 px-2 py-1">
            <Check size={12} />
            <span>Disponible</span>
          </span>
        </div>

        {/* Botones de Acción */}
        <div className="row g-2 pt-1">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-outline-secondary w-100 btn-sm rounded-pill py-2 d-inline-flex align-items-center justify-content-center gap-1 fw-semibold"
              onClick={() => onOpenDetail && onOpenDetail(product)}
            >
              <Eye size={15} />
              <span>Ver Detalle</span>
            </button>
          </div>
          <div className="col-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-cafe-dorado w-100 btn-sm rounded-pill py-2 d-inline-flex align-items-center justify-content-center gap-1"
              title="Consultar disponibilidad por WhatsApp"
            >
              <MessageCircle size={15} />
              <span>Consultar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
