import { Router } from 'express';
import { login, getProfile } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta pública para inicio de sesión de administradores
router.post('/login', login);

// Ruta protegida para verificar la validez del token y obtener datos del admin actual
router.get('/me', requireAuth, getProfile);

export default router;
