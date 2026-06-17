import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { authService } from '../services/authService'

const singleLink = {
  Admin: { to: '/dashboard/admin', icon: 'M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z', label: 'Panel' },
  Coach: { to: '/dashboard/coach', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6 4v4m0 0v4m0-4h4m-4 0h-4', label: 'Alumnos' },
  User: { to: '/dashboard/usuario', icon: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z', label: 'Perfil' },
}

export default function Sidebar() {
  const user = authService.getUser()
  const link = singleLink[user?.role] || singleLink.User

  return (
    <div className="sidebar-glass d-flex flex-column py-3 align-items-center" style={{
      width: 60, minHeight: 'calc(100vh - 56px)',
    }}>
      <Nav className="flex-column align-items-center gap-2">
        <NavLink
          to={link.to}
          className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
          title={link.label}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={link.icon} />
          </svg>
        </NavLink>
      </Nav>
    </div>
  )
}
