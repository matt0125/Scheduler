import React, { useState } from 'react';
import Modal from 'react-modal';
import { Box, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

import logo from "../images/branding.png";
import profile from "../images/profile-button.svg";

function TopBarComponent() {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate(); // Access the navigate function from useNavigate hook

  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/'); // Navigate to '/'
  };

  const handleEditProfile = () => {
    const employeeId = localStorage.getItem('id');
    navigate(`/edit-profile/${employeeId}`);
  };

  const navigateDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <img src={logo} alt="sched logo" className="logo" onClick={navigateDashboard} />
      <img className="profile-button" src={profile} alt="Profile Button" onClick={openProfileModal} />
      <Modal isOpen={showProfileModal} onRequestClose={closeProfileModal}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ p: 2 }}>
            <Button id='edit-button' variant="contained" color="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
            <Button variant="contained" color="primary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export default TopBarComponent;
