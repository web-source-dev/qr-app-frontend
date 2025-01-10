import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignUpCss.css'
import { useNavigate } from 'react-router-dom';
const UserLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    user_email: '',
    user_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const safeSetItem = (key, value) => {
    if (value !== null && value !== undefined && value !== '') {
      localStorage.setItem(key, value);
    }
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, formData);
      setSuccess('Login successful!');
      setError('');
      if (response.data.user._id) safeSetItem('user_id', response.data.user._id);
      if (response.data.token) safeSetItem('user_token', response.data.token);
      if (response.data.user.user_email) safeSetItem('user_email', response.data.user.user_email);
      if (response.data.user.user_phone) safeSetItem('user_phone', response.data.user.user_phone);
      if (response.data.user.user_city) safeSetItem('user_city', response.data.user.user_city);
      if (response.data.user.user_state) safeSetItem('user_state', response.data.user.user_state);
      if (response.data.user.user_zip) safeSetItem('user_zip', response.data.user.user_zip);
      if (response.data.user.user_country) safeSetItem('user_country', response.data.user.user_country);
      if (response.data.user.user_fullname) safeSetItem('user_fullname', response.data.user.user_fullname);      navigate('/dashboard')
      console.log(response.data);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="make-login-signup-form-center">
<div className="unique-login-container">
  <h2 className="unique-login-header">Login</h2>
  <form onSubmit={handleSubmit} className="unique-login-form">
    <div className="unique-form-field">
      <label htmlFor="user_email" className="unique-form-label">Email</label>
      <input
        type="email"
        id="user_email"
        name="user_email"
        value={formData.user_email}
        onChange={handleChange}
        required
        className="unique-form-input"
      />
    </div>
    <div className="unique-form-field">
      <label htmlFor="user_password" className="unique-form-label">Password</label>
      <input
        type="password"
        id="user_password"
        name="user_password"
        value={formData.user_password}
        onChange={handleChange}
        required
        className="unique-form-input"
      />
    </div>
    <button type="submit" className="unique-submit-button" role="button">
      <span className="unique-button-text">Login</span>
    </button>
  </form>
  {error && <div className="unique-error-message">{error}</div>}
  {success && <div className="unique-success-message">{success}</div>}
</div>
</div>

  );
};

export default UserLogin;
