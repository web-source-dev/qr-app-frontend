import React, { useEffect, useState } from 'react';

const MusicDisplay = ({ shopMenuDataGet, ConfigurationShopMenuData, data, customization }) => {
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
  {/* Display Music Title */}
  {showData.Music_title && <h3>{showData.Music_title}</h3>}
  
  {/* Display Music Description */}
  {showData.Music_description && <p>{showData.Music_description}</p>}

  {/* Display Uploaded Music */}
  {showData.Music && showData.Music.length > 0 && showData.Music.map((audio, index) => (
    <div key={index} className="audio-container">
      <audio src={audio} controls style={{ width: '100%', marginBottom: '10px' }} />
    </div>
  ))}

  {/* Button Section */}
  <div className="button-container">
    <a href={showData.Music_btn_url} className="button" style={{ backgroundColor: buttonColor, color: buttonTextColor }}>
      {showData.Music_btn_text}
    </a>
  </div>
</div>

  );
};

export default MusicDisplay;
