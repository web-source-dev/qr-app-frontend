import React, { useEffect, useState } from 'react';

const LandingPageDisplay = ({ shopMenuDataGet, ConfigurationShopMenuData, data, customization }) => {
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

  return (
    <div>
      {/* Display landing page name */}
      <h1>{showData.landingpage_name}</h1>

      {/* Display landing page image */}
      <img 
        src={showData.landingpage_image} 
        alt="Landing Page" 
        style={{ width: '100%', maxHeight: 'auto', marginBottom: '20px' }}
      />

      {/* Render content with dangerouslySetInnerHTML to handle HTML */}
      <div
        className="landingpage-content"
        dangerouslySetInnerHTML={{ __html: showData.content }}
      />
    </div>
  );
};

export default LandingPageDisplay;
