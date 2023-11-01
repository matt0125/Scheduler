import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";
import "../styles/Login.css";
import { Container, Row, Col } from "react-bootstrap";
import vector from "../images/Group.png";

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

  return (
      <Container>
        <Row className="row"> 
          <Col className="column">
            <img src={vector} className="business-photo" alt="business image"/>
          </Col>
          <Col className="column">
            <form onSubmit={handleSubmit}>
              <div className="login-box">
                <h1 class="font-family-katibeh">Login</h1>
                <h2 class="username">Email(or username)</h2>
                <input
                  type="text"
                  name="username"
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <h2 class="password">Password</h2>
                <input
                  type="password"
                  name="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                <button type="button" onClick={() => navigate("/register")}>
                  Sign up
                </button>
              </div>
            </form>
          </Col>
        </Row>
        <footer style={{ backgroundColor: "#B1947B;" }}>
        </footer>
      </Container>
  );
};

export default Login;
