import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Importar JS de Bootstrap 5 (para menús colapsables en móviles y modales)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Estilos globales y específicos de la aplicación
import './index.css';
import './App.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
