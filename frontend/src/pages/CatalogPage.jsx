import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Coffee, Search, Filter, ArrowUpDown, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/catalog/ProductCard';
import ProductDetailModal from '../components/catalog/ProductDetailModal';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('destacados');

  // Modal de detalle
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Categoría seleccionada a través de la URL
  const activeCategory = searchParams.get('categoria') || '';

  // 1. Cargar categorías de la base de datos
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categorias');
        if (res.data?.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error al cargar categorías:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // 2. Cargar productos según la categoría activa de la URL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const endpoint = activeCategory
          ? `/productos?categoria=${encodeURIComponent(activeCategory)}`
          : '/productos';
        const res = await api.get(endpoint);
        if (res.data?.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error al cargar productos:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  // Cambiar categoría y actualizar la URL
  const handleCategorySelect = (slug) => {
    if (!slug) {
      searchParams.delete('categoria');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ categoria: slug });
    }
  };

  // Limpiar todos los filtros
  const handleResetFilters = () => {
    setSearch('');
    setSortBy('destacados');
    searchParams.delete('categoria');
    setSearchParams(searchParams);
  };

  // Filtrado y ordenamiento en memoria reactiva
  const processedProducts = useMemo(() => {
    let list = [...products];

    // Filtro por término de búsqueda (nombre, descripción corta o descripción completa)
    if (search.trim()) {
      const term = search.toLowerCase().trim();
      list = list.filter((p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion_corta.toLowerCase().includes(term) ||
        (p.descripcion_completa && p.descripcion_completa.toLowerCase().includes(term))
      );
    }

    // Ordenamiento
    switch (sortBy) {
      case 'precio-asc':
        list.sort((a, b) => Number(a.precio) - Number(b.precio));
        break;
      case 'precio-desc':
        list.sort((a, b) => Number(b.precio) - Number(a.precio));
        break;
      case 'nombre-asc':
        list.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'destacados':
      default:
        list.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
        break;
    }

    return list;
  }, [products, search, sortBy]);

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // Conteo total de productos en todas las categorías
  const totalInAllCategories = categories.reduce((acc, cat) => acc + (cat.total_productos || 0), 0);

  return (
    <div className="animate-fade-in">
      {/* Header del Catálogo */}
      <section className="bg-espresso py-5 text-white text-center">
        <div className="container py-3">
          <span className="badge-categoria mb-3 bg-white text-dark fw-bold">
            Catálogo Informativo &bull; Café Pasión
          </span>
          <h1 className="display-4 fw-bold font-title">Nuestra Carta de Cafés y Productos</h1>
          <p className="lead text-white-50 mx-auto" style={{ maxWidth: '640px' }}>
            Explora precios, características técnicas y notas de cata. Para consultas directas sobre disponibilidad, pulsa en el botón de WhatsApp de cada producto.
          </p>
        </div>
      </section>

      {/* Barra de Filtros, Categorías y Buscador */}
      <section className="py-4 bg-white border-bottom shadow-sm sticky-top" style={{ top: '69px', zIndex: 1020 }}>
        <div className="container">
          <div className="row g-3 align-items-center justify-content-between">
            {/* Pestañas de Categoría */}
            <div className="col-lg-7">
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${!activeCategory ? 'btn-cafe-dorado' : 'btn-outline-secondary'}`}
                  onClick={() => handleCategorySelect('')}
                >
                  Todos ({totalInAllCategories || products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${activeCategory === cat.slug ? 'btn-cafe-dorado' : 'btn-outline-secondary'}`}
                    onClick={() => handleCategorySelect(cat.slug)}
                  >
                    {cat.nombre} ({cat.total_productos || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Buscador y Ordenador */}
            <div className="col-lg-5">
              <div className="row g-2">
                {/* Buscador */}
                <div className="col-sm-7">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light border-end-0">
                      <Search size={15} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 bg-light"
                      placeholder="Buscar por nombre o nota..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Ordenador */}
                <div className="col-sm-5">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light border-end-0">
                      <ArrowUpDown size={14} className="text-muted" />
                    </span>
                    <select
                      className="form-select border-start-0 bg-light"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="destacados">Destacados</option>
                      <option value="precio-asc">Precio: Menor a Mayor</option>
                      <option value="precio-desc">Precio: Mayor a Menor</option>
                      <option value="nombre-asc">Nombre: A - Z</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grilla de Resultados */}
      <section className="section-padding bg-crema">
        <div className="container">
          {/* Contador de Resultados y Filtro Activo */}
          <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted-cafe small fw-bold">
                Mostrando {processedProducts.length} producto{processedProducts.length !== 1 ? 's' : ''}
              </span>
              {activeCategory && (
                <span className="badge bg-secondary-subtle text-dark border px-2 py-1 small">
                  Filtro: {categories.find(c => c.slug === activeCategory)?.nombre || activeCategory}
                </span>
              )}
            </div>

            {(activeCategory || search) && (
              <button
                type="button"
                className="btn btn-link text-muted-cafe text-decoration-none small p-0 d-inline-flex align-items-center gap-1"
                onClick={handleResetFilters}
              >
                <RefreshCw size={14} />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>

          {/* Skeletons de Carga */}
          {loading ? (
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="col-md-6 col-lg-4">
                  <div className="card-cafe p-4 text-center">
                    <div className="spinner-border text-gold my-4" role="status" />
                    <p className="text-muted small">Cargando catálogo...</p>
                  </div>
                </div>
              ))}
            </div>
          ) : processedProducts.length === 0 ? (
            /* Estado Vacío */
            <div className="text-center py-5 bg-white rounded-4 p-5 shadow-sm">
              <AlertCircle size={52} color="#C89D54" className="mb-3 mx-auto" />
              <h3 className="font-title mb-2">No se encontraron productos</h3>
              <p className="text-muted-cafe mb-4" style={{ maxWidth: '480px', margin: '0 auto' }}>
                No encontramos productos que coincidan con &ldquo;{search || activeCategory}&rdquo;. Prueba modificando el término o revisa otra categoría.
              </p>
              <button
                type="button"
                className="btn btn-cafe-dorado px-4"
                onClick={handleResetFilters}
              >
                Ver todos los productos de Café Pasión
              </button>
            </div>
          ) : (
            /* Grilla de Productos */
            <div className="row g-4">
              {processedProducts.map((product) => (
                <div key={product.id} className="col-md-6 col-lg-4">
                  <ProductCard product={product} onOpenDetail={handleOpenDetail} />
                </div>
              ))}
            </div>
          )}
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

export default CatalogPage;
