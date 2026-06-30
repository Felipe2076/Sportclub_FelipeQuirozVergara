import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { authService } from '../services/authService'

const roleRedirect = { Admin: '/dashboard/admin', Coach: '/dashboard/coach', User: '/dashboard/usuario' }

export default function Recover() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = authService.getUser()
    if (user) navigate(roleRedirect[user.role] || '/dashboard/usuario', { replace: true })
  }, [navigate])

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSent(true)
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: `Si la cuenta existe, recibirás instrucciones en ${email}`,
        confirmButtonColor: '#f0c040',
      })
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
                                  <span className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" style={{ width: 60, height: 60, background: 'rgba(240,192,64,0.1)', border: '2px solid rgba(240,192,64,0.2)' }}>
                  <img src="/logo-nuevo.png" alt="SportClub" height="38" className="auth-logo" style={{ borderRadius: 6, objectFit: 'contain' }} />
                </span>
                  <h2 className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>Recuperar contraseña</h2>
                </div>

                {sent ? (
                  <div className="text-center">
                    <p style={{ color: 'var(--coach-color)', fontSize: '0.9rem' }}>Correo enviado correctamente</p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                      Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
                    </p>
                    <Form.Group className="mb-4">
                      <Form.Label>Correo electrónico</Form.Label>
                      <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required />
                    </Form.Group>
                    <Button variant="" type="submit" className="btn-gold w-100 mb-3">Enviar instrucciones</Button>
                  </Form>
                )}

                <div className="text-center small">
                  <Link to="/login" style={{ color: 'var(--gold)' }}>Volver a inicio de sesión</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
