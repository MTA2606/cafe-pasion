import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  getAdminCategories,
  createCategory,
  updateCategory
} from '../controllers/categoryController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas Públicas
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Rutas Administrativas Protegidas
router.get('/admin/todas', requireAuth, getAdminCategories);
router.post('/', requireAuth, createCategory);
router.put('/:id', requireAuth, updateCategory);

export default router;
