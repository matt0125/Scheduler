import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import "../styles/Login.css";
import { Container, Row, Col } from "react-bootstrap";
import vector from "../images/table-meeting.png";
import emailIcon from "../images/email.png";
import passIcon from "../images/password.png";
import logo from "../images/branding.png";
//import MediaQuery from 'react-responsive'

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

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

    // Call the backend API to authenticate the user
    // TODO: Replace this with a real API call
    const response = await fetch("http://large.poosd-project.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    console.log(JSON.stringify({ username, password }));
    console.log(response.status);

    // Check the response status code
    if (response.status === 200) {
      // Login successful
      alert("Logged in");
    } else {
      // Login failed
      alert("Invalid username or password");
    }
  };
  
  let url = "/register";
  return (
      <Container>
        <Row>
          <Col>
            <img src={logo} alt="sched logo" className="logo"></img>
          </Col>
          <Col className="title">
            <h1>Name of WebApp</h1>
          </Col>
        </Row>
        <Row className="row"> 
          <Col className="column">
            <img src={vector} className="business-photo" alt="business vector"/>
          </Col>
          <Col className="main-column">
            <form onSubmit={handleSubmit}>
              <div className="login-box">
                <h1 class="font-family-katibeh">Login</h1>
                <h2 class="username">Email(or username)</h2>
                <div class="username-input-group">
                  <img src={emailIcon} alt="email icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder=""
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <h2 class="password">Password</h2>
                <div class="password-input-group">
                  <img src={passIcon} alt="password icon"></img>
                  <input
                    type="password"
                    name="password"
                    placeholder=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="submit-button">Login</button>
                <p className="login-register-p">Forgot password? <a href={""} className="login-register-url">click here</a></p>
                <p className="login-register-p">Don't have an account  <a href={url} className="login-register-url">sign up</a></p>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
  );
};

export default Login;
