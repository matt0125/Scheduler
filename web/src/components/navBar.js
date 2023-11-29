import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


import logo from "../images/branding.png";
import profile from "../images/profile-button.svg";

const pages = ['Products', 'Pricing', 'Blog'];


function ResponsiveAppBar() {
  const navigate = useNavigate(); // Access the navigate function from useNavigate hook
  const location = useLocation();

  const editProfile = location.pathname.startsWith('/edit-profile/');
  const empDashboard = location.pathname === '/dashboard';
  const isMan = localStorage.getItem('isMan') === "true";

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigateTemplates = () => {
    navigate('/templates');
  };

  const navigateDashboard = () => {
    navigate('/dashboard');
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/'); // Navigate to '/'
  };
  const handleEditProfile = () => {
    const employeeId = localStorage.getItem('id');
    navigate(`/edit-profile/${employeeId}`);
  };

  // Function to get today's date as a string in MM-DD-YYYY format
const getFormattedDate = (date) => {
  let day = date.getDate().toString().padStart(2, '0');
  let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  let year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

// Function to get the beginning of the current week as a string in MM-DD-YYYY format
const getStartOfWeek = (date) => {
  const dayOfWeek = date.getDay(); // Sunday - 0, Monday - 1, etc.
  const startOfWeek = new Date(date.setDate(date.getDate() - dayOfWeek)); // Adjust to the beginning of the week
  return getFormattedDate(startOfWeek);
};

// Function to get the end of the current week as a string in MM-DD-YYYY format
const getEndOfWeek = (date) => {
  const dayOfWeek = date.getDay(); // Sunday - 0, Monday - 1, etc.
  const endOfWeek = new Date(date.setDate(date.getDate() - dayOfWeek + 6)); // Adjust to the end of the week
  return getFormattedDate(endOfWeek);
};

const generateSchedules = async () => {
  try {
    const managerId = localStorage.getItem('id'); // Assuming manager ID is stored in localStorage
    const today = new Date();
    const startDate = getStartOfWeek(new Date(today)); // Start of this week
    const endDate = getEndOfWeek(new Date(today)); // End of this week

    const jwtToken = localStorage.getItem('token');
    const response = await axios.post('http://large.poosd-project.com/api/schedule/generate', {
      managerId,
      startDate,
      endDate
    }, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data) {
      // Handle the response data
      console.log('Schedule generated successfully', response.data);
      window.location.reload();
      // Maybe navigate to the schedule view or display a success message
    }
  } catch (error) {
    // Handle errors here
    console.error('Error generating schedule:', error);
    // Maybe display an error message
  }
};

  

return (
  <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
    <Container maxWidth="xxl">
      <Toolbar disableGutters>
        <Tooltip title="Dashboard">
          <img src={logo} alt="sched logo" className="logo" onClick={navigateDashboard} />
        </Tooltip>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 4 }}>
            {/* Generate Schedules Button */}
            {isMan && !editProfile && (
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={generateSchedules}
              >
                Generate Schedules
              </Button>
            )}

            {/* Manager Dashboard Button */}
            {isMan && !editProfile && (
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={empDashboard ? navigateTemplates : navigateDashboard}
              >
                {empDashboard ? "Manager Dashboard" : "Employee Dashboard"}
              </Button>
            )}
          </Box>

        <Box sx={{ flexGrow: 0, mr: -2 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Profile" src={profile} sx={{ width: 72, height: 72 }} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
             <MenuItem key="EditProfile" onClick={() => {
                handleCloseUserMenu();
                handleEditProfile();
              }}>
                <Typography textAlign="center">Edit profile</Typography>
              </MenuItem>
              <MenuItem key="SignOut" onClick={() => {
                handleCloseUserMenu();
                handleSignOut();
              }}>
                <Typography textAlign="center">Sign out</Typography>
              </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </Container>
  </AppBar>
);
}

export default ResponsiveAppBar;