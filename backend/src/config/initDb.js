import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, dbExec, dbGet } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  console.log('----------------------------------------------------');
  console.log('☕ CAFÉ PASIÓN: Inicializador de Base de Datos SQLite');
  console.log('----------------------------------------------------');

  try {
    // 1. Activar llaves foráneas
    await dbExec('PRAGMA foreign_keys = ON;');

    // 2. Ejecutar schema.sql
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    console.log(`📄 Leyendo esquema desde: ${schemaPath}`);
    const schemaSql = await fs.readFile(schemaPath, 'utf-8');
    await dbExec(schemaSql);
    console.log('✅ Tablas creadas exitosamente.');

    // 3. Ejecutar seed.sql
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
    console.log(`🌱 Leyendo datos semilla desde: ${seedPath}`);
    const seedSql = await fs.readFile(seedPath, 'utf-8');
    await dbExec(seedSql);
    console.log('✅ Categorías, administrador inicial y productos insertados.');

    // 4. Verificación de conteo de registros insertados
    const adminCount = await dbGet('SELECT COUNT(*) as total FROM administradores');
    const catCount = await dbGet('SELECT COUNT(*) as total FROM categorias');
    const prodCount = await dbGet('SELECT COUNT(*) as total FROM productos');
    const configCount = await dbGet('SELECT COUNT(*) as total FROM configuracion_sitio');

    console.log('----------------------------------------------------');
    console.log('📊 Resumen de Base de Datos SQLite:');
    console.log(`   - Administradores: ${adminCount.total}`);
    console.log(`   - Categorías:      ${catCount.total}`);
    console.log(`   - Productos:       ${prodCount.total}`);
    console.log(`   - Configuraciones: ${configCount.total}`);
    console.log('----------------------------------------------------');
    console.log('🎉 ¡Base de datos SQLite inicializada y lista!');
    console.log('   Administrador inicial: admin@cafepasion.com');
    console.log('   Contraseña temporal:   CafePasion2026!');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Error durante la inicialización de SQLite:');
    console.error(error);
    process.exit(1);
  } finally {
    db.close();
  }
}

initializeDatabase();
