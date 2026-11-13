import { dbAll, dbGet, dbRun } from '../config/db.js';

// Helper para convertir texto a slug URL amigable
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9 -]/g, '')     // Eliminar caracteres especiales
    .replace(/\s+/g, '-')           // Espacios a guiones
    .replace(/-+/g, '-');           // Eliminar guiones repetidos
};

/**
 * Listar categorías activas con el conteo de productos disponibles (Público)
 * GET /api/categorias
 */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await dbAll(`
      SELECT 
        c.id, 
        c.nombre, 
        c.slug, 
        c.descripcion, 
        c.orden,
        COUNT(CASE WHEN p.activo = 1 THEN p.id ELSE NULL END) as total_productos
      FROM categorias c
      LEFT JOIN productos p ON p.categoria_id = c.id
      WHERE c.activo = 1
      GROUP BY c.id
      ORDER BY c.orden ASC, c.nombre ASC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener detalle de una categoría por su slug (Público)
 * GET /api/categorias/:slug
 */
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await dbGet(
      'SELECT id, nombre, slug, descripcion, orden, activo FROM categorias WHERE slug = ?',
      [slug]
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar todas las categorías (incluye inactivas) para el Panel Administrativo
 * GET /api/categorias/admin/todas
 */
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await dbAll(`
      SELECT 
        c.*,
        COUNT(p.id) as total_productos
      FROM categorias c
      LEFT JOIN productos p ON p.categoria_id = c.id
      GROUP BY c.id
      ORDER BY c.orden ASC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear nueva categoría (Admin)
 * POST /api/categorias
 */
export const createCategory = async (req, res, next) => {
  try {
    const { nombre, descripcion, orden = 0 } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la categoría es obligatorio'
      });
    }

    const slug = generateSlug(nombre);

    const result = await dbRun(
      'INSERT INTO categorias (nombre, slug, descripcion, orden, activo) VALUES (?, ?, ?, ?, 1)',
      [nombre.trim(), slug, descripcion || null, Number(orden)]
    );

    res.status(201).json({
      success: true,
      message: 'Categoría creada con éxito',
      data: {
        id: result.id,
        nombre: nombre.trim(),
        slug,
        descripcion,
        orden: Number(orden),
        activo: 1
      }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con un nombre similar'
      });
    }
    next(error);
  }
};

/**
 * Actualizar categoría existente (Admin)
 * PUT /api/categorias/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, orden, activo } = req.body;

    const existing = await dbGet('SELECT id FROM categorias WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    let slug;
    if (nombre) {
      slug = generateSlug(nombre);
    }

    const activoVal = activo !== undefined 
      ? ((activo === 'true' || activo === true || activo === 1 || activo === '1') ? 1 : 0)
      : null;

    await dbRun(
      `UPDATE categorias 
       SET nombre = COALESCE(?, nombre),
           slug = COALESCE(?, slug),
           descripcion = COALESCE(?, descripcion),
           orden = COALESCE(?, orden),
           activo = COALESCE(?, activo)
       WHERE id = ?`,
      [nombre ? nombre.trim() : null, slug || null, descripcion, orden !== undefined ? Number(orden) : null, activoVal, id]
    );

    const updated = await dbGet('SELECT * FROM categorias WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCategories,
  getCategoryBySlug,
  getAdminCategories,
  createCategory,
  updateCategory
};
