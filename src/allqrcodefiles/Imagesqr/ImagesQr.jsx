import React, { useState, useRef, useContext, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo'
import axios from 'axios';
import Configuration from '../stats/configuration/Configuration';
import CustomizationForm from '../../allqrcodeCustomizations/designCustomization/DesignCustomization';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';
import { useQR } from '../../allqrcodeCustomizations/qrCodeCustomization/globalqrcodedesign';
import { useFormContext } from '../../allqrcodeCustomizations/globalsetup/globaldata';
import { useNavigate } from 'react-router-dom';
import { useCustomization } from '../../allqrcodeCustomizations/designCustomization/globalcustomization';
import ImagesDisplay from './Mobiledisplay';
const ImagesQr = () => {
    const navigate = useNavigate()
    const { qrSettings } = useQR();
    const { customization, updateCustomization } = useCustomization();
    const user_id = localStorage.getItem('user_id');

    const { handleSubmit, qrvalueide, handleUpdate, buyCredits, handleDownload, handleBuyCredits,handleDownload1, isPopupOpen, handleClosePopup } = useFormContext()



    const [imagesData, setImagesData] = useState({
        Images_title: '',
        Images_description: '',
        Images_btn_text: '',
        Images_btn_url: '',
        Images: [],//✔️
        Social_welcome_screen: "",//✔️
        Social_welcome_screen_time: 5,//✔️
        social_display_theme: 'defualt',//✔️
        user_id,
    });
    const data = { ...imagesData };



    useEffect(() => {
        if (!user_id) {
            navigate("/user/login"); // Navigate to the login page if user_id is not available
        } else {
            const editableData = localStorage.getItem("requestBusinessEdit");
            if (editableData) {
                setImagesData(JSON.parse(localStorage.getItem("businessdatasending")))
            } else {
                const savedData = localStorage.getItem("imagesData");
                if (savedData) {
                    setImagesData(JSON.parse(savedData)); // Populate state with saved data
                }
                setTimeout(() => {
                    localStorage.removeItem("imagesData");
                    localStorage.removeItem("currentPath");
                    localStorage.removeItem("nextpath");
                    localStorage.removeItem("pricing")
                }, 3000);
            }
        }
    }, []);
    const editdataShowSidebar = localStorage.getItem("requestBusinessEdit");
    const ref = useRef();

    const [openSections, setOpenSections] = useState({}); // Track open/closed states

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    const handleThemeSelection = (theme) => {
        setImagesData((prevData) => ({
            ...prevData,
            social_display_theme: theme,
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setImagesData({
            ...imagesData,
            [name]: value,
        });
    };
    // Cloudinary Credentials
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;

    const handleImageChange = async (e, type) => {
        const files = Array.from(e.target.files); // Get the selected files
        const uploadedUrls = [];

        for (const file of files) {
            const imagesData = new FormData();
            imagesData.append('file', file);
            imagesData.append('upload_preset', uploadPreset); // Use the provided upload preset
            imagesData.append('cloud_name', cloudName); // Use the provided cloud name

            try {
                // Upload to Cloudinary
                const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, imagesData);

                // Get the URL of the uploaded image
                const imageUrl = response.data.secure_url;

                // Add the URL to the uploadedUrls array
                uploadedUrls.push(imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        // Update the state with the new image URLs
        setImagesData(prevState => ({
            ...prevState,
            [type]: [...prevState[type], ...uploadedUrls], // Append new image URLs to the existing ones
        }));
    };

    const handleImageRemove = (url, type) => {
        setImagesData(prevState => ({
            ...prevState,
            [type]: prevState[type].filter(imageUrl => imageUrl !== url) // Remove the image URL from the state
        }));
    };
    const handleSliderChange = (event) => {
        const newTime = event.target.value; // Get the new value from the slider
        // You could update the state or perform other actions here
        setImagesData({ ...imagesData, Social_welcome_screen_time: newTime });
    };

    const handleImageChangeWel = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (!file) return;
    
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset); // Cloudinary preset
    
        // Upload image to Cloudinary
        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.secure_url) {
              // Successfully uploaded image; set the image URL in state
              setImagesData((prevState) => ({
                ...prevState,
                Social_welcome_screen: data.secure_url, // Save the image URL in Social_welcome_screen
              }));
            } else {
              console.error('Error uploading image:', data);
            }
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
          });
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
                                                checked={imagesData.social_display_theme === 'defualt'}
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
                                            className={`theme-image ${imagesData.social_display_theme === 'theme1' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734005397/esthtdmgmuole2djbqu4.png"
                                            alt="Theme 2"
                                            onClick={() => handleThemeSelection('theme2')}
                                            className={`theme-image ${imagesData.social_display_theme === 'theme2' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733993440/jvt0sbaqet7sobomoby3.png"
                                            alt="Theme 3"
                                            onClick={() => handleThemeSelection('theme3')}
                                            className={`theme-image ${imagesData.social_display_theme === 'theme3' ? 'selected' : ''}`}
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
                                        className={`collapsible-header ${openSections.socialsectio ? "opened" : ""}`}
                                        onClick={() => toggleSection("socialsectio")}
                                    >
                                        <span>Images information</span>
                                        <span className={`arrow ${openSections.socialsectio ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.socialsectio && (
                                        <div className="collapsible-content">
                                            <div>

                                                <label htmlFor="Images_title">Title</label>
                                                <input
                                                    type="text"
                                                    id="Images_title"
                                                    name="Images_title"
                                                    value={imagesData.Images_title}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter image title"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Images_description">Description</label>
                                                <textarea
                                                    id="Images_description"
                                                    name="Images_description"
                                                    value={imagesData.Images_description}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter image description"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Images_btn_text">Button Text</label>
                                                <input
                                                    type="text"
                                                    id="Images_btn_text"
                                                    name="Images_btn_text"
                                                    value={imagesData.Images_btn_text}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter button text"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Images_btn_url">Button URL</label>
                                                <input
                                                    type="url"
                                                    id="Images_btn_url"
                                                    name="Images_btn_url"
                                                    value={imagesData.Images_btn_url}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter button URL"
                                                />
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
                                                onChange={handleImageChangeWel}
                                                accept="image/*" // Restrict file types to images only
                                            />
                                                {imagesData.Social_welcome_screen && (
                                                    <div className="image-preview-container">
                                                        <img
                                                            src={imagesData.Social_welcome_screen}
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
                                                    value={imagesData.Social_welcome_screen_time}
                                                    onChange={handleSliderChange}
                                                    className="welcome-screen-time-slider"
                                                />
                                                <span className="welcome-screen-time-display">
                                                    {imagesData.Social_welcome_screen_time} seconds
                                                </span>
                                            </div>

                                        </div>
                                    )}
                                </div>
                                <div className="collapsible-section">
                                    <div
                                        className={`collapsible-header ${openSections.undersection2 ? "opened" : ""}`}
                                        onClick={() => toggleSection("undersection2")}
                                    >
                                        <span>Images</span>
                                        <span className={`arrow ${openSections.undersection2 ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.undersection2 && (
                                        <div className="collapsible-content">
                                            {/* Slider Images */}
                                            <div className="slider-images-container">
                                                <label className="slider-images-label">Business Slider Images</label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleImageChange(e, "Images")}
                                                    accept="image/*"
                                                    multiple
                                                />
                                                {imagesData.Images.length > 0 && (
                                                    <div className="slider-images-preview">
                                                        {imagesData.Images.map((url, index) => (
                                                            <div key={index} className="slider-image-item">
                                                                <img
                                                                    src={url}
                                                                    alt={`Slider Image ${index + 1}`}
                                                                    className="slider-image"
                                                                />
                                                                <button
                                                                    onClick={() => handleImageRemove(url, "Images")}
                                                                    className="remove-image-button"
                                                                >
                                                                    ✖
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
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
                                                <button class="button-57" style={{ width: '100%' }} onClick={() => handleBuyCredits(data)} role="button"><span class="text">Buy Credits</span><span>You don't have credits</span></button>
                                            </div>
                                        ) : (

                                            !editdataShowSidebar ? (
                                                <>
                                                    <button class="button-57" style={{ width: '100%' }} onClick={() => {
                                                        handleSubmit("images", data); // Pass 'Business Text' and 'data'
                                                    }} role="button"><span class="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                                                </>
                                            ) : (
                                                <button class="button-57" style={{ width: '100%' }} onClick={() => handleUpdate(imagesData._id, "images", data)} role="button"><span class="text">Update</span><span>Update</span></button>
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
                                                value={`${process.env.REACT_APP_FRONTEND_URL}/display/qr-images/${qrvalueide}`}
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
                            <ImagesDisplay data={data} customization={customization}/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ImagesQr;
