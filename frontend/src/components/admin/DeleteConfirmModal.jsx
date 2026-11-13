import { AlertTriangle, Trash2 } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(44, 24, 16, 0.75)', backdropFilter: 'blur(4px)', zIndex: 1070 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-sm"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden text-center p-4">
          <div className="mx-auto mb-3 p-3 bg-danger-subtle text-danger rounded-circle d-inline-flex">
            <AlertTriangle size={32} />
          </div>

          <h5 className="font-title text-espresso mb-2">¿Eliminar Producto?</h5>
          <p className="text-muted-cafe small mb-4">
            ¿Estás seguro de que deseas eliminar permanentemente <strong>&ldquo;{itemTitle}&rdquo;</strong>? Esta acción borrará el registro de SQLite y el archivo físico de imagen.
          </p>

          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-sm btn-danger rounded-pill px-4 d-inline-flex align-items-center gap-1"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <Trash2 size={16} />
              )}
              <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
