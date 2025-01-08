import React, { useEffect, useState } from 'react';

const ImagesDisplay = ({ shopMenuDataGet, ConfigurationShopMenuData, data, customization }) => {
  const [showData, setShowData] = useState(null);
  const [showConfig, setShowConfig] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    console.log(data);
    console.log(customization);
    const afterScanData = localStorage.getItem("afterScan");

    if (afterScanData) {
      setShowData(shopMenuDataGet);
      setShowConfig(ConfigurationShopMenuData);
    } else {
      setShowData(data);
      setShowConfig(customization);
    }

    const timeoutId = setTimeout(() => {
      localStorage.removeItem("afterScan");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [data, shopMenuDataGet, ConfigurationShopMenuData, customization]);

  if (showConfig === null) return <div>Loading...</div>;
  if (!showData) return <div>Loading...</div>; // Render a placeholder or loading state

  const {
    titleColor,
    textColor,
    primaryColor,
    secondaryColor,
    buttonColor,
    buttonTextColor,
    fontFamily,
    icons_color,
  } = showConfig;

  const themePrefix = showData.shop_display_theme ? `${showData.shop_display_theme}-` : '';

  return (
    <div
      className={`${themePrefix}shop-menu-display`}
      style={{
        '--primary-color': primaryColor,
        '--title-color': titleColor,
        '--text-color': textColor,
        '--icons-color': icons_color,
        '--secondary-color': secondaryColor,
        '--button-color': buttonColor,
        '--button-text-color': buttonTextColor,
        '--font-family': fontFamily,
      }}
    >
        {showData.Images_title && <h3>{showData.Images_title}</h3>}
        {showData.Images_description && <p>{showData.Images_description}</p>}

      {/* Render images */}
      {showData.Images && showData.Images.map((image, index) => (
        <img key={index} src={image} alt={`Image ${index + 1}`} style={{ width: '100%', marginBottom: '10px' }} />
      ))}

      {/* Optional: Add any other content like buttons, text, etc. */}
      <div className="button-container">
        <a href={showData.Images_btn_url} className="button" style={{ backgroundColor: buttonColor, color: buttonTextColor }}>
          {showData.Images_btn_text}
        </a>
      </div>
    </div>
  );
};

export default ImagesDisplay;
