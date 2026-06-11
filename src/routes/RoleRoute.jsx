import { Navigate } from 'react-router-dom'
import { authService } from '../services/authService'

const roleRoutes = {
  Admin: '/dashboard/admin',
  Coach: '/dashboard/coach',
  User: '/dashboard/usuario',
}

export default function RoleRoute({ children, role }) {
  const user = authService.getUser()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={roleRoutes[user.role] || '/login'} replace />
  return children
}
