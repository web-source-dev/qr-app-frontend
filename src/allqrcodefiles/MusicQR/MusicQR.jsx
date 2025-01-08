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
import MusicDisplay from './MobileMusicDisplay';
const MusicQr = () => {
    const navigate = useNavigate()
    const { qrSettings } = useQR();
    const { customization, updateCustomization } = useCustomization();
    const user_id = localStorage.getItem('user_id');

    const { handleSubmit, qrvalueide, handleUpdate, buyCredits, handleDownload, handleBuyCredits, isPopupOpen,handleDownload1, handleClosePopup } = useFormContext()



    const [musicData, setMusicData] = useState({
        Music_title: '',
        Music_description: '',
        Music_btn_text: '',
        Music_btn_url: '',
        Music: [], // ✔️
        Social_welcome_screen: "", // ✔️
        Social_welcome_screen_time: 5, // ✔️
        social_display_theme: 'default', // ✔️
        user_id,
    });
    
    const data = { ...musicData };
    console.log(data);



    useEffect(() => {
        if (!user_id) {
            navigate("/user/login"); // Navigate to the login page if user_id is not available
        } else {
            const editableData = localStorage.getItem("requestBusinessEdit");
            if (editableData) {
                setMusicData(JSON.parse(localStorage.getItem("businessdatasending")))
            } else {
                const savedData = localStorage.getItem("musicData");
                if (savedData) {
                    setMusicData(JSON.parse(savedData)); // Populate state with saved data
                }
                setTimeout(() => {
                    localStorage.removeItem("musicData");
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
        setMusicData((prevData) => ({
            ...prevData,
            social_display_theme: theme,
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMusicData({
            ...musicData,
            [name]: value,
        });
    };
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;

    const handleMusicUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
    
            // POST request to Cloudinary upload API (corrected audio endpoint)
            fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    // Add the audio URL to state
                    setMusicData((prevState) => ({
                        ...prevState,
                        Music: [...prevState.Music, data.secure_url], // Store audio URL
                    }));
                })
                .catch((error) => console.error("Error uploading audio:", error));
        }
    };
    
    

    // Remove video by URL
    const removeMusic = (url) => {
        setMusicData((prevState) => ({
            ...prevState,
            Music: prevState.Music.filter((music) => music !== url), // Filter out the removed audio
        }));
    };
    
    

    const handleSliderChange = (event) => {
        const newTime = event.target.value; // Get the new value from the slider
        // You could update the state or perform other actions here
        setMusicData({ ...musicData, Social_welcome_screen_time: newTime });
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
                    setMusicData((prevState) => ({
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
                                                checked={musicData.social_display_theme === 'defualt'}
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
                                            className={`theme-image ${musicData.social_display_theme === 'theme1' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734005397/esthtdmgmuole2djbqu4.png"
                                            alt="Theme 2"
                                            onClick={() => handleThemeSelection('theme2')}
                                            className={`theme-image ${musicData.social_display_theme === 'theme2' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733993440/jvt0sbaqet7sobomoby3.png"
                                            alt="Theme 3"
                                            onClick={() => handleThemeSelection('theme3')}
                                            className={`theme-image ${musicData.social_display_theme === 'theme3' ? 'selected' : ''}`}
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

                                                <label htmlFor="Music_title">Title</label>
                                                <input
                                                    type="text"
                                                    id="Music_title"
                                                    name="Music_title"
                                                    value={musicData.Music_title}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter image title"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Music_description">Description</label>
                                                <textarea
                                                    id="Music_description"
                                                    name="Music_description"
                                                    value={musicData.Music_description}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter image description"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Music_btn_text">Button Text</label>
                                                <input
                                                    type="text"
                                                    id="Music_btn_text"
                                                    name="Music_btn_text"
                                                    value={musicData.Music_btn_text}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter button text"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Music_btn_url">Button URL</label>
                                                <input
                                                    type="url"
                                                    id="Music_btn_url"
                                                    name="Music_btn_url"
                                                    value={musicData.Music_btn_url}
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
                                                {musicData.Social_welcome_screen && (
                                                    <div className="image-preview-container">
                                                        <img
                                                            src={musicData.Social_welcome_screen}
                                                            alt="Welcome Screen"
                                                            className="welcome-image-preview"
                                                        />
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
                                                    value={musicData.Social_welcome_screen_time}
                                                    onChange={handleSliderChange}
                                                    className="welcome-screen-time-slider"
                                                />
                                                <span className="welcome-screen-time-display">
                                                    {musicData.Social_welcome_screen_time} seconds
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
                                        <span>Musics</span>
                                        <span className={`arrow ${openSections.undersection2 ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.undersection2 && (
                                        <div className="collapsible-content">
                                            <div>
    {/* File input to choose a music file */}
    <input type="file" accept="audio/*" onChange={handleMusicUpload} />

    {/* Display uploaded music */}
    <div>
        {musicData.Music.map((audioUrl, index) => (
            <div key={index} style={{ position: 'relative', marginBottom: '10px' }}>
                <audio controls>
                    <source src={audioUrl} type="audio/mp3" />
                    Your browser does not support the audio tag.
                </audio>

                {/* Cross button to remove the audio */}
                <button
                    onClick={() => removeMusic(audioUrl)}
                    style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: 'red',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '5px',
                        cursor: 'pointer',
                    }}
                >
                    X
                </button>
            </div>
        ))}
    </div>
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
                                                        handleSubmit("music", data); // Pass 'Business Text' and 'data'
                                                    }} role="button"><span class="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                                                </>
                                            ) : (
                                                <button class="button-57" style={{ width: '100%' }} onClick={() => handleUpdate(musicData._id, "music", data)} role="button"><span class="text">Update</span><span>Update</span></button>
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
                                                value={`${process.env.REACT_APP_FRONTEND_URL}/display/qr-music/${qrvalueide}`}
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
                            <MusicDisplay data={data} customization={customization}/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MusicQr;
