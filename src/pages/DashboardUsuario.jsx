import { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Badge } from 'react-bootstrap'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

const accent = 'var(--user-color)'

export default function DashboardUsuario() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => setData(data)).catch(() => {})
  }, [])

  const stats = [
    { icon: '📅', label: 'Reservas activas', value: '3', color: accent },
    { icon: '🏋️', label: 'Entrenamientos', value: '8', color: 'var(--coach-color)' },
    { icon: '⏱️', label: 'Horas este mes', value: '24', color: 'var(--gold)' },
    { icon: '🔥', label: 'Racha actual', value: '5 días', color: 'var(--admin-color)' },
  ]

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h2 className="dash-title" style={{ color: accent }}>Mi Panel</h2>
        <p className="dash-subtitle">Bienvenido a tu espacio de entrenamiento</p>
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
        <Col md={6}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(74,128,192,0.08)' }}>
              📋 Mis Reservas
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Fecha</th><th>Hora</th><th>Actividad</th><th>Estado</th></tr></thead>
                <tbody>
                  <tr><td>12/06</td><td>18:00</td><td>Funcional</td><td><Badge bg="success">Confirmada</Badge></td></tr>
                  <tr><td>14/06</td><td>07:00</td><td>Yoga</td><td><Badge bg="warning" text="dark">Pendiente</Badge></td></tr>
                  <tr><td>17/06</td><td>19:00</td><td>CrossFit</td><td><Badge bg="success">Confirmada</Badge></td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(74,128,192,0.08)' }}>
              🏆 Clases Disponibles
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Clase</th><th>Horario</th><th>Coach</th><th>Vacantes</th></tr></thead>
                <tbody>
                  <tr><td>Funcional</td><td>Mar 19:00</td><td>Coach Diego</td><td><Badge bg="info">5</Badge></td></tr>
                  <tr><td>CrossFit</td><td>Jue 18:00</td><td>Coach Diego</td><td><Badge bg="info">3</Badge></td></tr>
                  <tr><td>Spinning</td><td>Sáb 10:00</td><td>Coach Ana</td><td><Badge bg="danger">Lleno</Badge></td></tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
