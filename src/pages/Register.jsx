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
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5}>
            <Card className="auth-card shadow-lg">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img src="/logo-icon.svg" alt="SportClub" height="48" className="auth-logo mb-2" />
                  <h4 className="fw-bold text-purple">Crear cuenta</h4>
                  <p className="text-muted small">Únete a SportClub</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Nombre completo</Form.Label>
                    <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Correo electrónico</Form.Label>
                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="ejemplo@correo.com" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Contraseña</Form.Label>
                    <Form.Control type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Confirmar contraseña</Form.Label>
                    <Form.Control type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repite la contraseña" required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Tipo de usuario</Form.Label>
                    <Form.Select name="role" value={form.role} onChange={handleChange}>
                      <option value="User">Atleta</option>
                      <option value="Coach">Coach</option>
                    </Form.Select>
                  </Form.Group>

                  <Button variant="gold" type="submit" className="w-100 mb-3" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Crear cuenta'}
                  </Button>
                </Form>

                <div className="text-center small">
                  <span className="text-muted">¿Ya tienes cuenta? </span>
                  <Link to="/login" className="text-purple fw-semibold">Inicia sesión</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
