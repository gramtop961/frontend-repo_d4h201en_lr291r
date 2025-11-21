import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Test from './Test'
import AuthPage from './components/AuthPage'
import { AdminDashboard, DoctorDashboard, ReceptionistDashboard, PatientDashboard } from './components/Dashboards'
import './index.css'

function ProtectedRoute({ children, roles }){
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('authRole')
  if(!token) return (<div className="min-h-screen flex items-center justify-center text-white bg-slate-900">Redirecting...</div>)
  if(roles && !roles.includes(role)) return (<div className="min-h-screen flex items-center justify-center text-white bg-slate-900">Unauthorized</div>)
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/doctor" element={<ProtectedRoute roles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/receptionist" element={<ProtectedRoute roles={["receptionist"]}><ReceptionistDashboard /></ProtectedRoute>} />
        <Route path="/patient" element={<ProtectedRoute roles={["patient","doctor","receptionist","admin"]}><PatientDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
