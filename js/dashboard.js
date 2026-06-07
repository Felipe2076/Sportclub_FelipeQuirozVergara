const apiBase = 'http://localhost:4000/api';
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
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No se pudo cargar el dashboard.');
    
    const user = getUser();
    dashboardTitle.textContent = `Bienvenido, ${user?.name || 'Usuario'}`;
    dashboardSubtitle.textContent = `${data.role} • ${data.date}`;
    
    cardsContainer.innerHTML = data.panels.map(panel => `
      <article class="dashboard-card">
        <strong>${panel.value}</strong>
        <span>${panel.title}</span>
        <p>${panel.detail}</p>
      </article>
    `).join('');
    
    extraContainer.innerHTML = '';
    if (data.users) {
      extraContainer.innerHTML = `
        <section class="dashboard-list">
          <h3>👥 Usuarios registrados</h3>
          ${data.users.map(u => `
            <div class="dashboard-list-item">
              <strong>${u.name}</strong>
              <span>${u.email}</span>
              <p style="font-size: 0.85rem; color: #ff6b35; font-weight: 600; margin-top: 4px;">${u.role}</p>
            </div>
          `).join('')}
        </section>
      `;
    }
    if (data.athletes) {
      extraContainer.innerHTML = `
        <section class="dashboard-list">
          <h3>⚽ Atletas activos</h3>
          ${data.athletes.map(a => `
            <div class="dashboard-list-item">
              <strong>${a.name}</strong>
              <span>Progreso: ${a.progress}</span>
              <p style="font-size: 0.85rem; color: #10b981; font-weight: 600; margin-top: 4px;">${a.status}</p>
            </div>
          `).join('')}
        </section>
      `;
    }
    if (data.stats) {
      extraContainer.innerHTML = `
        <section class="dashboard-list">
          <h3>📊 Tus estadísticas</h3>
          ${data.stats.map(s => `
            <div class="dashboard-list-item">
              <strong>${s.label}</strong>
              <span style="font-size: 1.1rem; font-weight: 700; color: #ff6b35;">${s.value}</span>
            </div>
          `).join('')}
        </section>
      `;
    }
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
