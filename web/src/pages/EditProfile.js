import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { employeeId } = useParams(); // use employeeId from URL
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  // Fetch the existing data for the employee
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/employees/${employeeId}`);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber
        });
      } catch (error) {
        console.error('Error fetching employee data', error);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const handlePasswordChangeClick = () => {
    navigate(`/change-password/${employeeId}`); // Navigate to ChangePassword
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3000/employees/${employeeId}`, formData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error);
      console.error('Error updating profile', error);
    }
  };
  // Handles navigation to UpdateAvailability
  const handleUpdateAvailabilityClick = () => {
    navigate(`/update-availability/${employeeId}`); // Navigate to UpdateAvailability
  };

  // Additional handlers for Change Password and Change Availability can be added here

  return (
    <div>
      <h1>Edit Profile</h1>
      <form>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={handlePasswordChangeClick}>Change Password</button>
        <button type="button" onClick={handleUpdateAvailabilityClick}>Change Availability</button>
      </form>
    </div>
  );
};

export default EditProfile;
