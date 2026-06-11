function getToken() {
  return localStorage.getItem('gorilaToken');
}

function getUser() {
  return JSON.parse(localStorage.getItem('gorilaUser') || 'null');
}

function requireRole(expectedRole) {
  const token = getToken();
  const user = getUser();
  if (!token || !user) {
    window.location.href = 'login.html';
    return false;
  }
  if (expectedRole && user.role !== expectedRole) {
    const routes = { Admin: 'dashboard_admin.html', Coach: 'dashboard_coach.html', User: 'dashboard_usuario.html' };
    window.location.href = routes[user.role] || 'login.html';
    return false;
  }
  return true;
}

function initDashboardShell(roleLabel) {
  const user = getUser();
  const greeting = document.getElementById('dash-greeting');
  const avatar = document.getElementById('dash-avatar');
  const roleBadge = document.getElementById('dash-role-badge');

  if (greeting) greeting.textContent = `Hola, ${user?.name || 'Usuario'}`;
  if (avatar) avatar.textContent = (user?.name || 'U').charAt(0).toUpperCase();
  if (roleBadge) roleBadge.textContent = roleLabel;

  const logoutBtn = document.getElementById('logout-button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('gorilaToken');
      localStorage.removeItem('gorilaUser');
      window.location.href = 'login.html';
    });
  }
}

function roleBadgeClass(role) {
  if (role === 'Admin') return 'dash-badge-admin';
  if (role === 'Coach') return 'dash-badge-coach';
  return 'dash-badge-user';
}

function roleLabel(role) {
  if (role === 'Admin') return 'Administrador';
  if (role === 'Coach') return 'Coach';
  return 'Atleta';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
