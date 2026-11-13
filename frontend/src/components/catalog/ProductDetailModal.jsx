import { useState, useEffect } from 'react';
import { X, MessageCircle, Check, Star, Coffee, Sparkles, Tag } from 'lucide-react';
import { getImageUrl } from '../../services/api';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

export const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { settings } = useSettings();
  const [detailedProduct, setDetailedProduct] = useState(product);
  const [selectedImage, setSelectedImage] = useState(product?.imagen_principal);
  const [loading, setLoading] = useState(false);

  // Cargar detalles completos (galería de imágenes si existen)
  useEffect(() => {
    if (!product || !isOpen) return;

    setSelectedImage(product.imagen_principal);
    setDetailedProduct(product);

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/productos/${product.id}`);
        if (res.data?.success) {
          setDetailedProduct(res.data.data);
          if (res.data.data.imagen_principal) {
            setSelectedImage(res.data.data.imagen_principal);
          }
        }
      } catch (err) {
        console.warn('Usando datos locales del producto:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [product, isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !detailedProduct) return null;

  const {
    nombre,
    descripcion_corta,
    descripcion_completa,
    caracteristicas,
    precio,
    categoria_nombre,
    destacado,
    galeria = []
  } = detailedProduct;

  // Enlace directo a WhatsApp
  const rawNumber = settings.whatsapp || '51987654321';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const inquiryMessage = encodeURIComponent(
    `¡Hola Café Pasión! Estoy revisando su catálogo en línea y me gustaría consultar disponibilidad e información sobre el producto:\n\n*${nombre}*\n*Precio:* S/ ${Number(precio).toFixed(2)}\n\n¿Cómo puedo adquirirlo o visitarlos? Muchas gracias.`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${inquiryMessage}`;

  // Lista de imágenes para la galería (principal + adicionales)
  const allImages = [
    ...(detailedProduct.imagen_principal ? [{ id: 'main', url_imagen: detailedProduct.imagen_principal }] : []),
    ...galeria
  ];

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(44, 24, 16, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header del Modal */}
          <div className="modal-header bg-espresso text-white py-3 px-4 border-0">
            <div className="d-flex align-items-center gap-2">
              <Coffee size={22} color="#C89D54" />
              <h5 className="modal-title font-title mb-0 text-white">Detalle de Producto</h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Cerrar modal"
              onClick={onClose}
            />
          </div>

          {/* Cuerpo del Modal */}
          <div className="modal-body p-4 p-md-5 bg-white">
            <div className="row g-4 align-items-start">
              {/* Columna Izquierda: Fotografías */}
              <div className="col-md-5">
                <div className="card-cafe overflow-hidden mb-3" style={{ height: '320px' }}>
                  <img
                    src={getImageUrl(selectedImage)}
                    alt={nombre}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>

                {/* Miniaturas de Galería si existen más de una */}
                {allImages.length > 1 && (
                  <div className="d-flex gap-2 overflow-x-auto pb-2">
                    {allImages.map((img, idx) => (
                      <button
                        key={img.id || idx}
                        type="button"
                        className={`btn p-0 border rounded-3 overflow-hidden ${selectedImage === img.url_imagen ? 'border-warning border-2 shadow-sm' : 'border-secondary-subtle'}`}
                        style={{ width: '64px', height: '64px', flexShrink: 0 }}
                        onClick={() => setSelectedImage(img.url_imagen)}
                      >
                        <img
                          src={getImageUrl(img.url_imagen)}
                          alt={`Foto ${idx + 1}`}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-light rounded-3 mt-3 text-center border">
                  <span className="small text-muted d-block mb-1">Precio sugerido:</span>
                  <span className="display-6 fw-bold text-espresso">
                    S/ {Number(precio).toFixed(2)}
                  </span>
                  <div className="mt-2">
                    <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 px-3 py-1">
                      <Check size={14} />
                      <span>Disponible en catálogo</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Especificaciones */}
              <div className="col-md-7">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge-categoria">{categoria_nombre}</span>
                  {destacado ? (
                    <span className="badge bg-warning text-dark fw-bold d-inline-flex align-items-center gap-1">
                      <Star size={12} fill="#2C1810" />
                      <span>Destacado de la Casa</span>
                    </span>
                  ) : null}
                </div>

                <h3 className="font-title mb-3 text-espresso">{nombre}</h3>

                <p className="lead text-muted-cafe fs-6 mb-3">
                  {descripcion_completa || descripcion_corta}
                </p>

                {/* Lista Desglosada de Características Técnicas */}
                {Array.isArray(caracteristicas) && caracteristicas.length > 0 && (
                  <div className="my-4 p-3 rounded-3" style={{ backgroundColor: 'var(--cafe-crema)' }}>
                    <h6 className="fw-bold font-title text-espresso mb-2 d-flex align-items-center gap-2">
                      <Sparkles size={16} color="#C89D54" />
                      <span>Ficha Técnica y Notas de Calidad</span>
                    </h6>
                    <ul className="list-unstyled mb-0 small text-muted-cafe">
                      {caracteristicas.map((item, index) => (
                        <li key={index} className="py-1 d-flex align-items-start gap-2 border-bottom border-light-subtle">
                          <span className="text-gold fw-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Botón de Acción Principal */}
                <div className="d-grid gap-2 pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-cafe-dorado py-3 fs-5 shadow"
                  >
                    <MessageCircle size={22} />
                    <span>Pedir / Consultar por WhatsApp</span>
                  </a>
                  <p className="text-center text-muted small mt-2 mb-0">
                    * Sin cobros en línea. Coordina tu pedido directamente con Café Pasión.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer del Modal */}
          <div className="modal-footer bg-light py-2 px-4 border-top">
            <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill px-4" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
