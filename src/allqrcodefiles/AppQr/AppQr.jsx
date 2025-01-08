import React, { useState, useRef, useContext, useEffect } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Quill from "quill";
import { QRCode } from 'react-qrcode-logo'
import axios from 'axios';
import Configuration from '../stats/configuration/Configuration';
import CustomizationForm from '../../allqrcodeCustomizations/designCustomization/DesignCustomization';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';
import { useQR } from '../../allqrcodeCustomizations/qrCodeCustomization/globalqrcodedesign';
import { useFormContext } from '../../allqrcodeCustomizations/globalsetup/globaldata';
import { useNavigate } from 'react-router-dom';
import { useCustomization } from '../../allqrcodeCustomizations/designCustomization/globalcustomization';
const AppQr = () => {
    const navigate = useNavigate()
    const { qrSettings } = useQR();
    const { customization, updateCustomization } = useCustomization();
    const user_id = localStorage.getItem('user_id');

    const { handleSubmit, qrvalueide, handleUpdate,handleDownload1, buyCredits, handleDownload, handleBuyCredits, isPopupOpen, handleClosePopup } = useFormContext()

    const [appLink, setAppLink] = useState({
        landingpage_image: '',
        landingpage_name: '',
        landingpage_developers: '',
        landingpage_description: '',
        landingpage_website: '',
        Social_welcome_screen: "",//✔️
        Social_welcome_screen_time: 5,//✔️
        social_display_theme: 5,//✔️
        user_id,
        appStore: [],
        googlePlay: [],
        amazonStore: []
    });
    const data = { ...appLink };
    console.log(data);



    useEffect(() => {
        if (!user_id) {
            navigate("/user/login"); // Navigate to the login page if user_id is not available
        } else {
            const editableData = localStorage.getItem("requestBusinessEdit");
            if (editableData) {
                setAppLink(JSON.parse(localStorage.getItem("businessdatasending")))
            } else {
                const savedData = localStorage.getItem("appLink");
                if (savedData) {
                    setAppLink(JSON.parse(savedData)); // Populate state with saved data
                }
                setTimeout(() => {
                    localStorage.removeItem("appLink");
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
        setAppLink((prevData) => ({
            ...prevData,
            social_display_theme: theme,
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppLink({
            ...appLink,
            [name]: value,
        });
    };
    // Cloudinary Credentials
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
    const handleSliderChange = (event) => {
        const newTime = event.target.value; // Get the new value from the slider
        // You could update the state or perform other actions here
        setAppLink({ ...appLink, Social_welcome_screen_time: newTime });
    };

    const handleImageChangeWel = (e, imageget) => {
        const file = e.target.files[0]; // Get the selected file
        if (!file) return;
        console.log('image url', imageget)

        // Validate file type (e.g., allow only image files)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, or GIF).');
            return;
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('File size exceeds 5MB. Please select a smaller file.');
            return;
        }

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
                    setAppLink((prevState) => ({
                        ...prevState,
                        [imageget]: data.secure_url, // Save the image URL dynamically
                    }));
                } else {
                    console.error('Error uploading image:', data);
                    alert('Error uploading image. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error uploading image:', error);
                alert('Error uploading image. Please check your network and try again.');
            });
    };

    const handleAddInput = (store, img) => {
        setAppLink((prev) => ({
            ...prev,
            [store]: [...prev[store], { name: store, image: img, text: '', link: '' }]
        }));
    };

    const handleInputChanges = (store, index, field, value) => {
        const updatedInputs = appLink[store].map((input, i) =>
            i === index ? { ...input, [field]: value } : input
        );
        setAppLink((prev) => ({ ...prev, [store]: updatedInputs }));
    };
    const handleRemoveInput = (store, index) => {
        const updatedInputs = appLink[store].filter((_, i) => i !== index);
        setAppLink((prev) => ({ ...prev, [store]: updatedInputs }));
    };
    const amazonimg = 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736089393/yzpktb0nndbd9n9sb1ev.png'
    const appleimg = 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736089396/vxmqoxtoxj5z4eskoer7.png'
    const playstoreimg = 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1736089395/lznnequjj1j06sj6dase.png'
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
                                                checked={appLink.social_display_theme === 'defualt'}
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
                                            className={`theme-image ${appLink.social_display_theme === 'theme1' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734005397/esthtdmgmuole2djbqu4.png"
                                            alt="Theme 2"
                                            onClick={() => handleThemeSelection('theme2')}
                                            className={`theme-image ${appLink.social_display_theme === 'theme2' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733993440/jvt0sbaqet7sobomoby3.png"
                                            alt="Theme 3"
                                            onClick={() => handleThemeSelection('theme3')}
                                            className={`theme-image ${appLink.social_display_theme === 'theme3' ? 'selected' : ''}`}
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
                            <span>Basic Information</span>
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
                                        <span>App Information</span>
                                        <span className={`arrow ${openSections.socialsectio ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.socialsectio && (
                                        <div className="collapsible-content">
                                            <div>


                                                <label htmlFor="Video_title">Name</label>
                                                <input
                                                    type="text"
                                                    id="Video_title"
                                                    name="landingpage_name"
                                                    value={appLink.landingpage_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Name"
                                                />
                                                <input type="file"
                                                    onChange={(e) => handleImageChangeWel(e, 'landingpage_image')}
                                                    accept="image/*"
                                                /> <br />
                                                <label htmlFor="Video_title">Developer/Company</label>
                                                <input
                                                    type="text"
                                                    id="Video_title"
                                                    name="landingpage_developers"
                                                    value={appLink.landingpage_developers}
                                                    onChange={handleInputChange}
                                                    placeholder="Developer/Company"
                                                />
                                                <label htmlFor="Video_title">Description</label>
                                                <textarea
                                                    type="text"
                                                    id="Video_title"
                                                    name="landingpage_description"
                                                    value={appLink.landingpage_description}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Description"
                                                />
                                                <label htmlFor="Video_title">Website</label>
                                                <input
                                                    type="text"
                                                    id="Video_title"
                                                    name="landingpage_website"
                                                    value={appLink.landingpage_website}
                                                    onChange={handleInputChange}
                                                    placeholder="Website Url"
                                                />

                                            </div>

                                        </div>
                                    )}
                                </div>
                                <div className="collapsible-section">
                                    <div
                                        className={`collapsible-header ${openSections.appsection ? "opened" : ""}`}
                                        onClick={() => toggleSection("appsection")}
                                    >
                                        <span>Links to Different Platforms</span>
                                        <span className={`arrow ${openSections.appsection ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.appsection && (
                                        <div className="collapsible-content">
                                            <div>
                                                {['appStore', 'googlePlay', 'amazonStore'].map((store) => (
                                                    <div key={store}>
                                                        {appLink[store].map((input, index) => (
                                                            <div key={index}>
                                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                                    <img src={input.image} alt="" height='27px' width='27px' style={{ borderRadius: '50%', backgroundColor: 'bisque' }} />
                                                                    <h3>{input.name}</h3>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '20px' }}>
                                                                    <label>
                                                                        Text:
                                                                        <input
                                                                            type="text"
                                                                            value={input.text}
                                                                            onChange={(e) => handleInputChanges(store, index, 'text', e.target.value)}
                                                                            style={{ marginLeft: '10px', marginRight: '20px' }}
                                                                        />
                                                                    </label>
                                                                    <label>
                                                                        Link:
                                                                        <input
                                                                            type="text"
                                                                            value={input.link}
                                                                            onChange={(e) => handleInputChanges(store, index, 'link', e.target.value)}
                                                                            style={{ marginLeft: '10px' }}
                                                                        />
                                                                    </label>
                                                                    <button
                                                                        onClick={() => handleRemoveInput(store, index)}
                                                                        style={{
                                                                            backgroundColor: 'transparent',
                                                                            color: 'red',
                                                                            border: 'none',
                                                                            padding: '0 10px',

                                                                            cursor: 'pointer',
                                                                        }}
                                                                    >
                                                                        X
                                                                    </button>
                                                                </div>

                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                                <div style={{ marginTop: '20px', alignItems: 'center', justifyContent: 'center', display: 'flex', gap: '20px' }}>
                                                    <button className='btn-18' onClick={() => handleAddInput('appStore', appleimg)}>Add Apple Store</button>
                                                    <button className='btn-18' onClick={() => handleAddInput('googlePlay', playstoreimg)}>Add Google Play</button>
                                                    <button className='btn-18' onClick={() => handleAddInput('amazonStore', amazonimg)}>Add Amazon Store</button>
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
                                                    onChange={(e) => handleImageChangeWel(e, 'Social_welcome_screen')}
                                                    accept="image/*" // Restrict file types to images only
                                                />
                                                {appLink.Social_welcome_screen && (
                                                    <div className="image-preview-container">
                                                        <img
                                                            src={appLink.Social_welcome_screen}
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
                                                    value={appLink.Social_welcome_screen_time}
                                                    onChange={handleSliderChange}
                                                    className="welcome-screen-time-slider"
                                                />
                                                <span className="welcome-screen-time-display">
                                                    {appLink.Social_welcome_screen_time} seconds
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
                                                <button class="button-57" style={{ width: '100%' }} onClick={() => handleBuyCredits(data)} role="button"><span class="text">Buy Credits</span><span>You don't have credits</span></button>
                                            </div>
                                        ) : (

                                            !editdataShowSidebar ? (
                                                <>
                                                    <button class="button-57" style={{ width: '100%' }} onClick={() => {
                                                        handleSubmit("applinks", data); // Pass 'Business Text' and 'data'
                                                    }} role="button"><span class="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                                                </>
                                            ) : (
                                                <button class="button-57" style={{ width: '100%' }} onClick={() => handleUpdate(appLink._id, "applinks", data)} role="button"><span class="text">Update</span><span>Update</span></button>
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
                                                value={`${process.env.REACT_APP_FRONTEND_URL}display/qr-app/${qrvalueide}`}
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
                        {/* <LandingPageDisplay data={data} customization={customization}/> */}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AppQr;
