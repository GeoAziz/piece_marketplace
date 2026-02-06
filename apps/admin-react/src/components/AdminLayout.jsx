import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BarChart3, FileText, Settings } from 'lucide-react'

export default function AdminLayout(){
  const location = useLocation()
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="bg-white border-b md:border-r w-full md:w-64 md:min-h-screen">
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🔒</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Admin Console</h1>
          </Link>
        </div>
        <nav className="mt-4 px-2 space-y-1">
          <Link 
            to="/"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Review Queue
          </Link>
          <Link 
            to="/admin/audit"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/admin/audit')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            Audit Logs
          </Link>
          <Link 
            to="/admin/settings"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isActive('/admin/settings')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b shadow-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-semibold text-sm">A</span>
                </div>
                <span className="text-sm text-gray-600">Administrator</span>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
