import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email: '',
    phoneNumber: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
    } else {
      // Placeholder action: Navigate to the login page after a successful sign-up
      navigate('/');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up for BooksMuse</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="employeeId"
        placeholder="Employee ID"
        value={formData.employeeId}
        onChange={handleInputChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleInputChange}
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleInputChange}
      >
        <option value="">Select Role</option>
        <option value="Manager">Manager</option>
        <option value="Staff">Staff</option>
      </select>
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <p>Already have an account? <a href="/">Login</a></p>
    </div>
  );
}

export default SignUpPage;
