import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'
import { Container, Row, Col } from "react-bootstrap";
import logo from "../images/branding-notitle.png";
import vector from "../images/table-meeting.png";
import eyeOpenSvg from '../images/eye-open-svg.svg';
import eyeClosedSvg from '../images/eye-closed-svg.svg';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const { resetToken } = useParams();
  const navigate = useNavigate(); // Corrected variable name
  console.log("Reset token:", resetToken);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2(prev => !prev);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/reset-password', {
        resetToken,
        newPassword,
      });
      setSuccess(response.data.message);
      // Redirect to login page or elsewhere after successful reset
      setTimeout(() => navigate('/'), 3000); // Navigate after a delay to allow user to read the success message
    } catch (err) {
      setError(err.response.data.message || 'An error occurred');
    }
  };

  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPassword(e.target.value)
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    if (name === 'password') {
      if (value.length < 8) {
        error = 'Password must be at least 8 characters long.';
      }
      if (!/[A-Z]/.test(value)) {
        error = 'Password must contain at least one uppercase letter';
      }
      if (!/[a-z]/.test(value)) {
        error = 'Password must contain at least one lowercase letter';
      }
      if (!/[0-9]/.test(value)) {
        error = 'Password must contain at least one number';
      }
      if (!/[^A-Za-z0-9]/.test(value)) {
        error = 'Password must contain at least one special character';
      }
    } 

    setFormErrors({
      ...formErrors,
      [name]: error,
    });
  };


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
          <img src={vector} id='reset-photo' className="business-photo" alt="business vector"/>
        </Col>
        <Col className="main-column">
        <div className='reset-message'>
        {error && <div style={{ color: 'red'}}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        </div>
        <div className="login-box">
        <h2 class="font-family-katibeh">Reset Password</h2>
        <div class="new-pass">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            name="password"
            onChange={handleChange}
          />
          <div className="checkbox_wrapper1" onClick={togglePasswordVisibility}>
                  <img
                    src={showPassword ? eyeOpenSvg : eyeClosedSvg}
                    alt="Toggle Password Visibility"
                    className="eye-icon"
                  />
          </div>
          {formErrors.password && <div className="pass-popup1">{formErrors.password}</div>}
          </div>

          <div class="confirm-pass">
          <input
            type={showPassword2 ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="checkbox_wrapper2" onClick={togglePasswordVisibility2}>
                  <img
                    src={showPassword2 ? eyeOpenSvg : eyeClosedSvg}
                    alt="Toggle Password Visibility"
                    className="eye-icon"
                  />
          </div>
          </div>
        <button className="submit-button" onClick={handleResetPassword}>Reset Password</button>
        </div>
       
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default ResetPasswordPage;
