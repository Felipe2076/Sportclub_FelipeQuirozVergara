import { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Badge } from 'react-bootstrap'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../components/DashboardLayout'
import { UsersIcon, DumbbellIcon, TrophyIcon, ClockIcon, BookIcon, CalendarIcon } from '../components/Icons'
import api from '../services/api'

const accent = 'var(--coach-color)'
const coachGreen = '#3daa7a'
const barData = [
  { name: 'Ana G.', rendimiento: 92 }, { name: 'Mateo D.', rendimiento: 78 },
  { name: 'Valentina R.', rendimiento: 65 }, { name: 'Carlos M.', rendimiento: 88 },
  { name: 'Sofía L.', rendimiento: 95 },
]
const pieData = [
  { name: 'Funcional', value: 40 }, { name: 'CrossFit', value: 25 },
  { name: 'Spinning', value: 20 }, { name: 'Yoga', value: 15 },
]
const pieColors = ['#3daa7a', '#45b888', '#50c898', '#f0c040']

export default function DashboardCoach() {
  const [athletes, setAthletes] = useState([])

  useEffect(() => {
    api.get('/coach/dashboard').then(({ data }) => {
      if (data.athletes) setAthletes(data.athletes)
    }).catch(() => {})
  }, [])

  const stats = [
    { icon: <UsersIcon size={22} />, label: 'Alumnos activos', value: String(athletes.length || 4), color: accent },
    { icon: <DumbbellIcon size={22} />, label: 'Clases semanales', value: '6', color: '#45b888' },
    { icon: <TrophyIcon size={22} />, label: 'Rendimiento', value: '87%', color: 'var(--gold)' },
    { icon: <ClockIcon size={22} />, label: 'Sesiones esta semana', value: '12', color: '#40b898' },
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
                <span style={{ fontSize: 22, lineHeight: 1, color: s.color }}>{s.icon}</span>
                <div>
                  <div className="fw-bold fs-4" style={{ color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.label}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
        <Col md={7}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(61,170,122,0.08)' }}>
              <TrophyIcon size={14} /> Rendimiento de Alumnos
            </Card.Header>
            <Card.Body style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" stroke="#8a96b8" tick={{ fontSize: 12 }} unit="%" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="#8a96b8" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip
                    contentStyle={{ background: '#2e3a70', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13 }}
                    labelStyle={{ color: '#eef0f8' }}
                     formatter={(v) => [`${v}%`, 'Rendimiento']}
                  />
                  <Bar dataKey="rendimiento" fill={coachGreen} radius={[0, 6, 6, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(61,170,122,0.08)' }}>
              <DumbbellIcon size={14} /> Distribución de Clases
            </Card.Header>
            <Card.Body style={{ height: 260 }} className="d-flex align-items-center justify-content-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#2e3a70', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13 }}
                    labelStyle={{ color: '#eef0f8' }}
                     formatter={(v) => [`${v}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', bottom: 16, left: 0, right: 0 }}>
                {pieData.map((p, i) => (
                  <div key={p.name} className="d-flex align-items-center gap-1" style={{ fontSize: '0.7rem', color: '#c0caec' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: pieColors[i], display: 'inline-block' }} />
                    {p.name} {p.value}%
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={7}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(61,170,122,0.08)' }}>
              <UsersIcon size={14} /> Mis Alumnos
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Nombre</th><th>Email</th><th>Estado</th></tr></thead>
                <tbody>
                  {athletes.length > 0 ? athletes.map((a) => (
                    <tr key={a.id || a._id}>
                      <td className="fw-medium">{a.full_name || a.name}</td>
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
              <BookIcon size={14} /> Clases Asignadas
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
              <CalendarIcon size={14} /> Mi Horario
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
