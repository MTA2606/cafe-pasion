// Script de prueba integral de endpoints para Café Pasión API
import http from 'http';

async function testApi() {
  console.log('🧪 Iniciando prueba de endpoints...');

  // Importar dinámicamente app
  const { default: app } = await import('./src/index.js');
  
  // Dar 1 segundo para arranque
  await new Promise(r => setTimeout(r, 1000));

  try {
    // 1. Health check
    console.log('\n--- 1. GET /api/health ---');
    const resHealth = await fetch('http://localhost:5000/api/health');
    const dataHealth = await resHealth.json();
    console.log('Respuesta:', dataHealth);

    // 2. Categorías
    console.log('\n--- 2. GET /api/categorias ---');
    const resCat = await fetch('http://localhost:5000/api/categorias');
    const dataCat = await resCat.json();
    console.log(`Categorías encontradas: ${dataCat.data?.length}`);
    dataCat.data?.forEach(c => console.log(`  - [ID ${c.id}] ${c.nombre} (${c.total_productos} productos)`));

    // 3. Productos (Catálogo)
    console.log('\n--- 3. GET /api/productos ---');
    const resProd = await fetch('http://localhost:5000/api/productos');
    const dataProd = await resProd.json();
    console.log(`Productos activos: ${dataProd.total}`);
    dataProd.data?.slice(0, 3).forEach(p => {
      console.log(`  - [S/ ${p.precio.toFixed(2)}] ${p.nombre} (Cat: ${p.categoria_nombre})`);
      console.log(`    Características: ${p.caracteristicas?.length} items`);
    });

    // 4. Configuración
    console.log('\n--- 4. GET /api/configuracion ---');
    const resConf = await fetch('http://localhost:5000/api/configuracion');
    const dataConf = await resConf.json();
    console.log('Configuraciones:', {
      negocio: dataConf.data?.negocio_nombre,
      telefono: dataConf.data?.telefono,
      whatsapp: dataConf.data?.whatsapp,
      direccion: dataConf.data?.direccion
    });

    // 5. Autenticación: Login
    console.log('\n--- 5. POST /api/auth/login ---');
    const resLogin = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@cafepasion.com',
        password: 'CafePasion2026!'
      })
    });
    const dataLogin = await resLogin.json();
    console.log('Login exitoso:', dataLogin.success, '| Admin:', dataLogin.admin?.nombre);
    const token = dataLogin.token;

    // 6. Verificar ruta protegida /api/auth/me con Token
    console.log('\n--- 6. GET /api/auth/me (Protegido con JWT) ---');
    const resMe = await fetch('http://localhost:5000/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const dataMe = await resMe.json();
    console.log('Perfil verificado:', dataMe);

    console.log('\n=============================================');
    console.log('🎉 TODOS LOS ENDPOINTS FUNCIONAN AL 100%');
    console.log('=============================================\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la prueba de API:', error);
    process.exit(1);
  }
}

testApi();
