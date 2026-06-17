import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { authService } from '../services/authService'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'User' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      await authService.register(form.name, form.email, form.password, form.role)
      navigate('/dashboard/usuario')
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
                  <img src="/logo-icon.svg" alt="SportClub" height="48" className="auth-logo mb-2" />
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
                  <Form.Group className="mb-4">
                    <Form.Label>Tipo de usuario</Form.Label>
                    <Form.Select name="role" value={form.role} onChange={handleChange}>
                      <option value="User">Atleta</option>
                      <option value="Coach">Coach</option>
                    </Form.Select>
                  </Form.Group>

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
