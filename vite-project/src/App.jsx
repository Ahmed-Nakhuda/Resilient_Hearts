import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/signup'
import Home from './components/home'
import AdminDashboard from './components/adminDashboard'
import ProtectedRoute from './components/protectedRoute'
import FacilitatorDashboard from './components/facilitatorDashboard'
import UploadCourse from './components/uploadCourse'
import CourseContent from './components/courseContent'
import Payment from './components/payment'
import UserCourses from './components/userCourses'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/payment' element={<Payment />}></Route>
          <Route path='/user-courses' element={<UserCourses />}></Route>

          {/* Pass id's */}
          <Route path="user-courses/course-content/:courseId" element={<CourseContent />} />
          <Route path="/payment/:courseId" element={<Payment />} />


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
