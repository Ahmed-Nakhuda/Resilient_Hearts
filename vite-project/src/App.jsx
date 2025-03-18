import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/signup'
import Home from './components/home'
import ProtectedRoute from './components/protectedRoute'
import UploadCourse from './components/uploadCourse'
import CourseContent from './components/courseContent'
import Payment from './components/payment'
import UserCourses from './components/userCourses'
import StressManagement from './components/stressManagement'
import MyCommunity from './components/myCommunity'
import UserProfile from './components/userProfile'
import RemoveCourse from './components/removeCourse'
import MessageFacilitator from './components/messageFacilitator'
import FacilitatorMessages from './components/FacilitatorMessages'
import ConversationPage from './components/conversationPage'
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
          <Route path='/user-profile' element={<UserProfile />}></Route>
          <Route path='/my-community' element={<MyCommunity />}></Route>  
          

          {/* Pass id's */}
          <Route path="user-courses/course-content/:courseId" element={<CourseContent />} />
          <Route path="/payment/:courseId" element={<Payment />} />
          <Route path='/stress-management-and-healthy-coping/:courseId' element={<StressManagement />}></Route>


          {/* Admin-only route */}
          <Route
            path="/upload-course"
            element={<ProtectedRoute element={<UploadCourse />} allowedRoles={["admin"]} />}
          />

          <Route
            path="/remove-course"
            element={<ProtectedRoute element={<RemoveCourse />} allowedRoles={["admin"]} />}
          />


          {/* Facilitator-only route */}
          <Route
            path="/facilitator-messages"
            element={<ProtectedRoute element={<FacilitatorMessages />} allowedRoles={["facilitator"]} />}
          />

          <Route 
            path="/conversation/:userId" 
            element={<ProtectedRoute element={<ConversationPage />} allowedRoles={["facilitator"]} />}
          />


          {/* Enrolled user-only route */}
          <Route
            path="/my-community"
            element={<ProtectedRoute element={<MyCommunity />} allowedRoles={["enrolled", "admin"]} />}
          />

          <Route 
            path="/message-facilitator" 
            element={<ProtectedRoute element={<MessageFacilitator />} allowedRoles={["enrolled", "admin"]} />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
