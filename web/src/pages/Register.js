import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Register.css";
import { Container, Row, Col } from "react-bootstrap";
import vector from "../images/table-meeting.png";
import logo from "../images/branding-notitle.png";
import emailIcon from "../images/email.png";
import passIcon from "../images/password.png";
import phoneIcon from "../images/phone.png";



const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    empId: 'NULL',
    positionId: 'NULL',
    title: 'NULL',
    dayAvail: 'NULL',
    endAvail: 'NULL',
    startAvail: 'NULL',
    managerIdent: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://large.poosd-project.com/api/register', formData);
      console.log('Registration successful:', response.data);
      alert("Registered successfully.")
    } catch (err) {
      console.log('Error during registration:', err);
    }
  };


  let url = "/";
  return (
    <div id="register-body">
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
            <form onSubmit={handleSubmit}>
            <div className='register-form'>
            <h1 class="font-family-katibeh">Register</h1>
            <div className='register-box'>
              <div class="firstName-input-group">  
              <h2 class="input-font">First Name</h2>
                <input type="text" name="firstName" placeholder="" onChange={handleChange} />
              </div>
              <div class="lastName-input-group"> 
              <h2 class="input-font">Last Name</h2>
                <input type="text" name="lastName" placeholder="" onChange={handleChange} />
              </div>
              <div class="user-input-group"> 
              <h2 class="input-font">Username</h2>
                <input type="text" name="username" placeholder="" onChange={handleChange} />
              </div>
              <div class="pass-input-group"> 
              <h2 class="input-font">Password</h2>
              <img src={passIcon} alt="pass icon" /> 
                <input type="password" name="password" placeholder="" onChange={handleChange} />
              </div>
              <div class="email-input-group">
              <h2 class="input-font">Email</h2>
              <img src={emailIcon} alt="email icon" /> 
                <input type="email" name="email" placeholder="" onChange={handleChange} />
              </div>
              <div class="phone-input-group">
              <h2 class="input-font">Phone Number</h2>
              <img src={phoneIcon} alt="email icon" /> 
                <input type="text" name="phone" placeholder="" onChange={handleChange} />
              </div>
            </div>
            <div class="managerID-input-group">
            <h2 class="input-font">Are you a manager or an employee?</h2>
            <div id="radio-buttons">
            <input 
              type="radio" 
              value="Manager" 
              name="title" 
              onChange={(e) => handleChange({ target: { name: 'managerIdent', value: e.target.checked } })}
              /> Manager
            <input 
            type="radio" 
            value="Employee" 
            name="title" 
            onChange={(e) => handleChange({ target: { name: 'managerIdent', value: false} })}/> Employee
            </div>
            </div>
            <button type="submit" className="submit-button">Sign Up</button>
            <p className="login-register-p">Have an account?  <a href={url} className="login-register-url">log in</a></p>
            </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
