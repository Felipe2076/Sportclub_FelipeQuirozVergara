import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Recover from './pages/Recover'
import DashboardUsuario from './pages/DashboardUsuario'
import DashboardCoach from './pages/DashboardCoach'
import DashboardAdmin from './pages/DashboardAdmin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
