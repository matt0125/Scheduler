import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Box, Typography } from '@mui/material';

const EditProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '' // Make sure this key matches the one from your API response.
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        let jwtToken = localStorage.getItem('token');
        let employeeId = localStorage.getItem('id'); 
        if (!employeeId) {
          throw new Error('No employee ID found in local storage.');
        }

        const url = `http://large.poosd-project.com/api/employee/${employeeId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phoneNumber: response.data.phone || '' // Use `phone` or the correct key from your API response.
        });
        alert('Employee data retrieved successfully!');
      } catch (error) {
        console.error('Error:', error);
        alert(error instanceof Error ? error.message : 'Failed to retrieve employee data');
      }
    };

    fetchEmployeeData();
  }, []);

  useEffect(() => {
    console.log(formData); // This will log the formData when it's updated
  }, [formData]);
  

  const handleSave = async () => {
    let jwtToken = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:3000/api/employee/', formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile', error);
      alert('Error updating profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Since employeeId is no longer needed for navigation, these handlers have been updated
  const navigateToChangeManager = () => navigate('/change-manager');
  const navigateToChangePosition = () => navigate('/change-position');
  const navigateToChangePassword = () => navigate('/change-password');
  const navigateToUpdateAvailability = () => navigate('/update-availability');

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Edit Profile
      </Typography>
      <Box component="form" noValidate autoComplete="off">
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Phone Number"
        name="phoneNumber" // This should match the key used in setFormData
        value={formData.phoneNumber || ''} // Make sure you handle the controlled component correctly
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2' }} // Use MUI blue instead of default purple
        >
          Save
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={navigateToChangePassword}
          sx={{ mb: 2 }}
        >
          Change Password
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={navigateToUpdateAvailability}
          sx={{ mb: 2 }}
        >
          Change Availability
        </Button>
      </Box>
    </Container>
  );
};

export default EditProfile;
