const messageBox = document.getElementById('form-message');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const practicesSportCheckbox = document.getElementById('practicesSport');
const sportTypeGroup = document.getElementById('sport-type-group');

function showMessage(text, isError = false) {
  if (!messageBox) return;
  messageBox.textContent = text;
  messageBox.className = 'message show';
  messageBox.classList.toggle('error', isError);
  messageBox.classList.toggle('success', !isError);
  messageBox.classList.remove('is-hidden');
  messageBox.style.display = 'block'; // Ensure it's visible
}

function hideMessage() {
  if (messageBox) {
    messageBox.classList.add('is-hidden');
    messageBox.style.display = 'none'; // Ensure it's hidden
  }
}

function setSubmitting(button, isSubmitting, defaultText) {
  if (!button) return;
  button.disabled = isSubmitting;
  button.textContent = isSubmitting ? 'Cargando...' : defaultText;
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

  setSubmitting(submitButton, true, 'Register');

  try {
    const data = await apiRequest('/register', {
      method: 'POST',
      body: payload,
    });

    localStorage.setItem('gorilaToken', data.token);
    localStorage.setItem('gorilaUser', JSON.stringify(data.user));
    showMessage('Registro exitoso. Redirigiendo...', false);
    window.setTimeout(() => {
      window.location.href = getDashboardRoute(data.user.role);
    }, 800);
  } catch (error) {
    const errorMessage = error.message || 'Error desconocido durante el registro.';
    showMessage(errorMessage, true);
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

  setSubmitting(submitButton, true, 'Ingresar');

  try {
    const data = await apiRequest('/login', {
      method: 'POST',
      body: { email, password },
    });

    localStorage.setItem('gorilaToken', data.token);
    localStorage.setItem('gorilaUser', JSON.stringify(data.user));
    showMessage('Inicio de sesión exitoso. Redirigiendo...', false);
    window.setTimeout(() => {
      window.location.href = getDashboardRoute(data.user.role);
    }, 800);
  } catch (error) {
    const errorMessage = error.message || 'Error desconocido al iniciar sesión.';
    showMessage(errorMessage, true);
  } finally {
    setSubmitting(submitButton, false, 'Ingresar');
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
