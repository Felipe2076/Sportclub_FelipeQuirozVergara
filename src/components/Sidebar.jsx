import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { authService } from '../services/authService'

const menu = {
  Admin: [
    { to: '/dashboard/admin', icon: 'M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z', label: 'Panel' },
    { to: '/dashboard/admin/usuarios', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', label: 'Usuarios' },
  ],
  Coach: [
    { to: '/dashboard/coach', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6 4v4m0 0v4m0-4h4m-4 0h-4', label: 'Alumnos' },
    { to: '/dashboard/coach/clases', icon: 'M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z', label: 'Clases' },
  ],
  User: [
    { to: '/dashboard/usuario', icon: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z', label: 'Perfil' },
    { to: '/dashboard/usuario/reservas', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z', label: 'Reservas' },
  ],
}

const roleColors = { Admin: '#c0392b', Coach: '#27ae60', User: '#2980b9' }

export default function Sidebar() {
  const user = authService.getUser()
  const items = menu[user?.role] || menu.User
  const color = roleColors[user?.role] || '#2980b9'

  return (
    <div className="sidebar d-flex flex-column py-3" style={{
      width: 60, background: '#1a0f2a', borderRight: '1px solid rgba(242,183,5,0.15)',
      minHeight: 'calc(100vh - 56px)',
    }}>
      <Nav className="flex-column align-items-center gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-btn d-flex align-items-center justify-content-center rounded-3 p-2 ${isActive ? 'active' : ''}`
            }
            style={({ isActive }) => ({
              width: 42, height: 42,
              background: isActive ? color : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s',
            })}
            title={item.label}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
          </NavLink>
        ))}
      </Nav>
    </div>
  )
}
