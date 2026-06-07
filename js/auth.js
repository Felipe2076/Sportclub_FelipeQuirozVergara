const apiBase = 'http://localhost:4000/api';
const form = document.getElementById('register-form') || document.getElementById('login-form');
const messageBox = document.getElementById('form-message');

function showMessage(text, isError = false) {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = 'message';
  if (isError) messageBox.classList.add('error');
  else messageBox.classList.add('success');
  messageBox.classList.remove('is-hidden');
}

function hideMessage() {
  if (!messageBox) return;
  messageBox.classList.add('is-hidden');
}

async function registerUser(event) {
  event.preventDefault();
  hideMessage();
  const formData = new FormData(event.target);
  const fullName = formData.get('firstName')?.trim();
  const email = formData.get('email')?.trim();
  const password = formData.get('password')?.trim();
  const confirmPassword = formData.get('confirmPassword')?.trim();
  const role = formData.get('role') || 'User';

  if (!fullName || !email || !password || !confirmPassword) {
    showMessage('Completa todos los campos.', true);
    return;
  }

  if (password !== confirmPassword) {
    showMessage('Las contraseñas no coinciden.', true);
    return;
  }

  try {
    const response = await fetch(`${apiBase}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fullName, email, password, role }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error durante el registro.');
    localStorage.setItem('gorilaToken', data.token);
    localStorage.setItem('gorilaUser', JSON.stringify(data.user));
    showMessage('Registro exitoso. Redirigiendo...', false);
    window.location.href = getDashboardRoute(data.user.role);
  } catch (error) {
    showMessage(error.message, true);
  }
}

async function loginUser(event) {
  event.preventDefault();
  hideMessage();
  const formData = new FormData(event.target);
  const email = formData.get('email')?.trim();
  const password = formData.get('password')?.trim();

  if (!email || !password) {
    showMessage('Ingresa tu email y contraseña.', true);
    return;
  }

  try {
    const response = await fetch(`${apiBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en el login.');
    localStorage.setItem('gorilaToken', data.token);
    localStorage.setItem('gorilaUser', JSON.stringify(data.user));
    showMessage('Inicio de sesión correcto. Redirigiendo...', false);
    window.location.href = getDashboardRoute(data.user.role);
  } catch (error) {
    showMessage(error.message, true);
  }
}

function getDashboardRoute(role) {
  if (role === 'Admin') return 'dashboard_admin.html';
  if (role === 'Coach') return 'dashboard_coach.html';
  return 'dashboard_usuario.html';
}

if (document.getElementById('register-form')) {
  document.getElementById('register-form').addEventListener('submit', registerUser);
}
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', loginUser);
}
