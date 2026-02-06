import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Browse from './pages/Browse'
import ListingView from './pages/ListingView'
import Dashboard from './pages/Dashboard'
import ListingForm from './components/ListingForm'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import DashboardListingEdit from './pages/DashboardListingEdit'
import Messages from './pages/Messages'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>} />
          <Route path="browse" element={<Browse/>} />
          <Route path="create" element={<ListingForm/>} />
          <Route path="listing/:id" element={<ListingView/>} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="dashboard/edit/:id" element={<DashboardListingEdit/>} />
          <Route path="dashboard/messages" element={<Messages/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="*" element={<NotFound/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
