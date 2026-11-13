/**
 * Middleware centralizado para captura y formateo de errores.
 * Garantiza que cualquier error en la API retorne una respuesta JSON consistente
 * y amigable, evitando que el servidor colapse o exponga trazas internas en producción.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(`🚨 [Error en ${req.method} ${req.url}]:`, err.message);

  // Errores de Multer (subida de archivos)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo excede el tamaño máximo permitido (5 MB)'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Error al subir la imagen: ${err.message}`
    });
  }

  // Error de validación o formato personalizado
  const statusCode = err.statusCode || res.statusCode >= 400 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler;
