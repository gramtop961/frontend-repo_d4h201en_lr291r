import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Hospital Management Platform
            </h1>

            <p className="text-xl text-blue-200 mb-6">
              Unified admin and user experience with secure role-based access
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 shadow-xl mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-white mb-1">Get started</h3>
                <p className="text-blue-200/80 text-sm">Login or sign up to access your dashboard</p>
              </div>
              <Link to="/auth" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">Go to Auth</Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-blue-300/60">
              Built with role-aware navigation for Admins, Doctors, Receptionists and Patients
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App