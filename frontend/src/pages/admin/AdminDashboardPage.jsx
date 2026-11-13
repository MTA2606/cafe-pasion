import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Coffee,
  LogOut,
  Package,
  Plus,
  Layers,
  Eye,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle,
  XCircle,
  Settings,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import api, { getImageUrl } from '../../services/api';
import ProductFormModal from '../../components/admin/ProductFormModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import CategoryModal from '../../components/admin/CategoryModal';

export const AdminDashboardPage = () => {
  const { admin, logout } = useAuth();
  const { settings, refreshSettings } = useSettings();
  const navigate = useNavigate();

  // Estados principales de datos
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' | 'categorias' | 'configuracion'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros de la pestaña de productos
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Notificaciones Toast / Alerta
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  // Estados de Modales de Productos
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Estados de Modal de Eliminación de Producto
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados de Modal de Categorías
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  // Formulario de Configuración del Negocio
  const [configForm, setConfigForm] = useState({
    negocio_nombre: '',
    negocio_lema: '',
    telefono: '',
    whatsapp: '',
    whatsapp_mensaje: '',
    direccion: '',
    horario_atencion: '',
    mapa_embed_url: '',
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    x_url: ''
  });
  const [savingConfig, setSavingConfig] = useState(false);

  // Cargar datos del dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/productos/admin/todos'),
        api.get('/categorias/admin/todas')
      ]);

      if (prodRes.data?.success) setProducts(prodRes.data.data);
      if (catRes.data?.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error('Error al cargar datos administrativos:', err.message);
      showAlert('danger', 'Error al conectar con la base de datos de Café Pasión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Sincronizar formulario de configuración cuando cambie el contexto
  useEffect(() => {
    if (settings) {
      setConfigForm({
        negocio_nombre: settings.negocio_nombre || '',
        negocio_lema: settings.negocio_lema || '',
        telefono: settings.telefono || '',
        whatsapp: settings.whatsapp || '',
        whatsapp_mensaje: settings.whatsapp_mensaje || '',
        direccion: settings.direccion || '',
        horario_atencion: settings.horario_atencion || '',
        mapa_embed_url: settings.mapa_embed_url || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        tiktok_url: settings.tiktok_url || '',
        x_url: settings.x_url || ''
      });
    }
  }, [settings]);

  const showAlert = (type, text) => {
    setAlertMessage({ type, text });
    setTimeout(() => {
      setAlertMessage({ type: '', text: '' });
    }, 4000);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  // ==========================================
  // Acciones de Productos
  // ==========================================
  const handleOpenCreateProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setProductToEdit(prod);
    setIsProductModalOpen(true);
  };

  const handleProductSaved = (savedProduct, action) => {
    showAlert('success', `Producto "${savedProduct.nombre}" ${action} exitosamente.`);
    fetchDashboardData();
  };

  // Alternar Activo en un producto
  const handleToggleProductActivo = async (prod) => {
    try {
      const newStatus = !prod.activo;
      // Actualización optimista en memoria
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, activo: newStatus } : p));
      
      const res = await api.put(`/productos/${prod.id}`, { activo: newStatus });
      if (res.data?.success) {
        showAlert('success', `Producto "${prod.nombre}" ahora está ${newStatus ? 'visible' : 'oculto'}.`);
      }
    } catch (err) {
      console.error('Error al alternar estado de producto:', err);
      showAlert('danger', 'No se pudo actualizar el estado del producto.');
      fetchDashboardData();
    }
  };

  // Alternar Destacado en un producto
  const handleToggleProductDestacado = async (prod) => {
    try {
      const newDestacado = !prod.destacado;
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, destacado: newDestacado } : p));

      const res = await api.put(`/productos/${prod.id}`, { destacado: newDestacado });
      if (res.data?.success) {
        showAlert('success', `Producto "${prod.nombre}" ${newDestacado ? 'marcado como destacado ★' : 'removido de destacados'}.`);
      }
    } catch (err) {
      console.error('Error al alternar destacado:', err);
      showAlert('danger', 'No se pudo actualizar el estado de destacado.');
      fetchDashboardData();
    }
  };

  // Abrir confirmación de eliminación
  const handleOpenDeleteProduct = (prod) => {
    setProductToDelete(prod);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      const res = await api.delete(`/productos/${productToDelete.id}`);
      if (res.data?.success) {
        showAlert('success', `Producto "${productToDelete.nombre}" eliminado permanentemente.`);
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      showAlert('danger', 'Error al intentar eliminar el producto.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // Acciones de Categorías
  // ==========================================
  const handleOpenCreateCategory = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setCategoryToEdit(cat);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySaved = (savedCat, action) => {
    showAlert('success', `Categoría "${savedCat.nombre}" ${action} exitosamente.`);
    fetchDashboardData();
  };

  const handleToggleCategoryActivo = async (cat) => {
    try {
      const newStatus = !cat.activo;
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, activo: newStatus ? 1 : 0 } : c));
      const res = await api.put(`/categorias/${cat.id}`, { activo: newStatus });
      if (res.data?.success) {
        showAlert('success', `Categoría "${cat.nombre}" ${newStatus ? 'activada' : 'desactivada'}.`);
      }
    } catch (err) {
      console.error('Error al cambiar estado de categoría:', err);
      showAlert('danger', 'No se pudo actualizar la categoría.');
      fetchDashboardData();
    }
  };

  // ==========================================
  // Acciones de Configuración del Negocio
  // ==========================================
  const handleConfigChange = (e) => {
    setConfigForm({
      ...configForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      setSavingConfig(true);
      const res = await api.put('/configuracion', configForm);
      if (res.data?.success) {
        showAlert('success', '¡Información y enlaces de Café Pasión actualizados con éxito!');
        refreshSettings();
      }
    } catch (err) {
      console.error('Error al guardar configuración:', err);
      showAlert('danger', 'Error al guardar los datos de configuración.');
    } finally {
      setSavingConfig(false);
    }
  };

  // Filtrado de productos en memoria
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm.trim() ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        p.descripcion_corta.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchesCategory =
        !categoryFilter ||
        String(p.categoria_id) === String(categoryFilter);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Métricas en tiempo real
  const totalProductsCount = products.length;
  const activeProductsCount = products.filter(p => p.activo).length;
  const featuredProductsCount = products.filter(p => p.destacado).length;
  const totalCategoriesCount = categories.length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cafe-crema)' }}>
      {/* 1. BARRA SUPERIOR DE ADMINISTRACIÓN */}
      <nav className="navbar navbar-dark bg-espresso px-3 px-md-4 py-3 shadow border-bottom border-warning sticky-top">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="cafe-brand-icon text-decoration-none" style={{ width: '42px', height: '42px' }}>
              <Coffee size={24} />
            </Link>
            <div>
              <h5 className="font-title text-white mb-0">Panel de Administración</h5>
              <small className="text-gold">Café Pasión &bull; Gestor de Catálogo y Configuración</small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 gap-md-3">
            <span className="text-white-50 small d-none d-lg-inline">
              Administrador: <strong className="text-white">{admin?.nombre || 'Admin'}</strong>
            </span>
            <Link to="/" className="btn btn-sm btn-outline-light rounded-pill px-3 d-inline-flex align-items-center gap-1">
              <Eye size={15} />
              <span>Ver Tienda Pública</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-sm btn-danger rounded-pill px-3 d-inline-flex align-items-center gap-1">
              <LogOut size={15} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4 py-md-5">
        {/* Alerta de Éxito o Error Flotante */}
        {alertMessage.text && (
          <div
            className={`alert alert-${alertMessage.type} alert-dismissible fade show shadow-sm mb-4 d-flex align-items-center gap-2`}
            role="alert"
          >
            {alertMessage.type === 'success' ? (
              <CheckCircle size={20} className="text-success flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-danger flex-shrink-0" />
            )}
            <div className="fw-semibold">{alertMessage.text}</div>
            <button type="button" className="btn-close" onClick={() => setAlertMessage({ type: '', text: '' })} />
          </div>
        )}

        {/* 2. TARJETAS DE MÉTRICAS EN TIEMPO REAL */}
        <div className="row g-3 g-md-4 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card-cafe p-3 p-md-4 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted-cafe small fw-bold text-uppercase">Total Productos</span>
                <Package size={22} className="text-gold" />
              </div>
              <h3 className="display-6 fw-bold mb-0 text-espresso">{totalProductsCount}</h3>
              <small className="text-muted">En base de datos SQLite</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card-cafe p-3 p-md-4 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted-cafe small fw-bold text-uppercase">Productos Activos</span>
                <CheckCircle size={22} className="text-success" />
              </div>
              <h3 className="display-6 fw-bold mb-0 text-success">{activeProductsCount}</h3>
              <small className="text-muted">Visibles a clientes</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card-cafe p-3 p-md-4 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted-cafe small fw-bold text-uppercase">Destacados</span>
                <Star size={22} className="text-warning" fill="#C89D54" />
              </div>
              <h3 className="display-6 fw-bold mb-0 text-espresso">{featuredProductsCount}</h3>
              <small className="text-muted">En portada de Inicio</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card-cafe p-3 p-md-4 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted-cafe small fw-bold text-uppercase">Categorías</span>
                <Layers size={22} className="text-gold" />
              </div>
              <h3 className="display-6 fw-bold mb-0 text-espresso">{totalCategoriesCount}</h3>
              <small className="text-muted">Líneas de producto</small>
            </div>
          </div>
        </div>

        {/* 3. PESTAÑAS PRINCIPALES DEL PANEL */}
        <div className="card-cafe bg-white shadow-sm overflow-hidden mb-5">
          <div className="border-bottom px-4 pt-3 bg-light">
            <ul className="nav nav-tabs border-0 gap-2">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold px-4 py-2 border-0 rounded-top-3 ${activeTab === 'productos' ? 'active bg-white text-espresso border-bottom-0 shadow-sm' : 'text-muted'}`}
                  onClick={() => setActiveTab('productos')}
                >
                  <Package size={17} className="me-2" />
                  <span>Inventario de Productos ({totalProductsCount})</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold px-4 py-2 border-0 rounded-top-3 ${activeTab === 'categorias' ? 'active bg-white text-espresso border-bottom-0 shadow-sm' : 'text-muted'}`}
                  onClick={() => setActiveTab('categorias')}
                >
                  <Layers size={17} className="me-2" />
                  <span>Categorías ({totalCategoriesCount})</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link fw-semibold px-4 py-2 border-0 rounded-top-3 ${activeTab === 'configuracion' ? 'active bg-white text-espresso border-bottom-0 shadow-sm' : 'text-muted'}`}
                  onClick={() => setActiveTab('configuracion')}
                >
                  <Settings size={17} className="me-2" />
                  <span>Configuración del Negocio</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="p-4 p-md-5">
            {/* ========================================================
               PESTAÑA 1: INVENTARIO DE PRODUCTOS (CRUD)
               ======================================================== */}
            {activeTab === 'productos' && (
              <div>
                {/* Cabecera y Barra de Acciones */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
                  <div>
                    <h4 className="font-title mb-1 text-espresso">Inventario del Catálogo</h4>
                    <p className="text-muted-cafe small mb-0">Gestiona fotografías, precios, descripciones y disponibilidad.</p>
                  </div>
                  <div className="d-flex gap-2">
                    <button onClick={fetchDashboardData} className="btn btn-sm btn-outline-secondary rounded-pill px-3" title="Recargar datos">
                      <RefreshCw size={14} className="me-1" />
                      <span>Actualizar</span>
                    </button>
                    <button onClick={handleOpenCreateProduct} className="btn btn-sm btn-cafe-dorado rounded-pill px-4 shadow-sm">
                      <Plus size={16} />
                      <span>Nuevo Producto</span>
                    </button>
                  </div>
                </div>

                {/* Filtros de Búsqueda de Productos */}
                <div className="row g-3 mb-4">
                  <div className="col-md-7">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Search size={16} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 bg-light"
                        placeholder="Buscar producto por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <select
                      className="form-select bg-light"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">Todas las categorías ({categories.length})</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tabla de Productos */}
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-gold mb-3" role="status" />
                    <p className="text-muted small">Cargando inventario de Café Pasión...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded-4 p-4 border">
                    <Package size={42} className="text-muted mb-2 mx-auto" />
                    <h5 className="font-title">No se encontraron productos</h5>
                    <p className="text-muted small mb-3">Prueba cambiando los filtros o crea un nuevo producto.</p>
                    <button onClick={handleOpenCreateProduct} className="btn btn-sm btn-cafe-dorado">
                      <Plus size={15} />
                      <span>Crear Producto Ahora</span>
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '70px' }}>Foto</th>
                          <th>Producto</th>
                          <th>Categoría</th>
                          <th>Precio</th>
                          <th className="text-center">Activo / Visible</th>
                          <th className="text-center">Destacado</th>
                          <th className="text-end">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((p) => (
                          <tr key={p.id}>
                            {/* Miniatura */}
                            <td>
                              <img
                                src={getImageUrl(p.imagen_principal)}
                                alt={p.nombre}
                                className="rounded-3 object-fit-cover border"
                                style={{ width: '50px', height: '50px' }}
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80';
                                }}
                              />
                            </td>

                            {/* Nombre y Descripción */}
                            <td>
                              <div className="fw-semibold text-espresso">{p.nombre}</div>
                              <small className="text-muted d-block" style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {p.descripcion_corta}
                              </small>
                            </td>

                            {/* Categoría */}
                            <td>
                              <span className="badge-categoria small">{p.categoria_nombre}</span>
                            </td>

                            {/* Precio */}
                            <td>
                              <span className="fw-bold text-espresso fs-6">
                                S/ {Number(p.precio).toFixed(2)}
                              </span>
                            </td>

                            {/* Switch Activo / Visible */}
                            <td className="text-center">
                              <div className="form-check form-switch d-inline-block">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  checked={Boolean(p.activo)}
                                  onChange={() => handleToggleProductActivo(p)}
                                  title={p.activo ? 'Click para ocultar del catálogo' : 'Click para hacer visible'}
                                />
                              </div>
                            </td>

                            {/* Switch Destacado */}
                            <td className="text-center">
                              <button
                                type="button"
                                className={`btn btn-sm border-0 ${p.destacado ? 'text-warning' : 'text-muted'}`}
                                onClick={() => handleToggleProductDestacado(p)}
                                title={p.destacado ? 'Quitar de destacados' : 'Marcar como destacado'}
                              >
                                <Star size={20} fill={p.destacado ? '#C89D54' : 'none'} />
                              </button>
                            </td>

                            {/* Acciones */}
                            <td className="text-end">
                              <div className="btn-group btn-group-sm">
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => handleOpenEditProduct(p)}
                                  title="Editar producto"
                                >
                                  <Edit2 size={15} />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() => handleOpenDeleteProduct(p)}
                                  title="Eliminar producto permanentemente"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================
               PESTAÑA 2: GESTIÓN DE CATEGORÍAS
               ======================================================== */}
            {activeTab === 'categorias' && (
              <div>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
                  <div>
                    <h4 className="font-title mb-1 text-espresso">Líneas y Categorías de Café</h4>
                    <p className="text-muted-cafe small mb-0">Organización del catálogo en la web.</p>
                  </div>
                  <button onClick={handleOpenCreateCategory} className="btn btn-sm btn-cafe-dorado rounded-pill px-4 shadow-sm">
                    <Plus size={16} />
                    <span>Nueva Categoría</span>
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Orden</th>
                        <th>Nombre</th>
                        <th>Slug URL</th>
                        <th>Descripción</th>
                        <th className="text-center">Productos Asociados</th>
                        <th className="text-center">Estado</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr key={cat.id}>
                          <td className="fw-bold text-muted">#{cat.orden}</td>
                          <td className="fw-semibold text-espresso">{cat.nombre}</td>
                          <td><code>{cat.slug}</code></td>
                          <td className="small text-muted" style={{ maxWidth: '300px' }}>{cat.descripcion || '-'}</td>
                          <td className="text-center">
                            <span className="badge bg-secondary-subtle text-dark border px-2 py-1">
                              {cat.total_productos || 0} productos
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="form-check form-switch d-inline-block">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={Boolean(cat.activo)}
                                onChange={() => handleToggleCategoryActivo(cat)}
                                title={cat.activo ? 'Desactivar categoría' : 'Activar categoría'}
                              />
                            </div>
                          </td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleOpenEditCategory(cat)}
                              title="Editar categoría"
                            >
                              <Edit2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================
               PESTAÑA 3: CONFIGURACIÓN DINÁMICA DEL NEGOCIO
               ======================================================== */}
            {activeTab === 'configuracion' && (
              <div>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
                  <div>
                    <h4 className="font-title mb-1 text-espresso">Datos Oficiales de Café Pasión</h4>
                    <p className="text-muted-cafe small mb-0">
                      Actualiza teléfonos, WhatsApp, horarios y redes sociales. Se reflejarán de inmediato en todo el sitio web.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveConfig}>
                  <div className="row g-4">
                    {/* Identidad de Marca */}
                    <div className="col-md-6">
                      <div className="card-cafe p-4 bg-light border h-100">
                        <h5 className="font-title mb-3 d-flex align-items-center gap-2">
                          <Coffee size={18} color="#C89D54" />
                          <span>Identidad de la Cafetería</span>
                        </h5>

                        <div className="mb-3">
                          <label className="form-label small fw-bold text-espresso">Nombre Comercial</label>
                          <input
                            type="text"
                            name="negocio_nombre"
                            className="form-control"
                            value={configForm.negocio_nombre}
                            onChange={handleConfigChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-bold text-espresso">Eslogan / Lema</label>
                          <input
                            type="text"
                            name="negocio_lema"
                            className="form-control"
                            value={configForm.negocio_lema}
                            onChange={handleConfigChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-bold text-espresso d-flex align-items-center gap-1">
                            <MapPin size={15} />
                            <span>Dirección Física del Local</span>
                          </label>
                          <input
                            type="text"
                            name="direccion"
                            className="form-control"
                            value={configForm.direccion}
                            onChange={handleConfigChange}
                          />
                        </div>

                        <div className="mb-0">
                          <label className="form-label small fw-bold text-espresso d-flex align-items-center gap-1">
                            <Clock size={15} />
                            <span>Horario de Atención</span>
                          </label>
                          <input
                            type="text"
                            name="horario_atencion"
                            className="form-control"
                            value={configForm.horario_atencion}
                            onChange={handleConfigChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Canales Directos: WhatsApp y Teléfono */}
                    <div className="col-md-6">
                      <div className="card-cafe p-4 bg-light border h-100">
                        <h5 className="font-title mb-3 d-flex align-items-center gap-2">
                          <MessageCircle size={18} color="#25D366" />
                          <span>Canales de Contacto Directo</span>
                        </h5>

                        <div className="mb-3">
                          <label className="form-label small fw-bold text-espresso d-flex align-items-center gap-1">
                            <Phone size={15} />
                            <span>Teléfono Fijo / Móvil</span>
                          </label>
                          <input
                            type="text"
                            name="telefono"
                            className="form-control"
                            value={configForm.telefono}
                            onChange={handleConfigChange}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label small fw-bold text-espresso d-flex align-items-center gap-1">
                            <MessageCircle size={15} />
                            <span>Número de WhatsApp (con código de país)</span>
                          </label>
                          <input
                            type="text"
                            name="whatsapp"
                            className="form-control"
                            placeholder="Ej. 51987654321"
                            value={configForm.whatsapp}
                            onChange={handleConfigChange}
                          />
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Sin espacios ni el símbolo +. Para Perú, incluye el 51 inicial.
                          </small>
                        </div>

                        <div className="mb-0">
                          <label className="form-label small fw-bold text-espresso">Mensaje Predeterminado de WhatsApp</label>
                          <textarea
                            rows="2"
                            name="whatsapp_mensaje"
                            className="form-control"
                            value={configForm.whatsapp_mensaje}
                            onChange={handleConfigChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Redes Sociales y Mapa */}
                    <div className="col-12">
                      <div className="card-cafe p-4 bg-light border">
                        <h5 className="font-title mb-3 d-flex align-items-center gap-2">
                          <Share2 size={18} color="#C89D54" />
                          <span>Presencia Digital & Enlace de Mapa</span>
                        </h5>

                        <div className="row g-3">
                          <div className="col-md-3">
                            <label className="form-label small fw-bold text-espresso">Facebook URL</label>
                            <input
                              type="url"
                              name="facebook_url"
                              className="form-control form-control-sm"
                              placeholder="https://facebook.com/..."
                              value={configForm.facebook_url}
                              onChange={handleConfigChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label small fw-bold text-espresso">Instagram URL</label>
                            <input
                              type="url"
                              name="instagram_url"
                              className="form-control form-control-sm"
                              placeholder="https://instagram.com/..."
                              value={configForm.instagram_url}
                              onChange={handleConfigChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label small fw-bold text-espresso">TikTok URL</label>
                            <input
                              type="url"
                              name="tiktok_url"
                              className="form-control form-control-sm"
                              placeholder="https://tiktok.com/@..."
                              value={configForm.tiktok_url}
                              onChange={handleConfigChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label small fw-bold text-espresso">X (Twitter) URL</label>
                            <input
                              type="url"
                              name="x_url"
                              className="form-control form-control-sm"
                              placeholder="https://x.com/..."
                              value={configForm.x_url}
                              onChange={handleConfigChange}
                            />
                          </div>

                          <div className="col-12 mt-3">
                            <label className="form-label small fw-bold text-espresso">Google Maps Embed URL (Iframe)</label>
                            <input
                              type="text"
                              name="mapa_embed_url"
                              className="form-control form-control-sm"
                              placeholder="https://www.google.com/maps/embed?pb=..."
                              value={configForm.mapa_embed_url}
                              onChange={handleConfigChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-end mt-4">
                    <button
                      type="submit"
                      className="btn btn-cafe-dorado px-5 py-3 fs-6 rounded-pill shadow"
                      disabled={savingConfig}
                    >
                      {savingConfig ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                      ) : (
                        <Save size={18} className="me-2" />
                      )}
                      <span>{savingConfig ? 'Guardando Cambios...' : 'Guardar Toda la Configuración'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Crear / Editar Producto */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
        categories={categories}
        onSaveSuccess={handleProductSaved}
      />

      {/* Modal de Confirmar Eliminación */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteProduct}
        itemTitle={productToDelete?.nombre || 'este producto'}
        isDeleting={isDeleting}
      />

      {/* Modal de Crear / Editar Categoría */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categoryToEdit={categoryToEdit}
        onSaveSuccess={handleCategorySaved}
      />
    </div>
  );
};

export default AdminDashboardPage;
