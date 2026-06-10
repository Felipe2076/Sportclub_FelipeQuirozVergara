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

const DEMO_USERS = [
  { id: '1', name: 'Admin Demo', email: 'admin@demo.com', role: 'Admin' },
  { id: '2', name: 'Coach Demo', email: 'coach@demo.com', role: 'Coach' },
  { id: '3', name: 'Atleta Demo', email: 'atleta@demo.com', role: 'User' },
];

function handleDemoMode(endpoint, method, body) {
  return new Promise((resolve, reject) => {
    if (endpoint === '/login' || endpoint === '/register') {
      const user = { id: 'demo', name: 'Demo', email: 'demo@gorilasport.com', role: 'Admin' };
      localStorage.setItem('gorilaToken', 'demo-token');
      localStorage.setItem('gorilaUser', JSON.stringify(user));
      return resolve({ token: 'demo-token', user });
    }

    if (endpoint === '/dashboard') {
      const role = JSON.parse(localStorage.getItem('gorilaUser') || '{}').role || 'Admin';
      const isAdmin = role === 'Admin';
      return resolve({
        role,
        date: new Date().toLocaleDateString('es-ES'),
        users: isAdmin ? DEMO_USERS : undefined,
        athletes: role === 'Coach' ? DEMO_USERS.filter(u => u.role === 'User') : undefined,
      });
    }

    if (endpoint === '/users' && method === 'POST') {
      const newUser = { id: 'user-' + Date.now(), name: body?.name || 'Nuevo', email: body?.email || '', role: body?.role || 'User' };
      DEMO_USERS.push(newUser);
      return resolve({ message: 'User created successfully', user: newUser });
    }

    if (endpoint.startsWith('/users/') && method === 'DELETE') {
      const id = endpoint.replace('/users/', '');
      const idx = DEMO_USERS.findIndex(u => u.id === id);
      if (idx !== -1) DEMO_USERS.splice(idx, 1);
      return resolve({ message: 'User deleted successfully' });
    }

    if (endpoint.startsWith('/users/') && method === 'PUT') {
      const id = endpoint.replace('/users/', '');
      const user = DEMO_USERS.find(u => u.id === id);
      if (user && body) {
        if (body.name) user.name = body.name;
        if (body.email) user.email = body.email;
        if (body.role) user.role = body.role;
      }
      return resolve({ message: 'User updated successfully', user });
    }

    if (endpoint === '/users' || endpoint.startsWith('/users/')) {
      return resolve(DEMO_USERS);
    }

    reject(new Error('Modo demostración: inicia el backend real.'));
  });
}
