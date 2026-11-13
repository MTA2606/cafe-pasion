import { useState, useEffect } from 'react';
import { Layers, Check, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export const CategoryModal = ({ isOpen, onClose, categoryToEdit, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    orden: 0,
    activo: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(categoryToEdit);

  useEffect(() => {
    if (!isOpen) {
      setError('');
      return;
    }

    if (categoryToEdit) {
      setFormData({
        nombre: categoryToEdit.nombre || '',
        descripcion: categoryToEdit.descripcion || '',
        orden: categoryToEdit.orden !== undefined ? categoryToEdit.orden : 0,
        activo: categoryToEdit.activo !== undefined ? Boolean(categoryToEdit.activo) : true
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        orden: 1,
        activo: true
      });
    }
  }, [isOpen, categoryToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      setSubmitting(true);
      let res;
      if (isEditing) {
        res = await api.put(`/categorias/${categoryToEdit.id}`, formData);
      } else {
        res = await api.post('/categorias', formData);
      }

      if (res.data?.success) {
        onSaveSuccess(res.data.data, isEditing ? 'actualizada' : 'creada');
        onClose();
      } else {
        setError(res.data?.message || 'Error al guardar categoría');
      }
    } catch (err) {
      console.error('Error al guardar categoría:', err);
      setError(err.response?.data?.message || 'Error al conectar con el servidor');
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
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-espresso text-white py-3 px-4 border-0">
            <div className="d-flex align-items-center gap-2">
              <Layers size={22} color="#C89D54" />
              <h5 className="modal-title font-title mb-0 text-white">
                {isEditing ? `Editar Categoría: ${categoryToEdit.nombre}` : 'Nueva Categoría de Catálogo'}
              </h5>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4 bg-white">
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 small py-2 mb-3" role="alert">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-espresso">Nombre de la Categoría *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Cafés de Especialidad"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-espresso">Descripción Breve</label>
                <textarea
                  rows="2"
                  className="form-control"
                  placeholder="Descripción de los productos que componen esta categoría..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              <div className="row g-3 align-items-center mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-bold text-espresso">Orden de Aparición</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={formData.orden}
                    onChange={(e) => setFormData({ ...formData, orden: Number(e.target.value) })}
                  />
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>1 aparece primero, 2 segundo, etc.</small>
                </div>

                <div className="col-sm-6 pt-sm-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="catActivoSwitch"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    />
                    <label className="form-check-label small fw-bold text-espresso" htmlFor="catActivoSwitch">
                      Categoría Activa
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light py-2 px-4 border-top d-flex justify-content-between">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose} disabled={submitting}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-cafe-dorado rounded-pill px-4" disabled={submitting}>
                {submitting ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                ) : (
                  <Check size={18} className="me-1" />
                )}
                <span>{submitting ? 'Guardando...' : isEditing ? 'Actualizar Categoría' : 'Crear Categoría'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
