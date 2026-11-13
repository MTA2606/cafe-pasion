import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbAll, dbGet, dbRun } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper para convertir texto a slug URL amigable
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Helper para deserializar el campo de características JSON
const formatProduct = (p) => {
  if (!p) return null;
  let parsedFeatures = [];
  try {
    parsedFeatures = typeof p.caracteristicas === 'string' 
      ? JSON.parse(p.caracteristicas) 
      : (p.caracteristicas || []);
  } catch (e) {
    parsedFeatures = p.caracteristicas ? [p.caracteristicas] : [];
  }

  return {
    ...p,
    caracteristicas: parsedFeatures,
    precio: Number(p.precio),
    destacado: Boolean(p.destacado),
    activo: Boolean(p.activo)
  };
};

/**
 * Listar productos activos (Público) con filtros por categoría y buscador
 * GET /api/productos?categoria=slug_o_id&q=termino&destacados=true
 */
export const getProducts = async (req, res, next) => {
  try {
    const { categoria, q, destacados, destacado } = req.query;

    let query = `
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        c.slug as categoria_slug
      FROM productos p
      INNER JOIN categorias c ON c.id = p.categoria_id
      WHERE p.activo = 1 AND c.activo = 1
    `;
    const params = [];

    // Filtro por categoría (acepta id numérico o slug)
    if (categoria) {
      if (!isNaN(categoria)) {
        query += ` AND p.categoria_id = ?`;
        params.push(Number(categoria));
      } else {
        query += ` AND c.slug = ?`;
        params.push(categoria);
      }
    }

    // Buscador por nombre o descripción
    if (q && q.trim()) {
      query += ` AND (p.nombre LIKE ? OR p.descripcion_corta LIKE ? OR p.descripcion_completa LIKE ?)`;
      const search = `%${q.trim()}%`;
      params.push(search, search, search);
    }

    // Filtro de destacados para la portada de Inicio
    if (destacados === 'true' || destacados === '1' || destacado === 'true' || destacado === '1') {
      query += ` AND p.destacado = 1`;
    }

    query += ` ORDER BY p.destacado DESC, p.created_at DESC`;

    const rawProducts = await dbAll(query, params);
    const products = rawProducts.map(formatProduct);

    res.json({
      success: true,
      total: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener detalle completo de un producto por ID o por Slug (Público)
 * Incluye características completas y galería de imágenes
 * GET /api/productos/:identificador
 */
export const getProductDetail = async (req, res, next) => {
  try {
    const { identificador } = req.params;
    const isId = !isNaN(identificador);

    const productQuery = `
      SELECT 
        p.*,
        c.nombre as categoria_nombre,
        c.slug as categoria_slug
      FROM productos p
      INNER JOIN categorias c ON c.id = p.categoria_id
      WHERE (p.id = ? OR p.slug = ?)
    `;

    const rawProduct = await dbGet(productQuery, [
      isId ? Number(identificador) : 0,
      identificador
    ]);

    if (!rawProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Obtener imágenes adicionales de la galería
    const gallery = await dbAll(
      'SELECT id, url_imagen, orden FROM imagenes_producto WHERE producto_id = ? ORDER BY orden ASC',
      [rawProduct.id]
    );

    const product = formatProduct(rawProduct);
    product.galeria = gallery;

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar TODOS los productos para el Panel de Administración (incluye inactivos)
 * GET /api/productos/admin/todos
 */
export const getAdminProducts = async (req, res, next) => {
  try {
    const rawProducts = await dbAll(`
      SELECT 
        p.*,
        c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      ORDER BY p.id DESC
    `);

    const products = rawProducts.map(formatProduct);

    res.json({
      success: true,
      total: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo producto (Admin - Soporta subida de imagen con Multer)
 * POST /api/productos
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      categoria_id,
      nombre,
      descripcion_corta,
      descripcion_completa,
      caracteristicas,
      precio,
      destacado = 0
    } = req.body;

    if (!categoria_id || !nombre || !descripcion_corta || !precio) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: categoría, nombre, descripción breve y precio'
      });
    }

    const slug = `${generateSlug(nombre)}-${Date.now()}`;

    // Procesar características como JSON string si vienen como array o texto
    let formattedFeatures = '[]';
    if (caracteristicas) {
      if (typeof caracteristicas === 'string') {
        try {
          formattedFeatures = JSON.stringify(JSON.parse(caracteristicas));
        } catch (e) {
          // Si viene separada por saltos de línea
          const lines = caracteristicas.split('\n').map(l => l.trim()).filter(Boolean);
          formattedFeatures = JSON.stringify(lines);
        }
      } else if (Array.isArray(caracteristicas)) {
        formattedFeatures = JSON.stringify(caracteristicas);
      }
    }

    // Ruta de la imagen principal subida por Multer (si se envió un archivo)
    let imagen_principal = null;
    if (req.file) {
      imagen_principal = `/uploads/productos/${req.file.filename}`;
    }

    const result = await dbRun(`
      INSERT INTO productos (
        categoria_id, nombre, slug, descripcion_corta, descripcion_completa,
        caracteristicas, precio, imagen_principal, destacado, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      Number(categoria_id),
      nombre.trim(),
      slug,
      descripcion_corta.trim(),
      descripcion_completa ? descripcion_completa.trim() : descripcion_corta.trim(),
      formattedFeatures,
      Number(precio),
      imagen_principal,
      (destacado === 'true' || destacado === true || destacado === 1 || destacado === '1') ? 1 : 0
    ]);

    const created = await dbGet('SELECT * FROM productos WHERE id = ?', [result.id]);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: formatProduct(created)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar producto existente (Admin)
 * PUT /api/productos/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      categoria_id,
      nombre,
      descripcion_corta,
      descripcion_completa,
      caracteristicas,
      precio,
      destacado,
      activo
    } = req.body;

    const existing = await dbGet('SELECT * FROM productos WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    let imagen_principal = existing.imagen_principal;
    // Si se subió una nueva imagen con Multer
    if (req.file) {
      imagen_principal = `/uploads/productos/${req.file.filename}`;

      // Opcional: Eliminar la imagen anterior si era un archivo local
      if (existing.imagen_principal && existing.imagen_principal.startsWith('/uploads/productos/')) {
        const oldPath = path.resolve(__dirname, '../../', existing.imagen_principal.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, () => {});
        }
      }
    }

    let formattedFeatures = existing.caracteristicas;
    if (caracteristicas !== undefined) {
      if (typeof caracteristicas === 'string') {
        try {
          formattedFeatures = JSON.stringify(JSON.parse(caracteristicas));
        } catch (e) {
          const lines = caracteristicas.split('\n').map(l => l.trim()).filter(Boolean);
          formattedFeatures = JSON.stringify(lines);
        }
      } else if (Array.isArray(caracteristicas)) {
        formattedFeatures = JSON.stringify(caracteristicas);
      }
    }

    await dbRun(`
      UPDATE productos
      SET categoria_id = COALESCE(?, categoria_id),
          nombre = COALESCE(?, nombre),
          descripcion_corta = COALESCE(?, descripcion_corta),
          descripcion_completa = COALESCE(?, descripcion_completa),
          caracteristicas = COALESCE(?, caracteristicas),
          precio = COALESCE(?, precio),
          imagen_principal = ?,
          destacado = COALESCE(?, destacado),
          activo = COALESCE(?, activo),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      categoria_id ? Number(categoria_id) : null,
      nombre ? nombre.trim() : null,
      descripcion_corta ? descripcion_corta.trim() : null,
      descripcion_completa ? descripcion_completa.trim() : null,
      formattedFeatures,
      precio ? Number(precio) : null,
      imagen_principal,
      destacado !== undefined ? (destacado === 'true' || destacado === true || destacado === 1 || destacado === '1' ? 1 : 0) : null,
      activo !== undefined ? (activo === 'true' || activo === true || activo === 1 || activo === '1' ? 1 : 0) : null,
      id
    ]);

    const updated = await dbGet('SELECT * FROM productos WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: formatProduct(updated)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Alternar estado activo / inactivo de un producto (Admin)
 * PATCH /api/productos/:id/toggle-activo
 */
export const toggleProductStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await dbGet('SELECT id, activo FROM productos WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const newStatus = product.activo === 1 ? 0 : 1;
    await dbRun('UPDATE productos SET activo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, id]);

    res.json({
      success: true,
      message: `Producto ${newStatus === 1 ? 'activado' : 'desactivado'} correctamente`,
      activo: Boolean(newStatus)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar producto (Admin)
 * DELETE /api/productos/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await dbGet('SELECT id, imagen_principal FROM productos WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Eliminar archivo físico de imagen si existe
    if (product.imagen_principal && product.imagen_principal.startsWith('/uploads/productos/')) {
      const imgPath = path.resolve(__dirname, '../../', product.imagen_principal.replace(/^\//, ''));
      if (fs.existsSync(imgPath)) {
        fs.unlink(imgPath, () => {});
      }
    }

    await dbRun('DELETE FROM productos WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Producto eliminado permanentemente'
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProductDetail,
  getAdminProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct
};
