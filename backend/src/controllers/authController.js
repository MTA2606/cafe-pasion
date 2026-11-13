import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbGet } from '../config/db.js';

/**
 * Iniciar sesión de administrador
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, ingresa tu correo electrónico y contraseña'
      });
    }

    // Buscar el administrador por correo
    const admin = await dbGet(
      'SELECT id, nombre, email, password_hash, activo FROM administradores WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    if (!admin.activo) {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta de administrador se encuentra desactivada'
      });
    }

    // Comparar contraseña con el hash bcrypt
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT con vigencia de 7 días
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'super_secreto_cafe_pasion_2026_seguridad_clave_jwt',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      admin: {
        id: admin.id,
        nombre: admin.nombre,
        email: admin.email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener perfil del administrador autenticado
 * GET /api/auth/me
 */
export const getProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      admin: req.admin
    });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  getProfile
};
