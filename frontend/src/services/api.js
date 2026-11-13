import axios from 'axios';

// URL base de la API backend (por defecto en puerto 5000)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

// Instancia centralizada de Axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos
});

/**
 * Interceptor de Peticiones:
 * Si existe un token JWT en localStorage, se adjunta automáticamente
 * en la cabecera 'Authorization: Bearer <token>' para rutas protegidas.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cafe_pasion_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de Respuestas:
 * Si el servidor responde 401 (token expirado o inválido) en una ruta privada,
 * limpiamos la sesión de localStorage.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si la petición no era de login y expiró el token
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('cafe_pasion_token');
        localStorage.removeItem('cafe_pasion_admin');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Helper para construir URLs completas de imágenes de productos.
 * Soporta imágenes locales del backend (/uploads/...) o URLs externas.
 * Si no se proporciona una imagen, retorna una imagen de café de reemplazo elegante.
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    // Placeholder elegante de café
    return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80';
  }

  // Si ya es una URL absoluta (http:// o https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Si es una ruta relativa que empieza con slash
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${UPLOADS_URL}${cleanPath}`;
};

export default api;
