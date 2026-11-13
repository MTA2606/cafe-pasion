import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowRight, Sparkles, HeartHandshake, ShieldCheck, Flame, Layers, MessageCircle } from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/catalog/ProductCard';
import ProductDetailModal from '../components/catalog/ProductDetailModal';

export const HomePage = () => {
  const { settings } = useSettings();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Estado para el modal de detalle
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Cargar productos destacados
    const fetchFeatured = async () => {
      try {
        setLoadingFeatured(true);
        const res = await api.get('/productos?destacados=true');
        if (res.data?.success) {
          setFeaturedProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error cargando destacados:', err.message);
      } finally {
        setLoadingFeatured(false);
      }
    };

    // 2. Cargar categorías con conteo
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await api.get('/categorias');
        if (res.data?.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error cargando categorías:', err.message);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchFeatured();
    fetchCategories();
  }, []);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // Helper para asignar iconos e imágenes representativas a cada categoría
  const getCategoryVisuals = (slug) => {
    switch (slug) {
      case 'cafes-de-especialidad':
        return {
          bgImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
          subtitle: 'Granos de altura 100% arábica'
        };
      case 'bebidas-frias-y-calientes':
        return {
          bgImage: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
          subtitle: 'Espressos, lattes y cold brew'
        };
      case 'metodos-y-accesorios':
        return {
          bgImage: 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=600&q=80',
          subtitle: 'V60, Chemex y molinos de precisión'
        };
      case 'productos-dxn':
        return {
          bgImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
          subtitle: 'Nutrición con Ganoderma Lucidum'
        };
      default:
        return {
          bgImage: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80',
          subtitle: 'Variedad de especialidades'
        };
    }
  };

  const waNumber = settings.whatsapp || '51987654321';
  const cleanNumber = waNumber.replace(/[^0-9]/g, '');
  const waContactUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(settings.whatsapp_mensaje || 'Hola Café Pasión, deseo consultar sobre sus productos')}`;

  return (
    <div className="animate-fade-in">
      {/* 1. HERO SECTION MODERNO */}
      <section
        className="position-relative text-white py-5 d-flex align-items-center"
        style={{
          minHeight: '82vh',
          background: `linear-gradient(rgba(44, 24, 16, 0.88), rgba(44, 24, 16, 0.82)), url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat`
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-9 mx-auto text-center">
              <span className="badge-categoria mb-3 bg-white text-dark fw-bold px-3 py-2 shadow">
                ☕ Cafetería de Especialidad & Bienestar DXN
              </span>
              <h1 className="display-2 fw-bold mb-4 text-white font-title" style={{ letterSpacing: '-0.02em' }}>
                {settings.negocio_nombre || 'CAFÉ PASIÓN'}
              </h1>
              <p className="lead fs-4 text-white-50 mb-5 mx-auto" style={{ maxWidth: '720px' }}>
                {settings.negocio_lema || 'El arte del buen café y bienestar en cada taza'}. Granos selectos de altura, extracciones artesanales y productos enriquecidos con Ganoderma Lucidum.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/catalogo" className="btn-cafe-dorado fs-5 px-4 py-3">
                  <Coffee size={22} />
                  <span>Explorar Catálogo</span>
                </Link>
                <Link to="/nosotros" className="btn-cafe-outline-light fs-5 px-4 py-3">
                  <span>Nuestra Historia</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORAR POR CATEGORÍAS (GRILLA INTERACTIVA CON CONTEO REAL) */}
      <section className="section-padding bg-crema">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-gold fw-bold text-uppercase small">Nuestra Colección</span>
            <h2 className="font-title display-5 mb-2">Explora por Categorías</h2>
            <p className="text-muted-cafe mx-auto" style={{ maxWidth: '580px' }}>
              Descubre nuestra oferta organizada según tus preferencias de café y bienestar.
            </p>
          </div>

          <div className="row g-4">
            {categories.map((cat) => {
              const visual = getCategoryVisuals(cat.slug);
              return (
                <div key={cat.id} className="col-md-6 col-lg-3">
                  <Link
                    to={`/catalogo?categoria=${cat.slug}`}
                    className="card-cafe text-decoration-none d-block h-100 overflow-hidden position-relative group-hover"
                    style={{ minHeight: '260px' }}
                  >
                    <div
                      className="position-absolute inset-0 w-100 h-100"
                      style={{
                        backgroundImage: `linear-gradient(rgba(44, 24, 16, 0.65), rgba(44, 24, 16, 0.92)), url('${visual.bgImage}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.4s ease'
                      }}
                    />
                    <div className="position-relative p-4 d-flex flex-column justify-content-end h-100 text-white" style={{ minHeight: '260px' }}>
                      <span className="badge bg-warning text-dark mb-2 align-self-start fw-bold small">
                        {cat.total_productos || 0} productos
                      </span>
                      <h4 className="font-title text-white mb-1">{cat.nombre}</h4>
                      <p className="text-white-50 small mb-3">{visual.subtitle}</p>
                      <span className="text-gold small fw-semibold d-inline-flex align-items-center gap-1">
                        <span>Ver categoría</span>
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PRODUCTOS DESTACADOS DINÁMICOS */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="d-flex flex-wrap align-items-end justify-content-between mb-5 gap-3">
            <div>
              <span className="text-gold fw-bold text-uppercase small d-flex align-items-center gap-1">
                <Flame size={16} color="#C89D54" />
                <span>Selección Exclusiva</span>
              </span>
              <h2 className="font-title display-5 mb-0">Especialidades Destacadas</h2>
            </div>
            <Link to="/catalogo" className="btn btn-outline-secondary rounded-pill px-4 py-2 small fw-semibold">
              <span>Ver Catálogo Completo</span>
              <ArrowRight size={16} className="ms-1" />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="row g-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="col-md-4">
                  <div className="card-cafe p-4 text-center">
                    <div className="spinner-border text-gold my-4" role="status" />
                    <p className="text-muted small">Cargando destacados...</p>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="row g-4">
              {featuredProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="col-md-6 col-lg-4">
                  <ProductCard product={product} onOpenDetail={handleOpenDetail} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No hay productos destacados por el momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. EXPERIENCIA Y PILARES CAFÉ PASIÓN */}
      <section className="section-padding bg-crema">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="text-gold fw-bold text-uppercase small">Nuestra Promesa</span>
              <h2 className="font-title display-6 mb-4">¿Por qué Elegir Café Pasión?</h2>
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="cafe-brand-icon flex-shrink-0" style={{ width: '46px', height: '46px' }}>
                  <Coffee size={24} />
                </div>
                <div>
                  <h5 className="font-title mb-1">Tueste Artesanal Fresco</h5>
                  <p className="text-muted-cafe small mb-0">
                    Controlamos minuciosamente cada lote de tueste para conservar los azúcares naturales y las notas florales y acarameladas del grano.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="cafe-brand-icon flex-shrink-0" style={{ width: '46px', height: '46px' }}>
                  <Sparkles size={24} />
                </div>
                <div>
                  <h5 className="font-title mb-1">Bienestar Holístico con DXN</h5>
                  <p className="text-muted-cafe small mb-0">
                    Bebidas saludables que combinan el deleite de un buen café con las propiedades adaptógenas e inmunomoduladoras del Ganoderma Lucidum.
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="cafe-brand-icon flex-shrink-0" style={{ width: '46px', height: '46px' }}>
                  <HeartHandshake size={24} />
                </div>
                <div>
                  <h5 className="font-title mb-1">Atención Cercana y Asesoría Barista</h5>
                  <p className="text-muted-cafe small mb-0">
                    Te orientamos en la molienda ideal para tu método casero (V60, Prensa Francesa o Cafetera Italiana) y respondemos tus dudas al instante por WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card-cafe p-2 shadow-lg overflow-hidden position-relative" style={{ borderRadius: '24px' }}>
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
                  alt="Preparación de café en Café Pasión"
                  className="w-100 rounded-4 object-fit-cover"
                  style={{ maxHeight: '420px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BANNER CTA DE CONTACTO Y WHATSAPP */}
      <section className="bg-espresso text-white py-5 position-relative border-top border-warning">
        <div className="container py-4 text-center">
          <span className="badge-categoria mb-3 bg-white text-dark fw-bold">Atención Directa</span>
          <h2 className="font-title display-5 mb-3 text-white">¿Tienes alguna pregunta sobre nuestros cafés?</h2>
          <p className="lead text-white-50 mx-auto mb-4" style={{ maxWidth: '640px' }}>
            Escríbenos directamente por WhatsApp para coordinar tu pedido o consultar las características de cualquiera de nuestros productos.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <a
              href={waContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-cafe-dorado px-4 py-3 fs-5"
            >
              <MessageCircle size={22} />
              <span>Chatear por WhatsApp ({settings.whatsapp})</span>
            </a>
            <Link to="/contacto" className="btn btn-cafe-outline-light px-4 py-3 fs-5">
              <span>Ver Ubicación y Horarios</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal de Detalle */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

export default HomePage;
