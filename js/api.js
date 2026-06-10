const GORILA_CONFIG = window.GORILA_CONFIG || {
  apiBase: 'http://localhost:4000/api',
  apiKey: 'gsk_69fc31b7a9eecdfa6616b19a19a06aad0162aedb56e90c65',
};

async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body = null, auth = false } = options;

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

  // Si estamos en file:// o github.io, usamos datos simulados
  if (window.location.protocol === 'file:' || window.location.hostname.includes('github.io')) {
    return handleDemoMode(endpoint, method, body);
  }

  const response = await fetch(`${GORILA_CONFIG.apiBase}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud al servidor');
  }

  return data;
}

function handleDemoMode(endpoint, method) {
  return new Promise((resolve, reject) => {
    if (endpoint === '/login' || endpoint === '/register') {
      resolve({
        token: 'demo-token',
        user: { id: 'demo', name: 'Demo', email: 'demo@gorilasport.com', role: 'Admin' },
      });
    } else if (endpoint === '/dashboard') {
      resolve({ role: 'Admin', date: new Date().toLocaleDateString('es-ES'), users: [] });
    } else if (endpoint.startsWith('/users')) {
      resolve([
        { _id: '1', name: 'Admin Demo', email: 'admin@demo.com', role: 'Admin' },
        { _id: '2', name: 'Coach Demo', email: 'coach@demo.com', role: 'Coach' },
        { _id: '3', name: 'Atleta Demo', email: 'atleta@demo.com', role: 'User' },
      ]);
    } else {
      reject(new Error('Modo demostración: inicia el backend real.'));
    }
  });
}
