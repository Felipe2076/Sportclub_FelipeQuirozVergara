const apiBase = 'http://localhost:4000/api';
const API_KEY = 'your-secret-api-key-here';
const logoutButton = document.getElementById('logout-button');
const dashboardTitle = document.getElementById('dashboard-title');
const dashboardSubtitle = document.getElementById('dashboard-subtitle');
const cardsContainer = document.getElementById('dashboard-cards');
const extraContainer = document.getElementById('dashboard-extra');

function getToken() {
  return localStorage.getItem('gorilaToken');
}

function getUser() {
  return JSON.parse(localStorage.getItem('gorilaUser') || 'null');
}

function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

async function loadDashboard() {
  if (!requireAuth()) return;
  try {
    const response = await fetch(`${apiBase}/dashboard`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'x-api-key': API_KEY,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No se pudo cargar el dashboard.');
    
    const user = getUser();
    const currentDate = new Date().toLocaleDateString('es-ES');
    dashboardTitle.textContent = `Bienvenido, ${user?.name || 'Usuario'}`;
    dashboardSubtitle.textContent = `${data.role} • ${currentDate}`;
    
    cardsContainer.innerHTML = `
      <article class="dashboard-card">
        <strong>${data.stats?.totalUsers || 0}</strong>
        <span>Total de Usuarios</span>
        <p>Usuarios registrados en el sistema</p>
      </article>
      <article class="dashboard-card">
        <strong>${data.stats?.coachCount || 0}</strong>
        <span>Coaches</span>
        <p>Entrenadores activos</p>
      </article>
      <article class="dashboard-card">
        <strong>${data.stats?.athleteCount || 0}</strong>
        <span>Atletas</span>
        <p>Deportistas en el programa</p>
      </article>
    `;
    
    extraContainer.innerHTML = `
      <section class="dashboard-list">
        <h3>📊 Tu Perfil</h3>
        <div class="dashboard-list-item">
          <strong>${user?.name || 'N/A'}</strong>
          <span>${user?.email || 'N/A'}</span>
          <p style="font-size: 0.85rem; color: #ff6b35; font-weight: 600; margin-top: 4px;">${user?.role || 'Usuario'}</p>
        </div>
        ${user?.level ? `
        <div class="dashboard-list-item" style="margin-top: 12px;">
          <strong>Nivel</strong>
          <span>${user.level}</span>
        </div>
        ` : ''}
        ${user?.personalGoal ? `
        <div class="dashboard-list-item" style="margin-top: 12px;">
          <strong>Objetivo Personal</strong>
          <span>${user.personalGoal}</span>
        </div>
        ` : ''}
      </section>
    `;
  } catch (error) {
    console.error(error);
    localStorage.removeItem('gorilaToken');
    localStorage.removeItem('gorilaUser');
    window.location.href = 'login.html';
  }
}

if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('gorilaToken');
    localStorage.removeItem('gorilaUser');
    window.location.href = 'login.html';
  });
}

if (dashboardTitle) {
  window.addEventListener('DOMContentLoaded', loadDashboard);
}
