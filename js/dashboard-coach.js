async function loadCoachDashboard() {
  if (!requireRole('Coach')) return;
  initDashboardShell('Coach Panel');

  const user = getUser();
  const heroName = document.getElementById('coach-hero-name');
  if (heroName) heroName.textContent = user?.name?.toUpperCase() || 'COACH';

  try {
    const data = await apiRequest('/dashboard', { auth: true });
    renderAthletes(data.athletes || []);
    renderPerformance(data.performance || []);
  } catch (error) {
    alert('Error al cargar datos: ' + error.message);
    localStorage.removeItem('gorilaToken');
    localStorage.removeItem('gorilaUser');
    window.location.href = 'login.html';
  }
}

function renderAthletes(athletes) {
  const container = document.getElementById('athletes-list');
  if (!container) return;

  if (!athletes.length) {
    container.innerHTML = '<p style="color:var(--dash-muted);font-size:0.85rem">No hay atletas registrados aún.</p>';
    return;
  }

  container.innerHTML = athletes.map(a => `
    <div class="dash-athlete-item">
      <div class="dash-athlete-avatar">${escapeHtml(a.name.charAt(0))}</div>
      <div class="dash-athlete-info">
        <strong>${escapeHtml(a.name)}</strong>
        <span>${escapeHtml(a.email || '')}</span>
      </div>
      <span class="dash-badge ${a.status === 'Lesionado' ? 'dash-badge-danger' : 'dash-badge-active'}">${escapeHtml(a.status)}</span>
      <button class="dash-btn dash-btn-green dash-btn-sm">Ver perfil</button>
    </div>
  `).join('');
}

function renderPerformance(rows) {
  const tbody = document.getElementById('performance-table-body');
  if (!tbody) return;

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td><strong>${escapeHtml(r.name)}</strong></td>
      <td><span class="dash-badge ${scoreClass(r.speed)}">${r.speed}</span></td>
      <td><span class="dash-badge ${scoreClass(r.endurance)}">${r.endurance}</span></td>
      <td><span class="dash-badge ${scoreClass(r.technique)}">${r.technique}</span></td>
      <td><strong style="color:var(--dash-green)">${r.score}</strong></td>
    </tr>
  `).join('');
}

function scoreClass(val) {
  if (typeof val === 'number') {
    if (val >= 80) return 'dash-badge-active';
    if (val >= 60) return 'dash-badge-warning';
    return 'dash-badge-danger';
  }
  const num = parseInt(val, 10);
  if (num >= 80) return 'dash-badge-active';
  if (num >= 60) return 'dash-badge-warning';
  return 'dash-badge-danger';
}

window.addEventListener('DOMContentLoaded', loadCoachDashboard);
