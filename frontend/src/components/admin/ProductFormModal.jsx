import { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Coffee, Check, AlertCircle } from 'lucide-react';
import api, { getImageUrl } from '../../services/api';

export const ProductFormModal = ({ isOpen, onClose, productToEdit, categories, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria_id: '',
    precio: '',
    descripcion_corta: '',
    descripcion_completa: '',
    destacado: false,
    activo: true
  });

  const [features, setFeatures] = useState([]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(productToEdit);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl('');
      setError('');
      return;
    }

    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre || '',
        categoria_id: productToEdit.categoria_id || (categories[0]?.id || ''),
        precio: productToEdit.precio !== undefined ? productToEdit.precio : '',
        descripcion_corta: productToEdit.descripcion_corta || '',
        descripcion_completa: productToEdit.descripcion_completa || '',
        destacado: Boolean(productToEdit.destacado),
        activo: productToEdit.activo !== undefined ? Boolean(productToEdit.activo) : true
      });

      // Características (array)
      let initialFeatures = [];
      if (Array.isArray(productToEdit.caracteristicas)) {
        initialFeatures = productToEdit.caracteristicas;
      } else if (typeof productToEdit.caracteristicas === 'string') {
        try {
          initialFeatures = JSON.parse(productToEdit.caracteristicas);
        } catch (e) {
          initialFeatures = [productToEdit.caracteristicas];
        }
      }
      setFeatures(initialFeatures);

      // Previsualización de imagen existente
      if (productToEdit.imagen_principal) {
        setPreviewUrl(getImageUrl(productToEdit.imagen_principal));
      } else {
        setPreviewUrl('');
      }
    } else {
      // Modo creación nuevo
      setFormData({
        nombre: '',
        categoria_id: categories[0]?.id || '',
        precio: '',
        descripcion_corta: '',
        descripcion_completa: '',
        destacado: false,
        activo: true
      });
      setFeatures([
        'Origen: Selva Alta (1,700 m.s.n.m.)',
        'Variedad: 100% Arábica de Especialidad',
        'Tueste: Medio Artesanal'
      ]);
      setPreviewUrl('');
    }
  }, [isOpen, productToEdit, categories]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona un archivo de imagen válido (JPG, PNG o WebP)');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim() || !formData.categoria_id || !formData.precio || !formData.descripcion_corta.trim()) {
      setError('Por favor, completa los campos obligatorios: Nombre, Categoría, Precio y Descripción Corta.');
      return;
    }

    try {
      setSubmitting(true);

      // Usar FormData para enviar archivo binario y datos a Multer
      const data = new FormData();
      data.append('nombre', formData.nombre.trim());
      data.append('categoria_id', formData.categoria_id);
      data.append('precio', formData.precio);
      data.append('descripcion_corta', formData.descripcion_corta.trim());
      data.append('descripcion_completa', formData.descripcion_completa.trim() || formData.descripcion_corta.trim());
      data.append('caracteristicas', JSON.stringify(features));
      data.append('destacado', formData.destacado ? 'true' : 'false');
      data.append('activo', formData.activo ? 'true' : 'false');

      if (selectedFile) {
        data.append('imagen', selectedFile);
      }

      let res;
      if (isEditing) {
        res = await api.put(`/productos/${productToEdit.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/productos', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data?.success) {
        onSaveSuccess(res.data.data, isEditing ? 'actualizado' : 'creado');
        onClose();
      } else {
        setError(res.data?.message || 'Error al guardar el producto');
      }
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError(err.response?.data?.message || 'Error de conexión con el servidor');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          {/* Header */}
          <div className="modal-header bg-espresso text-white py-3 px-4 border-0">
            <div className="d-flex align-items-center gap-2">
              <Coffee size={22} color="#C89D54" />
              <h5 className="modal-title font-title mb-0 text-white">
                {isEditing ? `Editar Producto: ${productToEdit.nombre}` : 'Nuevo Producto para Café Pasión'}
              </h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar" />
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 p-md-5 bg-white" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-4" role="alert">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}

              <div className="row g-4">
                {/* Columna Izquierda: Imagen y Estado */}
                <div className="col-md-5">
                  <label className="form-label small fw-bold text-espresso">Fotografía del Producto</label>
                  <div
                    className="border border-2 border-dashed rounded-3 p-3 text-center mb-3 d-flex flex-column align-items-center justify-content-center"
                    style={{ minHeight: '220px', backgroundColor: 'var(--cafe-crema)' }}
                  >
                    {previewUrl ? (
                      <div className="position-relative w-100" style={{ height: '180px' }}>
                        <img
                          src={previewUrl}
                          alt="Vista previa"
                          className="w-100 h-100 object-fit-cover rounded-3 shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="text-muted small">
                        <Upload size={32} className="text-gold mb-2 mx-auto" />
                        <p className="mb-1 fw-semibold">Subir imagen</p>
                        <p className="small text-muted mb-0">Formatos JPG, PNG o WebP (Máx 5MB)</p>
                      </div>
                    )}

                    <input
                      type="file"
                      id="productImageInput"
                      className="d-none"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="productImageInput"
                      className="btn btn-sm btn-outline-secondary rounded-pill mt-3 px-3"
                    >
                      {previewUrl ? 'Cambiar Imagen' : 'Seleccionar Archivo'}
                    </label>
                  </div>

                  {/* Interruptores de Estado */}
                  <div className="p-3 bg-light rounded-3 border">
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="activoSwitch"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small fw-bold text-espresso" htmlFor="activoSwitch">
                        Producto Activo / Visible
                      </label>
                      <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                        Si está activo, los visitantes podrán verlo en el catálogo.
                      </small>
                    </div>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="destacadoSwitch"
                        name="destacado"
                        checked={formData.destacado}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label small fw-bold text-espresso" htmlFor="destacadoSwitch">
                        Producto Destacado ★
                      </label>
                      <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                        Aparecerá en la sección de inicio de Café Pasión.
                      </small>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Datos del Producto */}
                <div className="col-md-7">
                  {/* Nombre */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-espresso">Nombre del Producto *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      placeholder="Ej. Café Geisha Gran Reserva (250g)"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Categoría y Precio */}
                  <div className="row g-2 mb-3">
                    <div className="col-sm-7">
                      <label className="form-label small fw-bold text-espresso">Categoría *</label>
                      <select
                        name="categoria_id"
                        className="form-select"
                        value={formData.categoria_id}
                        onChange={handleInputChange}
                        required
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-sm-5">
                      <label className="form-label small fw-bold text-espresso">Precio (S/) *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">S/</span>
                        <input
                          type="number"
                          step="0.10"
                          min="0"
                          name="precio"
                          className="form-control"
                          placeholder="0.00"
                          value={formData.precio}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descripción Corta */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-espresso">Descripción Breve *</label>
                    <input
                      type="text"
                      name="descripcion_corta"
                      className="form-control"
                      placeholder="Resumen atractivo para la tarjeta del catálogo (1-2 líneas)"
                      value={formData.descripcion_corta}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Descripción Completa */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-espresso">Descripción Completa (Ficha)</label>
                    <textarea
                      name="descripcion_completa"
                      rows="3"
                      className="form-control"
                      placeholder="Historia del lote, método de tostado, perfil en taza o modo de consumo..."
                      value={formData.descripcion_completa}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Editor Dinámico de Características Técnicas */}
                  <div>
                    <label className="form-label small fw-bold text-espresso d-flex justify-content-between">
                      <span>Características Técnicas (JSON)</span>
                      <span className="text-muted fw-normal">{features.length} añadidas</span>
                    </label>

                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej. Tueste: Medio Claro | Variedad: Geisha"
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-cafe-dorado"
                        onClick={handleAddFeature}
                      >
                        <Plus size={16} />
                        <span>Agregar</span>
                      </button>
                    </div>

                    {features.length > 0 ? (
                      <div className="p-2 border rounded-3 bg-light" style={{ maxHeight: '130px', overflowY: 'auto' }}>
                        {features.map((feat, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center justify-content-between py-1 px-2 border-bottom border-white bg-white rounded-2 mb-1 small"
                          >
                            <span>✓ {feat}</span>
                            <button
                              type="button"
                              className="btn btn-link text-danger p-0 ms-2"
                              onClick={() => handleRemoveFeature(index)}
                              title="Quitar característica"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted small mb-0 fst-italic">
                        No hay características añadidas aún. Agrega notas de cata, origen o presentación.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light py-2 px-4 border-top d-flex justify-content-between">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose} disabled={submitting}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-cafe-dorado rounded-pill px-4" disabled={submitting}>
                {submitting ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                ) : (
                  <Check size={18} className="me-1" />
                )}
                <span>{submitting ? 'Guardando en Base de Datos...' : isEditing ? 'Actualizar Producto' : 'Crear Producto'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
