import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import "../styles/Login.css";
import { Container, Row, Col } from "react-bootstrap";
import vector from "../images/table-meeting.png";
import emailIcon from "../images/email.png";
import passIcon from "../images/password.png";
import logo from "../images/branding-notitle.png";

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


  const handlePasswordReset = async () => {
    const email = prompt("Please enter your email for password reset:");
    if (!email) {
      alert("Please enter your email");
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
        alert("Password reset email sent. Please check your inbox.");
      } else {
        alert("Failed to send password reset email.");
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

  // Handle the login form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate the form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setUsernameError(errors.username);
      setPasswordError(errors.password);
      return;
    }

    const response = await login( username, password);
    
    if (response.status === 200) {
      // Login successful
      const token = response.data.token;
      const id = response.data.id;
      console.log(response.data);
      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('isMan', await isManager(id));
      navigate('/dashboard');
    } else {
      // Login failed
      setFailPopup(true);
      document.getElementById("user-input").focus();
      document.getElementById("pass-input").focus();

    }
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
                    type= {showPassword ? "text" : "password"}
                    name="password"
                    placeholder=""
                    id="pass-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                <div id="log-checkbox_wrapper">
                  <input id="log-eyeball" className = "eyeball" type="checkbox" value = {showPassword} onChange={() => setShowPassword((prev) => !prev)}>
                  </input>
                  <label for="log-eyeball"></label>
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
      </div>
  );
};

export default Login;
