import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { MessageSquare, UserCircle } from 'lucide-react'

export default function Layout(){
  const location = useLocation()
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  const isDashboardActive = location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/edit')
  const isMessagesActive = location.pathname.startsWith('/dashboard/messages')
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">🏠 Kenya Land Market</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                to="/browse" 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/browse') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Browse
              </Link>
              <Link 
                to="/create" 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive('/create') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Create
              </Link>
              <Link 
                to="/dashboard" 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDashboardActive 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/messages"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isMessagesActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Messages</span>
              </Link>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive('/profile')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <Outlet/>
      </main>
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2026 Kenya Land Marketplace. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-500">Empowering transparent land transactions across Kenya</p>
        </div>
      </footer>
    </div>
  )
}
