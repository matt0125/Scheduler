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
      
      return;
    }

    try {
      await axios.put(`http://large.poosd-project.com/api/employees/change-password/${employeeId}`, { password: passwords.newPassword });
      
    } catch (error) {
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
