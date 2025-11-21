import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function TopBar({ title }){
  const navigate = useNavigate()
  const logout = ()=>{
    localStorage.removeItem('authToken')
    localStorage.removeItem('authRole')
    localStorage.removeItem('authName')
    localStorage.removeItem('authEmail')
    navigate('/auth')
  }
  const name = localStorage.getItem('authName') || 'User'
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/60 border-b border-slate-700">
      <h2 className="text-white font-semibold">{title}</h2>
      <div className="flex items-center gap-3">
        <span className="text-blue-200/80 text-sm">{name}</span>
        <button onClick={logout} className="px-3 py-1.5 rounded bg-red-600 text-white text-sm">Logout</button>
      </div>
    </div>
  )
}

function useAuth(){
  const navigate = useNavigate()
  useEffect(()=>{
    const t = localStorage.getItem('authToken')
    const r = localStorage.getItem('authRole')
    if(!t || !r){
      navigate('/auth')
    }
  },[navigate])
  const token = localStorage.getItem('authToken')
  const role = localStorage.getItem('authRole')
  return { token, role }
}

export function AdminDashboard(){
  const { token } = useAuth()
  const [staff, setStaff] = useState([])
  const [patients, setPatients] = useState([])
  const [summary, setSummary] = useState(null)

  const fetchAll = async ()=>{
    const headers = { 'Authorization': `Bearer ${token}` }
    const s = await fetch(`${BASE_URL}/admin/staff`, { headers })
    const staffData = await s.json()
    const p = await fetch(`${BASE_URL}/admin/patients`, { headers })
    const patientData = await p.json()
    const r = await fetch(`${BASE_URL}/admin/reports/summary`, { headers })
    const sumData = await r.json()
    setStaff(staffData)
    setPatients(patientData)
    setSummary(sumData)
  }

  useEffect(()=>{ fetchAll() },[])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <TopBar title="Admin Dashboard" />
      <div className="p-6 grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 p-4 rounded border border-slate-700">
          <h3 className="font-semibold mb-2">At a glance</h3>
          {summary ? (
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>Patients: {summary.patients}</li>
              <li>Staff: {summary.staff}</li>
              <li>Appointments: {summary.appointments}</li>
              <li className="text-xs mt-2">Updated: {summary.generated_at}</li>
            </ul>
          ) : 'Loading...'}
        </div>
        <div className="bg-slate-800/60 p-4 rounded border border-slate-700 md:col-span-2">
          <h3 className="font-semibold mb-2">Staff</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {staff.map(s => (
              <div key={s.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-blue-300/70">{s.role} • {s.email}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-slate-700">{s.department || '—'}</span>
              </div>
            ))}
            {staff.length === 0 && <div className="text-sm text-blue-200/60">No staff yet.</div>}
          </div>
        </div>
        <div className="bg-slate-800/60 p-4 rounded border border-slate-700 md:col-span-3">
          <h3 className="font-semibold mb-2">Patients</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {patients.map(p => (
              <div key={p.id} className="bg-slate-900/50 p-3 rounded">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-blue-300/70">{p.email || '—'} • {p.phone || '—'}</div>
              </div>
            ))}
            {patients.length === 0 && <div className="text-sm text-blue-200/60">No patients yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DoctorDashboard(){
  const { token } = useAuth()
  const [schedule, setSchedule] = useState([])
  useEffect(()=>{
    const headers = { 'Authorization': `Bearer ${token}` }
    fetch(`${BASE_URL}/doctor/schedule`, { headers })
      .then(r=>r.json()).then(setSchedule)
  },[])
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <TopBar title="Doctor Dashboard" />
      <div className="p-6">
        <h3 className="font-semibold mb-3">Upcoming Appointments</h3>
        <div className="space-y-2">
          {schedule.map(a => (
            <div key={a.id} className="bg-slate-800/60 p-3 rounded border border-slate-700">
              <div className="font-medium">{a.reason || 'Consultation'}</div>
              <div className="text-xs text-blue-300/70">{a.datetime} • Patient: {a.patient_id}</div>
            </div>
          ))}
          {schedule.length === 0 && <div className="text-sm text-blue-200/60">No appointments scheduled.</div>}
        </div>
      </div>
    </div>
  )
}

export function ReceptionistDashboard(){
  const { token } = useAuth()
  const [patients, setPatients] = useState([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(()=>{
    const headers = { 'Authorization': `Bearer ${token}` }
    fetch(`${BASE_URL}/admin/patients`, { headers })
      .then(r=>r.json()).then(setPatients)
  },[])

  const createPatient = async ()=>{
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    const res = await fetch(`${BASE_URL}/admin/patients`, { method: 'POST', headers, body: JSON.stringify({ name, phone }) })
    if(res.ok){
      setName(''); setPhone('');
      const headers2 = { 'Authorization': `Bearer ${token}` }
      const data = await fetch(`${BASE_URL}/admin/patients`, { headers: headers2 }).then(r=>r.json())
      setPatients(data)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <TopBar title="Receptionist Dashboard" />
      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 p-4 rounded border border-slate-700">
          <h3 className="font-semibold mb-3">Register New Patient</h3>
          <div className="space-y-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-600" />
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-600" />
            <button onClick={createPatient} className="px-3 py-2 rounded bg-blue-600">Save</button>
          </div>
        </div>
        <div className="bg-slate-800/60 p-4 rounded border border-slate-700">
          <h3 className="font-semibold mb-3">All Patients</h3>
          <div className="space-y-2 max-h-80 overflow-auto">
            {patients.map(p => (
              <div key={p.id} className="bg-slate-900/50 p-2 rounded">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-blue-300/70">{p.phone || '—'}</div>
              </div>
            ))}
            {patients.length === 0 && <div className="text-sm text-blue-200/60">No patients yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PatientDashboard(){
  useAuth()
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <TopBar title="Patient Dashboard" />
      <div className="p-6">
        <p className="text-blue-200/80">Welcome. You can view your appointments and profile here. (Demo view)</p>
      </div>
    </div>
  )
}
