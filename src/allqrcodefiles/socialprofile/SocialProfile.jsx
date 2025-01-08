import React, { useState, useRef, useContext, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo'
import axios from 'axios';
import Configuration from '../stats/configuration/Configuration';
import CustomizationForm from '../../allqrcodeCustomizations/designCustomization/DesignCustomization';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';
import { useQR } from '../../allqrcodeCustomizations/qrCodeCustomization/globalqrcodedesign';
import { useFormContext } from '../../allqrcodeCustomizations/globalsetup/globaldata';
import { useNavigate } from 'react-router-dom';
import SocialProfileDisplay from './SoicalProfileView';
import { useCustomization } from '../../allqrcodeCustomizations/designCustomization/globalcustomization';
const SocialProfile = () => {
  const navigate = useNavigate()
  const { qrSettings } = useQR();
  const { customization, updateCustomization } = useCustomization();
  const user_id = localStorage.getItem('user_id');

  const { handleSubmit, qrvalueide, handleUpdate, buyCredits, handleDownload,handleDownload1, handleBuyCredits, isPopupOpen, handleClosePopup } = useFormContext()



  const [socialdata, setSocialdata] = useState({
    social_social_networks: [],//✔️
    Social_welcome_screen: "",//✔️
    Social_welcome_screen_time: 5,//✔️
    social_display_theme: 'defualt',//✔️
    user_id,
  });
  const data = { ...socialdata };



  useEffect(() => {
    if (!user_id) {
      navigate("/user/login"); // Navigate to the login page if user_id is not available
    } else {
      const editableData = localStorage.getItem("requestBusinessEdit");
      if (editableData) {
        setSocialdata(JSON.parse(localStorage.getItem("businessdatasending")))
      } else {
        const savedData = localStorage.getItem("socialdata");
        if (savedData) {
          setSocialdata(JSON.parse(savedData)); // Populate state with saved data
        }
        setTimeout(() => {
          localStorage.removeItem("socialdata");
          localStorage.removeItem("currentPath");
          localStorage.removeItem("nextpath");
          localStorage.removeItem("pricing")
        }, 3000);
      }
    }
  }, []);
  const editdataShowSidebar = localStorage.getItem("requestBusinessEdit");

  const handleIconClick = (platform) => {
    // Add the selected platform to social_social_networks
    const alreadySelected = socialdata.social_social_networks.some(
      (network) => network.platform === platform.name
    );

    if (!alreadySelected) {
      setSocialdata((prevData) => ({
        ...prevData,
        social_social_networks: [
          ...prevData.social_social_networks,
          { platform: platform.name, link: "", message: "" },
        ],
      }));
    }
  };

  const handleInputChangeSocial = (e, platform, field) => {
    setSocialdata((prevData) => {
      const updatedSocialNetworks = prevData.social_social_networks.map((network) => {
        if (network.platform === platform) {
          return { ...network, [field]: e.target.value };
        }
        return network;
      });

      return { ...prevData, social_social_networks: updatedSocialNetworks };
    });
  };

  const handleRemovePlatform = (platform) => {
    setSocialdata((prevData) => ({
      ...prevData,
      social_social_networks: prevData.social_social_networks.filter(
        (network) => network.platform !== platform
      ),
    }));
  };

  const handleImageChange = async (e, imageType) => {
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
        if (imageType === "Social_welcome_screen") {
          setSocialdata((prevData) => ({
            ...prevData,
            Social_welcome_screen: imageUrl,
          }));
        }

        // Reset the message state
        setMessage('Image uploaded successfully!');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image. Please try again.');
      setMessageType('error');
    }
  };

  // Function to handle removing an image from the state
  const handleImageRemove = (imageType) => {
    if (imageType === "Social_welcome_screen") {
      setSocialdata((prevData) => ({
        ...prevData,
        Social_welcome_screen: "",
      }));
    }
  };

  const socialPlatforms = [
    { name: "Facebook", icon: "📘" },
    { name: "Twitter", icon: "🐦" },
    { name: "Instagram", icon: "📸" },
    { name: "LinkedIn", icon: "🔗" },
    { name: "YouTube", icon: "🎥" },
    { name: "TikTok", icon: "🎵" },
    { name: "Snapchat", icon: "👻" },
    { name: "WhatsApp", icon: "💬" },
    { name: "Pinterest", icon: "📌" },
    { name: "Reddit", icon: "👽" },
    { name: "Tumblr", icon: "📓" },
    { name: "Vimeo", icon: "🎬" },
    { name: "Skype", icon: "🖥️" },
    { name: "Spotify", icon: "🎧" },
    { name: "Discord", icon: "💬" },
    { name: "Telegram", icon: "📱" },
    { name: "Slack", icon: "📡" },
    { name: "WeChat", icon: "🟢" },
    { name: "Messenger", icon: "💬" },
  ];
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSliderChange = (e) => {
    const value = e.target.value;
    setSocialdata({
      ...socialdata,
      Social_welcome_screen_time: value,
    });
  };
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
  const ref = useRef();

  const [openSections, setOpenSections] = useState({}); // Track open/closed states

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const handleThemeSelection = (theme) => {
    setSocialdata((prevData) => ({
      ...prevData,
      social_display_theme: theme,
    }));
  };

  return (
    
    <div className="business-info-page">
    <div className="collapsible-container">

      <div className="business-form-container">
        <div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.section0 ? "opened" : ""}`}
            onClick={() => toggleSection("section0")}
          >
            <span>Select Theme</span>
            <span className={`arrow ${openSections.section0 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.section0 && (
            <div className="collapsible-content">
              <div className="selection-of-section">
                <div className="toggle-switch">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={socialdata.social_display_theme === 'defualt'}
                      onChange={() => handleThemeSelection('defualt')}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="toggle-label" onClick={() => handleThemeSelection('defualt')} >Default</span>
                </div>

                <div className="theme-images">
                
                  <img
                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733993598/ktjadhnbznqlj7w8flys.png"
                    alt="Theme 1"
                    onClick={() => handleThemeSelection('theme1')}
                    className={`theme-image ${socialdata.social_display_theme === 'theme1' ? 'selected' : ''}`}
                  />
                  <img
                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734005397/esthtdmgmuole2djbqu4.png"
                    alt="Theme 2"
                    onClick={() => handleThemeSelection('theme2')}
                    className={`theme-image ${socialdata.social_display_theme === 'theme2' ? 'selected' : ''}`}
                  />
                  <img
                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733993440/jvt0sbaqet7sobomoby3.png"
                    alt="Theme 3"
                    onClick={() => handleThemeSelection('theme3')}
                    className={`theme-image ${socialdata.social_display_theme === 'theme3' ? 'selected' : ''}`}
                  />
                </div>
              </div>

            </div>
          )}
        </div>
        <div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.socialsection3 ? "opened" : ""}`}
            onClick={() => toggleSection("socialsection3")}
          >
            <span>Social information</span>
            <span className={`arrow ${openSections.socialsection3 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.socialsection3 && (
            <div className="collapsible-content">
              <div className="collapsible-section">
                <div
                  className={`collapsible-header ${openSections.under2section3 ? "opened" : ""}`}
                  onClick={() => toggleSection("under2section3")}
                >
                  <span>Social Networks</span>
                  <span className={`arrow ${openSections.under2section3 ? "down" : "right"}`}>
                    <i className="ri-arrow-down-fill"></i>
                  </span>
                </div>
                {openSections.under2section3 && (
                  <div className="collapsible-content">
                    <div className="social-media-container">
                      <div className="social-media-selection-container">
                        {socialdata.social_social_networks.map((network, index) => (
                          <div key={index} className="social-media-network-card">
                            <div className="social-media-network-header">
                              <strong className="social-media-platform-names">{network.platform}</strong>
                              <button
                                onClick={() => handleRemovePlatform(network.platform)}
                                className="remove-platform-button"
                              >
                                ❌
                              </button>
                            </div>
                            <div className="flex-the-link-or-message-social">
                              <input
                                type="text"
                                placeholder="Enter link"
                                value={network.link}
                                onChange={(e) => handleInputChangeSocial(e, network.platform, "link")}
                                
                              />
                              <input
                                type="text"
                                placeholder="Enter message"
                                value={network.message}
                                onChange={(e) => handleInputChangeSocial(e, network.platform, "message")}
                                
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <h3 className="social-media-header">Social Media Platforms</h3>

                      <div className="social-media-platforms-container">
                        {socialPlatforms.map((platform) => (
                          <div
                            key={platform.name}
                            onClick={() => handleIconClick(platform)}
                            className="social-media-platform-card"
                          >
                            <span className="social-media-platform-icon">{platform.icon}</span>
                            <div className="social-media-platform-name">{platform.name}</div>
                          </div>
                        ))}
                      </div>


                    </div>
                  </div>
                )}
              </div>
              <div className="collapsible-section">
                <div
                  className={`collapsible-header ${openSections.under2section4 ? "opened" : ""}`}
                  onClick={() => toggleSection("under2section4")}
                >
                  <span>Welcome Screen</span>
                  <span className={`arrow ${openSections.under2section4 ? "down" : "right"}`}>
                    <i className="ri-arrow-down-fill"></i>
                  </span>
                </div>
                {openSections.under2section4 && (
                  <div className="collapsible-content">
                    <div className="business-welcome-screen-container">
                      <label className="business-welcome-screen-label">Business Welcome Screen</label>
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e, "Social_welcome_screen")}
                        accept="image/*"
                      />
                      {socialdata.Social_welcome_screen && (
                        <div className="image-preview-container">
                          <img
                            src={socialdata.Social_welcome_screen}
                            alt="Welcome Screen"
                            className="welcome-image-preview"
                          />
                          <button
                            onClick={() => handleImageRemove("Social_welcome_screen")}
                            className="remove-image-btn"
                          >
                            ✖
                          </button>

                        </div>
                      )}

                      <label htmlFor="welcome-screen-time" className="welcome-screen-time-label">
                        Welcome Screen Time (seconds):
                      </label>
                      <input
                        id="welcome-screen-time"
                        type="range"
                        min="1"
                        max="30"
                        value={socialdata.Social_welcome_screen_time}
                        onChange={handleSliderChange}
                        className="welcome-screen-time-slider"
                      />
                      <span className="welcome-screen-time-display">
                        {socialdata.Social_welcome_screen_time} seconds
                      </span>
                    </div>

                  </div>
                )}
              </div>
            </div>

          )}
        </div>
        <div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.socialsection0 ? "opened" : ""}`}
            onClick={() => toggleSection("socialsection0")}
          >
            <span>Configuration</span>
            <span className={`arrow ${openSections.socialsection0 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.socialsection0 && (
            <div className="collapsible-content">
              <Configuration />
            </div>

          )}
        </div>
        <div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.socialsection1 ? "opened" : ""}`}
            onClick={() => toggleSection("socialsection1")}
          >
            <span>Customization</span>
            <span className={`arrow ${openSections.socialsection1 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.socialsection1 && (
            <div className="collapsible-content">
              <CustomizationForm />
            </div>

          )}
        </div>
        <div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.section7 ? "opened" : ""}`}
            onClick={() => toggleSection("section7")}
          >
            <span>Qr Design</span>
            <span className={`arrow ${openSections.section7 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.section7 && (
            <div className="collapsible-content">
              <div className="qr-deigningig-component">
                <QRCodeGenerator />
                <div className='qr-display-container-fix-it'>
                  <div style={{
                    '--bg-color': qrSettings.bgColor || '#ffffff',
                    '--fg-color': qrSettings.fgColor || '#000',
                  }}
                    className={`${qrSettings.frame}`}>

                    <QRCode
                      value={`Dummy Qr for style Display`}
                      ecLevel={qrSettings.ecLevel}
                      enableCORS={qrSettings.enableCORS}
                      size={qrSettings.size}
                      quietZone={qrSettings.quietZone}
                      bgColor={qrSettings.bgColor}
                      fgColor={qrSettings.fgColor}
                      qrStyle={qrSettings.qrStyle}
                      eyeColor={qrSettings.eyeColor}
                      eyeRadius={qrSettings.eyeRadius}
                      logoImage={qrSettings.logo}
                      logoWidth={qrSettings.logoWidth}
                      logoHeight={qrSettings.logoHeight}
                      logoOpacity={qrSettings.logoOpacity}
                      removeQrCodeBehindLogo={qrSettings.removeQrCodeBehindLogo}
                      logoPadding={qrSettings.logoPadding}
                      logoPaddingStyle={qrSettings.logoPaddingStyle}
                    />
                  </div>
                   <br />
                  {buyCredits ? (
                    <div className="buy-credits-container">
                      <h2>Buy Credits</h2>
                      <p>
                        To create and customize QR codes, you need to purchase additional credits.
                        <br />
                      </p>
<button class="button-57" style={{width:'100%'}} onClick={() => handleBuyCredits(data)} role="button"><span class="text">Buy Credits</span><span>You don't have credits</span></button>
                    </div>
                  ) : (

                    !editdataShowSidebar ? (
                      <>
<button class="button-57" style={{width:'100%'}} onClick={() => {
                            handleSubmit("facebook", data); // Pass 'Business Text' and 'data'
                          }} role="button"><span class="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                      </>
                    ) : (
<button class="button-57" style={{width:'100%'}} onClick={() => handleUpdate(socialdata._id, "facebook", data)} role="button"><span class="text">Update</span><span>Update</span></button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {isPopupOpen && (
          <div className="modal-overlay-open-qr-pop-up">
            <div className="modal-content-open-qr-pop-up">
              {/* Close Button */}
              <button className="close-btn-open-qr-pop-up" onClick={handleClosePopup}>
                x
              </button>

              {/* QR Code Display */}
              {qrvalueide && (
                <div className="qr-display-container-pop-up">
                  <div
                    ref={ref}
                    style={{
                      '--bg-color': qrSettings.bgColor || '#ffffff',
                      '--fg-color': qrSettings.fgColor || '#000',
                    }}
                    className={`${qrSettings.frame}`}
                  >
                    <QRCode
                      value={`${process.env.REACT_APP_FRONTEND_URL}/display/qr-social/${qrvalueide}`}
                      ecLevel={qrSettings.ecLevel}
                      enableCORS={qrSettings.enableCORS}
                      size={qrSettings.size}
                      quietZone={qrSettings.quietZone}
                      bgColor={qrSettings.bgColor}
                      fgColor={qrSettings.fgColor}
                      qrStyle={qrSettings.qrStyle}
                      eyeColor={qrSettings.eyeColor}
                      eyeRadius={qrSettings.eyeRadius}
                      logoImage={qrSettings.logo}
                      logoWidth={qrSettings.logoWidth}
                      logoHeight={qrSettings.logoHeight}
                      logoOpacity={qrSettings.logoOpacity}
                      removeQrCodeBehindLogo={qrSettings.removeQrCodeBehindLogo}
                      logoPadding={qrSettings.logoPadding}
                      logoPaddingStyle={qrSettings.logoPaddingStyle}
                    />
                  </div>

                  <div className="download-button" data-tooltip="Size: 175kb" onClick={() => handleDownload1(ref)}>
<div className="download-button-wrapper">
  <div className="download-text">Download</div>
    <span className="download-icon">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
  <path 
    fill="none" 
    stroke="currentColor" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth="2" 
    d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
</svg>
    </span>
  </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
    </div>

      <div className="mobile-image-container">
        <div className="mobile-image-container-we">
        <div className="mobile-container-camera-wrapper">
          <div className="camera-mobile">
          </div>
            <SocialProfileDisplay data={socialdata} customization={customization} />
        </div>
      </div>
      </div>

    </div>
  );
};

export default SocialProfile;
