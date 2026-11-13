import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta del archivo SQLite (por defecto en la carpeta database/cafe_pasion.sqlite)
const defaultDbPath = path.resolve(__dirname, '../../../database/cafe_pasion.sqlite');
const dbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : defaultDbPath;

// Habilitar modo verbose para depuración si estamos en desarrollo
const sqlite = sqlite3.verbose();

/**
 * Conexión a la base de datos local SQLite.
 * SQLite almacena todo en un único archivo ligero (.sqlite),
 * ideal para desarrollo ágil, portabilidad y despliegues sin servidores de bases de datos externos.
 */
export const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos SQLite:', err.message);
  } else {
    // Activar llaves foráneas en SQLite
    db.run('PRAGMA foreign_keys = ON;');
  }
});

/**
 * Helper con Promesas para consultas que devuelven múltiples filas (SELECT ...)
 */
export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

/**
 * Helper con Promesas para consultas que devuelven una sola fila (SELECT ... LIMIT 1 / WHERE id = ?)
 */
export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

/**
 * Helper con Promesas para operaciones de modificación (INSERT, UPDATE, DELETE)
 * Retorna { id: lastID, changes: número de filas afectadas }
 */
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

/**
 * Helper con Promesas para ejecutar múltiples sentencias SQL en bloque (scripts DDL / semillas)
 */
export const dbExec = (sql) => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

/**
 * Verificación de conectividad
 */
export const testDbConnection = async () => {
  try {
    const result = await dbGet('SELECT 1 as connected');
    if (result && result.connected === 1) {
      console.log(`✅ Base de datos SQLite conectada correctamente: ${dbPath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error al comprobar conexión SQLite:', error.message);
    return false;
  }
};

export default {
  db,
  dbAll,
  dbGet,
  dbRun,
  dbExec,
  testDbConnection
};
