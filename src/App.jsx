import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'
import { authService } from './services/authService'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Recover from './pages/Recover'
import DashboardUsuario from './pages/DashboardUsuario'
import DashboardCoach from './pages/DashboardCoach'
import DashboardAdmin from './pages/DashboardAdmin'
import EditProfile from './pages/EditProfile'
import Unauthorized from './pages/Unauthorized'

const roleDefault = { Admin: '/dashboard/admin', Coach: '/dashboard/coach', User: '/dashboard/usuario' }

function HomeRoute() {
  const user = authService.getUser()
  if (user) return <Navigate to={roleDefault[user.role] || '/dashboard/usuario'} replace />
  return <Landing />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover" element={<Recover />} />

        <Route path="/dashboard/usuario" element={
          <ProtectedRoute><RoleRoute role="User"><DashboardUsuario /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/dashboard/coach" element={
          <ProtectedRoute><RoleRoute role="Coach"><DashboardCoach /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/dashboard/admin" element={
          <ProtectedRoute><RoleRoute role="Admin"><DashboardAdmin /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/dashboard/perfil" element={
          <ProtectedRoute><EditProfile /></ProtectedRoute>
        } />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<HomeRoute />} />
      </Routes>
    </BrowserRouter>
  )
}
