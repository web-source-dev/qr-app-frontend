import React, { useEffect, useState } from 'react';
import './themescreation.css';

const ShopMenuDisplay = ({ shopMenuDataGet,ConfigurationShopMenuData,data, customization }) => {
  const [showData, setShowData] = useState(null);
  const [showConfig, setShowConfig] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
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

  // Manage the expanded categories

  const handleCategoryClick = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index); // Toggle category visibility
  };
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this page!',
        text: 'This is an awesome page I wanted to share with you.',
        url: window.location.href,
      })
      .then(() => console.log('Successfully shared!'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing is not supported on this device.');
    }
  };
  

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
      {/* Shop Details */}
      <div className={`${themePrefix}shop-header`}>
       <div className={`${showData.shop_display_theme === 'theme3' ? 'theme3-logo-set-image' : ''}`}>
       <img
          src={showData.shop_image_logo}
          alt={showData.shopName}
          className={`${themePrefix}shop-logo`}
        />
        <h1>{showData.shopName}</h1>
       </div>
        <p>{showData.shopDescription}</p>
      </div>

{/* Categories and Products */}
<div className={`${themePrefix}shop-categories`}>
  <h2>Menu</h2>
  {showData.categories.map((category, index) => (
    <div key={index} className={`${themePrefix}category`}>
      <h3
        onClick={() => handleCategoryClick(index)}
        className={`${themePrefix}category-title`}
      >
        {category.categoryName}
      </h3>
      {expandedCategory === index && (
        <ul className={`${themePrefix}product-list`}>
          {category.products.map((product, idx) => (
            <li key={idx} className={`${themePrefix}product-item`}>
              <img
                src={product.image}
                alt={product.name}
                className={`${themePrefix}product-image`}
              />
              <div className={`${themePrefix}product-details`}>
                <h4>{product.name}</h4>
                <p>Price: ${product.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  ))}
</div>

      {/* Shop Schedule */}
{/* Shop Schedule */}
<div className={`${themePrefix}shop-schedule`}>
  <h2>Shop Schedule</h2>
  <ul className={`${themePrefix}schedule-list`}>
    {showData.shop_schedule.map((schedule, index) => (
      <li key={index} className={`${themePrefix}schedule-item`}>
        <strong className={`${themePrefix}day-name`}>{schedule.day}</strong>
        {schedule.time_slots.length > 0 ? (
          <ul className={`${themePrefix}time-slots`}>
            {schedule.time_slots.map((slot, idx) => (
              <li key={idx} className={`${themePrefix}time-slot`}>
                <p className={`${themePrefix}start-end-time`}>
                  {slot.start_time} - {slot.end_time}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`${themePrefix}closed`}>Closed</p>
        )}
      </li>
    ))}
  </ul>
</div>

<div className={`${themePrefix}shop-contact`}>
  <div className={`${themePrefix}contact-item`}>
    <i className="ri-phone-line"></i>
    <p>{showData.shop_contact}</p>
  </div>
  <div className={`${themePrefix}contact-item`}>
    <i className="ri-mail-line"></i>
    <p>{showData.shop_email}</p>
  </div>
  <div className={`${themePrefix}contact-item`}>
    <i className="ri-map-pin-line"></i>
    <p>{showData.shop_address}</p>
  </div>
</div>
  <div className={`${themePrefix}additional-info`}>
    <p><strong>Additional Info:</strong> {showData.shop_additional_info}</p>
  </div>

<button className={`${themePrefix}share-now-button`} onClick={handleShareClick}>
        <i className="ri-share-line"></i> Share
      </button>

    </div>
  );
}

export default ShopMenuDisplay;
