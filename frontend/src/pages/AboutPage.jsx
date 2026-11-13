import { Link } from 'react-router-dom';
import { Coffee, Award, Sparkles, Heart, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const AboutPage = () => {
  const { settings } = useSettings();

  return (
    <div className="animate-fade-in">
      {/* 1. Header de Página */}
      <section className="bg-espresso py-5 text-white text-center position-relative">
        <div className="container py-4">
          <span className="badge-categoria mb-3 bg-white text-dark fw-bold">
            Cultura & Pasión Cafetera
          </span>
          <h1 className="display-4 fw-bold font-title">Nuestra Pasión por el Café y el Bienestar</h1>
          <p className="lead text-white-50 mx-auto" style={{ maxWidth: '680px' }}>
            En {settings.negocio_nombre || 'Café Pasión'}, conectamos la dedicación de los caficultores de altura con la ciencia milenaria del bienestar natural.
          </p>
        </div>
      </section>

      {/* 2. Historia y Filosofía */}
      <section className="section-padding bg-crema">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <span className="text-gold fw-bold text-uppercase small">Nuestra Filosofía</span>
              <h2 className="font-title display-6 mb-4">Más que una Cafetería: Una Experiencia Sensorial</h2>
              <p className="text-muted-cafe mb-3">
                <strong>{settings.negocio_nombre || 'Café Pasión'}</strong> nació con la visión de rendir homenaje al auténtico café de especialidad. Para nosotros, cada grano contiene una narrativa: el clima de la selva alta, la riqueza mineral de la tierra, la altura geográfica y el esmero con el que se recolecta a mano en su punto óptimo de maduración.
              </p>
              <p className="text-muted-cafe mb-4">
                Nos alejamos de la producción masiva para concentrarnos en lotes selectos, tuestes artesanales que respetan los atributos del grano y métodos de extracción manual que permiten apreciar desde notas florales a jazmín hasta cuerpos aterciopelados con notas a chocolate amargo.
              </p>
              <div className="d-flex align-items-center gap-3">
                <Link to="/catalogo" className="btn btn-cafe-dorado px-4">
                  <Coffee size={18} />
                  <span>Ver Nuestro Catálogo</span>
                </Link>
                <Link to="/contacto" className="btn btn-cafe-outline px-4">
                  <span>Dónde Estamos</span>
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="position-relative">
                <div className="card-cafe overflow-hidden shadow-lg p-2 bg-white" style={{ borderRadius: '24px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                    alt="Barista preparando café en Café Pasión"
                    className="w-100 rounded-4 object-fit-cover"
                    style={{ height: '420px' }}
                  />
                </div>
                <div
                  className="position-absolute bottom-0 start-0 m-4 p-3 bg-white shadow rounded-3 border-start border-4 border-warning d-none d-sm-block"
                  style={{ maxWidth: '280px' }}
                >
                  <span className="fw-bold d-block text-espresso font-title">100% Granos de Altura</span>
                  <small className="text-muted-cafe">Cultivados por encima de 1,600 metros sobre el nivel del mar.</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEL GRANO A LA TAZA (EL PROCESO ARTESANAL) */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-gold fw-bold text-uppercase small">Trazabilidad y Calidad</span>
            <h2 className="font-title display-5 mb-2">El Camino de la Excelencia: Del Grano a la Taza</h2>
            <p className="text-muted-cafe mx-auto" style={{ maxWidth: '620px' }}>
              Cada taza servida en Café Pasión sigue un riguroso estándar de calidad que garantiza aromas intensos y perfiles balanceados.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card-cafe p-4 h-100 text-center">
                <div className="mx-auto mb-3 cafe-brand-icon" style={{ width: '50px', height: '50px' }}>
                  <span className="fw-bold fs-5">01</span>
                </div>
                <h5 className="font-title mb-2">Selección de Origen</h5>
                <p className="text-muted-cafe small mb-0">
                  Granos arábica cosechados a mano bajo rigurosos criterios de densidad, tamaño y madurez homogénea.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card-cafe p-4 h-100 text-center">
                <div className="mx-auto mb-3 cafe-brand-icon" style={{ width: '50px', height: '50px' }}>
                  <span className="fw-bold fs-5">02</span>
                </div>
                <h5 className="font-title mb-2">Tueste en Pequeños Lotes</h5>
                <p className="text-muted-cafe small mb-0">
                  Tostamos en micro-lotes para controlar curvas de temperatura exactas y desarrollar aromas y azúcares.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card-cafe p-4 h-100 text-center">
                <div className="mx-auto mb-3 cafe-brand-icon" style={{ width: '50px', height: '50px' }}>
                  <span className="fw-bold fs-5">03</span>
                </div>
                <h5 className="font-title mb-2">Molienda de Precisión</h5>
                <p className="text-muted-cafe small mb-0">
                  Muelas cónicas que no transfieren calor al grano, calibradas al instante según el método de extracción.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card-cafe p-4 h-100 text-center">
                <div className="mx-auto mb-3 cafe-brand-icon" style={{ width: '50px', height: '50px' }}>
                  <span className="fw-bold fs-5">04</span>
                </div>
                <h5 className="font-title mb-2">Extracción y Servicio</h5>
                <p className="text-muted-cafe small mb-0">
                  Agua a temperatura controlada y baristas apasionados listos para servir cada taza en su punto óptimo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BLOQUE ESPECIAL: BIENESTAR Y GANODERMA CON LA LÍNEA DXN */}
      <section className="section-padding bg-crema position-relative">
        <div className="container">
          <div className="card-cafe p-4 p-md-5 bg-white border border-success-subtle shadow-sm">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge bg-success text-white px-3 py-1 rounded-pill small fw-bold">
                    Línea Saludable DXN
                  </span>
                  <span className="text-gold small fw-bold">Bienestar Integral</span>
                </div>
                <h3 className="font-title display-6 mb-3 text-espresso">
                  El Poder del Ganoderma Lucidum en tu Taza Diaria
                </h3>
                <p className="text-muted-cafe mb-3">
                  En <strong>Café Pasión</strong> compartimos una profunda convicción: disfrutar de una deliciosa bebida puede ir de la mano con el cuidado de tu organismo. Por ello, somos distribuidores de la prestigiosa línea <strong>DXN</strong>, líder mundial en el cultivo y procesamiento de <em>Ganoderma Lucidum</em> (hongo Reishi).
                </p>
                <p className="text-muted-cafe mb-4">
                  El Ganoderma es un hongo adaptógeno milenario reconocido por regular el sistema inmunitario, neutralizar radicales libres y brindar energía sostenida sin provocar la acidez o nerviosismo característico de los cafés comerciales convencionales.
                </p>

                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <CheckCircle2 size={16} className="text-success" />
                        <span className="fw-bold small text-espresso">Café Lingzhi 2 en 1</span>
                      </div>
                      <small className="text-muted">Café negro gourmet sin azúcar, antioxidante y purificante.</small>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <CheckCircle2 size={16} className="text-success" />
                        <span className="fw-bold small text-espresso">Cocozhi Cacao</span>
                      </div>
                      <small className="text-muted">Bebida nutritiva de cacao fino con micelio de Ganoderma.</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="p-4 bg-espresso text-white rounded-4 shadow">
                  <h4 className="font-title text-gold mb-3">Beneficios Comprobados del Ganoderma</h4>
                  <ul className="list-unstyled mb-4 small text-white-50">
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <Sparkles size={18} className="text-gold flex-shrink-0 mt-1" />
                      <span><strong>Poder Adaptógeno:</strong> Ayuda a tu cuerpo a sobrellevar el estrés físico y mental de forma equilibrada.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <Sparkles size={18} className="text-gold flex-shrink-0 mt-1" />
                      <span><strong>Rico en Polisacáridos y Germanio Orgánico:</strong> Fortalece las defensas naturales y promueve la oxigenación celular.</span>
                    </li>
                    <li className="d-flex align-items-start gap-2 mb-3">
                      <Sparkles size={18} className="text-gold flex-shrink-0 mt-1" />
                      <span><strong>Suave con la Digestión:</strong> Alcaliniza el pH del café, evitando acidez estomacal y reflujo.</span>
                    </li>
                  </ul>
                  <Link to="/catalogo?categoria=productos-dxn" className="btn btn-cafe-dorado w-100 py-3">
                    <span>Explorar Productos DXN en Catálogo</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
