import { useNavigate } from 'react-router-dom'
import { Navbar, Container, Nav, Badge, Button, Dropdown } from 'react-bootstrap'
import { authService } from '../services/authService'

const roleConfig = {
  Admin: { label: 'ADMIN PANEL', color: '#c0392b', bg: '#2E1A47' },
  Coach: { label: 'COACH PANEL', color: '#27ae60', bg: '#1a3a2a' },
  User: { label: 'MI CUENTA', color: '#2980b9', bg: '#1a2a3a' },
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
    <Navbar style={{ background: cfg.bg }} variant="dark" className="px-3 shadow-sm" sticky="top">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center gap-2 fw-bold" style={{ letterSpacing: 1 }}>
          <img src="/logo-icon.svg" alt="" width="28" height="28" />
          {cfg.label}
        </Navbar.Brand>

        <div className="d-flex align-items-center gap-3">
          <span className="text-white-50 small">{user?.email}</span>
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-light" size="sm" className="d-flex align-items-center gap-2 border-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <span className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold"
                style={{ width: 28, height: 28, background: cfg.color, fontSize: 11, color: '#fff' }}>
                {initials}
              </span>
              <span className="small">{user?.name}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className="small"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Editar perfil</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="small text-danger">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  )
}
