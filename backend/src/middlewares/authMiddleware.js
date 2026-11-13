import jwt from 'jsonwebtoken';
import { dbGet } from '../config/db.js';

/**
 * Middleware para proteger rutas administrativas mediante JWT.
 * 
 * Flujo:
 * 1. Lee la cabecera 'Authorization: Bearer <token>'
 * 2. Cifra/descifra el token con JWT_SECRET
 * 3. Comprueba en SQLite que el administrador siga activo
 * 4. Inyecta los datos del admin en req.admin para que el controlador lo use
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado: Token de autenticación no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secreto_cafe_pasion_2026_seguridad_clave_jwt');

    // Verificar que el usuario exista y siga activo en SQLite
    const admin = await dbGet(
      'SELECT id, nombre, email, activo FROM administradores WHERE id = ?',
      [decoded.id]
    );

    if (!admin || !admin.activo) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado: Administrador no válido o inactivo'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'La sesión ha expirado. Por favor, inicia sesión nuevamente'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token de sesión inválido'
    });
  }
};

export default requireAuth;
