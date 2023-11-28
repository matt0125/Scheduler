import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = ({ employeeId }) => {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/employees/change-password/${employeeId}`, { password: passwords.newPassword });
      alert('Password updated successfully!');
    } catch (error) {
      alert(error);
      console.error('Error updating password', error);
    }
  };

  return (
    <div>
      <h1>Change Password</h1>
      <form>
        <input
          type="password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handleChange}
          placeholder="New Password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={passwords.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
        />
        <button type="button" onClick={handleSubmit}>Confirm Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
