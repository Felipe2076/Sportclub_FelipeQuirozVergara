import { useEffect, useState } from 'react'
import { Row, Col, Card, Table, Badge, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DashboardLayout from '../components/DashboardLayout'
import { CalendarIcon, DumbbellIcon, ClockIcon, FlameIcon, TrophyIcon, ListIcon } from '../components/Icons'
import api from '../services/api'

const accent = 'var(--user-color)'
const userBlue = '#5a90d0'
const barData = [
  { day: 'Lun', hours: 1.5 }, { day: 'Mar', hours: 2 }, { day: 'Mié', hours: 0.5 },
  { day: 'Jue', hours: 1.5 }, { day: 'Vie', hours: 2 }, { day: 'Sáb', hours: 1 }, { day: 'Dom', hours: 0 },
]

export default function DashboardUsuario() {
  const [classes, setClasses] = useState([])
  const [reservations, setReservations] = useState([])

  const loadData = async () => {
    try {
      const [clsRes, resRes] = await Promise.all([
        api.get('/class-schedules'),
        api.get('/reservations'),
      ])
      
      const clsData = clsRes.data.data || []
      const resData = resRes.data.data || []
      
      // Map the class-schedules to the expected format for the table
      // Since class-schedules is a schedule and not a sport-based class, we'll mock it.
      const mappedClasses = clsData.map(c => ({
        id: c.id,
        name: 'Sesión de Entrenamiento',
        schedule: 'Horario definido',
        coach: 'Coach',
        capacity: 10,
        vacants: 5
      }))

      setClasses(mappedClasses)
      setReservations(resData)
    } catch (err) { 
      console.error("Error loading data:", err)
    }
  }

  useEffect(() => { loadData() }, [])

  const userClassIds = reservations.map((r) => r.classId)

  const pieData = [
    { name: 'Confirmadas', value: reservations.filter((r) => r.status === 'confirmed').length },
    { name: 'Pendientes', value: reservations.filter((r) => r.status !== 'confirmed').length },
  ]
  const pieColors = ['#3daa7a', '#f0c040']

  const handleReserve = async (classId) => {
    const result = await Swal.fire({
      title: '¿Reservar esta clase?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, reservar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3daa7a',
    })
    if (!result.isConfirmed) return

    try {
      await api.post('/reservations', { classId })
      Swal.fire('Reservada', 'Clase reservada exitosamente', 'success')
      loadData()
    } catch (e) {
      Swal.fire('Error', e.response?.data?.message || e.message, 'error')
    }
  }

  const handleCancel = async (reservationId) => {
    const result = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: 'Esta accion no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
      confirmButtonColor: '#d33',
    })
    if (!result.isConfirmed) return

    try {
      await api.delete(`/reservations/${reservationId}`)
      Swal.fire('Cancelada', 'Reserva cancelada exitosamente', 'success')
      loadData()
    } catch (e) {
      Swal.fire('Error', e.response?.data?.message || e.message, 'error')
    }
  }

  const stats = [
    { icon: <CalendarIcon size={22} />, label: 'Reservas activas', value: String(reservations.length), color: accent },
    { icon: <DumbbellIcon size={22} />, label: 'Entrenamientos', value: '8', color: 'var(--coach-color)' },
    { icon: <ClockIcon size={22} />, label: 'Horas este mes', value: '24', color: 'var(--gold)' },
    { icon: <FlameIcon size={22} />, label: 'Racha actual', value: '5 días', color: 'var(--admin-color)' },
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
            <Card.Header style={{ color: accent, background: 'rgba(90,144,208,0.08)' }}>
              <DumbbellIcon size={14} /> Actividad Semanal
            </Card.Header>
            <Card.Body style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" stroke="#8a96b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#8a96b8" tick={{ fontSize: 12 }} unit="h" />
                  <Tooltip
                    contentStyle={{ background: '#2e3a70', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13 }}
                    labelStyle={{ color: '#eef0f8' }}
                  />
                  <Bar dataKey="hours" fill={userBlue} radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(90,144,208,0.08)' }}>
              <CalendarIcon size={14} /> Estado de Reservas
            </Card.Header>
            <Card.Body style={{ height: 260, position: 'relative' }} className="d-flex align-items-center justify-content-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={45}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#2e3a70', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13 }}
                    labelStyle={{ color: '#eef0f8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#eef0f8', lineHeight: 1 }}>{reservations.length}</div>
                <div style={{ color: '#8a96b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1 }}>Total</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={6}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(90,144,208,0.08)' }}>
              <ListIcon size={14} /> Mis Reservas
            </Card.Header>
            <Card.Body className="p-0">
              {reservations.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No tienes reservas activas
                </div>
              ) : (
                <Table className="mb-0 small" variant="dark">
                  <thead><tr><th>Clase</th><th>Horario</th><th>Estado</th><th className="text-center">Acción</th></tr></thead>
                  <tbody>
                    {reservations.map((r) => (
                      <tr key={r.id}>
                        <td className="fw-medium">{r.className || 'Clase'}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{r.schedule || '-'}</td>
                        <td><Badge bg="success">Confirmada</Badge></td>
                        <td className="text-center">
                          <Button
                            variant=""
                            size="sm"
                            style={{ padding: '0.2rem 0.5rem', color: 'var(--admin-color)', border: '1px solid var(--admin-color)', background: 'transparent', borderRadius: 8, fontSize: '0.7rem' }}
                            onClick={() => handleCancel(r.id)}
                          >
                            Cancelar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="list-card">
            <Card.Header style={{ color: accent, background: 'rgba(90,144,208,0.08)' }}>
              <DumbbellIcon size={14} /> Clases Disponibles
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0 small" variant="dark">
                <thead><tr><th>Clase</th><th>Horario</th><th>Coach</th><th>Vacantes</th><th className="text-center">Acción</th></tr></thead>
                <tbody>
                  {classes.map((c) => {
                    const alreadyReserved = userClassIds.includes(c.id)
                    const isFull = c.vacants <= 0
                    return (
                      <tr key={c.id}>
                        <td className="fw-medium">{c.name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{c.schedule}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{c.coach}</td>
                        <td><Badge bg={isFull ? 'danger' : 'info'}>{isFull ? 'Lleno' : c.vacants}</Badge></td>
                        <td className="text-center">
                          {alreadyReserved ? (
                            <Badge bg="success" style={{ fontSize: '0.65rem' }}>Reservado</Badge>
                          ) : isFull ? (
                            <Badge bg="secondary" style={{ fontSize: '0.65rem' }}>Sin cupo</Badge>
                          ) : (
                            <Button
                              variant=""
                              size="sm"
                              className="btn-outline-gold"
                              style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
                              onClick={() => handleReserve(c.id)}
                            >
                              Reservar
                            </Button>
                          )}
                        </td>
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
