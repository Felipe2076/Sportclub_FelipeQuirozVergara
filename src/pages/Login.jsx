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
        <Row className="justify-content-center w-100 mx-0">
          <Col md={5} lg={4}>
            <Card className="auth-card">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <img src="/logo-icon.svg" alt="SportClub" height="60" className="auth-logo mb-3" />
                  <h2 className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>SportClub</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 2 }}>Club deportivo — Iniciar sesión</p>
                </div>

                {error && <Alert variant="danger" className="py-2 small" style={{ borderRadius: 10, background: 'rgba(192,64,96,0.15)', border: '1px solid rgba(192,64,96,0.3)', color: '#f0a0b0' }}>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </Form.Group>

                  <Button variant="" type="submit" className="btn-gold w-100 mb-3" disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : 'Ingresar'}
                  </Button>
                </Form>

                <div className="text-center small" style={{ color: 'var(--text-muted)' }}>
                  <Link to="/register" style={{ color: 'var(--gold)' }}>Crear cuenta</Link>
                  <span className="mx-2">·</span>
                  <Link to="/recover" style={{ color: 'var(--gold)' }}>¿Olvidaste tu contraseña?</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
