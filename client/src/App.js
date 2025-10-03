import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Homepage from "./pages/Homepage.js";
import { useSelector } from "react-redux";
// import Spinners from "./components/Spinners.js";
import Spinners from "./components/spinners.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import PublicRoute from "./components/PublicRoute.js";
import ApplyDoctor from "./pages/ApplyDoctor.js";
import NotificationPage from "./pages/NotificationPage.js";
import Users from "./pages/admin/Users.js";
import Doctors from "./pages/admin/Doctors.js";
import Profile from "./pages/doctor/Profile.js";
import BookingPage from "./pages/doctor/BookingPage.js";
import Appointments from "./pages/Appointments.js";
import DoctorAppointments from "./pages/doctor/DoctorAppointments.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./components/LandingPage.js";

function App() {

  const {loading} = useSelector(state => state.alerts);

  return (
    <>
      <BrowserRouter>
      {loading ? (
        <Spinners/>
      ) : (
        <Routes >
           
          <Route path="/apply-doctor" element={
            <ProtectedRoute>
              <ApplyDoctor/>
            </ProtectedRoute>
            } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <Users/>
            </ProtectedRoute>
            } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute>
              <Doctors/>
            </ProtectedRoute>
            } />
          <Route path="/doctor/profile/:id" element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
            } />
          <Route path="/doctor/book-appointment/:doctorId" element={
            <ProtectedRoute>
              <BookingPage/>
            </ProtectedRoute>
            } />
            <Route path="/notification" element={
            <ProtectedRoute>
              <NotificationPage/>
            </ProtectedRoute>
            } />  
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
            } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
            } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute  >
            } />
          <Route path="/doctor-appointments" element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
            } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Homepage/>
            </ProtectedRoute>
            } /> 
          <Route path="/" element = {
              <LandingPage/>
          } />
        </Routes>
      )
    }
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeButton={true}
        rtl={false}
      />
    </>
  );
}

export default App;
