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

  return (
    <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
      <Container maxWidth="xxl">
        <Toolbar disableGutters>
          <Tooltip title="Dashboard">
            <img src={logo} alt="sched logo" className="logo" onClick={navigateDashboard} />
          </Tooltip>
          {/* <Typography
            variant="h6"
            noWrap
            component="a"
            href='/dashboard'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SCHED
          </Typography> */}

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

          <Box sx={{ flexGrow: 2 }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                style={{ visibility: isMan ? (!editProfile ? 'visible': 'hidden') : 'hidden' }}
                onClick={() => {
                  empDashboard? 
                  navigateTemplates() : 
                  navigateDashboard();
                }}>
                  {empDashboard? "Manager Dashboard" : "Employee Dashboard"}
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ flexGrow: 0, mr: -2 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={profile} sx={{ width: 72, height: 72 }} />
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