import React, { useRef, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './businessCsvqr.css'
import { QRCode } from 'react-qrcode-logo'
import MobileBusinessPreview from './mobilelivepreview';
import CustomizationForm from '../../allqrcodeCustomizations/designCustomization/DesignCustomization';
import Configuration from '../stats/configuration/Configuration';
import { useCustomization } from '../../allqrcodeCustomizations/designCustomization/globalcustomization';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';
import { useQR } from '../../allqrcodeCustomizations/qrCodeCustomization/globalqrcodedesign';
import { useFormContext } from '../../allqrcodeCustomizations/globalsetup/globaldata';
import { useNavigate } from 'react-router-dom';
const TimeScheduleForm = () => {
  const navigate = useNavigate()
  const { customization, updateCustomization } = useCustomization();
  const { qrSettings } = useQR();
  const user_id = localStorage.getItem('user_id');
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
  const { handleSubmit, handleUpdate,handleDownload1, qrvalueide, buyCredits, handleDownload, handleBuyCredits, isPopupOpen, handleClosePopup } = useFormContext()

  const ref = useRef();
  const [businessData, setBusinessData] = useState({
    business_logo_qr: "", //✔️
    business_company: "",//✔️
    business_title: "",//✔️
    business_subtitle: "",//✔️
    business_button_text: "",//✔️
    business_slider_images: [],//✔️
    business_address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    business_facilities: [],//✔️
    business_about: "",
    business_contact_numbers: [""],//✔️
    business_emails: [""],//✔️
    business_social_networks: [],//✔️
    business_welcome_screen: "",//✔️
    business_welcome_screen_time: 5,//✔️
    business_button_url: '',//✔️
    business_website_name: '',//✔️
    business_website_url: '',//✔️
    business_display_theme: 'defualt',//✔️
    business_schedule: [
      { day: 'Monday', time_slots: [] },
      { day: 'Tuesday', time_slots: [] },
      { day: 'Wednesday', time_slots: [] },
      { day: 'Thursday', time_slots: [] },
      { day: 'Friday', time_slots: [] },
      { day: 'Saturday', time_slots: [] },
      { day: 'Sunday', time_slots: [] }, // No default time slots for Sunday
    ],//✔️
    user_id,
  });
  console.log(businessData)
  const data1 = { ...businessData }
  const editdataShowSidebar = localStorage.getItem("requestBusinessEdit");
  useEffect(() => {
    if (!user_id) {
      navigate("/user/login"); // Navigate to the login page if user_id is not available
    } else {
      const editableData = localStorage.getItem("requestBusinessEdit");
      if (editableData) {
        setBusinessData(JSON.parse(localStorage.getItem("businessdatasending")))
      } else {
        const savedData = localStorage.getItem("businessData");
        if (savedData) {
          setBusinessData(JSON.parse(savedData)); // Populate state with saved data
        }
        setTimeout(() => {
          localStorage.removeItem("businessData");
          localStorage.removeItem("currentPath");
          localStorage.removeItem("nextpath");
          localStorage.removeItem("pricing")
        }, 3000);
      }
    }
  }, []);

  const handleSliderChange = (e) => {
    const value = e.target.value;
    setBusinessData({
      ...businessData,
      business_welcome_screen_time: value,
    });
  };
  const handleAboutChange = (e) => {
    setBusinessData({
      ...businessData,
      business_about: e.target.value,
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessData({ ...businessData, [name]: value });
  };

  const handleTimeSlotChange = (dayIndex, timeIndex, field, value) => {
    const newSchedule = [...businessData.business_schedule];
    newSchedule[dayIndex].time_slots[timeIndex][field] = value;
    setBusinessData({ ...businessData, business_schedule: newSchedule });
  };

  const addTimeSlot = (dayIndex) => {
    const newSchedule = [...businessData.business_schedule];
    newSchedule[dayIndex].time_slots.push({ start_time: '', end_time: '' });
    setBusinessData({ ...businessData, business_schedule: newSchedule });
  };

  const removeTimeSlot = (dayIndex, timeIndex) => {
    const newSchedule = [...businessData.business_schedule];
    newSchedule[dayIndex].time_slots.splice(timeIndex, 1);
    setBusinessData({ ...businessData, business_schedule: newSchedule });
  };
  // Function to handle adding a new input field
  const addField = (key) => {
    setBusinessData((prevState) => ({
      ...prevState,
      [key]: [...prevState[key], ""],
    }));
  };
  // Function to handle removing an input field
  const removeField = (key, index) => {
    setBusinessData((prevState) => ({
      ...prevState,
      [key]: prevState[key].filter((_, i) => i !== index),
    }));
  };

  // Function to handle input changes
  const handleInputChanges = (key, index, value) => {
    setBusinessData((prevState) => {
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
        if (imageType === "business_logo_qr") {
          setBusinessData((prevData) => ({
            ...prevData,
            business_logo_qr: imageUrl,
          }));
        } else if (imageType === "business_slider_images") {
          setBusinessData((prevData) => ({
            ...prevData,
            business_slider_images: [...prevData.business_slider_images, imageUrl],
          }));
        } else if (imageType === "business_welcome_screen") {
          setBusinessData((prevData) => ({
            ...prevData,
            business_welcome_screen: imageUrl,
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
    if (imageType === "business_logo_qr") {
      setBusinessData((prevData) => ({
        ...prevData,
        business_logo_qr: "",
      }));
    } else if (imageType === "business_slider_images") {
      setBusinessData((prevData) => ({
        ...prevData,
        business_slider_images: prevData.business_slider_images.filter(
          (url) => url !== imageUrl
        ),
      }));
    } else if (imageType === "business_welcome_screen") {
      setBusinessData((prevData) => ({
        ...prevData,
        business_welcome_screen: "",
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
    setBusinessData((prevData) => {
      const facilities = prevData.business_facilities.includes(facilityName)
        ? prevData.business_facilities.filter((facility) => facility !== facilityName)
        : [...prevData.business_facilities, facilityName];

      return { ...prevData, business_facilities: facilities };
    });
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
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const handleIconClick = (platform) => {
    // Add the selected platform to business_social_networks
    const alreadySelected = businessData.business_social_networks.some(
      (network) => network.platform === platform.name
    );

    if (!alreadySelected) {
      setBusinessData((prevData) => ({
        ...prevData,
        business_social_networks: [
          ...prevData.business_social_networks,
          { platform: platform.name, link: "", message: "" },
        ],
      }));
    }
  };

  const handleInputChangeSocial = (e, platform, field) => {
    setBusinessData((prevData) => {
      const updatedSocialNetworks = prevData.business_social_networks.map((network) => {
        if (network.platform === platform) {
          return { ...network, [field]: e.target.value };
        }
        return network;
      });

      return { ...prevData, business_social_networks: updatedSocialNetworks };
    });
  };

  const handleRemovePlatform = (platform) => {
    setBusinessData((prevData) => ({
      ...prevData,
      business_social_networks: prevData.business_social_networks.filter(
        (network) => network.platform !== platform
      ),
    }));
  };


  const [openSections, setOpenSections] = useState({}); // Track open/closed states

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const handleThemeSelection = (theme) => {
    setBusinessData((prevData) => ({
      ...prevData,
      business_display_theme: theme,
    }));
  };
  const toggleOpenClose = (dayIndex) => {
    const updatedSchedule = [...businessData.business_schedule];
    const currentDay = updatedSchedule[dayIndex];
    if (currentDay.time_slots.length === 0) {
      updatedSchedule[dayIndex].time_slots = [{ start_time: '08:00', end_time: '20:00' }];
    } else {
      updatedSchedule[dayIndex].time_slots = [];
    }
    setBusinessData({ ...businessData, business_schedule: updatedSchedule });
  };


  return (
    <>
      <div className="business-info-page">
        <div className="collapsible-container">
          <div className="business-form-container">
            <form>
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
                            checked={businessData.business_display_theme === 'defualt'}
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
                          className={`theme-image ${businessData.business_display_theme === 'theme1' ? 'selected' : ''}`}
                        />
                        <img
                          src="https://qrfy.com/assets/template-2-D0nYwSJm.webp"
                          alt="Theme 2"
                          onClick={() => handleThemeSelection('theme2')}
                          className={`theme-image ${businessData.business_display_theme === 'theme2' ? 'selected' : ''}`}
                        />
                        <img
                          src="https://qrfy.com/assets/template-1-DNRVxBJo.webp"
                          alt="Theme 3"
                          onClick={() => handleThemeSelection('theme3')}
                          className={`theme-image ${businessData.business_display_theme === 'theme3' ? 'selected' : ''}`}
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
                          <span>Business Information</span>
                          <span className={`arrow ${openSections.undersection1 ? "down" : "right"}`}>
                            <i className="ri-arrow-down-fill"></i>
                          </span>
                        </div>
                        {openSections.undersection1 && (
                          <div className="collapsible-content">

                            {/* <!-- Logo QR --> */}
                            <div className="business-logo-qr-container">
                              <label className="business-logo-qr-label">Business Logo QR</label>
                              <input
                                type="file"
                                onChange={(e) => handleImageChange(e, "business_logo_qr")}
                                accept="image/*"
                              />
                              {businessData.business_logo_qr && (
                                <div className="business-logo-qr-image-container">
                                  <img
                                    src={businessData.business_logo_qr}
                                    alt="Business Logo QR"
                                    className="business-logo-qr-image"
                                  />
                                  <button
                                    onClick={() => handleImageRemove(businessData.business_logo_qr, "business_logo_qr")}
                                    className="business-logo-qr-remove-btn"
                                  >
                                    ✖
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="business-info-inputs-container">
                              <label className="business-info-label">Company Name</label>
                              <input
                                type="text"
                                name="business_company"
                                value={businessData.business_company}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="business-info-inputs-container">
                              <label className="business-info-label">Business Title</label>
                              <input
                                type="text"
                                name="business_title"
                                value={businessData.business_title}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="business-info-inputs-container">
                              <label className="business-info-label">Business Subtitle</label>
                              <input
                                type="text"
                                name="business_subtitle"
                                value={businessData.business_subtitle}
                                onChange={handleInputChange}
                                required
                              />
                            </div>

                            <div className="business-info-inputs-container">
                              <label className="business-info-label">Button</label>
                              <div className="business-button-inputs-container">
                                <input
                                  type="text"
                                  name="business_button_text"
                                  value={businessData.business_button_text}
                                  onChange={handleInputChange}
                                  placeholder='Enter Button text'
                                  required
                                />
                                <input
                                  type="url"
                                  name="business_button_url"
                                  value={businessData.business_button_url}
                                  onChange={handleInputChange}
                                  placeholder='Enter Button URL'
                                  required
                                />
                              </div>
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
                                onChange={(e) => handleImageChange(e, "business_slider_images")}
                                accept="image/*"
                                multiple
                              />
                              {businessData.business_slider_images.length > 0 && (
                                <div className="slider-images-preview">
                                  {businessData.business_slider_images.map((url, index) => (
                                    <div key={index} className="slider-image-item">
                                      <img
                                        src={url}
                                        alt={`Slider Image ${index + 1}`}
                                        className="slider-image"
                                      />
                                      <button
                                        onClick={() => handleImageRemove(url, "business_slider_images")}
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
                      <div className="collapsible-section">
                        <div
                          className={`collapsible-header ${openSections.undersection3 ? "opened" : ""}`}
                          onClick={() => toggleSection("undersection3")}
                        >
                          <span>Opening Hours</span>
                          <span className={`arrow ${openSections.undersection3 ? "down" : "right"}`}>
                            <i className="ri-arrow-down-fill"></i>
                          </span>
                        </div>
                        {openSections.undersection3 && (
                          <div className="collapsible-content">
                            <div className="business-hours-container">
                              <h3 className="business-hours-title">Business Hours</h3>
                              <div className="business-hours-grid">
                                {businessData.business_schedule.map((schedule, dayIndex) => (
                                  <div key={schedule.day} className="day-schedule-card">
                                    {/* Open/Close Status */}
                                    <span className={`status ${schedule.time_slots.length > 0 ? 'open' : 'closed'}`}>
                                      {schedule.time_slots.length > 0 ? 'Open' : 'Closed'}
                                    </span>

                                    <div className="flex-of-day-and-button">

                                      {/* Day Name */}
                                      <h4 className="day-name">{schedule.day}</h4>
                                      <button
                                        type="button"
                                        onClick={() => addTimeSlot(dayIndex)}
                                        className="toggle-open-close-btn"
                                      >
                                        +
                                      </button>
                                    </div>

                                    {/* Time Slots */}
                                    {schedule.time_slots.map((slot, timeIndex) => (
                                      <div key={timeIndex} className="time-slot-row">
                                        <input
                                          type="time"
                                          value={slot.start_time}
                                          onChange={(e) =>
                                            handleTimeSlotChange(dayIndex, timeIndex, 'start_time', e.target.value)
                                          }
                                          required
                                          className="time-input"
                                        />
                                        <input
                                          type="time"
                                          value={slot.end_time}
                                          onChange={(e) =>
                                            handleTimeSlotChange(dayIndex, timeIndex, 'end_time', e.target.value)
                                          }
                                          required
                                          className="time-input"
                                        />
                                        {timeIndex > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => removeTimeSlot(dayIndex, timeIndex)}
                                            className="remove-time-slot-btn"
                                          >
                                            ❌
                                          </button>
                                        )}
                                      </div>
                                    ))}

                                    <button
                                      type="button"
                                      onClick={() => toggleOpenClose(dayIndex)}
                                      className="add-time-slot-btn"
                                    >
                                      {schedule.time_slots.length > 0 ? 'Close' : 'Open'}
                                    </button>


                                  </div>
                                ))}
                              </div>
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
                                  value={businessData.business_address.street}
                                  onChange={(e) =>
                                    setBusinessData({
                                      ...businessData,
                                      business_address: { ...businessData.business_address, street: e.target.value },
                                    })
                                  }
                                />
                              </div>

                              <div>
                                <label>City</label>
                                <input
                                  type="text"
                                  value={businessData.business_address.city}
                                  onChange={(e) =>
                                    setBusinessData({
                                      ...businessData,
                                      business_address: { ...businessData.business_address, city: e.target.value },
                                    })
                                  }
                                />
                              </div>

                              <div>
                                <label>State</label>
                                <input
                                  type="text"
                                  value={businessData.business_address.state}
                                  onChange={(e) =>
                                    setBusinessData({
                                      ...businessData,
                                      business_address: { ...businessData.business_address, state: e.target.value },
                                    })
                                  }
                                />
                              </div>

                              <div>
                                <label>Zip</label>
                                <input
                                  type="text"
                                  value={businessData.business_address.zip}
                                  onChange={(e) =>
                                    setBusinessData({
                                      ...businessData,
                                      business_address: { ...businessData.business_address, zip: e.target.value },
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* 4 */}
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
                                    className={`facility-option-card ${businessData.business_facilities.includes(facility.name) ? 'selected' : ''}`}
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
                        className={`collapsible-header ${openSections.under2section1 ? "opened" : ""}`}
                        onClick={() => toggleSection("under2section1")}
                      >
                        <span>About the Company</span>
                        <span className={`arrow ${openSections.under2section1 ? "down" : "right"}`}>
                          <i className="ri-arrow-down-fill"></i>
                        </span>
                      </div>
                      {openSections.under2section1 && (
                        <div className="collapsible-content">
                          <div className="business-about-container">

                            <div className="business-about-textarea-container">
                              <label htmlFor="about-textarea" className="business-about-label">
                                About Your Business:
                              </label>
                              <textarea
                                id="about-textarea"
                                value={businessData.business_about}
                                onChange={handleAboutChange}
                                rows="10"
                                cols="50"
                                placeholder="Enter some text about your business..."
                                className="business-about-textarea"
                              />
                            </div>
                          </div>


                        </div>
                      )}
                    </div>
                    <div className="collapsible-section">
                      <div
                        className={`collapsible-header ${openSections.under2section2 ? "opened" : ""}`}
                        onClick={() => toggleSection("under2section2")}
                      >
                        <span>Contact Information</span>
                        <span className={`arrow ${openSections.under2section2 ? "down" : "right"}`}>
                          <i className="ri-arrow-down-fill"></i>
                        </span>
                      </div>
                      {openSections.under2section2 && (
                        <div className="collapsible-content">
                          <label className="business-info-label">Add Website</label>
                          <div className="business-info-inputs-containers">
                            <input
                              type="text"
                              name="business_website_name"
                              value={businessData.business_website_name}
                              onChange={handleInputChange}
                              placeholder='Website Name'
                              required
                            />
                            <input
                              type="url"
                              name="business_website_url"
                              value={businessData.business_website_url}
                              onChange={handleInputChange}
                              placeholder='Website URL'
                              required
                            />
                          </div>

                          <div className="contact-numbers-container">
                            <div className="contact-numbers-header">
                              <span>Business Contact Numbers</span>
                              <button
                                type="button"
                                onClick={() => addField("business_contact_numbers")}
                                className="add-contact-number-btn"
                              >
                                +
                              </button>
                            </div>
                            <div>
                              {businessData.business_contact_numbers.map((number, index) => (
                                <div key={index} className="contact-number-input-container">
                                  <input
                                    type="text"
                                    value={number}
                                    onChange={(e) =>
                                      handleInputChanges("business_contact_numbers", index, e.target.value)
                                    }
                                    placeholder="Enter phone number"
                                  />
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => removeField("business_contact_numbers", index)}
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
                              <span>Business Emails</span>
                              <button
                                type="button"
                                onClick={() => addField("business_emails")}
                                className="add-business-email-btn"
                              >
                                +
                              </button>
                            </div>
                            <div>
                              {businessData.business_emails.map((email, index) => (
                                <div key={index} className="business-email-input-container">
                                  <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                      handleInputChanges("business_emails", index, e.target.value)
                                    }
                                    placeholder="Enter email address"
                                  />
                                  {index > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => removeField("business_emails", index)}
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
                              {businessData.business_social_networks.map((network, index) => (
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
                              onChange={(e) => handleImageChange(e, "business_welcome_screen")}
                              accept="image/*"
                            />
                            {businessData.business_welcome_screen && (
                              <div className="image-preview-container">
                                <img
                                  src={businessData.business_welcome_screen}
                                  alt="Welcome Screen"
                                  className="welcome-image-preview"
                                />
                                <button
                                  onClick={() => handleImageRemove(businessData.business_welcome_screen, "business_welcome_screen")}
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
                              value={businessData.business_welcome_screen_time}
                              onChange={handleSliderChange}
                              className="welcome-screen-time-slider"
                            />
                            <span className="welcome-screen-time-display">
                              {businessData.business_welcome_screen_time} seconds
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
            </form>

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
                              handleSubmit("instagram", data1); // Pass 'Business Text' and 'data'
                            }} role="button"><span className="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                          </>
                        ) : (
                          <button className="button-57" style={{ width: '100%' }} onClick={() => handleUpdate(businessData._id, "instagram", data1)} role="button"><span className="text">Update</span><span>Update</span></button>
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
                          value={`${process.env.REACT_APP_FRONTEND_URL}/display/qr-business/${qrvalueide}`}
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
            <MobileBusinessPreview businessData={businessData} customization={customization} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeScheduleForm;
