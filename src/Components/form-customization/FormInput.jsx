import React from 'react';
import { useNavigate } from 'react-router-dom';

const FormInput = ({ formData, setFormData, handleFormSubmit, handleImageChange, message, setMessage }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const navigate = useNavigate();

  return (
    <div className="qr-form-container">
      <button onClick={() => navigate('/data')}>All users</button>
      <h1>Form Submission</h1>
      <form className="qr-form" onSubmit={handleFormSubmit}>
        <div className="form-inputs-flex">
          <div className="left-side-form">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
            <input type="email" name="work_email" placeholder="Work Email" value={formData.work_email} onChange={handleInputChange} />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} required />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
            <input type="file" name="user_image" onChange={handleImageChange} accept="image/*" />
            {formData.user_image && <img src={formData.user_image} width="80px" height="80px" alt="User" />}
          </div>
          <div className="right-side-form">
            <input type="text" name="organization" placeholder="Organization" value={formData.organization} onChange={handleInputChange} required />
            <input type="url" name="youtube_url" placeholder="YouTube URL" value={formData.youtube_url} onChange={handleInputChange} />
            <input type="url" name="facebook_url" placeholder="Facebook URL" value={formData.facebook_url} onChange={handleInputChange} />
            <input type="url" name="linkden_url" placeholder="LinkedIn URL" value={formData.linkden_url} onChange={handleInputChange} />
            <input type="url" name="twitter_url" placeholder="Twitter URL" value={formData.twitter_url} onChange={handleInputChange} />
          </div>
        </div>
        <button className="submit-btn" type="submit">Submit</button>
        {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
      </form>
    </div>
  );
};

export default FormInput;
