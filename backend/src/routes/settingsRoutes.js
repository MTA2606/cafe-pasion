import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta pública para consultar la información y redes del negocio
router.get('/', getSettings);

// Ruta protegida para que el administrador actualice los datos de contacto
router.put('/', requireAuth, updateSettings);

export default router;
