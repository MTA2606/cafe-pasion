import { Router } from 'express';
import {
  getProducts,
  getProductDetail,
  getAdminProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct
} from '../controllers/productController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { uploadProductImage } from '../middlewares/uploadMiddleware.js';

const router = Router();

// ==========================================
// Rutas Públicas (Catálogo de Café Pasión)
// ==========================================
// Listar productos activos (admite filtros: ?categoria=slug&q=busqueda&destacados=true)
router.get('/', getProducts);

// Listar todos los productos para el panel (debe ir antes de :identificador)
router.get('/admin/todos', requireAuth, getAdminProducts);

// Detalle de un producto por ID o Slug con características y fotos
router.get('/:identificador', getProductDetail);

// ==========================================
// Rutas Administrativas Protegidas (JWT)
// ==========================================
// Crear producto con soporte de carga de imagen ('imagen')
router.post('/', requireAuth, uploadProductImage.single('imagen'), createProduct);

// Actualizar datos del producto y opcionalmente reemplazar su imagen
router.put('/:id', requireAuth, uploadProductImage.single('imagen'), updateProduct);

// Activar o desactivar producto rápidamente
router.patch('/:id/toggle-activo', requireAuth, toggleProductStatus);

// Eliminar producto
router.delete('/:id', requireAuth, deleteProduct);

export default router;
