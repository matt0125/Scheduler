import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import "../styles/Login.css";
import { Container, Row, Col } from "react-bootstrap";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import vector from "../images/table-meeting.png";
import emailIcon from "../images/email.png";
import passIcon from "../images/password.png";
import logo from "../images/branding-notitle.png";
import eyeOpenSvg from '../images/eye-open-svg.svg';
import eyeClosedSvg from '../images/eye-closed-svg.svg';
import { login, isManager } from '../services/api';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showFailPopup, setFailPopup] = useState(false);
  const [openModal, setOpenModal] = useState(false);


  const handlePasswordReset = () => {
    setOpenModal(true); // Open the Material-UI modal instead of using prompt
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const submitPasswordReset = async () => {
    const email = prompt("Please enter your email for password reset:");
    if (!email) {
      
      return;
    }
  
    // Call the API to send password reset email
    try {
      const response = await fetch("http://localhost:3000/api/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
  
      if (response.status === 200) {
        handleModalClose(); // Close the modal on submit
      } else {
        
      }
    } catch (error) {
      console.error("Error sending password reset email: ", error);
    }
  };
  


  // Validate the username and password
  const validateForm = () => {
    let errors = {};
    if (!username) {
      setUsernameError("Username is required");
      
    }
    if (!password) {
      setPasswordError("Password is required");
      
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setUsernameError(errors.username);
      setPasswordError(errors.password);
      return;
    }
  
    try {
      const response = await login(username, password);
      // Login successful
      const token = response.data.token;
      const id = response.data.id;
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      const isMan = await isManager(id);
      localStorage.setItem('isMan', isMan);
      navigate('/dashboard');
    } catch (error) {
      // Login failed
      setFailPopup(true);
      document.getElementById("user-input").focus();
      document.getElementById("pass-input").focus();
      // Log the error or display it to the user
      console.error('Login failed:', error.response?.data?.message || error.message);
    }
  };
  
  

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  const handleClosePopup = () => {
    // Close the popup
    setFailPopup(false);
  };
  
  let url = "/register";
  let url2 = "/dashboard";
  return (
    <div id="login-body">
      <Container>
        <Row>
          <Col>
            <img src={logo} alt="sched logo" className="logo"></img>
          </Col>
          <Col className="title">
            <h1>Sched</h1>
          </Col>
        </Row>
        <Row className="row"> 
          <Col className="column">
            <img src={vector} className="business-photo" alt="business vector"/>
          </Col>
          <Col className="main-column">
          {showFailPopup && (<div className="bad-top-popup" onClick={handleClosePopup}>
            <p>Invalid username or password</p>
            </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="login-box">
                <h1 class="font-family-katibeh">Login</h1>
                <h2 class="username">Username</h2>
                <div class="username-input-group">
                  <img src={emailIcon} alt="email icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder=""
                    id="user-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <h2 class="password">Password</h2>
                <div class="password-input-group">
                  <img src={passIcon} alt="password icon"></img>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder=""
                    id="pass-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div id="log-checkbox_wrapper" onClick={togglePasswordVisibility}>
                    <img 
                      src={showPassword ? eyeOpenSvg : eyeClosedSvg} 
                      alt="Toggle Password Visibility" 
                      className="eye-icon"
                    />
                  </div>
                </div>
                <button onClick={ handleSubmit } type="submit" className="submit-button">Login</button>
                <p className="login-register-p">Forgot password?
                  <a href="#!" onClick={handlePasswordReset} className="login-register-url">click here</a>
                </p>
                <p className="login-register-p">Don't have an account  <a href={url} className="login-register-url">sign up</a></p>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="password-reset-modal"
        aria-describedby="password-reset-form"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, outline: 'none' }}>
          <Typography id="password-reset-modal" variant="h6" component="h2">
            Password Reset
          </Typography>
          <Box component="form" onSubmit={submitPasswordReset} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Send Reset Link
            </Button>
            <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={handleModalClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      </div>
  );
};

export default Login;
