import { MessageCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhatsAppButton = () => {
  const { settings } = useSettings();

  // Número limpio sin signos ni espacios para enlace wa.me
  const rawNumber = settings.whatsapp || '51987654321';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(
    settings.whatsapp_mensaje || '¡Hola Café Pasión! Vengo de su página web y deseo consultar sobre sus productos de café.'
  );

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      title="Consultar por WhatsApp con Café Pasión"
      aria-label="Abrir chat de WhatsApp"
    >
      <div className="whatsapp-pulse-ring" />
      <MessageCircle size={32} />
    </a>
  );
};

export default WhatsAppButton;
