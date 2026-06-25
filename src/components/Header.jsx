import { useNavigate } from 'react-router-dom'
import { Navbar, Container, Dropdown, Badge } from 'react-bootstrap'
import { authService } from '../services/authService'

const roleConfig = {
  Admin: { label: 'ADMIN PANEL', color: 'var(--admin-color)', badge: 'danger' },
  Coach: { label: 'COACH PANEL', color: 'var(--coach-color)', badge: 'success' },
  User: { label: 'MI CUENTA', color: 'var(--user-color)', badge: 'primary' },
}

export default function Header() {
  const navigate = useNavigate()
  const user = authService.getUser()
  const cfg = roleConfig[user?.role] || roleConfig.User
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <Navbar className="navbar-glass px-3" sticky="top">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center gap-2 fw-bold" style={{ letterSpacing: 1, color: 'var(--text-primary)' }}>
          <span className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: 32, height: 32, background: 'rgba(240,192,64,0.12)', border: '1px solid rgba(240,192,64,0.2)' }}>
            <img src="/logo-nuevo.png" alt="" width="24" height="24" style={{ objectFit: 'contain' }} />
          </span>
          {cfg.label}
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-3">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{user?.email}</span>
          <Dropdown align="end">
            <Dropdown.Toggle variant="" size="sm" className="d-flex align-items-center gap-2 border-0 p-1"
              style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
              <span className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold"
                style={{ width: 30, height: 30, background: cfg.color, fontSize: 11, color: '#fff' }}>
                {initials}
              </span>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.82rem' }}>{user?.name}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                <Badge bg={cfg.badge} className="me-1">{user?.role}</Badge> {user?.email}
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item className="small" style={{ color: 'var(--text-secondary)' }} onClick={() => navigate('/dashboard/perfil')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Editar perfil
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="small" style={{ color: 'var(--admin-color)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  )
}
