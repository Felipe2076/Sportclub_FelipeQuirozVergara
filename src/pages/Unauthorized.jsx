import { Link } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import { authService } from '../services/authService'

const roleRoutes = { Admin: '/dashboard/admin', Coach: '/dashboard/coach', User: '/dashboard/usuario' }

export default function Unauthorized() {
  const user = authService.getUser()
  const fallback = user ? roleRoutes[user.role] || '/dashboard/usuario' : '/login'

  return (
    <div style={{ background: 'linear-gradient(rgba(26,38,80,0.88), rgba(18,26,62,0.82)), url(/dashboard-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container className="text-center">
        <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--admin-color)', lineHeight: 1 }}>403</div>
        <h2 style={{ color: '#e8e0f4', marginTop: '0.5rem' }}>Acceso denegado</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 400, margin: '0.5rem auto 1.5rem' }}>
          No tienes permisos suficientes para acceder a esta página.
        </p>
        <Link to={fallback}>
          <Button variant="" className="btn-gold">
            Volver a mi panel
          </Button>
        </Link>
      </Container>
    </div>
  )
}
