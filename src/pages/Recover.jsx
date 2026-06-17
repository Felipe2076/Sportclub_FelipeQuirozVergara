import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

export default function Recover() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) setSent(true)
  }

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center w-100 mx-0">
          <Col md={5} lg={4}>
            <Card className="auth-card">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <img src="/logo-icon.svg" alt="SportClub" height="48" className="auth-logo mb-2" />
                  <h2 className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: '1.3rem' }}>Recuperar contraseña</h2>
                </div>

                {sent ? (
                  <Alert variant="" style={{ borderRadius: 12, background: 'rgba(61,170,122,0.15)', border: '1px solid rgba(61,170,122,0.3)', color: '#a0e0c0' }}>
                    <p className="fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>Correo enviado</p>
                    <small>Si la cuenta existe, recibirás instrucciones en {email}</small>
                  </Alert>
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
