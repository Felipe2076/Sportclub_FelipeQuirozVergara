const apiBase = 'http://localhost:4000/api';
const messageBox = document.getElementById('form-message');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const practicesSportCheckbox = document.getElementById('practicesSport');
const sportTypeGroup = document.getElementById('sport-type-group');

function isStaticHost() {
  return window.location.hostname.includes('github.io');
}

function showMessage(text, isError = false) {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = 'message show';
  messageBox.classList.toggle('error', isError);
  messageBox.classList.toggle('success', !isError);
  messageBox.classList.remove('is-hidden');
}

function hideMessage() {
  if (messageBox) messageBox.classList.add('is-hidden');
}

function setSubmitting(button, isSubmitting, defaultText) {
  if (!button) return;
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? 'Procesando...' : defaultText;
}

function getDashboardRoute(role) {
  if (role === 'Admin') return 'dashboard_admin.html';
  if (role === 'Coach') return 'dashboard_coach.html';
  return 'dashboard_usuario.html';
}

async function registerUser(event) {
  event.preventDefault();
  hideMessage();

  const formData = new FormData(event.target);
  const email = formData.get('email')?.trim();
  const password = formData.get('password')?.trim();
  const submitButton = document.getElementById('register-submit');

  if (!email || !password) {
    showMessage('Correo y contraseña son obligatorios.', true);
    return;
  }

  if (password.length < 8) {
    showMessage('La contraseña debe tener al menos 8 caracteres.', true);
    return;
  }

  const payload = {
    email,
    password,
    name: formData.get('name')?.trim() || email.split('@')[0],
    role: 'User',
    age: formData.get('age') || null,
    practicesSport: formData.get('practicesSport') === 'yes',
    sportType: formData.get('sportType') || null,
    personalGoal: formData.get('personalGoal')?.trim() || null,
    level: formData.get('level') || null,
  };

  setSubmitting(submitButton, true, 'Registrarse');

  if (isStaticHost()) {
    showMessage('Registro simulado correctamente. Redirigiendo al login...', false);
    window.setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
    setSubmitting(submitButton, false, 'Registrarse');
    return;
  }

  try {
    const response = await fetch(`${apiBase}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error durante el registro.');

    localStorage.setItem('gorilaToken', data.token);
    localStorage.setItem('gorilaUser', JSON.stringify(data.user));
    showMessage('Registro exitoso. Redirigiendo...', false);
    window.setTimeout(() => {
      window.location.href = getDashboardRoute(data.user.role);
    }, 800);
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    setSubmitting(submitButton, false, 'Registrarse');
  }
}

async function loginUser(event) {
  event.preventDefault();
  hideMessage();

  const formData = new FormData(event.target);
  const email = formData.get('email')?.trim();
  const password = formData.get('password')?.trim();
  const submitButton = document.getElementById('login-submit');

  if (!email || !password) {
    showMessage('Ingresa tu correo y contraseña.', true);
    return;
  }

  setSubmitting(submitButton, true, 'Iniciar sesión');

  if (isStaticHost()) {
    showMessage('Inicio de sesión simulado. Bienvenido a Gorila Sport.', false);
    setSubmitting(submitButton, false, 'Iniciar sesión');
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
    window.setTimeout(() => {
      window.location.href = getDashboardRoute(data.user.role);
    }, 800);
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    setSubmitting(submitButton, false, 'Iniciar sesión');
  }
}

function toggleSportTypeField() {
  if (!practicesSportCheckbox || !sportTypeGroup) return;
  sportTypeGroup.hidden = !practicesSportCheckbox.checked;
}

if (practicesSportCheckbox) {
  practicesSportCheckbox.addEventListener('change', toggleSportTypeField);
  toggleSportTypeField();
}

if (registerForm) {
  registerForm.addEventListener('submit', registerUser);
}

if (loginForm) {
  loginForm.addEventListener('submit', loginUser);
}
