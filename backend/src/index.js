import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Importar configuración de base de datos
import { testDbConnection } from './config/db.js';

// Importar rutas modulares
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

// Importar middleware central de errores
import { errorHandler } from './middlewares/errorHandler.js';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. Middlewares de Seguridad y Parsing
// ==========================================

// Helmet: Cabeceras de seguridad HTTP (permite cargar imágenes cross-origin en el frontend)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS: Permite peticiones desde el frontend (Vite en puerto 5173 u otros definidos)
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (como Postman o curl) o en la lista permitida
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Bloqueado por política CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Lectura de peticiones en JSON y Formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 2. Servir Archivos Estáticos (Imágenes)
// ==========================================
// Expone la carpeta uploads públicamente para que las imágenes sean accesibles vía URL
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// ==========================================
// 3. Rutas de la API REST
// ==========================================
// Chequeo de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'Café Pasión Backend API',
    database: 'SQLite',
    timestamp: new Date().toISOString()
  });
});

// Enrutadores principales
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/configuracion', settingsRoutes);

// Manejador para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// ==========================================
// 4. Middleware Centralizado de Errores
// ==========================================
app.use(errorHandler);

// ==========================================
// 5. Inicialización del Servidor
// ==========================================
app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`☕ CAFÉ PASIÓN API corriendo en http://localhost:${PORT}`);
  console.log(`📁 Imágenes servidas en http://localhost:${PORT}/uploads`);
  console.log(`🛡️  Seguridad: Helmet activo | CORS configurado`);
  console.log('====================================================');

  // Comprobar conexión a la base de datos
  await testDbConnection();
});

export default app;
