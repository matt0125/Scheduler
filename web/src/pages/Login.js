import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

import '../styles/Login.css'; // Correct import path

const Login = () => {
  // Define state variables for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Define the login handler function
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to the login API endpoint
      const response = await axios.post('http://localhost:5000/api/login', {
        username, // Use the current value of username state
        password, // Use the current value of password state
      });

      // Show a success message with the response data
      alert(response.data);
    } catch (error) {
      // If an error occurs, show an error message
      alert('Invalid credentials');
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <form className='login-form' onSubmit={handleLogin}>
          <div className='AppName'>
            <h1> Sched</h1>
          </div>
          <div>
            <h1 className='loginTitle'>Login</h1>
          </div>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update the username state on input change
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update the password state on input change
            />
          </div>
          <button type="submit">Login</button>
          <div className="signup-link">
            Don’t have an account? <Link to="/Register">Sign up</Link>
          </div>
        </form>
      </div>
      <footer className="footer">
      </footer>
    </div>
  );
};

export default Login;
