import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import Queue from './pages/Queue'
import Audit from './pages/Audit'
import Settings from './pages/Settings'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout/>}>
          <Route index element={<Queue/>} />
          <Route path="admin/queue" element={<Queue/>} />
          <Route path="admin/audit" element={<Audit/>} />
          <Route path="admin/settings" element={<Settings/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
