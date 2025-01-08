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
import DisplayVcardPlus from './DisplayVcardPlusQr';
import VcardDisplay from './MobileVcardDisplay';
const VcardPlusQR = () => {
    const navigate = useNavigate()
    const { qrSettings } = useQR();
    const { customization, updateCustomization } = useCustomization();
    const user_id = localStorage.getItem('user_id');

    const { handleSubmit, qrvalueide, handleUpdate, buyCredits, handleDownload,handleDownload1, handleBuyCredits, isPopupOpen, handleClosePopup } = useFormContext()



    const [vcardPlus, setVcardPlus] = useState({
        vcardplus_image: '',
        vcardplus_name: '',
        vcardplus_surname: '',
        vcardplus_title: '',
        vcardplus_contact: [{ label: "", value: "" }],
        vcardplus_email: [{ label: "", value: "" }],     
        vcardplus_website_name: '',//✔️
        vcardplus_website_url: '',//✔️
        business_address: {
            street: "",
            city: "",
            state: "",
            zip: "",
        },
        vcardplus_note: '',
        vcardplus_images: [],//✔️
        vcardplus_company: [],//
        vcardplus_social_networks: [],
        Social_welcome_screen: "",//✔️
        Social_welcome_screen_time: 5,//✔️
        social_display_theme: 'defualt',//✔️
        user_id,
        vcardPlus_header_phone: '',
        vcardPlus_header_email: '',
        vcardPlus_header_location: '',
        vcardPlus_btn: '',
        vcardPlus_button_top: 'false',
        vcardPlus_button_float: 'false'
    });
    const data = { ...vcardPlus };
    console.log(data);



    useEffect(() => {
        if (!user_id) {
            navigate("/user/login"); // Navigate to the login page if user_id is not available
        } else {
            const editableData = localStorage.getItem("requestBusinessEdit");
            if (editableData) {
                setVcardPlus(JSON.parse(localStorage.getItem("businessdatasending")))
            } else {
                const savedData = localStorage.getItem("vcardPlus");
                if (savedData) {
                    setVcardPlus(JSON.parse(savedData)); // Populate state with saved data
                }
                setTimeout(() => {
                    localStorage.removeItem("vcardPlus");
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
    const toggleSection = (section) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    const handleThemeSelection = (theme) => {
        setVcardPlus((prevData) => ({
            ...prevData,
            social_display_theme: theme,
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVcardPlus({
            ...vcardPlus,
            [name]: value,
        });
    };
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
    const handleSliderChange = (event) => {
        const newTime = event.target.value; // Get the new value from the slider
        // You could update the state or perform other actions here
        setVcardPlus({ ...vcardPlus, Social_welcome_screen_time: newTime });
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
                    setVcardPlus((prevState) => ({
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

    // Function to handle adding a new input field
    const addField = (key) => {
        setVcardPlus((prevState) => ({
            ...prevState,
            [key]: [...prevState[key], { label: "", value: "" }],
        }));
    };
    // Function to handle input changes
    const handleInputChanges = (key, index, field, value) => {
        setVcardPlus((prevState) => {
            const updatedFields = [...prevState[key]];
            updatedFields[index] = {
                ...updatedFields[index],
                [field]: value,
            };
            return {
                ...prevState,
                [key]: updatedFields,
            };
        });
    };

    // Function to handle removing an input field
    const removeField = (key, index) => {
        setVcardPlus((prevState) => ({
            ...prevState,
            [key]: prevState[key].filter((_, i) => i !== index),
        }));
    };
    const handleImageChange = async (e, imageType) => {
        const file = e.target.files[0];

        // Validate file type and size
        if (file && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            return;
        }

        if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
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
                    setVcardPlus((prevData) => ({
                        ...prevData,
                        business_logo_qr: imageUrl,
                    }));
                } else if (imageType === "vcardplus_images") {
                    setVcardPlus((prevData) => ({
                        ...prevData,
                        vcardplus_images: [...prevData.vcardplus_images, imageUrl],
                    }));
                } else if (imageType === "business_welcome_screen") {
                    setVcardPlus((prevData) => ({
                        ...prevData,
                        business_welcome_screen: imageUrl,
                    }));
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Function to handle removing an image from the state
    const handleImageRemove = (imageUrl, imageType) => {
        if (imageType === "business_logo_qr") {
            setVcardPlus((prevData) => ({
                ...prevData,
                business_logo_qr: "",
            }));
        } else if (imageType === "vcardplus_images") {
            setVcardPlus((prevData) => ({
                ...prevData,
                vcardplus_images: prevData.vcardplus_images.filter(
                    (url) => url !== imageUrl
                ),
            }));
        } else if (imageType === "business_welcome_screen") {
            setVcardPlus((prevData) => ({
                ...prevData,
                business_welcome_screen: "",
            }));
        }
    };
    const handleAboutChange = (e) => {
        setVcardPlus({
            ...vcardPlus,
            vcardplus_note: e.target.value,
        });
    };
    const handleCheckBoxChange = (e, check) => {
        setVcardPlus((prevState) => ({
            ...prevState, // Spreads the existing state into the new state
            [check]: e.target.checked, // Updates the specific checkbox's state
            ...(check === 'vcardPlus_button_top' && { vcardPlus_button_float: false }), // Conditionally unchecks the other checkbox
            ...(check === 'vcardPlus_button_float' && { vcardPlus_button_top: false }) // Conditionally unchecks the first checkbox
        }));
    }
    const handleIconClick = (platform) => {
        // Add the selected platform to vcardplus_social_networks
        const alreadySelected = vcardPlus.vcardplus_social_networks.some(
          (network) => network.platform === platform.name
        );
    
        if (!alreadySelected) {
          setVcardPlus((prevData) => ({
            ...prevData,
            vcardplus_social_networks: [
              ...prevData.vcardplus_social_networks,
              { platform: platform.name, link: "", message: "" },
            ],
          }));
        }
      };
    
      const handleInputChangeSocial = (e, platform, field) => {
        setVcardPlus((prevData) => {
          const updatedSocialNetworks = prevData.vcardplus_social_networks.map((network) => {
            if (network.platform === platform) {
              return { ...network, [field]: e.target.value };
            }
            return network;
          });
    
          return { ...prevData, vcardplus_social_networks: updatedSocialNetworks };
        });
      };
    
      const handleRemovePlatform = (platform) => {
        setVcardPlus((prevData) => ({
          ...prevData,
          vcardplus_social_networks: prevData.vcardplus_social_networks.filter(
            (network) => network.platform !== platform
          ),
        }));
      };
      const handleCategoryNameChange = (index, event) => {
        const newCategories = [...vcardPlus.vcardplus_company];
        newCategories[index].categoryName = event.target.value;
        setVcardPlus({ ...vcardPlus, vcardplus_company: newCategories });
      };
      // Handle product name change
      const handleProductNameChange = (categoryIndex, productIndex, event) => {
        const newCategories = [...vcardPlus.vcardplus_company];
        newCategories[categoryIndex].products[productIndex].name = event.target.value;
        setVcardPlus({ ...vcardPlus, vcardplus_company: newCategories });
      };

      // Add a new category
      const addCategory = () => {
        setVcardPlus({
          ...vcardPlus,
          vcardplus_company: [...vcardPlus.vcardplus_company, { categoryName: '', products: [] }],
        });
      };
      // Remove a category
      const removeCategory = (index) => {
        const newCategories = vcardPlus.vcardplus_company.filter((_, i) => i !== index);
        setVcardPlus({ ...vcardPlus, vcardplus_company: newCategories });
      };
      // Add a new product to a category
      const addProduct = (categoryIndex) => {
        const newCategories = [...vcardPlus.vcardplus_company];
        newCategories[categoryIndex].products.push({ name: ''});
        setVcardPlus({ ...vcardPlus, vcardplus_company: newCategories });
      };
      // Remove a product from a category
      const removeProduct = (categoryIndex, productIndex) => {
        const newCategories = [...vcardPlus.vcardplus_company];
        newCategories[categoryIndex].products = newCategories[categoryIndex].products.filter(
          (_, i) => i !== productIndex
        );
        setVcardPlus({ ...vcardPlus, vcardplus_company: newCategories });
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
                                                checked={vcardPlus.social_display_theme === 'defualt'}
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
                                            className={`theme-image ${vcardPlus.social_display_theme === 'theme1' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734005397/esthtdmgmuole2djbqu4.png"
                                            alt="Theme 2"
                                            onClick={() => handleThemeSelection('theme2')}
                                            className={`theme-image ${vcardPlus.social_display_theme === 'theme2' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733993440/jvt0sbaqet7sobomoby3.png"
                                            alt="Theme 3"
                                            onClick={() => handleThemeSelection('theme3')}
                                            className={`theme-image ${vcardPlus.social_display_theme === 'theme3' ? 'selected' : ''}`}
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
                                        <span>About You</span>
                                        <span className={`arrow ${openSections.socialsectio ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.socialsectio && (
                                        <div className="collapsible-content">
                                            <div>
                                                <input type="file"
                                                    onChange={(e) => handleImageChangeWel(e, 'vcardplus_image')}
                                                    accept="image/*"
                                                />

                                                <label htmlFor="Video_title">Name</label>
                                                <input
                                                    type="text"
                                                    id="Video_title"
                                                    name="vcardplus_name"
                                                    value={vcardPlus.vcardplus_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Name"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Video_description">SurName</label>
                                                <input type="text"
                                                    id="Video_description"
                                                    name="vcardplus_surname"
                                                    value={vcardPlus.vcardplus_surname}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Surname"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Video_btn_text">Title</label>
                                                <input
                                                    type="text"
                                                    id="Video_btn_text"
                                                    name="vcardplus_title"
                                                    value={vcardPlus.vcardplus_title}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Title"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="collapsible-section">
                                    <div
                                        className={`collapsible-header ${openSections.vcardplussection0 ? "opened" : ""}`}
                                        onClick={() => toggleSection("vcardplussection0")}
                                    >
                                        <span>Contact Info</span>
                                        <span className={`arrow ${openSections.vcardplussection0 ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.vcardplussection0 && (
                                        <div className="collapsible-content">
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
                                                                    value={vcardPlus.business_address.street}
                                                                    onChange={(e) =>
                                                                        setVcardPlus({
                                                                            ...vcardPlus,
                                                                            business_address: { ...vcardPlus.business_address, street: e.target.value },
                                                                        })
                                                                    }
                                                                />
                                                            </div>

                                                            <div>
                                                                <label>City</label>
                                                                <input
                                                                    type="text"
                                                                    value={vcardPlus.business_address.city}
                                                                    onChange={(e) =>
                                                                        setVcardPlus({
                                                                            ...vcardPlus,
                                                                            business_address: { ...vcardPlus.business_address, city: e.target.value },
                                                                        })
                                                                    }
                                                                />
                                                            </div>

                                                            <div>
                                                                <label>State</label>
                                                                <input
                                                                    type="text"
                                                                    value={vcardPlus.business_address.state}
                                                                    onChange={(e) =>
                                                                        setVcardPlus({
                                                                            ...vcardPlus,
                                                                            business_address: { ...vcardPlus.business_address, state: e.target.value },
                                                                        })
                                                                    }
                                                                />
                                                            </div>

                                                            <div>
                                                                <label>Zip</label>
                                                                <input
                                                                    type="text"
                                                                    value={vcardPlus.business_address.zip}
                                                                    onChange={(e) =>
                                                                        setVcardPlus({
                                                                            ...vcardPlus,
                                                                            business_address: { ...vcardPlus.business_address, zip: e.target.value },
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
                                                                name="vcardplus_website_name"
                                                                value={vcardPlus.vcardplus_website_name}
                                                                onChange={handleInputChange}
                                                                placeholder='Website Name'
                                                                required
                                                            />
                                                            <input
                                                                type="url"
                                                                name="vcardplus_website_url"
                                                                value={vcardPlus.vcardplus_website_url}
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
                                                                    onClick={() => addField("vcardplus_contact")}
                                                                    className="add-contact-number-btn"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            <div>
                                                                {vcardPlus.vcardplus_contact.map((contact, index) => (
                                                                    <div key={index} className="contact-number-input-container">
                                                                        <input
                                                                            type="text"
                                                                            value={contact.label}
                                                                            onChange={(e) =>
                                                                                handleInputChanges("vcardplus_contact", index, "label", e.target.value)
                                                                            }
                                                                            placeholder="Enter label (e.g., Work, Home)"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={contact.value}
                                                                            onChange={(e) =>
                                                                                handleInputChanges("vcardplus_contact", index, "value", e.target.value)
                                                                            }
                                                                            placeholder="Enter phone number"
                                                                        />
                                                                        {index > 0 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeField("vcardplus_contact", index)}
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
                                                                    onClick={() => addField("vcardplus_email")}
                                                                    className="add-business-email-btn"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            <div>
                                                                {vcardPlus.vcardplus_email.map((email, index) => (
                                                                    <div key={index} className="business-email-input-container">
                                                                        <input
                                                                            type="text"
                                                                            value={email.label}
                                                                            onChange={(e) =>
                                                                                handleInputChanges("vcardplus_email", index, "label", e.target.value)
                                                                            }
                                                                            placeholder="Enter label (e.g., Work, Personal)"
                                                                        />
                                                                        <input
                                                                            type="email"
                                                                            value={email.value}
                                                                            onChange={(e) =>
                                                                                handleInputChanges("vcardplus_email", index, "value", e.target.value)
                                                                            }
                                                                            placeholder="Enter email address"
                                                                        />
                                                                        {index > 0 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeField("vcardplus_email", index)}
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
                                                                    Summary:
                                                                </label>
                                                                <textarea
                                                                    id="about-textarea"
                                                                    value={vcardPlus.vcardplus_note}
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
                                                            <label className="slider-images-label">Images</label>
                                                            <input
                                                                type="file"
                                                                onChange={(e) => handleImageChange(e, "vcardplus_images")}
                                                                accept="image/*"
                                                                multiple
                                                            />
                                                            {vcardPlus.vcardplus_images.length > 0 && (
                                                                <div className="slider-images-preview">
                                                                    {vcardPlus.vcardplus_images.map((url, index) => (
                                                                        <div key={index} className="slider-image-item">
                                                                            <img
                                                                                src={url}
                                                                                alt={`Slider Image ${index + 1}`}
                                                                                className="slider-image"
                                                                            />
                                                                            <button
                                                                                onClick={() => handleImageRemove(url, "vcardplus_images")}
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
                                                {vcardPlus.Social_welcome_screen && (
                                                    <div className="image-preview-container">
                                                        <img
                                                            src={vcardPlus.Social_welcome_screen}
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
                                                    value={vcardPlus.Social_welcome_screen_time}
                                                    onChange={handleSliderChange}
                                                    className="welcome-screen-time-slider"
                                                />
                                                <span className="welcome-screen-time-display">
                                                    {vcardPlus.Social_welcome_screen_time} seconds
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
                            className={`collapsible-header ${openSections.undersection2 ? "opened" : ""}`}
                            onClick={() => toggleSection("undersection2")}
                        >
                            <span>Content</span>
                            <span className={`arrow ${openSections.undersection2 ? "down" : "right"}`}>
                                <i className="ri-arrow-down-fill"></i>
                            </span>
                        </div>
                        {openSections.undersection2 && (
                            <div className="collapsible-content">
                                <div className="collapsible-section">
                                    <div
                                        className={`collapsible-header ${openSections.vcardplussection1 ? "opened" : ""}`}
                                        onClick={() => toggleSection("vcardplussection1")}
                                    >
                                        <span>Customize your Buttons</span>
                                        <span className={`arrow ${openSections.vcardplussection1 ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.vcardplussection1 && (
                                        <div className="collapsible-content">
                                            <div>
                                                <h3>Header</h3>
                                                <label htmlFor="Video_title">phone</label>
                                                <input
                                                    type="text"
                                                    id="Video_title"
                                                    name="vcardPlus_header_phone"
                                                    value={vcardPlus.vcardPlus_header_phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Name"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Video_description">email</label>
                                                <input type="text"
                                                    id="Video_description"
                                                    name="vcardPlus_header_email"
                                                    value={vcardPlus.vcardPlus_header_email}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Surname"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Video_btn_text">location</label>
                                                <input
                                                    type="text"
                                                    id="Video_btn_text"
                                                    name="vcardPlus_header_location"
                                                    value={vcardPlus.vcardPlus_header_location}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Title"
                                                />
                                            </div>
                                            <h3>Footer</h3>
                                            <div>
                                                <label htmlFor="Video_btn_text">Button Text</label>
                                                <input
                                                    type="text"
                                                    id="Video_btn_text"
                                                    name="vcardPlus_btn"
                                                    value={vcardPlus.vcardPlus_btn}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Button Text"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="Video_btn_text">Button Top</label>
                                                <input
                                                    type="checkbox"
                                                    id="Video_btn_text"
                                                    name="vcardPlus_button_top"
                                                    value={vcardPlus.vcardPlus_button_top}
                                                    checked={vcardPlus.vcardPlus_button_top} // Ensure the `checked` attribute is tied to the state
                                                    onChange={(e) => handleCheckBoxChange(e, 'vcardPlus_button_top')}
                                                    placeholder="Enter Button Text"
                                                />
                                            </div> <div>
                                                <label htmlFor="Video_btn_text">Button Float</label>
                                                <input
                                                    type="checkbox"
                                                    id="Video_btn_text"
                                                    name="vcardPlus_button_float"
                                                    value={vcardPlus.vcardPlus_button_float}
                                                    checked={vcardPlus.vcardPlus_button_float} // Ensure the `checked` attribute is tied to the state
                                                    onChange={(e) => handleCheckBoxChange(e, 'vcardPlus_button_float')}
                                                    placeholder="Enter Button Text"
                                                />
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
                              {vcardPlus.vcardplus_social_networks.map((network, index) => (
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
            className={`collapsible-header ${openSections.shopnamedetail4 ? "opened" : ""}`}
            onClick={() => toggleSection("shopnamedetail4")}
          >
            <span>Company</span>
            <span className={`arrow ${openSections.shopnamedetail4 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.shopnamedetail4 && (
            <div className="collapsible-content">
<div className="category-container">
    

  {vcardPlus.vcardplus_company.map((category, categoryIndex) => (
    <div key={categoryIndex} className="category-section">
      <div className="category-header">
        <label htmlFor={`category-name-${categoryIndex}`} className="category-label">
          Company {categoryIndex +1}
        </label>
        <div className="category-header-input">
        
          <button type="button" onClick={() => removeCategory(categoryIndex)} className="remove-category-btn">
            X
          </button>
        </div>   
           </div>
        <input
            type="text"
            id={`category-name-${categoryIndex}`}
            placeholder="Company Name"
            value={category.categoryName}
            onChange={(e) => handleCategoryNameChange(categoryIndex, e)}
          />


      <div className="product-list">
        {category.products.map((product, productIndex) => (
          <div key={productIndex} className="product-item">
            <div className="product-input-group">
              <div className="product-input-group-wrapper">
              <label htmlFor={`product-name-${productIndex}`} className="product-label">Profession Name</label>
              <button type="button" onClick={() => removeProduct(categoryIndex, productIndex)} className="remove-product-btn">
                  X
                </button>
              </div>
              <input
                  type="text"
                  id={`product-name-${productIndex}`}
                  placeholder="Profession Name"
                  value={product.name}
                  onChange={(e) => handleProductNameChange(categoryIndex, productIndex, e)}
                />
            </div>
          </div>
        ))}
      </div>

      <div className="add-product-section">
        <label htmlFor="add-product" className="add-product-label">Add Profession</label>
        <button type="button" onClick={() => addProduct(categoryIndex)} className="add-product-btn">
          +
        </button>
      </div>
    </div>
  ))}
  <div className="add-category-section">
    <label htmlFor="add-category" className="add-category-label">Add Company</label>
    <button type="button" onClick={addCategory} className="add-category-btn">
      +
    </button>
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
                                                        handleSubmit("vcardplus", data); // Pass 'Business Text' and 'data'
                                                    }} role="button"><span class="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                                                </>
                                            ) : (
                                                <button class="button-57" style={{ width: '100%' }} onClick={() => handleUpdate(vcardPlus._id, "vcardplus", data)} role="button"><span class="text">Update</span><span>Update</span></button>
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
                                                value={`${process.env.REACT_APP_FRONTEND_URL}display/qr-vcardplus/${qrvalueide}`}
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
                            <VcardDisplay data={data} customization={customization}/>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VcardPlusQR;
