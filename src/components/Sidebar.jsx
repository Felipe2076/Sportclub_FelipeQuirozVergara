import { NavLink, useNavigate } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { authService } from '../services/authService'

const roleLinks = {
  Admin: [
    { to: '/dashboard/admin', icon: 'M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z', label: 'Panel' },
    { to: '/dashboard/perfil', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', label: 'Perfil' },
  ],
  Coach: [
    { to: '/dashboard/coach', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6 4v4m0 0v4m0-4h4m-4 0h-4', label: 'Panel' },
    { to: '/dashboard/perfil', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', label: 'Perfil' },
  ],
  User: [
    { to: '/dashboard/usuario', icon: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z', label: 'Panel' },
    { to: '/dashboard/perfil', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', label: 'Perfil' },
  ],
}

export default function Sidebar() {
  const navigate = useNavigate()
  const user = authService.getUser()
  const links = roleLinks[user?.role] || roleLinks.User

  return (
    <div className="sidebar-glass d-flex flex-column py-3 align-items-center" style={{
      width: 60, minHeight: 'calc(100vh - 56px)',
    }}>
      <Nav className="flex-column align-items-center gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
            title={link.label}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={link.icon} />
            </svg>
          </NavLink>
        ))}
        <button
          className="sidebar-btn"
          title="Cerrar sesión"
          onClick={() => { authService.logout(); navigate('/login') }}
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </Nav>
    </div>
  )
}
