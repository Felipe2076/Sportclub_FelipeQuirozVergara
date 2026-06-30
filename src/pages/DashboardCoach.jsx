import { useEffect, useState, useCallback } from 'react'
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../components/DashboardLayout'
import { UsersIcon, DumbbellIcon, TrophyIcon, ClockIcon, BookIcon, CalendarIcon } from '../components/Icons'
import api from '../services/api'

const accent = 'var(--coach-color)'
const coachGreen = '#3daa7a'
const pieColors = ['#3daa7a', '#45b888', '#50c898', '#f0c040']
const daysMap = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' }

const sampleBarData = [
  { name: 'Ana G.', rendimiento: 92 }, { name: 'Mateo D.', rendimiento: 78 },
  { name: 'Valentina R.', rendimiento: 65 }, { name: 'Carlos M.', rendimiento: 88 },
  { name: 'Sofía L.', rendimiento: 95 },
]
const samplePieData = [
  { name: 'Funcional', value: 40 }, { name: 'CrossFit', value: 25 },
  { name: 'Spinning', value: 20 }, { name: 'Yoga', value: 15 },
]

export default function DashboardCoach() {
  const [athletes] = useState([])
  const [classes, setClasses] = useState([])
  const [schedules, setSchedules] = useState([])
  const [stats, setStats] = useState({ total_classes: 0, total_schedules: 0, total_rooms: 0 })

  const loadData = useCallback(async () => {
    try {
      const [dashRes, classesRes, schedRes] = await Promise.all([
        api.get('/coach/dashboard'),
        api.get('/coach/my-classes').catch(() => ({ data: { data: [] } })),
        api.get('/coach/my-schedules').catch(() => ({ data: { data: [] } })),
      ])
      const dashData = dashRes.data.data || {}
      setStats({
        total_classes: dashData.total_classes || 0,
        total_schedules: dashData.total_schedules || 0,
        total_rooms: dashData.total_rooms || 0,
      })
      const clsData = classesRes.data.data || []
      setClasses(clsData)
      const schedData = schedRes.data.data || []
      setSchedules(schedData)
    } catch (err) {
      Swal.fire('Error', 'No se pudieron cargar los datos del coach', 'error')
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const dashboardStats = [
    { icon: <UsersIcon size={22} />, label: 'Alumnos activos', value: String(athletes.length || 4), color: accent },
    { icon: <DumbbellIcon size={22} />, label: 'Clases semanales', value: String(stats.total_classes || 6), color: '#45b888' },
    { icon: <TrophyIcon size={22} />, label: 'Rendimiento', value: '87%', color: 'var(--gold)' },
    { icon: <ClockIcon size={22} />, label: 'Horarios activos', value: String(stats.total_schedules || 12), color: '#40b898' },
  ]

  const hardcodedClasses = [
    { sport: { name: 'Funcional' }, schedules: [{ day_of_week: 2, start_time: '19:00' }] },
    { sport: { name: 'CrossFit' }, schedules: [{ day_of_week: 4, start_time: '18:00' }] },
    { sport: { name: 'Spinning' }, schedules: [{ day_of_week: 6, start_time: '10:00' }] },
  ]
  const hardcodedSchedules = [
    { day_of_week: 1, start_time: '18:00', end_time: '20:00' },
    { day_of_week: 2, start_time: '07:00', end_time: '09:00' },
    { day_of_week: 3, start_time: '18:00', end_time: '20:00' },
    { day_of_week: 4, start_time: '07:00', end_time: '09:00' },
    { day_of_week: 6, start_time: '10:00', end_time: '12:00' },
  ]

  const displayClasses = classes.length > 0 ? classes : hardcodedClasses
  const displaySchedules = schedules.length > 0 ? schedules : hardcodedSchedules

  return (
    <DashboardLayout>
      <div className="dash-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="dash-title" style={{ color: accent }}>Panel del Coach</h2>
          <p className="dash-subtitle">Gestión de alumnos, clases y rendimiento</p>
        </div>
        <Button variant="" className="btn-outline-gold btn-sm" onClick={loadData}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Refrescar
        </Button>
      </div>

      <Row className="g-3 mb-4">
        {dashboardStats.map((s) => (
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
                <BarChart data={sampleBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} layout="vertical">
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
                  <Pie data={samplePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3}>
                    {samplePieData.map((_, i) => (
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
                {samplePieData.map((p, i) => (
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
                  {displayClasses.map((c, i) => {
                    const sched = c.schedules && c.schedules[0]
                    const dayName = sched ? daysMap[sched.day_of_week] || '-' : '-'
                    const time = sched ? sched.start_time?.slice(0, 5) : '-'
                    return (
                      <tr key={c.id || i}>
                        <td>{c.sport?.name || c.name || 'Clase'}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{`${dayName} ${time}`}</td>
                      </tr>
                    )
                  })}
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
                  {displaySchedules.map((s, i) => {
                    const dayName = daysMap[s.day_of_week] || '?'
                    const start = s.start_time?.slice(0, 5)
                    const end = s.end_time?.slice(0, 5)
                    return (
                      <tr key={i}>
                        <td>{dayName}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{`${start} — ${end}`}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
