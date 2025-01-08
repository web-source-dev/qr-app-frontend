import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignUpCss.css'
import { useNavigate } from 'react-router-dom';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_password: '',
  });

  const navigate = useNavigate()
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      if(!formData.user_email || !formData.user_name || !formData.user_password){
        setError('Please fill all fields');
        return;
      }
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/signup`, formData);
      setSuccess('Signup successful!');
      setFormData({ user_name: '', user_email: '', user_password: '' }); // Clear form
      const responselogin = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, formData);
      setError('');
      localStorage.setItem('user_id', responselogin.data.user_id);
      localStorage.setItem('user_token', responselogin.data.token);
      localStorage.setItem('user_email', responselogin.data.user_email);
      navigate('/dashboard')
    } catch (err) {
      setError('Error during signup. Please try again.');
    }
  };

  return (
    <div className="make-login-signup-form-center">
    <div className="unique-login-container">
    <h2 className="unique-login-header">Sign Up</h2>
    <form onSubmit={handleSubmit} className="unique-signup-form">
      <div className="unique-form-field">
        <label htmlFor="user_name" className="unique-form-label">Username</label>
        <input
          type="text"
          id="user_name"
          name="user_name"
          value={formData.user_name}
          onChange={handleChange}
          required
          className="unique-form-input"
        />
      </div>
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
      <button type="submit" className="unique-submit-button">Sign Up</button>
    </form>
    {error && <div className="unique-error-message">{error}</div>}
    {success && <div className="unique-success-message">{success}</div>}
  </div>
  </div>
  );
};

export default UserSignup;
