import React from 'react';

const ThemeSelection = ({ selectedImage, setSelectedImage, setCurrentStep }) => {
  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setCurrentStep(4);
  };

  return (
    <div className="qr-form-container">
      <h2>Select a Theme</h2>
      <div className="select-theme">
        <img src="theme1.jpg" alt="Theme 1" onClick={() => handleImageSelect('theme1')} />
        <img src="theme2.jpg" alt="Theme 2" onClick={() => handleImageSelect('theme2')} />
        <img src="theme3.jpg" alt="Theme 3" onClick={() => handleImageSelect('theme3')} />
      </div>
    </div>
  );
};

export default ThemeSelection;
