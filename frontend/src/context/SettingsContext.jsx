import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

// Valores predeterminados en caso de que la API esté cargando
const defaultSettings = {
  negocio_nombre: 'Café Pasión',
  negocio_lema: 'El arte del buen café y bienestar en cada taza',
  telefono: '+51 987 654 321',
  whatsapp: '51987654321',
  whatsapp_mensaje: '¡Hola Café Pasión! Vengo de su página web y deseo consultar sobre sus productos de café.',
  direccion: 'Av. El Café 456, Centro Gastronómico',
  horario_atencion: 'Lunes a Sábado: 8:00 AM - 9:00 PM | Domingos: 9:00 AM - 6:00 PM',
  mapa_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.6558485206263!2d-77.03154882414704!3d-12.085023988155255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8c15664a37b%3A0x67394d232537cb9a!2sParque%20de%20la%20Reserva!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe',
  facebook_url: 'https://facebook.com/cafepasion',
  instagram_url: 'https://instagram.com/cafepasion',
  tiktok_url: 'https://tiktok.com/@cafepasion',
  x_url: 'https://x.com/cafepasion'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/configuracion');
      if (res.data && res.data.success) {
        setSettings((prev) => ({
          ...prev,
          ...res.data.data
        }));
        setError(null);
      }
    } catch (err) {
      console.warn('⚠️ No se pudo cargar la configuración dinámica desde el backend, usando valores por defecto:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe utilizarse dentro de un SettingsProvider');
  }
  return context;
};

export default SettingsContext;
