import { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Badge } from 'react-bootstrap'
import DashboardLayout from '../components/DashboardLayout'
import api from '../services/api'

export default function DashboardCoach() {
  const [athletes, setAthletes] = useState([])

  useEffect(() => {
    api.get('/dashboard').then(({ data }) => {
      if (data.athletes) setAthletes(data.athletes)
    }).catch(() => {})
  }, [])

  return (
    <DashboardLayout>
      <div className="dash-header mb-4">
        <h3 className="fw-bold" style={{ color: '#27ae60' }}>Panel del Coach</h3>
        <p className="text-white-50 small">Gestión de alumnos, clases y rendimiento</p>
      </div>

      <Row className="g-3 mb-4">
        {[
          { icon: '👨‍🏫', label: 'Alumnos activos', value: String(athletes.length || 4), color: '#27ae60' },
          { icon: '🏋️', label: 'Clases semanales', value: '6', color: '#2ecc71' },
          { icon: '🏆', label: 'Rendimiento', value: '87%', color: '#f1c40f' },
          { icon: '⏰', label: 'Sesiones esta semana', value: '12', color: '#1abc9c' },
        ].map((s) => (
          <Col key={s.label} md={3}>
            <Card className="stat-card h-100" style={{ borderLeft: `4px solid ${s.color}`, background: 'rgba(39,174,96,0.05)' }}>
              <Card.Body className="d-flex align-items-center gap-3">
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <div>
                  <div className="fw-bold fs-4" style={{ color: s.color }}>{s.value}</div>
                  <div className="small text-white-50">{s.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        <Col md={7}>
          <Card className="list-card" style={{ background: 'rgba(39,174,96,0.03)' }}>
            <Card.Header className="fw-semibold small" style={{ background: 'rgba(39,174,96,0.1)', color: '#27ae60', borderBottom: '1px solid rgba(39,174,96,0.2)' }}>
              👥 Mis Alumnos
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Nombre</th><th>Email</th><th>Estado</th></tr></thead>
                <tbody>
                  {athletes.length > 0 ? athletes.map((a) => (
                    <tr key={a.id || a._id}>
                      <td className="fw-medium">{a.name}</td>
                      <td className="text-white-50">{a.email}</td>
                      <td><Badge bg="success">{a.status || 'Activo'}</Badge></td>
                    </tr>
                  )) : (
                    <>
                      <tr><td>Ana García</td><td className="text-white-50">ana@email.com</td><td><Badge bg="success">Activo</Badge></td></tr>
                      <tr><td>Mateo Díaz</td><td className="text-white-50">mateo@email.com</td><td><Badge bg="success">Activo</Badge></td></tr>
                      <tr><td>Valentina Rojas</td><td className="text-white-50">valentina@email.com</td><td><Badge bg="warning" text="dark">En pausa</Badge></td></tr>
                    </>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="list-card mb-3" style={{ background: 'rgba(39,174,96,0.03)' }}>
            <Card.Header className="fw-semibold small" style={{ background: 'rgba(39,174,96,0.1)', color: '#27ae60', borderBottom: '1px solid rgba(39,174,96,0.2)' }}>
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

          <Card className="list-card" style={{ background: 'rgba(39,174,96,0.03)' }}>
            <Card.Header className="fw-semibold small" style={{ background: 'rgba(39,174,96,0.1)', color: '#27ae60', borderBottom: '1px solid rgba(39,174,96,0.2)' }}>
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
