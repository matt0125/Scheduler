import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(''); // Add a state for the current password

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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
          phone: response.data.phone || '' // Use `phone` or the correct key from your API response.
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEmployeeData();
  }, []);

  useEffect(() => {
    console.log(formData); // This will log the formData when it's updated
  }, [formData]);
  

  const handleSave = async () => {
    let jwtToken = localStorage.getItem('token');
    let employeeId = localStorage.getItem('id');
    if (!employeeId) {
      console.error('No employee ID found in local storage.');
      return; // Exit the function if no employee ID is found
    }
  
    const url = `http://large.poosd-project.com/updateEmployee/${employeeId}`;
    
    try {
      // The formData sent to the server must match the server's expected format
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone, // Make sure to use 'phone' if that's what the server expects
      };
      
      const response = await axios.put(url, dataToSend, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log('Data sent:', dataToSend);
      alert('Profile updated successfully!');
      console.log('Server response:', response.data);
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

  const handlePasswordChange = async () => {
    // Log passwords for debugging purposes
    console.log(`Current Password: ${currentPassword}, New Password: ${newPassword}, Confirm New Password: ${confirmNewPassword}`);
  
    // Check if the new passwords match
    if (newPassword.trim() !== confirmNewPassword.trim()) {
      alert("New passwords don't match.");
      return;
    }
  
    // Perform the password update call
    let jwtToken = localStorage.getItem('token');
    let employeeId = localStorage.getItem('id');
    const url = `http://large.poosd-project.com/api/employee/${employeeId}/password`;
    console.log("Sending request with", { currentPassword, newPassword });
    try {
      const response = await axios.put(url, JSON.stringify({ currentPassword, newPassword }), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      alert('Password updated successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Error updating password:', error);
      alert(`Error updating password: ${error.response?.data?.message || error.message}`);
    }
  };
  

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          sx={{ mt: 3, mb: 2, backgroundColor: '#1976d2' }}
        >
          Save
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleOpenModal}
          sx={{ mb: 2 }}
        >
          Change Password
        </Button>
        {/* Assuming navigateToUpdateAvailability is defined elsewhere */}
      </Box>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To update your password, please enter your current and new password here.
          </DialogContentText>
          <TextField
            margin="dense"
            id="current-password"
            label="Current Password"
            type={passwordVisible ? 'text' : 'password'}
            fullWidth
            variant="standard"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="dense"
            id="confirm-new-password"
            label="Retype New Password"
            type="password"
            fullWidth
            variant="standard"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handlePasswordChange}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditProfile;
