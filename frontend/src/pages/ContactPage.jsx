import { useState } from 'react';
import { MapPin, Phone, Clock, MessageCircle, Send, Copy, Check, ExternalLink, HelpCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const ContactPage = () => {
  const { settings } = useSettings();

  // Estado del formulario de consulta interactiva
  const [formData, setFormData] = useState({
    nombre: '',
    asunto: 'Cafés de Especialidad',
    mensaje: ''
  });
  const [copied, setCopied] = useState(false);

  const rawNumber = settings.whatsapp || '51987654321';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendToWhatsApp = (e) => {
    e.preventDefault();
    const { nombre, asunto, mensaje } = formData;

    const formattedMessage = encodeURIComponent(
      `¡Hola Café Pasión!\n\n` +
      `*Nombre:* ${nombre || 'Cliente interesado'}\n` +
      `*Categoría de interés:* ${asunto}\n` +
      `*Consulta:* ${mensaje || 'Deseo más información sobre sus productos y disponibilidad.'}\n\n` +
      `Mensaje enviado desde la página web de Café Pasión.`
    );

    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${formattedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyInfo = () => {
    const textToCopy = `Café Pasión\nDirección: ${settings.direccion || 'Av. El Café 456'}\nTeléfono: ${settings.telefono || '+51 987 654 321'}\nWhatsApp: ${settings.whatsapp || '51987654321'}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="animate-fade-in">
      {/* 1. Header */}
      <section className="bg-espresso py-5 text-white text-center">
        <div className="container py-3">
          <span className="badge-categoria mb-3 bg-white text-dark fw-bold">
            Atención al Cliente &bull; Café Pasión
          </span>
          <h1 className="display-4 fw-bold font-title">Ponte en Contacto con Nosotros</h1>
          <p className="lead text-white-50 mx-auto" style={{ maxWidth: '640px' }}>
            Visítanos para degustar nuestros cafés o envíanos tus dudas sobre granos, métodos de preparación o la línea saludable DXN.
          </p>
        </div>
      </section>

      {/* 2. Formulario y Datos de Contacto */}
      <section className="section-padding bg-crema">
        <div className="container">
          <div className="row g-5">
            {/* Tarjeta de Información del Negocio */}
            <div className="col-lg-5">
              <div className="card-cafe p-4 p-md-5 h-100 bg-white">
                <span className="text-gold fw-bold text-uppercase small">Datos Oficiales</span>
                <h3 className="font-title mb-4 text-espresso">Visítanos o Escríbenos</h3>

                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="cafe-brand-icon flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-espresso">Dirección Física</h6>
                    <p className="text-muted-cafe mb-0">{settings.direccion || 'Av. El Café 456, Centro Gastronómico'}</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="cafe-brand-icon flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-espresso">Horario de Cafetería</h6>
                    <p className="text-muted-cafe mb-0">{settings.horario_atencion || 'Lunes a Sábado: 8:00 AM - 9:00 PM'}</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="cafe-brand-icon flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-espresso">Teléfono de Atención</h6>
                    <p className="text-muted-cafe mb-0">{settings.telefono || '+51 987 654 321'}</p>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-4">
                  <div className="cafe-brand-icon flex-shrink-0" style={{ width: '44px', height: '44px', background: '#25D366' }}>
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-espresso">WhatsApp Directo</h6>
                    <p className="text-muted-cafe mb-1">{settings.whatsapp || '51987654321'}</p>
                    <small className="text-muted d-block">Respuestas ágiles en horario comercial.</small>
                  </div>
                </div>

                {/* Botón para Copiar Datos */}
                <div className="pt-3 border-top mt-auto">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2"
                    onClick={handleCopyInfo}
                  >
                    {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                    <span>{copied ? '¡Datos de contacto copiados!' : 'Copiar dirección y teléfonos'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Formulario Interactivo Directo a WhatsApp */}
            <div className="col-lg-7">
              <div className="card-cafe p-4 p-md-5 bg-white h-100">
                <span className="text-gold fw-bold text-uppercase small">Consulta Rápida</span>
                <h3 className="font-title mb-2 text-espresso">Envía tu Consulta a Café Pasión</h3>
                <p className="text-muted-cafe small mb-4">
                  Completa los campos a continuación y se abrirá tu WhatsApp con el mensaje estructurado listo para enviar a nuestro equipo.
                </p>

                <form onSubmit={handleSendToWhatsApp}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-espresso">Tu Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control bg-light"
                      placeholder="Ej. Carlos Mendoza"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-espresso">Categoría de Interés</label>
                    <select
                      name="asunto"
                      className="form-select bg-light"
                      value={formData.asunto}
                      onChange={handleChange}
                    >
                      <option value="Cafés de Especialidad">Cafés de Especialidad (Granos y Tueste)</option>
                      <option value="Bebidas Frías y Calientes">Bebidas (Carta de Cafetería)</option>
                      <option value="Métodos y Accesorios">Métodos de Preparación (V60, Prensa, Molinos)</option>
                      <option value="Productos DXN">Línea Saludable DXN (Ganoderma Lucidum)</option>
                      <option value="Visitas y Eventos">Visitas grupales o reservas especiales</option>
                      <option value="Consulta General">Otra consulta general</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-espresso">Mensaje o Pregunta</label>
                    <textarea
                      name="mensaje"
                      rows="4"
                      className="form-control bg-light"
                      placeholder="Escribe aquí tu duda sobre perfiles de café, presentaciones disponibles o recomendaciones..."
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-cafe-dorado w-100 py-3 fs-5 shadow-sm d-inline-flex align-items-center justify-content-center gap-2"
                  >
                    <Send size={20} />
                    <span>Enviar Consulta a WhatsApp</span>
                  </button>

                  <div className="d-flex align-items-center gap-2 text-muted small mt-3 justify-content-center">
                    <HelpCircle size={15} />
                    <span>Tu mensaje se abrirá en WhatsApp Web o en tu aplicación móvil sin intermediarios.</span>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 3. Mapa de Google */}
          <div className="mt-5">
            <div className="card-cafe p-2 bg-white shadow-sm overflow-hidden" style={{ minHeight: '440px' }}>
              <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="font-title mb-0 text-espresso">Nuestra Ubicación en el Mapa</h5>
                  <small className="text-muted-cafe">{settings.direccion || 'Av. El Café 456, Centro Gastronómico'}</small>
                </div>
                {settings.mapa_embed_url && (
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-1"
                  >
                    <ExternalLink size={14} />
                    <span>Abrir en Google Maps</span>
                  </a>
                )}
              </div>
              <div style={{ height: '400px' }}>
                {settings.mapa_embed_url ? (
                  <iframe
                    title="Ubicación oficial de Café Pasión en Google Maps"
                    src={settings.mapa_embed_url}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    <p>El mapa interactivo se encuentra en configuración.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
