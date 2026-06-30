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
    const data = await apiRequest('/dashboard', { auth: true });
    
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
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3>👥 Gestión de Usuarios</h3>
            <button class="btn btn-primary" onclick="showAddUserForm()">+ Añadir Usuario</button>
          </div>
          <div id="add-user-form" style="display:none; margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #fff;">
            <h4 id="form-title" style="margin-bottom: 10px;">Nuevo Usuario</h4>
            <input type="hidden" id="edit-user-id" value="">
            <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
              <input type="text" id="new-name" placeholder="Nombre" style="flex: 1; padding: 8px;">
              <input type="email" id="new-email" placeholder="Email" style="flex: 1; padding: 8px;">
              <input type="password" id="new-password" placeholder="Contraseña (opcional al editar)" style="flex: 1; padding: 8px;">
              <select id="new-role" style="padding: 8px;">
                <option value="User">Atleta</option>
                <option value="Coach">Coach</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button class="btn btn-primary" onclick="saveUser()">Guardar</button>
            <button class="btn btn-ghost" onclick="hideAddUserForm()">Cancelar</button>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <thead>
              <tr style="border-bottom: 2px solid #ddd; text-align: left;">
                <th style="padding: 8px;">Nombre</th>
                <th style="padding: 8px;">Email</th>
                <th style="padding: 8px;">Rol</th>
                <th style="padding: 8px;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${data.users.map(u => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px 8px;"><strong>${u.name}</strong></td>
                  <td style="padding: 10px 8px;">${u.email}</td>
                  <td style="padding: 10px 8px;"><span style="color: #ff6b35; font-weight: 600;">${u.role}</span></td>
                  <td style="padding: 10px 8px;">
                    <button class="btn" style="padding: 4px 8px; font-size: 0.8rem; background: #004e89; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;" onclick="editUser('${u.id}', '${u.name}', '${u.email}', '${u.role}')">Editar</button>
                    <button class="btn" style="padding: 4px 8px; font-size: 0.8rem; background: #e63946; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="deleteUser('${u.id}')">Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
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

window.showAddUserForm = () => { 
  document.getElementById('form-title').innerText = 'Nuevo Usuario';
  document.getElementById('edit-user-id').value = '';
  document.getElementById('new-name').value = '';
  document.getElementById('new-email').value = '';
  document.getElementById('new-password').value = '';
  document.getElementById('new-role').value = 'User';
  document.getElementById('add-user-form').style.display = 'block'; 
};

window.hideAddUserForm = () => { 
  document.getElementById('add-user-form').style.display = 'none'; 
};

window.editUser = (id, name, email, role) => {
  document.getElementById('form-title').innerText = 'Editar Usuario';
  document.getElementById('edit-user-id').value = id;
  document.getElementById('new-name').value = name;
  document.getElementById('new-email').value = email;
  document.getElementById('new-password').value = ''; // Leave blank if not changing
  document.getElementById('new-role').value = role;
  document.getElementById('add-user-form').style.display = 'block';
  document.getElementById('add-user-form').scrollIntoView({ behavior: 'smooth' });
};

window.saveUser = async () => {
  const id = document.getElementById('edit-user-id').value;
  const name = document.getElementById('new-name').value;
  const email = document.getElementById('new-email').value;
  const password = document.getElementById('new-password').value;
  const role = document.getElementById('new-role').value;

  const body = { name, email, role };
  if (password) body.password = password;

  try {
    if (id) {
      // Editar
      await apiRequest(`/users/${id}`, {
        method: 'PUT',
        auth: true,
        body
      });
      alert('Usuario actualizado exitosamente');
    } else {
      // Crear
      if (!password) {
        alert('La contraseña es requerida para nuevos usuarios.');
        return;
      }
      await apiRequest('/users', {
        method: 'POST',
        auth: true,
        body
      });
      alert('Usuario creado exitosamente');
    }
    loadDashboard(); 
  } catch (error) {
    alert('Error al guardar usuario: ' + error.message);
  }
};

window.deleteUser = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
  try {
    await apiRequest(`/users/${id}`, { method: 'DELETE', auth: true });
    alert('Usuario eliminado exitosamente');
    loadDashboard();
  } catch (error) {
    alert('Error al eliminar: ' + error.message);
  }
};

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
