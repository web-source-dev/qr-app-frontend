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
const CoupanQR = () => {
    const navigate = useNavigate()
    const { qrSettings } = useQR();
    const { customization, updateCustomization } = useCustomization();
    const user_id = localStorage.getItem('user_id');

    const { handleSubmit, qrvalueide, handleUpdate, buyCredits, handleDownload, handleDownload1,handleBuyCredits, isPopupOpen, handleClosePopup } = useFormContext()



    const [coupanCode, setCoupan] = useState({
        coupan_image: '',
        coupan_name: '',
        coupan_description: '',
        coupan_title: '',
        coupan_sales_badge: '',
        coupan_btn_to_see_code: '',
        coupan_website_name: '',//✔️
        coupan_website_url: '',//✔️
        business_address: {
            street: "",
            city: "",
            state: "",
            zip: "",
        },
        coupan_coupan_code: '',
        coupan_valid_until: '',
        coupan_terms_conditions: '',
        coupan_btn: '',
        coupan_btn_url: '',
        Social_welcome_screen: "",//✔️
        Social_welcome_screen_time: 5,//✔️
        social_display_theme: 'defualt',//✔️
        user_id,
    });
    const data = { ...coupanCode };
    console.log(data);



    useEffect(() => {
        if (!user_id) {
            navigate("/user/login"); // Navigate to the login page if user_id is not available
        } else {
            const editableData = localStorage.getItem("requestBusinessEdit");
            if (editableData) {
                setCoupan(JSON.parse(localStorage.getItem("businessdatasending")))
            } else {
                const savedData = localStorage.getItem("coupanCode");
                if (savedData) {
                    setCoupan(JSON.parse(savedData)); // Populate state with saved data
                }
                setTimeout(() => {
                    localStorage.removeItem("coupanCode");
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
        setCoupan((prevData) => ({
            ...prevData,
            social_display_theme: theme,
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCoupan({
            ...coupanCode,
            [name]: value,
        });
    };
    
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
    const handleSliderChange = (event) => {
        const newTime = event.target.value; // Get the new value from the slider
        // You could update the state or perform other actions here
        setCoupan({ ...coupanCode, Social_welcome_screen_time: newTime });
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
                    setCoupan((prevState) => ({
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
                                                checked={coupanCode.social_display_theme === 'defualt'}
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
                                            className={`theme-image ${coupanCode.social_display_theme === 'theme1' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734005397/esthtdmgmuole2djbqu4.png"
                                            alt="Theme 2"
                                            onClick={() => handleThemeSelection('theme2')}
                                            className={`theme-image ${coupanCode.social_display_theme === 'theme2' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733993440/jvt0sbaqet7sobomoby3.png"
                                            alt="Theme 3"
                                            onClick={() => handleThemeSelection('theme3')}
                                            className={`theme-image ${coupanCode.social_display_theme === 'theme3' ? 'selected' : ''}`}
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
                                        <span>Offer Information</span>
                                        <span className={`arrow ${openSections.socialsectio ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.socialsectio && (
                                        <div className="collapsible-content">
                                            <div>
                                                <input type="file"
                                                    onChange={(e) => handleImageChangeWel(e, 'coupan_image')}
                                                    accept="image/*"
                                                />

                                                <label htmlFor="Video_title">Company</label>
                                                <input
                                                    type="text"
                                                    id="Video_title"
                                                    name="coupan_name"
                                                    value={coupanCode.coupan_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Company"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Video_description">Title</label>
                                                <input type="text"
                                                    id="Video_description"
                                                    name="coupan_title"
                                                    value={coupanCode.coupan_title}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter title"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="Video_btn_text">Discription</label>
                                                <textarea
                                                    type="text"
                                                    id="Video_btn_text"
                                                    name="coupan_description"
                                                    value={coupanCode.coupan_description}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Title"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="Video_description">Sales badge</label>
                                                <input type="text"
                                                    id="Video_description"
                                                    name="coupan_sales_badge"
                                                    value={coupanCode.coupan_sales_badge}
                                                    onChange={handleInputChange}
                                                    placeholder="Sales badge"
                                                />
                                            </div>     <div>
                                                <label htmlFor="Video_description">Button to see the code</label>
                                                <input type="text"
                                                    id="Video_description"
                                                    name="coupan_btn_to_see_code"
                                                    value={coupanCode.coupan_btn_to_see_code}
                                                    onChange={handleInputChange}
                                                    placeholder="Get Coupan"
                                                />
                                            </div>     <div>
                                                <label htmlFor="Video_description">Website Name</label>
                                                <input type="text"
                                                    id="Video_description"
                                                    name="coupan_website_name"
                                                    value={coupanCode.coupan_website_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Website Name"
                                                />
                                            </div>     <div>
                                                <label htmlFor="Video_description">Website Url</label>
                                                <input type="text"
                                                    id="Video_description"
                                                    name="coupan_website_url"
                                                    value={coupanCode.coupan_website_url}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Website Url"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="collapsible-section">
                                    <div
                                        className={`collapsible-header ${openSections.coupansection3 ? "opened" : ""}`}
                                        onClick={() => toggleSection("coupansection3")}
                                    >
                                        <span>Coupan Information</span>
                                        <span className={`arrow ${openSections.coupansection3 ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.coupansection3 && (
                                        <div className="collapsible-content">                           
                                            <div>
                                                <label htmlFor="Video_btn_text">Coupan Code</label>
                                                <input
                                                    type="text"
                                                    id="Video_btn_text"
                                                    name="coupan_coupan_code"
                                                    value={coupanCode.coupan_coupan_code}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Title"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="Video_btn_text">Valid Until</label>
                                                <input
                                                    type="date"
                                                    id="Video_btn_text"
                                                    name="coupan_valid_until"
                                                    value={coupanCode.coupan_valid_until}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Title"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="Video_btn_text">Coupan Code</label>
                                                <textarea
                                                    type="text"
                                                    id="Video_btn_text"
                                                    name="coupan_terms_conditions"
                                                    value={coupanCode.coupan_terms_conditions}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Title"
                                                />
                                            </div><div>
                                                <label htmlFor="Video_btn_text">Button Text</label>
                                                <input
                                                    type="text"
                                                    id="Video_btn_text"
                                                    name="coupan_btn"
                                                    value={coupanCode.coupan_btn}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Button Text"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="Video_btn_text">Button Url</label>
                                                <input
                                                    type="url"
                                                    id="Video_btn_text"
                                                    name="coupan_btn_url"
                                                    value={coupanCode.coupan_btn_url}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Button URL"
                                                />
                                            </div>
                                    </div>
                                    )}
                                </div>
                                <div className="collapsible-section">
                                    <div
                                        className={`collapsible-header ${openSections.undersection4 ? "opened" : ""}`}
                                        onClick={() => toggleSection("undersection4")}
                                    >
                                        <span>Location</span>
                                        <span className={`arrow ${openSections.undersection4 ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.undersection4 && (
                                        <div className="collapsible-content">


                                            <h3>Address</h3>
                                            <div className="business-info-address-inputs-container">
                                                <div>
                                                    <label>Street</label>
                                                    <input
                                                        type="text"
                                                        value={coupanCode.business_address.street}
                                                        onChange={(e) =>
                                                            setCoupan({
                                                                ...coupanCode,
                                                                business_address: { ...coupanCode.business_address, street: e.target.value },
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <label>City</label>
                                                    <input
                                                        type="text"
                                                        value={coupanCode.business_address.city}
                                                        onChange={(e) =>
                                                            setCoupan({
                                                                ...coupanCode,
                                                                business_address: { ...coupanCode.business_address, city: e.target.value },
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <label>State</label>
                                                    <input
                                                        type="text"
                                                        value={coupanCode.business_address.state}
                                                        onChange={(e) =>
                                                            setCoupan({
                                                                ...coupanCode,
                                                                business_address: { ...coupanCode.business_address, state: e.target.value },
                                                            })
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <label>Zip</label>
                                                    <input
                                                        type="text"
                                                        value={coupanCode.business_address.zip}
                                                        onChange={(e) =>
                                                            setCoupan({
                                                                ...coupanCode,
                                                                business_address: { ...coupanCode.business_address, zip: e.target.value },
                                                            })
                                                        }
                                                    />
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
                                                {coupanCode.Social_welcome_screen && (
                                                    <div className="image-preview-container">
                                                        <img
                                                            src={coupanCode.Social_welcome_screen}
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
                                                    value={coupanCode.Social_welcome_screen_time}
                                                    onChange={handleSliderChange}
                                                    className="welcome-screen-time-slider"
                                                />
                                                <span className="welcome-screen-time-display">
                                                    {coupanCode.Social_welcome_screen_time} seconds
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
                                                        handleSubmit("coupan", data); // Pass 'Business Text' and 'data'
                                                    }} role="button"><span class="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                                                </>
                                            ) : (
                                                <button class="button-57" style={{ width: '100%' }} onClick={() => handleUpdate(coupanCode._id, "coupan", data)} role="button"><span class="text">Update</span><span>Update</span></button>
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
                                                value={`${process.env.REACT_APP_FRONTEND_URL}display/qr-coupan/${qrvalueide}`}
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
                        {/* <VcardDisplay data={data} customization={customization}/> */}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CoupanQR;
