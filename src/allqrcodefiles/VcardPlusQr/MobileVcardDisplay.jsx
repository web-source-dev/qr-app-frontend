import React, { useEffect, useState } from 'react';

const VcardDisplay = ({ shopMenuDataGet, ConfigurationShopMenuData, data, customization }) => {
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
  if (!showData) return <div>Loading...</div>;

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
        position:'relative'
      }}
    >
      {/* Header Section */}
      <div className={`${themePrefix}vcard-header`}>
        <img className={`${themePrefix}vcard-image`} src={showData.vcardplus_image} alt="Profile" />
        <h2 className={`${themePrefix}vcard-name`}>
          {showData.vcardplus_name} {showData.vcardplus_surname}
        </h2>
        <p className={`${themePrefix}vcard-title`}>{showData.vcardplus_title}</p>
      </div>
      {showData.vcardPlus_button_top && (
  <button className={`${themePrefix}vcard-btn`}>
    {showData.vcardPlus_btn}
  </button>
)}
      {/* Contact Information */}
      <div className={`${themePrefix}vcard-contact`}>
        {showData.vcardplus_contact.map((contact, index) => (
          <p key={index}><strong>{contact.label}:</strong> {contact.value}</p>
        ))}
      </div>

      {/* Email Information */}
      <div className={`${themePrefix}vcard-email`}>
        {showData.vcardplus_email.map((email, index) => (
          <p key={index}><strong>{email.label}:</strong> {email.value}</p>
        ))}
      </div>

      {/* Website */}
      <div className={`${themePrefix}vcard-website`}>
        <p><strong>{showData.vcardplus_website_name}:</strong> <a href={showData.vcardplus_website_url} target="_blank" rel="noopener noreferrer">{showData.vcardplus_website_url}</a></p>
      </div>

      {/* Business Address */}
      <div className={`${themePrefix}vcard-business`}>
        <p><strong>Business Address:</strong></p>
        <p>{showData.business_address.street}, {showData.business_address.city}, {showData.business_address.state}, {showData.business_address.zip}</p>
      </div>

      {/* Note */}
      <div className={`${themePrefix}vcard-note`}>
        <p><strong>Note:</strong> {showData.vcardplus_note}</p>
      </div>

      {/* Images Gallery */}
      <div className={`${themePrefix}vcard-images`}>
        {showData.vcardplus_images.map((image, index) => (
          <img key={index} className={`${themePrefix}vcard-image-gallery`} src={image} alt={`Gallery ${index}`} />
        ))}
      </div>

      {/* Company Products */}
      <div className={`${themePrefix}vcard-company`}>
        {showData.vcardplus_company.map((company, index) => (
          <div key={index} className={`${themePrefix}company-category`}>
            <h4>{company.categoryName}</h4>
            <ul>
              {company.products.map((product, idx) => (
                <li key={idx}>{product.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Social Media Links */}
      <div className={`${themePrefix}vcard-social`}>
        {showData.vcardplus_social_networks.map((social, index) => (
          <p key={index}>
            <strong>{social.platform}:</strong> <a href={social.link} target="_blank" rel="noopener noreferrer">{social.message}</a>
          </p>
        ))}
      </div>

      {/* Button */}
      {!showData.vcardPlus_button_float && !showData.vcardPlus_button_top && (
  <button className={`${themePrefix}vcard-btn`}>
    {showData.vcardPlus_btn} hello
  </button>
)}
    {showData.vcardPlus_button_float && (
  <button className={`${themePrefix}vcard-btn`} style={{position:'sticky',bottom:'10%',left:"90%"}}>
    {showData.vcardPlus_btn}
  </button>
)}

    </div>
  );
};

export default VcardDisplay;
