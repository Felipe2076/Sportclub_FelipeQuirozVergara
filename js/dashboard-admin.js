const userModal = document.getElementById('user-modal');
const userForm = document.getElementById('user-form');
const modalTitle = document.getElementById('modal-title');
const editUserId = document.getElementById('edit-user-id');
const inputName = document.getElementById('user-name');
const inputEmail = document.getElementById('user-email');
const inputPassword = document.getElementById('user-password');
const inputRole = document.getElementById('user-role');
const usersTableBody = document.getElementById('users-table-body');
const userSearch = document.getElementById('user-search');

let allUsers = [];

function openModal(isEdit = false) {
  userModal.classList.add('open');
  modalTitle.textContent = isEdit ? 'Editar Usuario' : 'Nuevo Usuario';
  inputPassword.placeholder = isEdit ? 'Dejar vacío para no cambiar' : 'Contraseña (mín. 8 caracteres)';
  inputPassword.required = !isEdit;
}

function closeModal() {
  userModal.classList.remove('open');
  userForm.reset();
  editUserId.value = '';
}

function renderUsersTable(users) {
  const query = (userSearch?.value || '').toLowerCase();
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query) ||
    u.email.toLowerCase().includes(query) ||
    u.role.toLowerCase().includes(query)
  );

  if (!filtered.length) {
    usersTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--dash-muted)">No hay usuarios</td></tr>`;
    return;
  }

  usersTableBody.innerHTML = filtered.map(u => `
    <tr>
      <td><strong>${escapeHtml(u.name)}</strong></td>
      <td>${escapeHtml(u.id)}</td>
      <td><span class="dash-badge ${roleBadgeClass(u.role)}">${roleLabel(u.role)}</span></td>
      <td>${escapeHtml(u.email)}</td>
      <td>
        <div class="dash-actions">
          <button class="dash-action-btn dash-action-edit" title="Editar"
            onclick="editUser('${u.id}')">✏️</button>
          <button class="dash-action-btn dash-action-delete" title="Eliminar"
            onclick="deleteUser('${u.id}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');

  updateCharts(users);
}

function updateCharts(users) {
  const athletes = users.filter(u => u.role === 'User').length;
  const coaches = users.filter(u => u.role === 'Coach').length;
  const admins = users.filter(u => u.role === 'Admin').length;
  const total = users.length || 1;
  const activePct = Math.round(((athletes + coaches) / total) * 100);

  const donut = document.getElementById('members-donut');
  if (donut) {
    donut.style.background = `conic-gradient(
      var(--dash-green) 0% ${activePct}%,
      #334155 ${activePct}% 100%
    )`;
  }

  const legendActive = document.getElementById('legend-active');
  const legendInactive = document.getElementById('legend-inactive');
  if (legendActive) legendActive.textContent = `Activos (${athletes + coaches})`;
  if (legendInactive) legendInactive.textContent = `Admin (${admins})`;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-athletes').textContent = athletes;
  document.getElementById('stat-coaches').textContent = coaches;
}

async function loadAdminDashboard() {
  if (!requireRole('Admin')) return;
  initDashboardShell('Admin Panel');

  try {
    const data = await apiRequest('/dashboard', { auth: true });
    allUsers = data.users || [];
    renderUsersTable(allUsers);
  } catch (error) {
    alert('Error al cargar datos: ' + error.message);
    localStorage.removeItem('gorilaToken');
    localStorage.removeItem('gorilaUser');
    window.location.href = 'login.html';
  }
}

window.showAddUserForm = () => {
  editUserId.value = '';
  userForm.reset();
  openModal(false);
};

window.editUser = (id) => {
  const user = allUsers.find(u => u.id === id);
  if (!user) return;
  editUserId.value = user.id;
  inputName.value = user.name;
  inputEmail.value = user.email;
  inputRole.value = user.role;
  inputPassword.value = '';
  openModal(true);
};

window.deleteUser = async (id) => {
  const user = allUsers.find(u => u.id === id);
  const currentUser = getUser();
  if (currentUser?.id === id) {
    alert('No puedes eliminar tu propia cuenta mientras estás conectado.');
    return;
  }
  if (!confirm(`¿Eliminar a "${user?.name || 'este usuario'}"? Esta acción no se puede deshacer.`)) return;
  try {
    await apiRequest(`/users/${id}`, { method: 'DELETE', auth: true });
    allUsers = allUsers.filter(u => u.id !== id);
    renderUsersTable(allUsers);
  } catch (error) {
    alert('Error al eliminar: ' + error.message);
  }
};

userForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = editUserId.value;
  const body = {
    name: inputName.value.trim(),
    email: inputEmail.value.trim(),
    role: inputRole.value,
  };
  if (inputPassword.value) body.password = inputPassword.value;

  try {
    if (id) {
      const result = await apiRequest(`/users/${id}`, { method: 'PUT', auth: true, body });
      const idx = allUsers.findIndex(u => u.id === id);
      if (idx !== -1) allUsers[idx] = result.user;
    } else {
      if (!body.password || body.password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
      const result = await apiRequest('/users', { method: 'POST', auth: true, body });
      allUsers.push(result.user);
    }
    closeModal();
    renderUsersTable(allUsers);
  } catch (error) {
    alert('Error al guardar: ' + error.message);
  }
});

document.getElementById('modal-cancel')?.addEventListener('click', closeModal);
userModal?.addEventListener('click', (e) => { if (e.target === userModal) closeModal(); });
userSearch?.addEventListener('input', () => renderUsersTable(allUsers));

window.addEventListener('DOMContentLoaded', loadAdminDashboard);
