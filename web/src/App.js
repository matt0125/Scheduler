import React, { useEffect } from 'react'; // Import React and useEffect from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import UpdateAvailability from './pages/UpdateAvailability';
import VerifyEmail from './pages/VerifyEmail';
import EmployeeRegistration from './pages/EmployeeRegistration'; // Assuming you have this component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardWithNavigate />} />
        <Route path="/templates" element={<TemplatesWithNavigate />} />
        <Route path="/edit-profile/:employeeId" element={<EditProfile />} />
        <Route path="/change-password/:employeeId" element={<ChangePassword />} />
        <Route path="/update-availability/:employeeId" element={<UpdateAvailability />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/EmployeeRegistration" element={<EmployeeRegistration />} /> {/* Added route for EmployeeRegistration */}
      </Routes>
    </Router>
  );
};

function TemplatesWithNavigate() {
  const navigate = useNavigate();
  return <Templates navigate={navigate} />;
}
function DashboardWithNavigate() {
  const navigate = useNavigate();
  return <Dashboard navigate={navigate} />;
}

export default App;
