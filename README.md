# ☕ CAFÉ PASIÓN — Sitio Web Profesional y Catálogo Visual

Bienvenido al repositorio oficial del proyecto **CAFÉ PASIÓN**. Este proyecto es una plataforma web moderna, elegante y de alto rendimiento diseñada para una cafetería real de especialidad y distribuidora de la línea saludable de productos **DXN**.

> [!IMPORTANT]
> **Modelo del Proyecto:** Este desarrollo es **exclusivamente un sitio web informativo y catálogo visual interactivo**. NO cuenta con carrito de compras, pasarelas de pago ni checkout virtual. Todo el contacto comercial y pedidos se canalizan de forma directa y personalizada mediante botones de **WhatsApp**.

---

## 📋 Tabla de Contenidos
1. [Características Principales](#-características-principales)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Instalación y Ejecución Local](#-instalación-y-ejecución-local)
5. [Credenciales de Acceso Administrativo](#-credenciales-de-acceso-administrativo)
6. [Guía de Aprendizaje y Conceptos Clave](#-guía-de-aprendizaje-y-conceptos-clave)
7. [Guía de Despliegue en Producción](#-guía-de-despliegue-en-producción)

---

## 🌟 Características Principales

### 🌐 Sitio Web Público (Clientes)
- **Inicio (Hero Section):** Portada moderna con identidad cafetera, propuesta de valor, botones directos de acción (CTA), grilla interactiva de las 4 categorías con conteo en vivo de productos y sección de especialidades destacadas.
- **Nosotros:** Filosofía del café de altura, el proceso artesanal en 4 pasos (*Del Grano a la Taza*) y bloque educativo sobre los beneficios inmunomoduladores y adaptógenos del *Ganoderma Lucidum* con los productos DXN.
- **Catálogo Interactivo con Modal:**
  - Filtrado reactivo sincronizado con la URL (`/catalogo?categoria=...`).
  - Botones para las 4 categorías: *Cafés de Especialidad*, *Bebidas Frías y Calientes*, *Métodos y Accesorios*, *Productos DXN*.
  - Buscador en tiempo real por nombre o notas de cata.
  - Selector de ordenamiento (Destacados, Precio: Menor a Mayor, Precio: Mayor a Menor, Alfabético A-Z).
  - **Modal de Detalle Completo:** Muestra fotografía ampliada, galería de miniaturas, descripción completa, ficha técnica desglosada (origen, tueste, notas) y botón directo de consulta a WhatsApp con mensaje prellenado que incluye el nombre del producto y su precio.
- **Contacto y Atención:** Horarios, teléfonos dinámicos, botón para copiar datos de contacto con un clic, mapa interactivo de Google Maps y formulario que arma una consulta preformateada hacia WhatsApp.
- **Botón Flotante de WhatsApp:** Con onda pulsante y mensaje preconfigurado en todas las vistas.

### 🛡️ Panel Administrativo Privado
- **Acceso Protegido (JWT):** Inicio de sesión exclusivo para administradores, con contraseñas cifradas en `bcrypt` y botón para mostrar/ocultar contraseña.
- **Métricas en Tiempo Real:** Tarjetas con conteo total de productos, productos activos/visibles, productos destacados en portada y total de categorías.
- **Gestión Completa de Productos (CRUD):**
  - Registro de nuevos productos con subida de fotografía física mediante **Multer** y previsualización en vivo antes de guardar.
  - Editor dinámico para añadir/quitar características técnicas (guardadas en SQLite como array JSON).
  - Interruptores instantáneos (switches) para activar/ocultar productos del catálogo y marcar/desmarcar productos destacados.
  - Modal de confirmación segura antes de eliminar un producto.
- **Gestión de Categorías:** Crear, editar y alternar visibilidad de las categorías del catálogo.
- **Configuración Dinámica del Negocio:** Formulario para modificar nombres, eslogan, teléfonos, WhatsApp, horarios, redes sociales (Facebook, Instagram, TikTok, X) y URL de Google Maps sin tener que tocar código fuente.

---

## 💻 Stack Tecnológico

| Capa | Tecnologías | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Bootstrap 5 | Interfaz responsiva, componentes reactivos y compilación rápida |
| **Enrutamiento** | React Router 7 | Navegación de Página Única (SPA) con rutas públicas y privadas |
| **Iconografía** | Lucide React | Iconos vectoriales ligeros (tazas de café, WhatsApp, candado, etc.) |
| **Cliente HTTP** | Axios | Peticiones REST con interceptor de token JWT y helper de imágenes |
| **Backend** | Node.js, Express | Servidor RESTful modular, seguro y de alto rendimiento |
| **Base de Datos** | SQLite (`sqlite3`) | Motor relacional local en archivo único (`cafe_pasion.sqlite`), rápido y sin contraseñas |
| **Seguridad** | Helmet, CORS, Bcryptjs, JWT | Cabeceras HTTP de protección, control de orígenes y autenticación |
| **Subida de Archivos** | Multer (`diskStorage`) | Recepción, validación (JPG/PNG/WebP, máx 5MB) y almacenamiento de imágenes |

---

## 📁 Estructura del Proyecto

```text
CAFE-PASION/
├── backend/                             # Servidor Node.js + Express
│   ├── uploads/                         # Archivos físicos subidos por administradores
│   │   └── productos/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                    # Conexión y helpers con Promesas para SQLite
│   │   │   └── initDb.js                # Inicializador automatizado de tablas y semillas
│   │   ├── controllers/                 # Lógica de negocio de la API
│   │   │   ├── authController.js        # Login y verificación de token
│   │   │   ├── categoryController.js    # CRUD de categorías y conteo de productos
│   │   │   ├── productController.js     # CRUD de productos, filtros y buscador
│   │   │   └── settingsController.js   # Lectura y actualización de datos de contacto
│   │   ├── middlewares/                 # Filtros y validaciones
│   │   │   ├── authMiddleware.js        # Verificación de JWT en rutas privadas
│   │   │   ├── errorHandler.js          # Capturador centralizado de errores
│   │   │   └── uploadMiddleware.js      # Procesamiento de imágenes con Multer
│   │   ├── routes/                      # Definición de endpoints REST
│   │   │   ├── authRoutes.js            # /api/auth
│   │   │   ├── categoryRoutes.js        # /api/categorias
│   │   │   ├── productRoutes.js         # /api/productos
│   │   │   └── settingsRoutes.js        # /api/configuracion
│   │   └── index.js                     # Servidor Express, Helmet, CORS y rutas estáticas
│   ├── .env.example
│   ├── package.json
│   └── test-api.js                      # Pruebas automatizadas de endpoints
│
├── frontend/                            # Aplicación React con Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                   # Modales: ProductFormModal, DeleteConfirmModal, CategoryModal
│   │   │   ├── catalog/                 # ProductCard y ProductDetailModal
│   │   │   └── layout/                  # Navbar, Footer, WhatsAppButton, PublicLayout, PrivateRoute
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Estado global de autenticación de admin
│   │   │   └── SettingsContext.jsx      # Estado global de datos de contacto y redes
│   │   ├── pages/                       # Vistas: HomePage, AboutPage, CatalogPage, ContactPage, etc.
│   │   │   └── admin/                   # AdminLoginPage y AdminDashboardPage
│   │   ├── services/
│   │   │   └── api.js                   # Axios con interceptor JWT y helper getImageUrl
│   │   ├── App.css                      # Estilos de layout, navbar, footer y botón de WhatsApp
│   │   ├── index.css                    # Bootstrap 5 + variables de paleta café (:root)
│   │   ├── App.jsx                      # Configuración de React Router
│   │   └── main.jsx                     # Montaje de React y bundle JS de Bootstrap
│   ├── .env.example
│   ├── index.html                       # Fuentes Google (Playfair Display + Plus Jakarta Sans)
│   ├── package.json
│   └── vite.config.js
│
├── database/                            # Persistencia y scripts SQL
│   ├── schema.sql                       # Esquema relacional para SQLite
│   ├── seed.sql                         # Semillas: admin inicial, 4 categorías y 9 productos
│   └── cafe_pasion.sqlite               # Archivo físico de la base de datos SQLite
│
├── package.json                         # Scripts unificados de ejecución en la raíz
├── .gitignore
└── README.md
```

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos
- Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### 1. Clonar o Descargar el Proyecto
Abre una terminal en la carpeta raíz del proyecto (`C:\PROYECTOS\CAFE PASION`).

### 2. Inicializar la Base de Datos SQLite
Para crear las tablas y sembrar los productos iniciales, ejecuta en la raíz:
```bash
npm run db:init
```
*(Esto creará o actualizará automáticamente el archivo `database/cafe_pasion.sqlite`).*

### 3. Iniciar el Servidor Backend (API REST)
En una terminal ejecuta:
```bash
npm run dev:backend
```
El servidor backend se levantará en: **`http://localhost:5000`**

### 4. Iniciar la Aplicación Frontend (Vite)
En una segunda terminal ejecuta:
```bash
npm run dev:frontend
```
El sitio web estará disponible en: **`http://localhost:5173`**

---

## 🔑 Credenciales de Acceso Administrativo

Para acceder al **Panel Administrativo Privado**:
- **URL de Acceso:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login) (o clic en el botón *"Panel"* del Navbar).
- **Correo Electrónico:** `admin@cafepasion.com`
- **Contraseña:** `CafePasion2026!`

*(Una vez dentro podrás gestionar productos, subir fotos, activar/desactivar categorías y cambiar los datos de WhatsApp).*

---

## 🎓 Guía de Aprendizaje y Conceptos Clave

Si estás aprendiendo desarrollo web profesional, este proyecto te servirá como referencia para comprender cómo se construyen aplicaciones reales:

### 1. ¿Por qué una Arquitectura Desacoplada?
El frontend (React) no sabe nada de la base de datos directa. Solo se comunica a través de peticiones HTTP en formato JSON con la API (Express). Esto permite cambiar el diseño visual, crear una aplicación móvil o migrar de base de datos sin romper la aplicación.

### 2. Autenticación con JWT (JSON Web Tokens)
En lugar de almacenar sesiones pesadas en la memoria del servidor, cuando el admin se autentica en `/api/auth/login`, el backend le firma un token criptográfico seguro. El cliente guarda este token en `localStorage` y el interceptor de Axios en `api.js` lo adjunta automáticamente en cada petición privada como cabecera `Authorization: Bearer <token>`.

### 3. Manejo de Fotografías con Multer y FormData
Nunca se deben almacenar imágenes en base de datos como base64, ya que multiplica el tamaño de la base de datos y degrada la velocidad de las consultas.
- Con **Multer**, el archivo binario se almacena en el disco del servidor (`backend/uploads/productos/`) con un nombre único generado (`producto-timestamp-aleatorio.ext`).
- En SQLite solo se guarda la ruta relativa corta (`/uploads/productos/...`).
- El servidor Express expone esta carpeta estáticamente mediante `app.use('/uploads', express.static(...))`.

### 4. Características Técnicas como JSON en SQLite
Para evitar crear múltiples tablas intermedias para especificaciones que varían entre productos (ej. notas de cata para un grano de café vs número de sobres para un producto DXN), almacenamos un array JSON en SQLite. El controlador de backend lo deserializa automáticamente al responder las consultas.

### 5. Estilizado Temático con Bootstrap 5 y Variables CSS
En lugar de reescribir todo el CSS, importamos la rejilla y componentes de Bootstrap 5 y definimos variables semánticas en `:root` (`--cafe-espresso`, `--cafe-dorado`, `--cafe-crema`), logrando una identidad visual elegante y consistente con muy pocas líneas de código.

---

## ☁️ Guía de Despliegue en Producción

### Opción A: Despliegue en Servicios Cloud Gratuitos / PaaS
1. **Frontend (Vercel o Netlify):**
   - Conecta el repositorio de GitHub.
   - Configura el subdirectorio raíz como `frontend`.
   - Comando de compilación: `npm run build`.
   - Carpeta de salida: `dist`.
   - Variable de entorno en Vercel: `VITE_API_URL=https://tu-backend.onrender.com/api` y `VITE_UPLOADS_URL=https://tu-backend.onrender.com`.
2. **Backend (Render, Railway o Fly.io):**
   - Configura el subdirectorio raíz como `backend`.
   - Comando de inicio: `node src/index.js`.
   - Variables de entorno en producción:
     ```env
     PORT=5000
     NODE_ENV=production
     JWT_SECRET=tu_clave_secreta_de_produccion_muy_larga
     FRONTEND_URL=https://tu-sitio-en-vercel.app
     ```
   - *Nota:* En servicios con almacenamiento efímero (como Render gratuito), las imágenes subidas por admin se reinician al suspender el contenedor. Para un despliegue en producción a gran escala con almacenamiento persistente de archivos, puedes adjuntar un volumen de disco persistente o enlazar Multer con un bucket como AWS S3 o Cloudinary.

### Opción B: Despliegue en Servidor VPS (Ubuntu + Nginx + PM2)
1. Clona el repositorio en `/var/www/cafe-pasion`.
2. Compila el frontend (`npm --prefix frontend run build`).
3. Inicia el backend con PM2: `pm2 start backend/src/index.js --name "cafe-pasion-api"`.
4. Configura Nginx para servir los archivos de `frontend/dist` en el puerto 80/443 y redirigir `/api` y `/uploads` al puerto local `5000` con `proxy_pass`.

---

## ☕ Créditos y Licencia
Desarrollado con dedicación y buenas prácticas para **CAFÉ PASIÓN**.
Licencia ISC. Proyecto preparado para publicación en internet.
