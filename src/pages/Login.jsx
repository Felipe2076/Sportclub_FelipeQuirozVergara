import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { authService } from '../services/authService'

const roleRedirect = { Admin: '/dashboard/admin', Coach: '/dashboard/coach', User: '/dashboard/usuario' }

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await authService.login(email, password)
      navigate(roleRedirect[user.role] || '/dashboard/usuario')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={5} lg={4}>
            <Card className="auth-card shadow-lg">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img src="/logo-icon.svg" alt="SportClub" height="56" className="auth-logo mb-2" />
                  <h3 className="fw-bold text-purple">SportClub</h3>
                  <p className="text-muted small">Club deportivo — Iniciar sesión</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Correo electrónico</Form.Label>
                    <Form.Control
                      type="email" placeholder="ejemplo@correo.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Contraseña</Form.Label>
                    <Form.Control
                      type="password" placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="gold" type="submit" className="w-100 mb-3" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Ingresar'}
                  </Button>
                </Form>

                <div className="text-center small">
                  <Link to="/register" className="text-purple">Crear cuenta</Link>
                  <span className="mx-2 text-muted">|</span>
                  <Link to="/recover" className="text-purple">¿Olvidaste tu contraseña?</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
