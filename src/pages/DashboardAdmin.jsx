import { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

const accent = 'var(--admin-color)'

export default function DashboardAdmin() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'User' })

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users')
      setUsers(Array.isArray(data) ? data : data?.users || [])
    } catch (e) { console.error(e) }
  }

  useEffect(() => { loadUsers() }, [])

  const handleSave = async () => {
    try {
      if (editing) {
        const payload = { name: form.name, email: form.email, role: form.role }
        if (form.password) payload.password = form.password
        await api.put(`/users/${editing}`, payload)
      } else {
        await api.post('/users', { ...form, password: form.password || 'Pass123!' })
      }
      setShowModal(false)
      setEditing(null)
      setForm({ name: '', email: '', password: '', role: 'User' })
      loadUsers()
    } catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return
    try {
      await api.delete(`/users/${id}`)
      loadUsers()
    } catch (e) { alert('Error: ' + (e.response?.data?.message || e.message)) }
  }

  const openEdit = (u) => {
    setEditing(u.id || u._id)
    setForm({ name: u.name || '', email: u.email || '', password: '', role: u.role || 'User' })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', password: '', role: 'User' })
    setShowModal(true)
  }

  const stats = [
    { icon: '👥', label: 'Total usuarios', value: users.length, color: accent },
    { icon: '👨‍🏫', label: 'Coaches', value: users.filter(u => u.role === 'Coach').length, color: 'var(--coach-color)' },
    { icon: '🏋️', label: 'Atletas', value: users.filter(u => u.role === 'User').length, color: 'var(--user-color)' },
    { icon: '🛡️', label: 'Administradores', value: users.filter(u => u.role === 'Admin').length, color: '#8a5ab8' },
  ]

  const controlPanel = [
    { label: 'Usuarios activos', detail: 'Total de miembros registrados', value: users.length, color: 'var(--user-color)' },
    { label: 'Clases del día', detail: 'Programadas para hoy', value: '6', color: 'var(--gold)' },
    { label: 'Reservas activas', detail: 'En las últimas 24h', value: '12', color: 'var(--coach-color)' },
    { label: 'Pagos pendientes', detail: 'Membresías por vencer', value: '3', color: 'var(--admin-color)' },
  ]

  return (
    <DashboardLayout>
      <div className="dash-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="dash-title" style={{ color: accent }}>Panel de Administración</h2>
          <p className="dash-subtitle">Gestión de usuarios, estadísticas y control del sistema</p>
        </div>
        <Button variant="" className="btn-outline-gold btn-sm" onClick={openCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Añadir usuario
        </Button>
      </div>

      <Row className="g-3 mb-4">
        {stats.map((s) => (
          <Col key={s.label} md={3}>
            <Card className="stat-card h-100" style={{ borderLeft: `4px solid ${s.color}` }}>
              <Card.Body className="d-flex align-items-center gap-3">
                <span style={{ fontSize: 28, lineHeight: 1 }}>{s.icon}</span>
                <div>
                  <div className="fw-bold fs-4" style={{ color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        <Col md={8}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(192,64,96,0.08)' }}>
              👥 Gestión de Usuarios
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th className="text-center">Acciones</th></tr></thead>
                <tbody>
                  {users.map((u) => {
                    const badgeClass = u.role === 'Admin' ? 'danger' : u.role === 'Coach' ? 'success' : 'primary'
                    return (
                      <tr key={u.id || u._id}>
                        <td className="fw-medium">{u.name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                        <td><Badge bg={badgeClass}>{u.role}</Badge></td>
                        <td className="text-center">
                          <Button variant="" size="sm" className="btn-outline-gold me-1" style={{ padding: '0.2rem 0.5rem' }} onClick={() => openEdit(u)} title="Editar">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </Button>
                          <Button variant="" size="sm" style={{ padding: '0.2rem 0.5rem', color: 'var(--admin-color)', border: '1px solid var(--admin-color)', background: 'transparent', borderRadius: 8 }} onClick={() => handleDelete(u.id || u._id)} title="Eliminar">
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
            <Card.Header style={{ color: accent, background: 'rgba(192,64,96,0.08)' }}>
              📊 Panel de Control
            </Card.Header>
            <Card.Body>
              {controlPanel.map((c) => (
                <div key={c.label} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div className="fw-medium" style={{ fontSize: '0.82rem' }}>{c.label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{c.detail}</div>
                  </div>
                  <Badge bg="" style={{ background: c.color, fontSize: '0.75rem', minWidth: 28 }}>{c.value}</Badge>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-light">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '0.95rem', fontWeight: 700 }}>{editing ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control size="sm" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Ej. Juan Pérez" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control size="sm" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="juan@correo.com" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña {editing && <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.7rem' }}>(dejar vacío para mantener)</span>}</Form.Label>
              <Form.Control size="sm" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder={editing ? 'Nueva contraseña' : 'Mínimo 6 caracteres'} />
            </Form.Group>
            <Form.Group className="mb-0">
              <Form.Label>Rol</Form.Label>
              <Form.Select size="sm" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                <option value="User">Atleta</option>
                <option value="Coach">Coach</option>
                <option value="Admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" size="sm" style={{ color: 'var(--text-secondary)', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="" size="sm" className="btn-gold" onClick={handleSave} style={{ fontSize: '0.8rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}
