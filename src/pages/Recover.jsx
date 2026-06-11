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
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={5} lg={4}>
            <Card className="auth-card shadow-lg">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <img src="/logo-icon.svg" alt="SportClub" height="48" className="auth-logo mb-2" />
                  <h4 className="fw-bold text-purple">Recuperar contraseña</h4>
                </div>

                {sent ? (
                  <Alert variant="success" className="text-center">
                    <p className="mb-1 fw-semibold">Correo enviado</p>
                    <small>Si la cuenta existe, recibirás instrucciones en {email}</small>
                  </Alert>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <p className="text-muted small mb-3">
                      Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
                    </p>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-semibold">Correo electrónico</Form.Label>
                      <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required />
                    </Form.Group>
                    <Button variant="gold" type="submit" className="w-100 mb-3">Enviar instrucciones</Button>
                  </Form>
                )}

                <div className="text-center small">
                  <Link to="/login" className="text-purple">Volver a inicio de sesión</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
