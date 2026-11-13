import { dbAll, dbRun } from '../config/db.js';

/**
 * Obtener todas las configuraciones públicas del negocio
 * (Teléfono, WhatsApp, dirección, horario, redes sociales, mapa)
 * GET /api/configuracion
 */
export const getSettings = async (req, res, next) => {
  try {
    const rows = await dbAll('SELECT clave, valor, descripcion FROM configuracion_sitio');

    // Convertir array de filas a un objeto clave: valor para consumo ágil en React
    const settingsObject = {};
    rows.forEach(item => {
      settingsObject[item.clave] = item.valor;
    });

    res.json({
      success: true,
      data: settingsObject,
      detalles: rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar configuraciones del sitio (Admin)
 * PUT /api/configuracion
 */
export const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body; // Objeto con pares clave-valor { telefono: '...', whatsapp: '...', ... }

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Datos de configuración inválidos'
      });
    }

    const keys = Object.keys(updates);
    for (const key of keys) {
      const val = updates[key];
      if (val !== undefined && val !== null) {
        await dbRun(
          `INSERT INTO configuracion_sitio (clave, valor) VALUES (?, ?)
           ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor, updated_at = CURRENT_TIMESTAMP`,
          [key, String(val)]
        );
      }
    }

    res.json({
      success: true,
      message: 'Configuraciones del sitio actualizadas exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSettings,
  updateSettings
};
