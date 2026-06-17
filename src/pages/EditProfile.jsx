import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'
import { authService } from '../services/authService'

const roleColors = { Admin: 'var(--admin-color)', Coach: 'var(--coach-color)', User: 'var(--user-color)' }

export default function EditProfile() {
  const navigate = useNavigate()
  const user = authService.getUser()
  const color = roleColors[user?.role] || roleColors.User
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const [form, setForm] = useState({ name: '', email: '' })
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '' })
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password.newPass && password.newPass !== password.confirm) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }
    if (password.newPass && password.newPass.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    const payload = { name: form.name, email: form.email }
    if (password.current && password.newPass) {
      payload.currentPassword = password.current
      payload.newPassword = password.newPass
    }

    setLoading(true)
    try {
      const { data } = await api.put('/profile', payload)
      localStorage.setItem('gorilaUser', JSON.stringify(data.user))
      setSuccess('Perfil actualizado correctamente')
      setPassword({ current: '', newPass: '', confirm: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="dash-title" style={{ color }}>Editar Perfil</h2>
        <p className="dash-subtitle">Actualiza tus datos personales y contraseña</p>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="list-card">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <div className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-2"
                  style={{ width: 64, height: 64, background: color, fontSize: 24, color: '#fff' }}>
                  {initials}
                </div>
                <h5 style={{ color: 'var(--text-primary)', marginBottom: 2 }}>{form.name || 'Usuario'}</h5>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{form.email}</span>
              </div>

              {error && <Alert variant="danger" className="py-2 small" style={{ borderRadius: 10, background: 'rgba(192,64,96,0.15)', border: '1px solid rgba(192,64,96,0.3)', color: '#f0a0b0' }}>{error}</Alert>}
              {success && <Alert variant="" className="py-2 small" style={{ borderRadius: 10, background: 'rgba(61,170,122,0.15)', border: '1px solid rgba(61,170,122,0.3)', color: '#a0e0c0' }}>{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <h6 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '1rem' }}>Información personal</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Tu nombre" />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="tu@correo.com" />
                </Form.Group>

                <h6 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1, marginBottom: '1rem' }}>Cambiar contraseña <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', fontSize: '0.7rem' }}>(opcional)</span></h6>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña actual</Form.Label>
                  <Form.Control type="password" value={password.current} onChange={(e) => setPassword({...password, current: e.target.value})} placeholder="••••••••" />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nueva contraseña</Form.Label>
                      <Form.Control type="password" value={password.newPass} onChange={(e) => setPassword({...password, newPass: e.target.value})} placeholder="Mín. 6 caracteres" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Confirmar nueva</Form.Label>
                      <Form.Control type="password" value={password.confirm} onChange={(e) => setPassword({...password, confirm: e.target.value})} placeholder="Repetir contraseña" />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button variant="" type="submit" className="btn-gold" disabled={loading} style={{ flex: 1 }}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Guardar cambios'}
                  </Button>
                  <Button variant="" onClick={() => navigate(-1)}
                    style={{ color: 'var(--text-secondary)', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
