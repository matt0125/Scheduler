import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile'; // Import EditProfile
import ChangePassword from './pages/ChangePassword'; // Import ChangePassword
import UpdateAvailability from './pages/UpdateAvailability'; // Import UpdateAvailability

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<DashboardWithNavigate/>} />
        <Route path="/edit-profile/:employeeId" element={<EditProfile/>} /> {/* Add this line */}
        <Route path="/change-password/:employeeId" element={<ChangePassword />} />
        <Route path="/update-availability/:employeeId" element={<UpdateAvailability/>} />
      </Routes>
    </Router>
  );
};

function DashboardWithNavigate() {
  const navigate = useNavigate();
  return <Dashboard navigate={navigate} />;
}

export default App;
