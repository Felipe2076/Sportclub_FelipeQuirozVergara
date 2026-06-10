function isDemoHost() {
  return window.location.hostname.includes('github.io');
}

function assertBackendAvailable() {
  if (window.location.protocol === 'file:') {
    throw new Error(
      'Abre la app desde http://localhost:4000/login.html con el backend iniciado. ' +
      'Los datos se guardan en el servidor, no en el navegador.'
    );
  }
}

const GORILA_CONFIG = window.GORILA_CONFIG || {
  apiBase: 'http://localhost:4000/api',
  apiKey: 'gsk_69fc31b7a9eecdfa6616b19a19a06aad0162aedb56e90c65',
};

async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body = null, auth = false } = options;

  // Solo GitHub Pages usa demo sin backend; todo lo demás va al servidor real
  if (isDemoHost()) {
    return handleDemoMode(endpoint, method, body);
  }

  assertBackendAvailable();

  const headers = {
    'Content-Type': 'application/json',
    'X-API-Key': GORILA_CONFIG.apiKey,
  };

  if (auth) {
    const token = localStorage.getItem('gorilaToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${GORILA_CONFIG.apiBase}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud al servidor');
  }

  return data;
}

// Demo solo lectura para GitHub Pages (sin persistencia)
function handleDemoMode(endpoint, method) {
  return new Promise((resolve, reject) => {
    if (method !== 'GET' && method !== 'POST') {
      return reject(new Error('En modo demo no se pueden guardar cambios. Usa el backend local.'));
    }
    if (endpoint === '/login' || endpoint === '/register') {
      resolve({
        token: 'demo-token',
        user: { id: 'demo', name: 'Demo', email: 'demo@gorilasport.com', role: 'Admin' },
      });
    } else if (endpoint === '/dashboard') {
      resolve({ role: 'Admin', date: new Date().toLocaleDateString('es-ES'), users: [] });
    } else {
      reject(new Error('Modo demo: inicia el backend para guardar datos reales.'));
    }
  });
}
