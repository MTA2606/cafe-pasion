-- ========================================================
-- BASE DE DATOS: CAFÉ PASIÓN (SQLite)
-- Archivo: database/schema.sql
-- Propósito: Definición de tablas, relaciones e integridad referencial
-- ========================================================

PRAGMA foreign_keys = ON;

-- 1. Tabla de Administradores (Acceso exclusivo al panel privado)
CREATE TABLE IF NOT EXISTS administradores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    activo INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Categorías (Organización del catálogo)
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descripcion TEXT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    activo INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Productos (Catálogo visual con detalles y precios)
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    descripcion_corta TEXT NOT NULL,
    descripcion_completa TEXT NOT NULL,
    caracteristicas TEXT NULL, -- Almacenado en formato JSON string
    precio REAL NOT NULL DEFAULT 0.00,
    imagen_principal TEXT NULL,
    destacado INTEGER NOT NULL DEFAULT 0,
    activo INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 4. Tabla de Galería de Imágenes Adicionales por Producto
CREATE TABLE IF NOT EXISTS imagenes_producto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER NOT NULL,
    url_imagen TEXT NOT NULL,
    orden INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- 5. Tabla de Configuración Dinámica del Negocio
CREATE TABLE IF NOT EXISTS configuracion_sitio (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL,
    descripcion TEXT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
