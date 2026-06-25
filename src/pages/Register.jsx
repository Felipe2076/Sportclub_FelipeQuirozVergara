import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { authService } from '../services/authService'

const roleRedirect = { Admin: '/dashboard/admin', Coach: '/dashboard/coach', User: '/dashboard/usuario' }

export default function Register() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getUser()
    if (user) navigate(roleRedirect[user.role] || '/dashboard/usuario', { replace: true })
  }, [navigate])

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    setLoading(true)
    try {
      const user = await authService.register(form.name, form.email, form.password)
      navigate(roleRedirect[user.role] || '/dashboard/usuario')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center w-100 mx-0">
          <Col md={6} lg={5}>
            <Card className="auth-card">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <span className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" style={{ width: 60, height: 60, background: 'rgba(240,192,64,0.1)', border: '2px solid rgba(240,192,64,0.2)' }}>
                    <img src="/logo-nuevo.png" alt="SportClub" height="38" style={{ borderRadius: 6, objectFit: 'contain' }} />
                  </span>
                  <h2 className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: '1.4rem' }}>Crear cuenta</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Únete a SportClub</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small" style={{ borderRadius: 10, background: 'rgba(192,64,96,0.15)', border: '1px solid rgba(192,64,96,0.3)', color: '#f0a0b0' }}>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="ejemplo@correo.com" required />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mín. 6" required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirmar</Form.Label>
                        <Form.Control type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repetir" required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button variant="" type="submit" className="btn-gold w-100 mb-3" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Crear cuenta'}
                  </Button>
                </Form>

                <div className="text-center small" style={{ color: 'var(--text-muted)' }}>
                  <span>¿Ya tienes cuenta? </span>
                  <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Inicia sesión</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
