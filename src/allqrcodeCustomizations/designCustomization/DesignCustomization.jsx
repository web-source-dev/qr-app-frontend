import React from 'react';
import './designCustomization.css';
import { useCustomization } from './globalcustomization';

const CustomizationForm = () => {
  const { customization, updateCustomization } = useCustomization();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateCustomization(name, value);
  };

  return (
    <div className="customization-form-container">
      <h2>Customize Your Theme</h2>

      <div className="color-picker-group">
        <div className="color-picker-container">
          <label className='label-bold-small-big' htmlFor="titleColor">Title Color:</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              id="titleColor"
              name="titleColor"
              value={customization.titleColor}
              onChange={handleChange}
            />
            {customization.titleColor && <p className="color-code">{customization.titleColor}</p>}
          </div>
        </div>

        <div className="color-picker-container">
          <label className='label-bold-small-big' htmlFor="textColor">Text Color:</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              id="textColor"
              name="textColor"
              value={customization.textColor}
              onChange={handleChange}
            />
            {customization.textColor && <p className="color-code">{customization.textColor}</p>}
          </div>
        </div>

      </div>

      <div className="color-picker-group">
        <div className="color-picker-container">
          <label className='label-bold-small-big' htmlFor="primaryColor">Primary Color:</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              id="primaryColor"
              name="primaryColor"
              value={customization.primaryColor}
              onChange={handleChange}
            />
            {customization.primaryColor && <p className="color-code">{customization.primaryColor}</p>}
          </div>
        </div>

        <div className="color-picker-container">
          <label className='label-bold-small-big' htmlFor="secondaryColor">Secondary Color:</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              id="secondaryColor"
              name="secondaryColor"
              value={customization.secondaryColor}
              onChange={handleChange}
            />
            {customization.secondaryColor && <p className="color-code">{customization.secondaryColor}</p>}
          </div>
        </div>
      </div>

      <div className="color-picker-group">
        <div className="color-picker-container">
          <label className='label-bold-small-big' htmlFor="buttonColor">Button Color:</label>

          <div className="color-picker-wrapper">
            <input
              type="color"
              id="buttonColor"
              name="buttonColor"
              value={customization.buttonColor}
              onChange={handleChange}
            />
            {customization.buttonColor && <p className="color-code">{customization.buttonColor}</p>}
          </div>
        </div>
        <div className="color-picker-container">
          <label className='label-bold-small-big' htmlFor="buttonTextColor">Button Text Color:</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              id="buttonTextColor"
              name="buttonTextColor"
              value={customization.buttonTextColor}
              onChange={handleChange}
            />
            {customization.buttonTextColor && <p className="color-code">{customization.buttonTextColor}</p>}
          </div>
        </div>



      </div>
      <div className="color-picker-group">
        <div className="color-picker-container">
          <label className='label-bold-small-big' htmlFor="icons_color">Social Icon Color:</label>
          <div className="color-picker-wrapper">
          <input
            type="color"
            id="icons_color"
            name="icons_color"
            value={customization.icons_color}
            onChange={handleChange}
          />
          {customization.icons_color && <p className="color-code">{customization.icons_color}</p>}
        </div>
        </div>
        <div className="color-picker-container">
          <label className='label-bold-small-big' htmlFor="fontFamily">Font Family:</label>
          <select
            id="fontFamily"
            name="fontFamily"
            value={customization.fontFamily}
            onChange={handleChange}
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Verdana', sans-serif">Verdana</option>
            <option value="'Georgia', serif">Georgia</option>
            <option value="'Tahoma', sans-serif">Tahoma</option>
            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
            <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
            <option value="'Helvetica', sans-serif">Helvetica</option>
            <option value="'Lucida Console', monospace">Lucida Console</option>
            <option value="'Gill Sans', sans-serif">Gill Sans</option>
            <option value="'Futura', sans-serif">Futura</option>
            <option value="'Palatino', serif">Palatino</option>
            <option value="'Garamond', serif">Garamond</option>
            <option value="'Baskerville', serif">Baskerville</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Lato', sans-serif">Lato</option>
            <option value="'Montserrat', sans-serif">Montserrat</option>
            <option value="'Oswald', sans-serif">Oswald</option>
            <option value="'Poppins', sans-serif">Poppins</option>
            <option value="'Merriweather', serif">Merriweather</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
            <option value="'Raleway', sans-serif">Raleway</option>
            <option value="'Nunito', sans-serif">Nunito</option>
            <option value="'Inconsolata', monospace">Inconsolata</option>
            <option value="'Source Sans Pro', sans-serif">Source Sans Pro</option>
            <option value="'Ubuntu', sans-serif">Ubuntu</option>
            <option value="'Dancing Script', cursive">Dancing Script</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomizationForm;
