import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/signup'
import Home from './components/home'
import AdminDashboard from './components/adminDashboard'
import ProtectedRoute from './components/protectedRoute'
import FacilitatorDashboard from './components/facilitatorDashboard'
import UploadCourse from './components/uploadCourse'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/home' element={<Home />}></Route>


          {/* Admin-only route */}
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
          />

          <Route
            path="/upload-course"
            element={<ProtectedRoute element={<UploadCourse />} allowedRoles={["admin"]} />}
          />


          {/* Facilitator-only route */}
          <Route
            path="/facilitator-dashboard"
            element={<ProtectedRoute element={<FacilitatorDashboard />} allowedRoles={["facilitator"]} />}
          />

        </Routes>
      </Router>
    </>
  )
}

export default App
