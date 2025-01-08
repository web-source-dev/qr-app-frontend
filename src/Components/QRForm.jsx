import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './customize.css';
import FormInput from './form-customization/FormInput';
import QRCodeStep from './form-customization/QRCodeStep';
import ThemeSelection from './form-customization/ThemeSelection';
import CustomizationPanel from './form-customization/CustomizationPanel';

const QRForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    work_email: '',
    organization: '',
    phone: '',
    address: '',
    youtube_url: '',
    facebook_url: '',
    linkden_url: '',
    twitter_url: '',
    user_image: null,
  });

  const [userId, setUserId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image for Step 2/3
  const [selectTheme, setSelectTheme] = useState({
    backgroundColor: '',
    textColor: '',
    borderColor: '',
    innerBoxColor: '',
    headingColor: '',
    buttonColor: '',
    linksColor: '',
    userId: userId,
    theme_set: selectedImage,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [namedata, setNamedata] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // Track the current step

  const navigate = useNavigate();
  const user_id_login = localStorage.getItem('user_id');
  const user_token = localStorage.getItem('user_token');

  useEffect(() => {
    if (!user_token) {
      navigate('/user/login');
    }
  }, [navigate, user_token]);

  // Cloudinary credentials
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const cloudName = 'dcvqytwuq';
  const uploadPreset = 'my_qr_preset';
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    // Validate file type and size
    if (file && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setMessage('Invalid image format. Please upload a JPEG, PNG, or GIF file.');
      setMessageType('error');
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage('File size exceeds the 5MB limit.');
      setMessageType('error');
      return;
    }

    // Prepare the form data for Cloudinary upload
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', uploadPreset);
    uploadData.append('cloud_name', cloudName);

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, uploadData);

      if (response.status === 200) {
        const imageUrl = response.data.secure_url;
        setFormData((prev) => ({ ...prev, user_image: imageUrl }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image. Please try again.');
      setMessageType('error');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = { ...formData, user_id: user_id_login };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/qrdata`, dataToSend);

      if (response.status === 201) {
        const { userId, qrdata } = response.data;
        setUserId(userId);
        setIsSubmitted(true);
        setMessage('Form submitted successfully!');
        setMessageType('success');
        setNamedata(qrdata);
        setCurrentStep(2); // Move to Step 2 after successful form submission
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error: Please check the data.');
      setMessageType('error');
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setCurrentStep(4); // Move to Step 3 after selecting an image
  };

  const downloadQRCode = () => {
    const canvas = document.createElement('canvas');
    const qrCanvas = document.getElementById('qr-code-canvas');

    if (!qrCanvas) {
      setMessage('QR Code not generated yet. Please submit the form first.');
      setMessageType('error');
      return;
    }

    const qrCodeSize = 300;
    const padding = 50;

    canvas.width = qrCodeSize + padding * 2;
    canvas.height = qrCodeSize + 150;

    const context = canvas.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#000000';
    context.font = '20px Arial';
    context.textAlign = 'center';
    context.fillText(namedata.name, canvas.width / 2, 30);

    context.drawImage(qrCanvas, padding, 50, qrCodeSize, qrCodeSize);

    context.fillText(`ID: ${userId}`, canvas.width / 2, qrCodeSize + 80);

    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = 'user-qr-code.png';
    a.click();
  };

  const handleThemeSubmit = async () => {
    if (!userId) {
      console.error('User ID is missing!');
      return;
    }

    const themeData = {
      ...selectTheme,
      userId: userId, // Ensure userId is included
      theme_set: selectedImage, // Ensure image is included
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/theme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeData), // Send the theme data as JSON
      });

      if (!response.ok) {
        throw new Error('Theme submission failed');
      }

      const data = await response.json();
      console.log('Theme submitted successfully', data);
      setMessage('Theme applied successfully!');
      navigate('/data')
    } catch (error) {
      console.error('Error submitting theme:', error);
    }
  };

  const handleColorChange = (event) => {
    const { name, value } = event.target;
    setSelectTheme((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="center-form-c">
      {currentStep === 1 && (
        <FormInput 
          formData={formData} 
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          handleImageChange={handleImageChange}
          message={message}
          setMessage={setMessage}
        />
      )}

      {currentStep === 2 && (
        <QRCodeStep 
          userId={userId}
          downloadQRCode={downloadQRCode}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 3 && (
        <ThemeSelection 
          selectedImage={selectedImage} 
          setSelectedImage={setSelectedImage}
          setCurrentStep={setCurrentStep}
        />
      )}

      {currentStep === 4 && (
        <CustomizationPanel 
          selectTheme={selectTheme}
          setSelectTheme={setSelectTheme}
          handleColorChange={handleColorChange}
          handleThemeSubmit={handleThemeSubmit}
          formData={formData}
          selectedImage={selectedImage}
        />
      )}
    </div>
  );
};

export default QRForm;
