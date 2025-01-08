import React, { useRef, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { QRCode } from 'react-qrcode-logo'
import CustomizationForm from '../../allqrcodeCustomizations/designCustomization/DesignCustomization';
import Configuration from '../stats/configuration/Configuration';
import { useCustomization } from '../../allqrcodeCustomizations/designCustomization/globalcustomization';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';
import { useQR } from '../../allqrcodeCustomizations/qrCodeCustomization/globalqrcodedesign';
import { useFormContext } from '../../allqrcodeCustomizations/globalsetup/globaldata';
import './eventqr.css'
import { useNavigate } from 'react-router-dom';
const EventQrForm = () => {
    const navigate = useNavigate()
    const { customization, updateCustomization } = useCustomization();
    const { qrSettings } = useQR();
    const user_id = localStorage.getItem('user_id');
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
    const { handleSubmit, handleUpdate, qrvalueide, buyCredits,handleDownload1, handleDownload, handleBuyCredits, isPopupOpen, handleClosePopup } = useFormContext()

    const ref = useRef();
    const [eventData, setEventData] = useState({
        event_logo_qr: "", //✔️
        event_name: "",//✔️
        event_discription: "",//✔️
        event_facilities: [],//✔️
        event_about: "",
        event_contact_numbers: [],//✔️
        event_emails: [],//✔️
        event_welcome_screen: "",//✔️
        event_welcome_screen_time: 5,//✔️
        event_website_url: '',//✔️
        event_organizer: '',//✔️
        event_display_theme: 'defualt',//✔️
        user_id,
        event_data: [{ eventName: '', since: '', until: '', fullDay: false, timeZone: 'GST (UTC+4:00)' }],

    });
    console.log(eventData)
    const data1 = { ...eventData }
    const editdataShowSidebar = localStorage.getItem("requestBusinessEdit");
    useEffect(() => {
        if (!user_id) {
            navigate("/user/login"); // Navigate to the login page if user_id is not available
        } else {
            const editableData = localStorage.getItem("requestBusinessEdit");
            if (editableData) {
                setEventData(JSON.parse(localStorage.getItem("businessdatasending")))
            } else {
                const savedData = localStorage.getItem("eventData");
                if (savedData) {
                    setEventData(JSON.parse(savedData)); // Populate state with saved data
                }
                setTimeout(() => {
                    localStorage.removeItem("eventData");
                    localStorage.removeItem("currentPath");
                    localStorage.removeItem("nextpath");
                    localStorage.removeItem("pricing")
                }, 3000);
            }
        }
    }, []);

    const handleSliderChange = (e) => {
        const value = e.target.value;
        setEventData({
            ...eventData,
            event_welcome_screen_time: value,
        });
    };
    const handleAboutChange = (e) => {
        setEventData({
            ...eventData,
            event_about: e.target.value,
        });
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };
    // Function to handle adding a new input field
    const addField = (key) => {
        setEventData((prevState) => ({
            ...prevState,
            [key]: [...prevState[key], ""],
        }));
    };
    // Function to handle removing an input field
    const removeField = (key, index) => {
        setEventData((prevState) => ({
            ...prevState,
            [key]: prevState[key].filter((_, i) => i !== index),
        }));
    };

    // Function to handle input changes
    const handleInputChanges = (key, index, value) => {
        setEventData((prevState) => {
            const updatedFields = [...prevState[key]];
            updatedFields[index] = value;
            return {
                ...prevState,
                [key]: updatedFields,
            };
        });
    };

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

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

                // Update the state based on the image type
                if (imageType === "event_logo_qr") {
                    setEventData((prevData) => ({
                        ...prevData,
                        event_logo_qr: imageUrl,
                    }));
                } else if (imageType === "event_slider_images") {
                    setEventData((prevData) => ({
                        ...prevData,
                        event_slider_images: [...prevData.event_slider_images, imageUrl],
                    }));
                } else if (imageType === "event_welcome_screen") {
                    setEventData((prevData) => ({
                        ...prevData,
                        event_welcome_screen: imageUrl,
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
    const handleImageRemove = (imageUrl, imageType) => {
        if (imageType === "event_logo_qr") {
            setEventData((prevData) => ({
                ...prevData,
                event_logo_qr: "",
            }));
        } else if (imageType === "event_slider_images") {
            setEventData((prevData) => ({
                ...prevData,
                event_slider_images: prevData.event_slider_images.filter(
                    (url) => url !== imageUrl
                ),
            }));
        } else if (imageType === "event_welcome_screen") {
            setEventData((prevData) => ({
                ...prevData,
                event_welcome_screen: "",
            }));
        }
    };
    const facilityIcons = [
        { name: "WiFi", icon: "🌐" },
        { name: "Tea", icon: "🍵" },
        { name: "Coffee", icon: "☕" },
        { name: "Parking", icon: "🅿️" },
        { name: "A-C", icon: "❄️" },
        { name: "Pets", icon: "🐾" },
        { name: "Smoke Area", icon: "🚬" },
        { name: "Wheelchair", icon: "♿" },
        { name: "Restrooms", icon: "🚻" },
        { name: "Charging", icon: "🔌" },
        { name: "Projector", icon: "📽️" },
        { name: "Whiteboard", icon: "📝" },
        { name: "TV", icon: "📺" },
        { name: "Gym", icon: "🏋️" },
        { name: "Swimming Pool", icon: "🏊" },
        { name: "CCTV", icon: "📹" },
        { name: "Fire Safety", icon: "🔥" },
        { name: "First Aid", icon: "🚑" },
        { name: "Library", icon: "📚" },
        { name: "Game Zone", icon: "🎮" },
    ];


    const toggleFacility = (facilityName) => {
        setEventData((prevData) => {
            const facilities = prevData.event_facilities.includes(facilityName)
                ? prevData.event_facilities.filter((facility) => facility !== facilityName)
                : [...prevData.event_facilities, facilityName];

            return { ...prevData, event_facilities: facilities };
        });
    };

    const [openSections, setOpenSections] = useState({}); // Track open/closed states

    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    const handleThemeSelection = (theme) => {
        setEventData((prevData) => ({
            ...prevData,
            event_display_theme: theme,
        }));
    };

    const timeZones = [
        'CET (UTC+1:00) - Central European Time (Algeria, Tunisia)',
        'EET (UTC+2:00) - Eastern European Time (Egypt, Israel)',
        'CAT (UTC+2:00) - Central Africa Time (Botswana, South Africa)',
        'EAT (UTC+3:00) - East Africa Time (Kenya, Tanzania)',
        'WAT (UTC+1:00) - West Africa Time (Nigeria, Ghana)',
        'SAST (UTC+2:00) - South Africa Standard Time (South Africa)',
        'FET (UTC+3:00) - Further Eastern European Time (Belarus)',
        'WAST (UTC+1:00) - West Africa Summer Time (Senegal)',

        // Asia
        'IST (UTC+5:30) - Indian Standard Time (India, Sri Lanka)',
        'BST (UTC+6:00) - Bangladesh Standard Time (Bangladesh)',
        'ICT (UTC+7:00) - Indochina Time (Vietnam, Thailand)',
        'JST (UTC+9:00) - Japan Standard Time (Japan)',
        'KST (UTC+9:00) - Korea Standard Time (South Korea)',
        'CST (UTC+8:00) - China Standard Time (China, Taiwan)',
        'PST (UTC+8:00) - Philippine Standard Time (Philippines)',
        'ACT (UTC+9:30) - Australian Central Time (Australia)',
        'AET (UTC+10:00) - Australian Eastern Time (Australia)',
        'NZST (UTC+12:00) - New Zealand Standard Time (New Zealand)',
        'WST (UTC+8:00) - Western Standard Time (Australia, Indonesia)',

        // Europe
        'CET (UTC+1:00) - Central European Time (Germany, France, Italy)',
        'EET (UTC+2:00) - Eastern European Time (Greece, Cyprus)',
        'WET (UTC+0:00) - Western European Time (UK, Portugal)',
        'GMT (UTC+0:00) - Greenwich Mean Time (Ireland)',
        'MSK (UTC+3:00) - Moscow Standard Time (Russia)',

        // North America
        'AST (UTC-4:00) - Atlantic Standard Time (Puerto Rico, US Virgin Islands)',
        'EST (UTC-5:00) - Eastern Standard Time (USA, Canada)',
        'CST (UTC-6:00) - Central Standard Time (Mexico, USA)',
        'MST (UTC-7:00) - Mountain Standard Time (USA, Canada)',
        'PST (UTC-8:00) - Pacific Standard Time (USA, Canada)',
        'AKST (UTC-9:00) - Alaska Standard Time (Alaska, USA)',
        'HST (UTC-10:00) - Hawaii Standard Time (Hawaii, USA)',
        'NST (UTC-11:00) - Niue Standard Time (American Samoa)',
        'SST (UTC-11:00) - Samoa Standard Time (Samoa)',

        // South America
        'CLT (UTC-4:00) - Chile Standard Time (Chile)',
        'ART (UTC-3:00) - Argentina Time (Argentina)',
        'BRT (UTC-3:00) - Brazil Standard Time (Brazil)',
        'AMT (UTC-4:00) - Amazon Time (Brazil)',
        'PYT (UTC-4:00) - Paraguay Time (Paraguay)',
        'UYT (UTC-3:00) - Uruguay Time (Uruguay)',

        // Oceania
        'NUT (UTC-11:00) - Niue Time (Niue)',
        'SBT (UTC+11:00) - Solomon Islands Time (Solomon Islands)',
        'VUT (UTC+11:00) - Vanuatu Time (Vanuatu)',
        'AEST (UTC+10:00) - Australian Eastern Standard Time (Australia)',
        'ACST (UTC+9:30) - Australian Central Standard Time (Australia)',
        'AWST (UTC+8:00) - Australian Western Standard Time (Australia)',

        // Time Zones with offsets
        'UTC+0:00', 'UTC+1:00', 'UTC+2:00', 'UTC+3:00', 'UTC+3:30', 'UTC+4:00', 'UTC+4:30', 'UTC+5:00',
        'UTC+5:30', 'UTC+6:00', 'UTC+7:00', 'UTC+8:00', 'UTC+9:00', 'UTC+9:30', 'UTC+10:00', 'UTC+11:00',
        'UTC+12:00', 'UTC-1:00', 'UTC-2:00', 'UTC-3:00', 'UTC-4:00', 'UTC-5:00', 'UTC-6:00', 'UTC-7:00',
        'UTC-8:00', 'UTC-9:00', 'UTC-10:00', 'UTC-11:00', 'UTC-12:00'
    ];


    const handleChange = (index, field, value) => {
        const updatedEventData = [...eventData.event_data];
        updatedEventData[index][field] = value;
        setEventData({ ...eventData, event_data: updatedEventData });
    };

    const handleAddEvent = () => {
        setEventData({
            ...eventData,
            event_data: [
                ...eventData.event_data,
                { since: '', until: '', fullDay: false, timeZone: 'GST (UTC+4:00)' },
            ],
        });
    };

    const handleRemoveEvent = (index) => {
        const updatedEventData = eventData.event_data.filter((_, i) => i !== index);
        setEventData({ ...eventData, event_data: updatedEventData });
    };



    return (
        <>
            <div className="business-info-page">
                <div className="collapsible-container">
                    <div className="business-form-container">
                        {/* 1 */}
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
                                                    checked={eventData.event_display_theme === 'defualt'}
                                                    onChange={() => handleThemeSelection('defualt')}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                            <span className="toggle-label" onClick={() => handleThemeSelection('defualt')} >Default</span>
                                        </div>

                                        <div className="theme-images">
                                            <img
                                                src="https://qrfy.com/assets/template-default-iJw8sLx_.webp"
                                                alt="Theme 1"
                                                onClick={() => handleThemeSelection('theme1')}
                                                className={`theme-image ${eventData.event_display_theme === 'theme1' ? 'selected' : ''}`}
                                            />
                                            <img
                                                src="https://qrfy.com/assets/template-2-D0nYwSJm.webp"
                                                alt="Theme 2"
                                                onClick={() => handleThemeSelection('theme2')}
                                                className={`theme-image ${eventData.event_display_theme === 'theme2' ? 'selected' : ''}`}
                                            />
                                            <img
                                                src="https://qrfy.com/assets/template-1-DNRVxBJo.webp"
                                                alt="Theme 3"
                                                onClick={() => handleThemeSelection('theme3')}
                                                className={`theme-image ${eventData.event_display_theme === 'theme3' ? 'selected' : ''}`}
                                            />
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                        {/* 2 */}
                        <div className="collapsible-section">
                            <div
                                className={`collapsible-header ${openSections.section1 ? "opened" : ""}`}
                                onClick={() => toggleSection("section1")}
                            >
                                <span>Basic Information</span>
                                <span className={`arrow ${openSections.section1 ? "down" : "right"}`}>
                                    <i className="ri-arrow-down-fill"></i>
                                </span>
                            </div>
                            {openSections.section1 && (
                                <div className="collapsible-content">
                                    <div className="upload-business-images-container">
                                        <div className="collapsible-section">
                                            <div
                                                className={`collapsible-header ${openSections.undersection1 ? "opened" : ""}`}
                                                onClick={() => toggleSection("undersection1")}
                                            >
                                                <span>Event Information</span>
                                                <span className={`arrow ${openSections.undersection1 ? "down" : "right"}`}>
                                                    <i className="ri-arrow-down-fill"></i>
                                                </span>
                                            </div>
                                            {openSections.undersection1 && (
                                                <div className="collapsible-content">

                                                    {/* <!-- Logo QR --> */}
                                                    <div className="business-logo-qr-container">
                                                        <label className="business-logo-qr-label">Event Image</label>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleImageChange(e, "event_logo_qr")}
                                                            accept="image/*"
                                                        />
                                                        {eventData.event_logo_qr && (
                                                            <div className="business-logo-qr-image-container">
                                                                <img
                                                                    src={eventData.event_logo_qr}
                                                                    alt="Business Logo QR"
                                                                    className="business-logo-qr-image"
                                                                />
                                                                <button
                                                                    onClick={() => handleImageRemove(eventData.event_logo_qr, "event_logo_qr")}
                                                                    className="business-logo-qr-remove-btn"
                                                                >
                                                                    ✖
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="business-info-inputs-container">
                                                        <label className="business-info-label">Event Name</label>
                                                        <input
                                                            type="text"
                                                            name="event_name"
                                                            value={eventData.event_name}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="business-info-inputs-container">
                                                        <label className="business-info-label">Event Discription</label>
                                                        <input
                                                            type="text"
                                                            name="event_discription"
                                                            value={eventData.event_discription}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="collapsible-section">
                                            <div
                                                className={`collapsible-header ${openSections.eventsection ? "opened" : ""}`}
                                                onClick={() => toggleSection("eventsection")}
                                            >
                                                <span>Event Date</span>
                                                <span className={`arrow ${openSections.eventsection ? "down" : "right"}`}>
                                                    <i className="ri-arrow-down-fill"></i>
                                                </span>
                                            </div>
                                            {openSections.eventsection && (
                                                <div className="collapsible-content">
                                                    <div>
                                                        <h2>Date Scheduler</h2>
                                                        {eventData.event_data.map((event, index) => (
                                                            <div key={index} style={{ borderBottom: '1px solid #000', padding: '10px 0px', marginBottom: '10px' }}>
                                                                <h5>{event.eventName}</h5>
                                                                <label>
                                                                    Name: <br />
                                                                    <input
                                                                        type="text"
                                                                        value={event.eventName || ''}
                                                                        onChange={(e) => handleChange(index, 'eventName', e.target.value)}
                                                                        placeholder="Enter Event Name"
                                                                        style={{ width: '100%', padding: '5px' }}
                                                                    />
                                                                </label>

                                                                <div>
                                                                    <label>
                                                                        Since: <br />
                                                                        <input
                                                                            type="date"
                                                                            value={event.since}
                                                                            onChange={(e) => handleChange(index, 'since', e.target.value)}

                                                                        />
                                                                    </label>
                                                                    {!event.fullDay && (
                                                                        <input
                                                                            type="time"
                                                                            onChange={(e) =>
                                                                                handleChange(index, 'sinceTime', e.target.value)
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>

                                                                <div style={{ marginBottom: '10px' }}>
                                                                    <label>
                                                                        Until: <br />
                                                                        <input
                                                                            type="date"
                                                                            value={event.until}
                                                                            onChange={(e) => handleChange(index, 'until', e.target.value)}

                                                                        />
                                                                    </label>
                                                                    {!event.fullDay && (
                                                                        <input
                                                                            type="time"
                                                                            onChange={(e) =>
                                                                                handleChange(index, 'untilTime', e.target.value)
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                                <h3>Full Day</h3>
                                                                <div className="toggle-switchs">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={event.fullDay}
                                                                        onChange={(e) => handleChange(index, 'fullDay', e.target.checked)}
                                                                        id={`fullDay-toggle-${index}`}
                                                                    />
                                                                    <label htmlFor={`fullDay-toggle-${index}`} className="toggle-labels"></label>
                                                                </div>



                                                                <div style={{ marginBottom: '10px' }}>
                                                                    <label>
                                                                        Time Zone: <br />
                                                                        <select
                                                                            value={event.timeZone || 'GST (UTC+4:00)'}
                                                                            onChange={(e) => handleChange(index, 'timeZone', e.target.value)}
                                                                        >
                                                                            {timeZones.map((zone) => (
                                                                                <option key={zone} value={zone}>
                                                                                    {zone}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </label>
                                                                </div>

                                                                {index > 0 && (
                                                                    <button
                                                                        onClick={() => handleRemoveEvent(index)}
                                                                        style={{
                                                                            backgroundColor: '#ff4d4d',
                                                                            color: '#fff',
                                                                            border: 'none',
                                                                            padding: '5px 10px',
                                                                            cursor: 'pointer',
                                                                            borderRadius: '4px',
                                                                            marginTop: '10px',
                                                                        }}
                                                                    >
                                                                        Remove Event
                                                                    </button>
                                                                )}
                                                            </div>

                                                        ))}

                                                        <button
                                                            onClick={handleAddEvent}
                                                            style={{
                                                                backgroundColor: '#000',
                                                                color: '#fff',
                                                                border: 'none',
                                                                padding: '10px 20px',
                                                                cursor: 'pointer',
                                                                borderRadius: '4px',
                                                            }}
                                                        >
                                                            Add Event
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* 3 */}
                        <div className="collapsible-section">
                            <div
                                className={`collapsible-header ${openSections.section2 ? "opened" : ""}`}
                                onClick={() => toggleSection("section2")}
                            >
                                <span>Content</span>
                                <span className={`arrow ${openSections.section2 ? "down" : "right"}`}>
                                    <i className="ri-arrow-down-fill"></i>
                                </span>
                            </div>
                            {openSections.section2 && (
                                <div className="collapsible-content">

                                    <div className="collapsible-section">
                                        <div
                                            className={`collapsible-header ${openSections.under2section2 ? "opened" : ""}`}
                                            onClick={() => toggleSection("under2section2")}
                                        >
                                            <span>Organizer Information</span>
                                            <span className={`arrow ${openSections.under2section2 ? "down" : "right"}`}>
                                                <i className="ri-arrow-down-fill"></i>
                                            </span>
                                        </div>
                                        {openSections.under2section2 && (
                                            <div className="collapsible-content">
                                                <label className="business-info-label">Organizer</label>
                                                <div className="business-info-inputs-containers">
                                                    <input
                                                        type="text"
                                                        name="event_organizer"
                                                        value={eventData.event_organizer}
                                                        onChange={handleInputChange}
                                                        placeholder='Name'
                                                        required
                                                    />
                                                    <input
                                                        type="url"
                                                        name="event_website_url"
                                                        value={eventData.event_website_url}
                                                        onChange={handleInputChange}
                                                        placeholder='Website'
                                                        required
                                                    />
                                                </div>

                                                <div className="contact-numbers-container">
                                                    <div className="contact-numbers-header">
                                                        <span>Contact Number</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => addField("event_contact_numbers")}
                                                            className="add-contact-number-btn"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div>
                                                        {eventData.event_contact_numbers.map((number, index) => (
                                                            <div key={index} className="contact-number-input-container">
                                                                <input
                                                                    type="text"
                                                                    value={number}
                                                                    onChange={(e) =>
                                                                        handleInputChanges("event_contact_numbers", index, e.target.value)
                                                                    }
                                                                    placeholder="Enter phone number"
                                                                />
                                                                {index > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeField("event_contact_numbers", index)}
                                                                        className="remove-contact-number-btn"
                                                                    >
                                                                        ✖
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="business-emails-container">
                                                    <div className="business-emails-header">
                                                        <span>Email</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => addField("event_emails")}
                                                            className="add-business-email-btn"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div>
                                                        {eventData.event_emails.map((email, index) => (
                                                            <div key={index} className="business-email-input-container">
                                                                <input
                                                                    type="email"
                                                                    value={email}
                                                                    onChange={(e) =>
                                                                        handleInputChanges("event_emails", index, e.target.value)
                                                                    }
                                                                    placeholder="Enter email address"
                                                                />
                                                                {index > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeField("event_emails", index)}
                                                                        className="remove-business-email-btn"
                                                                    >
                                                                        ✖
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>


                                            </div>
                                        )}
                                    </div>
                                    <div className="collapsible-section">
                                        <div
                                            className={`collapsible-header ${openSections.undersection5 ? "opened" : ""}`}
                                            onClick={() => toggleSection("undersection5")}
                                        >
                                            <span>Facilities</span>
                                            <span className={`arrow ${openSections.undersection5 ? "down" : "right"}`}>
                                                <i className="ri-arrow-down-fill"></i>
                                            </span>
                                        </div>
                                        {openSections.undersection5 && (
                                            <div className="collapsible-content">
                                                <div className="facilities-container">
                                                    <h3 className="facilities-header">Select Facilities</h3>

                                                    <div className="facilities-options-container">
                                                        {facilityIcons.map((facility) => (
                                                            <div
                                                                key={facility.name}
                                                                onClick={() => toggleFacility(facility.name)}
                                                                className={`facility-option-card ${eventData.event_facilities.includes(facility.name) ? 'selected' : ''}`}
                                                            >
                                                                <span className="facility-icon">{facility.icon}</span>
                                                                <span className='small-text'>{facility.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                    <div className="collapsible-section">
                                        <div
                                            className={`collapsible-header ${openSections.under2section1 ? "opened" : ""}`}
                                            onClick={() => toggleSection("under2section1")}
                                        >
                                            <span>About us</span>
                                            <span className={`arrow ${openSections.under2section1 ? "down" : "right"}`}>
                                                <i className="ri-arrow-down-fill"></i>
                                            </span>
                                        </div>
                                        {openSections.under2section1 && (
                                            <div className="collapsible-content">
                                                <div className="business-about-container">

                                                    <div className="business-about-textarea-container">
                                                        <label htmlFor="about-textarea" className="business-about-label">
                                                            About Event:
                                                        </label>
                                                        <textarea
                                                            id="about-textarea"
                                                            value={eventData.event_about}
                                                            onChange={handleAboutChange}
                                                            rows="10"
                                                            cols="50"
                                                            placeholder="Enter some text about your Event..."
                                                            className="business-about-textarea"
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
                                                        onChange={(e) => handleImageChange(e, "event_welcome_screen")}
                                                        accept="image/*"
                                                    />
                                                    {eventData.event_welcome_screen && (
                                                        <div className="image-preview-container">
                                                            <img
                                                                src={eventData.event_welcome_screen}
                                                                alt="Welcome Screen"
                                                                className="welcome-image-preview"
                                                            />
                                                            <button
                                                                onClick={() => handleImageRemove(eventData.event_welcome_screen, "event_welcome_screen")}
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
                                                        value={eventData.event_welcome_screen_time}
                                                        onChange={handleSliderChange}
                                                        className="welcome-screen-time-slider"
                                                    />
                                                    <span className="welcome-screen-time-display">
                                                        {eventData.event_welcome_screen_time} seconds
                                                    </span>
                                                </div>

                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}
                        </div>
                        {/* 4 */}
                        <div className="collapsible-section">
                            <div
                                className={`collapsible-header ${openSections.section4 ? "opened" : ""}`}
                                onClick={() => toggleSection("section4")}
                            >
                                <span>Customization</span>
                                <span className={`arrow ${openSections.section4 ? "down" : "right"}`}>
                                    <i className="ri-arrow-down-fill"></i>
                                </span>
                            </div>
                            {openSections.section4 && (
                                <div className="collapsible-content">
                                    <CustomizationForm
                                    />
                                </div>
                            )}
                        </div>
                        {/* 6 */}
                        <div className="collapsible-section">
                            <div
                                className={`collapsible-header ${openSections.section6 ? "opened" : ""}`}
                                onClick={() => toggleSection("section6")}
                            >
                                <span>Configuration</span>
                                <span className={`arrow ${openSections.section6 ? "down" : "right"}`}>
                                    <i className="ri-arrow-down-fill"></i>
                                </span>
                            </div>
                            {openSections.section6 && (
                                <div className="collapsible-content">
                                    <Configuration />
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
                                            </div> <br />
                                            {buyCredits ? (
                                                <div className="buy-credits-container">
                                                    <h2>Buy Credits</h2>
                                                    <p>
                                                        To create and customize QR codes, you need to purchase additional credits.
                                                        <br />
                                                    </p>
                                                    <button className="button-57" style={{ width: '100%' }} onClick={() => handleBuyCredits(data1)} role="button"><span className="text">Buy Credits</span><span>You don't have credits</span></button>
                                                </div>
                                            ) : (

                                                !editdataShowSidebar ? (
                                                    <>
                                                        <button className="button-57" style={{ width: '100%' }} onClick={() => {
                                                            handleSubmit("event", data1); // Pass 'Business Text' and 'data'
                                                        }} role="button"><span className="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                                                    </>
                                                ) : (
                                                    <button className="button-57" style={{ width: '100%' }} onClick={() => handleUpdate(eventData._id, "event", data1)} role="button"><span className="text">Update</span><span>Update</span></button>
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
                                                    value={`${process.env.REACT_APP_FRONTEND_URL}/display/qr-event/${qrvalueide}`}
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
                                                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
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
                    <div className="mobile-container-camera-wrapper">
                        <div className="camera-mobile"></div>
                        {/* <MobileBusinessPreview eventData={eventData} customization={customization} /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventQrForm;
