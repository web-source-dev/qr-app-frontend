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
const ListOfLinksQr = () => {
    const navigate = useNavigate()
    const { qrSettings } = useQR();
    const { customization, updateCustomization } = useCustomization();
    const user_id = localStorage.getItem('user_id');

    const { handleSubmit, qrvalueide, handleUpdate, buyCredits, handleDownload,handleDownload1, handleBuyCredits, isPopupOpen, handleClosePopup } = useFormContext()



    const [listOfLinks, setListOfLinks] = useState({
        listoflinks_image: '',
        listoflinks_name: '',
        listoflinks_surname: '',
        listoflinks_images: [],//✔️
        listoflinks_social_networks: [],
        Social_welcome_screen: "",//✔️
        Social_welcome_screen_time: 5,//✔️
        social_display_theme: 'defualt',//✔️
        user_id,
        listoflinks_links: [{ label: '', value: '', icon: '' }],
    });
    const data = { ...listOfLinks };
    console.log(data);



    useEffect(() => {
        if (!user_id) {
            navigate("/user/login"); // Navigate to the login page if user_id is not available
        } else {
            const editableData = localStorage.getItem("requestBusinessEdit");
            if (editableData) {
                setListOfLinks(JSON.parse(localStorage.getItem("businessdatasending")))
            } else {
                const savedData = localStorage.getItem("listOfLinks");
                if (savedData) {
                    setListOfLinks(JSON.parse(savedData)); // Populate state with saved data
                }
                setTimeout(() => {
                    localStorage.removeItem("listOfLinks");
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
        setListOfLinks((prevData) => ({
            ...prevData,
            social_display_theme: theme,
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setListOfLinks({
            ...listOfLinks,
            [name]: value,
        });
    };
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
    const handleSliderChange = (event) => {
        const newTime = event.target.value; // Get the new value from the slider
        // You could update the state or perform other actions here
        setListOfLinks({ ...listOfLinks, Social_welcome_screen_time: newTime });
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
                    setListOfLinks((prevState) => ({
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
    const handleIconUpload = (e, index) => {
        const file = e.target.files[0]; // Get the selected file
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, or GIF).');
            return;
        }

        // Validate file size
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('File size exceeds 5MB. Please select a smaller file.');
            return;
        }

        // Create FormData for Cloudinary upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my_qr_preset'); // Replace with your upload preset

        // Upload to Cloudinary
        fetch(`https://api.cloudinary.com/v1_1/dcvqytwuq/image/upload`, {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.secure_url) {
                    // Update the icon URL in the state
                    setListOfLinks((prevState) => {
                        const updatedLinks = [...prevState.listoflinks_links];
                        updatedLinks[index].icon = data.secure_url;
                        return {
                            ...prevState,
                            listoflinks_links: updatedLinks,
                        };
                    });
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
                    setListOfLinks((prevData) => ({
                        ...prevData,
                        business_logo_qr: imageUrl,
                    }));
                } else if (imageType === "listoflinks_images") {
                    setListOfLinks((prevData) => ({
                        ...prevData,
                        listoflinks_images: [...prevData.listoflinks_images, imageUrl],
                    }));
                } else if (imageType === "business_welcome_screen") {
                    setListOfLinks((prevData) => ({
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
            setListOfLinks((prevData) => ({
                ...prevData,
                business_logo_qr: "",
            }));
        } else if (imageType === "listoflinks_images") {
            setListOfLinks((prevData) => ({
                ...prevData,
                listoflinks_images: prevData.listoflinks_images.filter(
                    (url) => url !== imageUrl
                ),
            }));
        } else if (imageType === "business_welcome_screen") {
            setListOfLinks((prevData) => ({
                ...prevData,
                business_welcome_screen: "",
            }));
        }
    };
    const handleIconClick = (platform) => {
        // Add the selected platform to listoflinks_social_networks
        const alreadySelected = listOfLinks.listoflinks_social_networks.some(
            (network) => network.platform === platform.name
        );

        if (!alreadySelected) {
            setListOfLinks((prevData) => ({
                ...prevData,
                listoflinks_social_networks: [
                    ...prevData.listoflinks_social_networks,
                    { platform: platform.name, link: "", message: "" },
                ],
            }));
        }
    };

    const handleInputChangeSocial = (e, platform, field) => {
        setListOfLinks((prevData) => {
            const updatedSocialNetworks = prevData.listoflinks_social_networks.map((network) => {
                if (network.platform === platform) {
                    return { ...network, [field]: e.target.value };
                }
                return network;
            });

            return { ...prevData, listoflinks_social_networks: updatedSocialNetworks };
        });
    };

    const handleRemovePlatform = (platform) => {
        setListOfLinks((prevData) => ({
            ...prevData,
            listoflinks_social_networks: prevData.listoflinks_social_networks.filter(
                (network) => network.platform !== platform
            ),
        }));
    };
    // Function to handle adding a new input field
    const addField = (key) => {
        setListOfLinks((prevState) => ({
            ...prevState,
            [key]: [...prevState[key], { label: "", value: "", icon: "", }],
        }));
    };
    // Function to handle input changes
    const handleInputChanges = (key, index, field, value) => {
        setListOfLinks((prevState) => {
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
        setListOfLinks((prevState) => ({
            ...prevState,
            [key]: prevState[key].filter((_, i) => i !== index),
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
                                                checked={listOfLinks.social_display_theme === 'defualt'}
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
                                            className={`theme-image ${listOfLinks.social_display_theme === 'theme1' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734005397/esthtdmgmuole2djbqu4.png"
                                            alt="Theme 2"
                                            onClick={() => handleThemeSelection('theme2')}
                                            className={`theme-image ${listOfLinks.social_display_theme === 'theme2' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733993440/jvt0sbaqet7sobomoby3.png"
                                            alt="Theme 3"
                                            onClick={() => handleThemeSelection('theme3')}
                                            className={`theme-image ${listOfLinks.social_display_theme === 'theme3' ? 'selected' : ''}`}
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
                                                    onChange={(e) => handleImageChangeWel(e, 'listoflinks_image')}
                                                    accept="image/*"
                                                />

                                                <label htmlFor="Video_title">Name</label>
                                                <input
                                                    type="text"
                                                    id="Video_title"
                                                    name="listoflinks_name"
                                                    value={listOfLinks.listoflinks_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Name"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="Video_description">SurName</label>
                                                <input type="text"
                                                    id="Video_description"
                                                    name="listoflinks_surname"
                                                    value={listOfLinks.listoflinks_surname}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Surname"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="collapsible-section">
                                    <div
                                        className={`collapsible-header ${openSections.listoflinksection3 ? "opened" : ""}`}
                                        onClick={() => toggleSection("listoflinksection3")}
                                    >
                                        <span>List of Links</span>
                                        <span className={`arrow ${openSections.listoflinksection3 ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.listoflinksection3 && (
                                        <div className="collapsible-content">

                                            <div className="business-emails-container">
                                                <div className="business-emails-header">
                                                    <span>Links</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => addField("listoflinks_links")}
                                                        className="add-business-email-btn"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div>
                                                    {listOfLinks.listoflinks_links.map((email, index) => (
                                                        <div key={index} className="business-email-input-container">
                                                            
                                                            <div className="icon-upload-container">
                                                                <label htmlFor={`icon-upload-${index}`} style={{cursor:'pointer'}} className="icon-upload-label">
                                                                    <i className="ri-upload-cloud-line"></i>
                                                                    Upload
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    id={`icon-upload-${index}`}
                                                                    style={{display:'none'}}
                                                                    onChange={(e) => handleIconUpload(e, index)}
                                                                />
                                                                {email.icon && (
                                                                    <img
                                                                        src={email.icon}
                                                                        alt="Uploaded Icon"
                                                                        className="uploaded-icon-preview"
                                                                        style={{ width: "30px", height: "30px", marginLeft: "10px" }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={email.label}
                                                                onChange={(e) =>
                                                                    handleInputChanges("listoflinks_links", index, "label", e.target.value)
                                                                }
                                                                placeholder="Enter label (e.g., Work, Personal)"
                                                            />
                                                            <input
                                                                type="email"
                                                                value={email.value}
                                                                onChange={(e) =>
                                                                    handleInputChanges("listoflinks_links", index, "value", e.target.value)
                                                                }
                                                                placeholder="Enter email address"
                                                            />
                                                            {index > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeField("listoflinks_links", index)}
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
                                                    onChange={(e) => handleImageChange(e, "listoflinks_images")}
                                                    accept="image/*"
                                                    multiple
                                                />
                                                {listOfLinks.listoflinks_images.length > 0 && (
                                                    <div className="slider-images-preview">
                                                        {listOfLinks.listoflinks_images.map((url, index) => (
                                                            <div key={index} className="slider-image-item">
                                                                <img
                                                                    src={url}
                                                                    alt={`Slider Image ${index + 1}`}
                                                                    className="slider-image"
                                                                />
                                                                <button
                                                                    onClick={() => handleImageRemove(url, "listoflinks_images")}
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
                                                    {listOfLinks.listoflinks_social_networks.map((network, index) => (
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
                                                    onChange={(e) => handleImageChangeWel(e, 'Social_welcome_screen')}
                                                    accept="image/*" // Restrict file types to images only
                                                />
                                                {listOfLinks.Social_welcome_screen && (
                                                    <div className="image-preview-container">
                                                        <img
                                                            src={listOfLinks.Social_welcome_screen}
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
                                                    value={listOfLinks.Social_welcome_screen_time}
                                                    onChange={handleSliderChange}
                                                    className="welcome-screen-time-slider"
                                                />
                                                <span className="welcome-screen-time-display">
                                                    {listOfLinks.Social_welcome_screen_time} seconds
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
                                                        handleSubmit("listoflinks", data); // Pass 'Business Text' and 'data'
                                                    }} role="button"><span class="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                                                </>
                                            ) : (
                                                <button class="button-57" style={{ width: '100%' }} onClick={() => handleUpdate(listOfLinks._id, "listoflinks", data)} role="button"><span class="text">Update</span><span>Update</span></button>
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
                                                value={`${process.env.REACT_APP_FRONTEND_URL}display/qr-listoflinks/${qrvalueide}`}
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

export default ListOfLinksQr;
