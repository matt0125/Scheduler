import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Register.css";

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
    } catch (err) {
      console.log('Error during registration:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      {/* Add more input fields similarly */}
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
      <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
      <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
      <input type="checkbox" name="managerIdent" onChange={(e) => handleChange({ target: { name: 'managerIdent', value: e.target.checked } })} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
