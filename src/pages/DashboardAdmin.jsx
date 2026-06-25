import { useEffect, useState, useCallback } from "react"
import { Row, Col, Card, Table, Badge, Button, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import DashboardLayout from "../components/DashboardLayout"
import UserFormModal from "../components/users/UserFormModal"
import SportFormModal from "../components/sports/SportFormModal"
import { UsersIcon, DumbbellIcon, ShieldIcon, ChartIcon } from "../components/Icons"
import { getUsers, createUser, updateUser, deleteUser } from "../services/userService"
import { getSports, createSport, updateSport, deleteSport, toggleSportStatus } from "../services/sportService"

const accent = "var(--admin-color)"

function formatDate(dateStr) {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  const parts = d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }).split(" ")
  if (parts.length >= 3) {
    parts[1] = parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
  }
  return parts.join(" ")
}

export default function DashboardAdmin() {
  const [users, setUsers] = useState([])
  const [sports, setSports] = useState([])
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showSportModal, setShowSportModal] = useState(false)
  const [selectedSport, setSelectedSport] = useState(null)

  const loadUsers = useCallback(async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch { Swal.fire("Error", "No se pudieron cargar los usuarios", "error") }
  }, [])

  const loadSports = useCallback(async () => {
    try {
      const data = await getSports()
      setSports(data)
    } catch { Swal.fire("Error", "No se pudieron cargar los deportes", "error") }
  }, [])

  useEffect(() => { loadUsers(); loadSports() }, [loadUsers, loadSports])

  const openCreateUser = () => { setSelectedUser(null); setShowUserModal(true) }
  const openEditUser = (u) => { setSelectedUser(u); setShowUserModal(true) }
  const closeUserModal = () => { setShowUserModal(false); setSelectedUser(null) }

  const handleSaveUser = async (formData) => {
    try {
      if (selectedUser) {
        const payload = { name: formData.name, email: formData.email, role: formData.role }
        if (formData.password) payload.password = formData.password
        await updateUser(selectedUser.id, payload)
        Swal.fire("Actualizado", "Usuario actualizado correctamente", "success")
      } else {
        await createUser({ ...formData, password: formData.password || "12345678" })
        Swal.fire("Creado", "Usuario creado correctamente", "success")
      }
      closeUserModal(); loadUsers()
    } catch (e) { Swal.fire("Error", e.response?.data?.message || e.message, "error") }
  }

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Eliminar usuario?",
      text: "Esta accion no se puede deshacer",
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Si, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "#d33",
    })
    if (!result.isConfirmed) return
    try {
      await deleteUser(id)
      Swal.fire("Eliminado", "Usuario eliminado correctamente", "success")
      loadUsers()
    } catch (e) { Swal.fire("Error", e.response?.data?.message || e.message, "error") }
  }

  const openCreateSport = () => { setSelectedSport(null); setShowSportModal(true) }
  const openEditSport = (s) => { setSelectedSport(s); setShowSportModal(true) }
  const closeSportModal = () => { setShowSportModal(false); setSelectedSport(null) }

  const handleSaveSport = async (formData) => {
    try {
      if (selectedSport) {
        await updateSport(selectedSport.id, formData)
        Swal.fire("Actualizado", "Deporte actualizado correctamente", "success")
      } else {
        await createSport(formData)
        Swal.fire("Creado", "Deporte creado correctamente", "success")
      }
      closeSportModal(); loadSports()
    } catch (e) { Swal.fire("Error", e.response?.data?.message || e.message, "error") }
  }

  const handleDeleteSport = async (id) => {
    const result = await Swal.fire({
      title: "Eliminar deporte?",
      text: "Esta accion no se puede deshacer",
      icon: "warning", showCancelButton: true,
      confirmButtonText: "Si, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "#d33",
    })
    if (!result.isConfirmed) return
    try {
      await deleteSport(id)
      Swal.fire("Eliminado", "Deporte eliminado correctamente", "success")
      loadSports()
    } catch (e) { Swal.fire("Error", e.response?.data?.message || e.message, "error") }
  }

  const handleToggleStatus = async (sport) => {
    try {
      const updated = await toggleSportStatus(sport.id, !sport.status)
      Swal.fire("Estado actualizado", updated.status ? "Deporte activado" : "Deporte desactivado", "success")
      loadSports()
    } catch (e) { Swal.fire("Error", e.response?.data?.message || e.message, "error") }
  }

  const stats = [
    { icon: <UsersIcon size={22} />, label: "Total usuarios", value: users.length, color: accent },
    { icon: <UsersIcon size={22} />, label: "Coaches", value: users.filter(u => u.role === "Coach").length, color: "var(--coach-color)" },
    { icon: <DumbbellIcon size={22} />, label: "Deportes", value: sports.length, color: "var(--gold)" },
    { icon: <ShieldIcon size={22} />, label: "Administradores", value: users.filter(u => u.role === "Admin").length, color: "#8a5ab8" },
  ]

  return (
    <DashboardLayout>
      <div className="dash-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="dash-title" style={{ color: accent }}>Panel de Administracion</h2>
          <p className="dash-subtitle">Gestion de usuarios, deportes y control del sistema</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="" className="btn-outline-gold btn-sm" onClick={openCreateUser}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Anadir usuario
          </Button>
          <Button variant="" className="btn-outline-gold btn-sm" onClick={openCreateSport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Anadir deporte
          </Button>
        </div>
      </div>

      <Row className="g-3 mb-4">
        {stats.map((s) => (
          <Col key={s.label} md={3}>
            <Card className="stat-card h-100" style={{ borderLeft: "4px solid " + s.color }}>
              <Card.Body className="d-flex align-items-center gap-3">
                <span style={{ fontSize: 22, lineHeight: 1, color: s.color }}>{s.icon}</span>
                <div>
                  <div className="fw-bold fs-4" style={{ color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{s.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
        <Col md={8}>
          <Card className="list-card">
            <Card.Header className="d-flex justify-content-between align-items-center"
              style={{ color: accent, background: "rgba(208,64,80,0.08)" }}>
              <span><UsersIcon size={14} /> Gestion de Usuarios</span>
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th className="text-center">Acciones</th></tr></thead>
                <tbody>
                  {users.map((u) => {
                    const badgeClass = u.role === "Admin" ? "danger" : u.role === "Coach" ? "success" : "primary"
                    return (
                      <tr key={u.id}>
                        <td className="fw-medium">{u.name}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                        <td><Badge bg={badgeClass}>{u.role}</Badge></td>
                        <td className="text-center">
                          <Button variant="" size="sm" className="btn-outline-gold me-1" style={{ padding: "0.2rem 0.5rem" }} onClick={() => openEditUser(u)} title="Editar">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </Button>
                          <Button variant="" size="sm" style={{ padding: "0.2rem 0.5rem", color: "var(--admin-color)", border: "1px solid var(--admin-color)", background: "transparent", borderRadius: 8 }} onClick={() => handleDeleteUser(u.id)} title="Eliminar">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: "rgba(208,64,80,0.08)" }}>
              <ChartIcon size={14} /> Panel de Control
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <div className="fw-medium" style={{ fontSize: "0.82rem" }}>Usuarios activos</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>Total de miembros registrados</div>
                </div>
                <Badge bg="" style={{ background: "var(--user-color)", fontSize: "0.75rem", minWidth: 28 }}>{users.length}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <div className="fw-medium" style={{ fontSize: "0.82rem" }}>Deportes</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>Disponibles en el sistema</div>
                </div>
                <Badge bg="" style={{ background: "var(--gold)", fontSize: "0.75rem", minWidth: 28 }}>{sports.length}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div>
                  <div className="fw-medium" style={{ fontSize: "0.82rem" }}>Clases del dia</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>Programadas para hoy</div>
                </div>
                <Badge bg="" style={{ background: "var(--coach-color)", fontSize: "0.75rem", minWidth: 28 }}>6</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="list-card mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center"
          style={{ color: accent, background: "rgba(208,64,80,0.08)" }}>
          <span><DumbbellIcon size={14} /> Gestion de Deportes</span>
          <Button variant="" className="btn-outline-gold btn-sm" onClick={loadSports}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refrescar
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          <Table className="mb-0 small" variant="dark">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Objetivo</th>
                <th>Duracion</th>
                <th>Estado</th>
                <th>Fecha creacion</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sports.map((s) => (
                <tr key={s.id}>
                  <td className="fw-medium">{s.name}</td>
                  <td style={{ color: "var(--text-secondary)", maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.objective}</td>
                  <td style={{ color: "var(--text-secondary)" }}>{s.duration} min</td>
                  <td>
                    <Form.Check
                      type="switch"
                      id={"sport-status-" + s.id}
                      checked={s.status}
                      onChange={() => handleToggleStatus(s)}
                      label={s.status ? "Activo" : "Inactivo"}
                    />
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{formatDate(s.created_at)}</td>
                  <td className="text-center">
                    <Button variant="" size="sm" className="btn-outline-gold me-1" style={{ padding: "0.2rem 0.5rem" }} onClick={() => openEditSport(s)} title="Editar">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Button>
                    <Button variant="" size="sm" style={{ padding: "0.2rem 0.5rem", color: "var(--admin-color)", border: "1px solid var(--admin-color)", background: "transparent", borderRadius: 8 }} onClick={() => handleDeleteSport(s.id)} title="Eliminar">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </Button>
                  </td>
                </tr>
              ))}
              {sports.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-3" style={{ color: "var(--text-muted)" }}>
                    No hay deportes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <UserFormModal
        show={showUserModal}
        handleClose={closeUserModal}
        handleSave={handleSaveUser}
        selectedUser={selectedUser}
      />
      <SportFormModal
        show={showSportModal}
        handleClose={closeSportModal}
        handleSave={handleSaveSport}
        selectedSport={selectedSport}
      />
    </DashboardLayout>
  )
}
