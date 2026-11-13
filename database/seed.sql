-- ========================================================
-- DATOS SEMILLA: CAFÉ PASIÓN (SQLite)
-- Archivo: database/seed.sql
-- Propósito: Cargar categorías base, admin inicial y productos de ejemplo
-- ========================================================

-- 1. Administrador Inicial (Contraseña temporal: CafePasion2026!)
INSERT INTO administradores (nombre, email, password_hash, activo) 
VALUES (
    'Administrador Café Pasión',
    'admin@cafepasion.com',
    '$2a$10$rNP4PyAGIkGUWelIOU4YiuXu3bDt2j.Z7myjqF5swUt11OOmyESfu',
    1
)
ON CONFLICT(email) DO UPDATE SET nombre = excluded.nombre;

-- 2. Categorías Oficiales
INSERT INTO categorias (id, nombre, slug, descripcion, orden, activo) VALUES
(1, 'Cafés de Especialidad', 'cafes-de-especialidad', 'Granos selectos de altura tostados artesanalmente con perfiles de taza excepcionales.', 1, 1),
(2, 'Bebidas Frías y Calientes', 'bebidas-frias-y-calientes', 'Espressos, capuchinos, lattes, cold brew y especialidades preparadas por nuestros baristas.', 2, 1),
(3, 'Métodos y Accesorios', 'metodos-y-accesorios', 'Cafeteras de extracción (V60, Chemex, Prensa Francesa), molinos y accesorios para barismo en casa.', 3, 1),
(4, 'Productos DXN', 'productos-dxn', 'Línea de bebidas naturales y saludables enriquecidas con extracto 100% puro de Ganoderma Lucidum.', 4, 1)
ON CONFLICT(id) DO UPDATE SET nombre = excluded.nombre, descripcion = excluded.descripcion;

-- 3. Productos Iniciales para Catálogo Visual
INSERT INTO productos (categoria_id, nombre, slug, descripcion_corta, descripcion_completa, caracteristicas, precio, imagen_principal, destacado, activo) VALUES
-- Cafés de Especialidad
(
    1,
    'Café Geisha Gran Reserva de Altura (250g)',
    'cafe-geisha-gran-reserva-250g',
    'Café de aroma floral intenso con delicadas notas a jazmín, bergamota y miel.',
    'Nuestro café insignia cultivado a más de 1,800 msnm. Procesado bajo un estricto beneficio lavado y tostado en curva media para resaltar su acidez brillante, cuerpo sedoso y retrogusto prolongado a jazmín y frutas cítricas.',
    '["Origen: Selva Alta (1,850 m.s.n.m.)", "Variedad: Geisha 100% Arábica", "Tueste: Medio Claro", "Notas de cata: Jazmín, flor de azahar, durazno blanco y miel de abeja", "Presentación: Bolsa trilaminada con válvula desgasificadora de 250g"]',
    45.00,
    '/uploads/productos/geisha-reserva.jpg',
    1,
    1
),
(
    1,
    'Café Bourbon Tostado Artesanal (500g)',
    'cafe-bourbon-tostado-artesanal-500g',
    'Perfil balanceado con cuerpo cremoso, notas a chocolate amargo y avellanas.',
    'Selección rigurosa de granos Bourbon rojo cosechados a mano. Destaca por su dulzura natural acaramelada y baja acidez, haciéndolo ideal tanto para métodos de filtro como para espresso tradicional.',
    '["Origen: Finca La Esperanza (1,600 m.s.n.m.)", "Variedad: Bourbon Rojo Arábica", "Tueste: Medio Oscuro", "Notas de cata: Chocolate negro 70%, nueces tostadas y caramelo tostado", "Presentación: Bolsa con zipper resellable de 500g"]',
    38.00,
    '/uploads/productos/bourbon-artesanal.jpg',
    1,
    1
),

-- Bebidas Frías y Calientes
(
    2,
    'Cappuccino Clásico Café Pasión (8 oz)',
    'cappuccino-clasico-8oz',
    'Doble shot de espresso premium con leche emulsionada y microespuma aterciopelada.',
    'La perfecta armonía italiana. Elaborado con nuestro blend especial de la casa recién molido y leche vaporizada a temperatura óptima para lograr una textura cremosa con arte latte decorado por el barista.',
    '["Base: Doble shot de espresso de especialidad", "Leche: Entera fresca (opción vegetal disponible)", "Tamaño: 8 oz (240 ml)", "Temperatura de servicio: 65°C para dulzor óptimo"]',
    11.50,
    '/uploads/productos/cappuccino-clasico.jpg',
    1,
    1
),
(
    2,
    'Cold Brew Artesanal Macerado 18 Horas (350ml)',
    'cold-brew-artesanal-18h',
    'Café extraído lentamente en agua fría. Refrescante, dulce y con cuerpo ligero.',
    'Infusión gota a gota durante 18 horas a baja temperatura. Este proceso resalta las notas dulces naturales del grano eliminando la acidez agresiva. Servido con hielo cristalino y toque cítrico opcional.',
    '["Tiempo de extracción: 18 horas en frío", "Grano: Blend Arábica proceso Honey", "Presentación: Botella de vidrio estilizada de 350ml", "Servicio: Con hielo o para llevar"]',
    14.00,
    '/uploads/productos/cold-brew.jpg',
    0,
    1
),

-- Métodos y Accesorios
(
    3,
    'Cafetera Prensa Francesa de Vidrio Borosilicato (600ml)',
    'prensa-francesa-borosilicato-600ml',
    'Estructura de acero inoxidable 304 y émbolo de cuatro filtros de alta precisión.',
    'El método clásico de inmersión total que conserva los aceites aromáticos esenciales del grano. Vidrio resistente a choques térmicos y acabado elegante color cobre/bronce.',
    '["Capacidad: 600 ml (3 a 4 tazas)", "Material: Vidrio borosilicato resistente y acero inoxidable", "Sistema de filtrado: Émbolo de 4 capas anti-sedimento", "Fácil limpieza: Apta para lavavajillas"]',
    59.00,
    '/uploads/productos/prensa-francesa.jpg',
    1,
    1
),
(
    3,
    'Molino Manual de Café con Muelas Cerámicas Cónicas',
    'molino-manual-muelas-ceramicas',
    'Molienda uniforme y graduable para Espresso, V60, Chemex y Prensa Francesa.',
    'Cuerpo compacto de aluminio cepillado con manivela ergonómica desmontable. Las muelas cónicas de cerámica no transfieren calor al grano durante la molienda, preservando todos los compuestos aromáticos intactos.',
    '["Tipo de muela: Cónica de cerámica de alta durabilidad", "Niveles de ajuste: Regulador de clic de fino a grueso", "Capacidad de tolva: 35g de granos de café", "Portabilidad: Ideal para viajes, oficina o casa"]',
    79.00,
    '/uploads/productos/molino-manual.jpg',
    0,
    1
),

-- Productos DXN
(
    4,
    'Café Lingzhi 2 en 1 DXN (Bolsa 20 sobres)',
    'cafe-lingzhi-2-en-1-dxn',
    'Café negro gourmet brasileño enriquecido con extracto 100% puro de Ganoderma.',
    'Exclusiva fórmula sin azúcar añadido que combina los mejores granos de café arábica con el poder adaptógeno del hongo Ganoderma Lucidum. Ideal para personas que buscan energía sostenida, claridad mental y bienestar integral sin acidez estomacal.',
    '["Contenido: 20 sobres individuales x 4.5g", "Ingredientes: Café soluble selecto y extracto de Ganoderma Lucidum", "Propiedades: Cero azúcar añadido, antioxidante y energizante natural", "Certificación: Certificación de pureza internacional DXN"]',
    58.00,
    '/uploads/productos/dxn-lingzhi-2en1.jpg',
    1,
    1
),
(
    4,
    'Café Lingzhi 3 en 1 DXN (Bolsa 20 sobres)',
    'cafe-lingzhi-3-en-1-dxn',
    'Café suave y cremoso con crema vegetal no láctea y Ganoderma Lucidum.',
    'Una bebida instantánea deliciosa que equilibra el sabor del café premium con una suave crema vegetal y el extracto de Ganoderma. Suaviza la digestión y brinda un momento reconfortante en cualquier momento del día.',
    '["Contenido: 20 sobres individuales x 21g", "Ingredientes: Café soluble, sustituto de crema vegetal, azúcar de caña y extracto de Ganoderma", "Sabor: Cremoso, dulce y balanceado", "Fácil preparación: Solo agregar agua caliente y mezclar"]',
    62.00,
    '/uploads/productos/dxn-lingzhi-3en1.jpg',
    0,
    1
),
(
    4,
    'Cocozhi DXN - Cacao con Ganoderma (Bolsa 20 sobres)',
    'cocozhi-dxn-cacao-ganoderma',
    'Bebida achocolatada nutritiva con extracto de micelio de Ganoderma (GL).',
    'Bebida rica en nutrientes elaborada con cacao de primera calidad y extracto de Ganoderma joven. Aporta minerales, flavonoides y energía para niños, estudiantes y adultos mayores.',
    '["Contenido: 20 sobres individuales x 32g", "Ingredientes: Cacao fino de aroma, leche descremada, extracto de malta y Ganoderma", "Beneficios: Nutrición celular, soporte para la concentración y relajación", "Consumo: Delicioso frío o caliente"]',
    65.00,
    '/uploads/productos/dxn-cocozhi.jpg',
    1,
    1
)
ON CONFLICT(slug) DO UPDATE SET nombre = excluded.nombre, precio = excluded.precio, descripcion_corta = excluded.descripcion_corta;

-- 4. Configuración General del Sitio (Datos de contacto configurables)
INSERT INTO configuracion_sitio (clave, valor, descripcion) VALUES
('negocio_nombre', 'Café Pasión', 'Nombre comercial de la marca'),
('negocio_lema', 'El arte del buen café y bienestar en cada taza', 'Eslogan oficial'),
('telefono', '+51 987 654 321', 'Teléfono principal de atención'),
('whatsapp', '51987654321', 'Número de WhatsApp con código de país para botón de consulta'),
('whatsapp_mensaje', '¡Hola Café Pasión! Vengo de su página web y deseo consultar sobre sus productos de café.', 'Mensaje predeterminado de contacto'),
('direccion', 'Av. El Café 456, Centro Gastronómico', 'Dirección física del establecimiento'),
('horario_atencion', 'Lunes a Sábado: 8:00 AM - 9:00 PM | Domingos: 9:00 AM - 6:00 PM', 'Horario de apertura al público'),
('mapa_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.6558485206263!2d-77.03154882414704!3d-12.085023988155255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c8c15664a37b%3A0x67394d232537cb9a!2sParque%20de%20la%20Reserva!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe', 'URL del iframe de Google Maps'),
('facebook_url', 'https://facebook.com/cafepasion', 'Enlace a página de Facebook'),
('instagram_url', 'https://instagram.com/cafepasion', 'Enlace a perfil de Instagram'),
('tiktok_url', 'https://tiktok.com/@cafepasion', 'Enlace a cuenta de TikTok'),
('x_url', 'https://x.com/cafepasion', 'Enlace a cuenta de X (Twitter)')
ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor;
