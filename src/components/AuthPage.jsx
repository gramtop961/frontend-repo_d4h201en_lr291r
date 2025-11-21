import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const existingToken = localStorage.getItem('authToken')
    const existingRole = localStorage.getItem('authRole')
    if (existingToken && existingRole) {
      redirectByRole(existingRole)
    }
  }, [])

  const redirectByRole = (r) => {
    if (r === 'admin') navigate('/admin')
    else if (r === 'doctor') navigate('/doctor')
    else if (r === 'receptionist') navigate('/receptionist')
    else navigate('/patient')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup'
      const payload = mode === 'login' ? { email, password } : { name, email, password, role }
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed')
      }
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authRole', data.role)
      localStorage.setItem('authName', data.name)
      localStorage.setItem('authEmail', data.email)
      redirectByRole(data.role)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800/60 border border-blue-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Hospital Management</h1>
          <p className="text-blue-200/80">Secure {mode === 'login' ? 'Login' : 'Signup'}</p>
        </div>

        <div className="flex mb-6 bg-slate-700/60 rounded-lg overflow-hidden">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-semibold ${mode==='login'?'bg-blue-600 text-white':'text-blue-200/80 hover:bg-slate-700'}`}
          >Login</button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-semibold ${mode==='signup'?'bg-blue-600 text-white':'text-blue-200/80 hover:bg-slate-700'}`}
          >Sign up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-blue-200/90 text-sm mb-1">Full name</label>
              <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-blue-200/90 text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              required
              className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-blue-200/90 text-sm mb-1">Password</label>
            <input
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              type="password"
              required
              className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="block text-blue-200/90 text-sm mb-1">Role</label>
              <select
                value={role}
                onChange={(e)=>setRole(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="patient">Patient</option>
                <option value="receptionist">Receptionist</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-400 bg-red-900/20 border border-red-700/30 p-2 rounded">{error}</div>
          )}

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold py-2 rounded transition-colors"
          >{loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create account')}</button>
        </form>

        <p className="text-center text-blue-300/70 text-xs mt-4">Backend: {BASE_URL}</p>
      </div>
    </div>
  )
}

export default AuthPage
