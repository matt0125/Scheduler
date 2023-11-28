import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { resetToken } = useParams();
  const navigate = useNavigate(); // Corrected variable name
  console.log("Reset token:", resetToken);

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

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPasswordPage;
