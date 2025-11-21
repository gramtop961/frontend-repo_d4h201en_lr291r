import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './AuthPage'
import { AdminDashboard, DoctorDashboard, ReceptionistDashboard, PatientDashboard } from './Dashboards'

function ProtectedRoute({ children, roles }){
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('authRole')
  if(!token) return <Navigate to="/auth" replace />
  if(roles && !roles.includes(role)) return <Navigate to="/auth" replace />
  return children
}

export default function LayoutRoutes(){
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/doctor" element={<ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/receptionist" element={<ProtectedRoute roles={['receptionist']}><ReceptionistDashboard /></ProtectedRoute>} />
      <Route path="/patient" element={<ProtectedRoute roles={['patient','doctor','receptionist','admin']}><PatientDashboard /></ProtectedRoute>} />
    </Routes>
  )
}
