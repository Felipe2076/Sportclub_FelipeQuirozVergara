import { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Badge } from 'react-bootstrap'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

const accent = 'var(--coach-color)'

export default function DashboardCoach() {
  const [athletes, setAthletes] = useState([])

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => {
      if (data.athletes) setAthletes(data.athletes)
    }).catch(() => {})
  }, [])

  const stats = [
    { icon: '👨‍🏫', label: 'Alumnos activos', value: String(athletes.length || 4), color: accent },
    { icon: '🏋️', label: 'Clases semanales', value: '6', color: '#45b888' },
    { icon: '🏆', label: 'Rendimiento', value: '87%', color: 'var(--gold)' },
    { icon: '⏰', label: 'Sesiones esta semana', value: '12', color: '#40b898' },
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="dash-title" style={{ color: accent }}>Panel del Coach</h2>
        <p className="dash-subtitle">Gestión de alumnos, clases y rendimiento</p>
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
        <Col md={7}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(61,170,122,0.08)' }}>
              👥 Mis Alumnos
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Nombre</th><th>Email</th><th>Estado</th></tr></thead>
                <tbody>
                  {athletes.length > 0 ? athletes.map((a) => (
                    <tr key={a.id || a._id}>
                      <td className="fw-medium">{a.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{a.email}</td>
                      <td><Badge bg="success">{a.status || 'Activo'}</Badge></td>
                    </tr>
                  )) : (
                    <>
                      <tr><td>Ana García</td><td style={{ color: 'var(--text-secondary)' }}>ana@email.com</td><td><Badge bg="success">Activo</Badge></td></tr>
                      <tr><td>Mateo Díaz</td><td style={{ color: 'var(--text-secondary)' }}>mateo@email.com</td><td><Badge bg="success">Activo</Badge></td></tr>
                      <tr><td>Valentina Rojas</td><td style={{ color: 'var(--text-secondary)' }}>valentina@email.com</td><td><Badge bg="warning" text="dark">En pausa</Badge></td></tr>
                    </>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="list-card mb-3">
            <Card.Header style={{ color: accent, background: 'rgba(61,170,122,0.08)' }}>
              📚 Clases Asignadas
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Clase</th><th>Horario</th></tr></thead>
                <tbody>
                  <tr><td>Funcional</td><td>Mar 19:00</td></tr>
                  <tr><td>CrossFit</td><td>Jue 18:00</td></tr>
                  <tr><td>Spinning</td><td>Sáb 10:00</td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(61,170,122,0.08)' }}>
              📅 Mi Horario
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Día</th><th>Horario</th></tr></thead>
                <tbody>
                  <tr><td>Lunes</td><td>18:00 — 20:00</td></tr>
                  <tr><td>Martes</td><td>07:00 — 09:00</td></tr>
                  <tr><td>Miércoles</td><td>18:00 — 20:00</td></tr>
                  <tr><td>Jueves</td><td>07:00 — 09:00</td></tr>
                  <tr><td>Sábado</td><td>10:00 — 12:00</td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
