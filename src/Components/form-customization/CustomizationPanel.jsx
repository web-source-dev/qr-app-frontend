import React from 'react';

const CustomizationPanel = ({
  selectTheme,
  setSelectTheme,
  handleColorChange,
  handleThemeSubmit,
  formData,
  selectedImage,
}) => {
  return (
    <div className="qr-form-container">
      <h2>Customize Your Display</h2>
      <div className="left-panel-for-customizing-display">
        <label htmlFor="backgroundColor">Background Color:</label>
        <input
          type="color"
          name="backgroundColor"
          value={selectTheme.backgroundColor}
          onChange={handleColorChange}
        />

        <label htmlFor="textColor">Text Color:</label>
        <input
          type="color"
          name="textColor"
          value={selectTheme.textColor}
          onChange={handleColorChange}
        />

        <label htmlFor="borderColor">Border Color:</label>
        <input
          type="color"
          name="borderColor"
          value={selectTheme.borderColor}
          onChange={handleColorChange}
        />

        <label htmlFor="innerBoxColor">Inner Box Color:</label>
        <input
          type="color"
          name="innerBoxColor"
          value={selectTheme.innerBoxColor}
          onChange={handleColorChange}
        />

        <label htmlFor="headingColor">Heading Color:</label>
        <input
          type="color"
          name="headingColor"
          value={selectTheme.headingColor}
          onChange={handleColorChange}
        />

        <label htmlFor="buttonColor">Button Color:</label>
        <input
          type="color"
          name="buttonColor"
          value={selectTheme.buttonColor}
          onChange={handleColorChange}
        />

        <label htmlFor="linksColor">Links Color:</label>
        <input
          type="color"
          name="linksColor"
          value={selectTheme.linksColor}
          onChange={handleColorChange}
        />
      </div>

      {/* Preview Section */}
      <div className="preview">
        <h3>Preview</h3>
        <div
          className="preview-image"
          style={{
            backgroundColor: selectTheme.backgroundColor,
            color: selectTheme.textColor,
            borderColor: selectTheme.borderColor,
            borderWidth: '2px',
            borderStyle: 'solid',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          {/* Display the selected image */}
          <img
            src={formData.user_image}
            alt="Selected Theme"
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: `2px solid ${selectTheme.innerBoxColor}`,
            }}
          />
          <h3 style={{ color: selectTheme.headingColor }}>Your Name: {formData.name}</h3>
          <button
            style={{
              backgroundColor: selectTheme.buttonColor,
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Action Button
          </button>
          <div
            style={{
              marginTop: '20px',
              color: selectTheme.linksColor,
            }}
          >
            <a href={formData.youtube_url} target="_blank" rel="noopener noreferrer">YouTube</a> |
            <a href={formData.facebook_url} target="_blank" rel="noopener noreferrer"> Facebook</a> |
            <a href={formData.linkden_url} target="_blank" rel="noopener noreferrer"> LinkedIn</a> |
            <a href={formData.twitter_url} target="_blank" rel="noopener noreferrer"> Twitter</a>
          </div>
        </div>
      </div>

      <button onClick={handleThemeSubmit}>Save Changes</button>
    </div>
  );
};

export default CustomizationPanel;
