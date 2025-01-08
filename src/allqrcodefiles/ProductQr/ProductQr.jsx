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

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; // Import the required CSS
const ProductQr = () => {
    const navigate = useNavigate()
    const { qrSettings } = useQR();
    const { customization, updateCustomization } = useCustomization();
    const user_id = localStorage.getItem('user_id');

    const { handleSubmit, qrvalueide, handleUpdate, buyCredits, handleDownload, handleBuyCredits, isPopupOpen, handleClosePopup,handleDownload1 } = useFormContext()

    const [products, setProducts] = useState({
        product_image: '',
        product_name: '',
        product_description: '',
        product_header: '',
        product_category: [],
        product_ingredients: [],
        product_nutritions: [],
        product_allergens: [],//✔️
        product_certificates: [],//✔️
        product_Organic: [],//✔️
        product_Responsible_consumption: [],//✔️
        product_Recycling_stamps: [],//✔️
        Social_welcome_screen: "",//✔️
        Social_welcome_screen_time: 5,//✔️
        social_display_theme: 'defualt',//✔️
        user_id,
    });
    const data = { ...products };
    console.log(data);



    useEffect(() => {
        if (!user_id) {
            navigate("/user/login"); // Navigate to the login page if user_id is not available
        } else {
            const editableData = localStorage.getItem("requestBusinessEdit");
            if (editableData) {
                setProducts(JSON.parse(localStorage.getItem("businessdatasending")))
            } else {
                const savedData = localStorage.getItem("products");
                if (savedData) {
                    setProducts(JSON.parse(savedData)); // Populate state with saved data
                }
                setTimeout(() => {
                    localStorage.removeItem("products");
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
        setProducts((prevData) => ({
            ...prevData,
            social_display_theme: theme,
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProducts({
            ...products,
            [name]: value,
        });
    };
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
    const handleSliderChange = (event) => {
        const newTime = event.target.value; // Get the new value from the slider
        // You could update the state or perform other actions here
        setProducts({ ...products, Social_welcome_screen_time: newTime });
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
                    setProducts((prevState) => ({
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
        setProducts((prevState) => ({
            ...prevState,
            [key]: [...prevState[key], { label: "", value: "" }],
        }));
    };
    // Function to handle input changes
    const handleInputChanges = (key, index, field, value) => {
        setProducts((prevState) => {
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
        setProducts((prevState) => ({
            ...prevState,
            [key]: prevState[key].filter((_, i) => i !== index),
        }));
    };
    const addnutrition = (key) => {
        setProducts((prevState) => ({
            ...prevState,
            [key]: [...prevState[key], { name: "", value: "" }],
        }));
    };
    // Function to handle input changes
    const handlenutritionChange = (key, index, field, value) => {
        setProducts((prevState) => {
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
    const removenutrition = (key, index) => {
        setProducts((prevState) => ({
            ...prevState,
            [key]: prevState[key].filter((_, i) => i !== index),
        }));
    };
    const addIngredient = (key) => {
        setProducts((prevState) => ({
            ...prevState,
            [key]: [...prevState[key], { name: "" }],
        }));
    };
    // Function to handle input changes
    const handleIngredientChange = (key, index, field, value) => {
        setProducts((prevState) => {
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
    const removeIngredient = (key, index) => {
        setProducts((prevState) => ({
            ...prevState,
            [key]: prevState[key].filter((_, i) => i !== index),
        }));
    };

    const allergens = [
        { name: "Cereals", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095571/fi6kwjqvajbrbqhbjot9.svg" },
        { name: "Crustaceans", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095541/dowzkv2rslqkwlvatccb.svg" },
        { name: "Molluscs", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095688/f9u7to7usrkp3gmngobl.svg" },
        { name: "Lupins", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095693/k0tsj8cktirvr7s6larl.svg" },
        { name: "Sulfur and sulphites", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095696/bzsvjua1guarldv1s4rs.svg" },
        { name: "Sesame", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095700/qeudwxi2zr5q8xzcysjp.svg" },
        { name: "Mustard", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095702/vbbwt0gjoyqo3vswe8ib.svg" },
        { name: "Celery", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095704/hl53vba8ly8wgux7uc7k.svg" },
        { name: "Fruits of shell", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095707/xjtxuovkwy0uiidnupti.svg" },
        { name: "Milk", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095711/xjh5rhcswrnnjedvcvdy.svg" },
        { name: "Peanuts", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095714/fptcnh2fejsy2wg0frfc.svg" },
        { name: "Soy", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095717/aagqlppjvlo76qeegndq.svg" },
        { name: "Fish", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095719/fmq38hec6vdfbltlkwik.svg" },
        { name: "Eggs", icon: "https://res.cloudinary.com/dcvqytwuq/image/upload/v1736095724/qzhrr0rp9pv7wvzyfwoa.svg" },
    ];


    const [certi, setCerti] = useState([
        { icon: "https://qrfy.com/assets/vegan-qiCirDmx.webp" },
        { icon: "https://qrfy.com/assets/sustainable_wine-BbjFgD-5.webp" },
        { icon: "https://qrfy.com/assets/emission_reduction-Dm_rMi04.webp" },
    ]);
    const [organic, setOrganic] = useState([
        { icon: "https://qrfy.com/assets/organic1-BwzBNyJ-.webp" },
        { icon: "https://qrfy.com/assets/organic2-Y6kGkZtg.webp" },
        { icon: "https://qrfy.com/assets/organic3-D8aOkGpE.webp" },
    ]);
    const [consumption, setConsumption] = useState([
        { icon: "https://qrfy.com/assets/dui-D5UArM6o.webp" },
        { icon: "https://qrfy.com/assets/18-DhXuen3J.webp" },
        { icon: "https://qrfy.com/assets/pregnant-BAv5bbC9.webp" },
    ]);
    const [recycling, setRecycling] = useState([
        { icon: "https://qrfy.com/assets/1-DL_oNHhG.webp" },
        { icon: "https://qrfy.com/assets/2-BnMYTbtp.webp" },
        { icon: "https://qrfy.com/assets/3-UO8dRXBQ.webp" },
        { icon: "https://qrfy.com/assets/4-eSrTQK-t.webp" },
        { icon: "https://qrfy.com/assets/5-DquNr-Dk.webp" },
        { icon: "https://qrfy.com/assets/6-InA-AfNx.webp" },
        { icon: "https://qrfy.com/assets/7-JPXuZT5i.webp" },
        { icon: "https://qrfy.com/assets/8-BnN1vZO0.webp" },
    ]);

    const handleicon = (e, uploadFunction) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("Please select a valid image file (JPEG, PNG, or GIF).");
            return;
        }

        // Validate file size
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert("File size exceeds 5MB. Please select a smaller file.");
            return;
        }

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.secure_url) {
                    // Add the uploaded image to the certi array
                    uploadFunction((prevCerti) => [...prevCerti, { icon: data.secure_url }]);
                } else {
                    alert("Error uploading image. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
                alert("Error uploading image. Please check your network and try again.");
            });
    };
    const toggleFacility = (stateKey, facilityName, facilityIcon) => {
        setProducts((prevData) => {
            const facilities = prevData[stateKey].some(
                (facility) => facility.name === facilityName
            )
                ? prevData[stateKey].filter(
                    (facility) => facility.name !== facilityName
                ) // Remove the facility
                : [...prevData[stateKey], { name: facilityName, icon: facilityIcon }]; // Add the facility

            return { ...prevData, [stateKey]: facilities };
        });
    };
    const toggleFacilitys = (stateKey, facilityIcon) => {
        setProducts((prevProducts) => {
            const facilities = prevProducts[stateKey].some(
                (facility) => facility.icon === facilityIcon
            )
                ? prevProducts[stateKey].filter(
                    (facility) => facility.icon !== facilityIcon
                ) // Remove
                : [...prevProducts[stateKey], { icon: facilityIcon }]; // Add

            return { ...prevProducts, [stateKey]: facilities };
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
                                                checked={products.social_display_theme === 'defualt'}
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
                                            className={`theme-image ${products.social_display_theme === 'theme1' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734005397/esthtdmgmuole2djbqu4.png"
                                            alt="Theme 2"
                                            onClick={() => handleThemeSelection('theme2')}
                                            className={`theme-image ${products.social_display_theme === 'theme2' ? 'selected' : ''}`}
                                        />
                                        <img
                                            src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733993440/jvt0sbaqet7sobomoby3.png"
                                            alt="Theme 3"
                                            onClick={() => handleThemeSelection('theme3')}
                                            className={`theme-image ${products.social_display_theme === 'theme3' ? 'selected' : ''}`}
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

                                <div>


                                    <label htmlFor="Video_title">Title</label>
                                    <input
                                        type="text"
                                        id="Video_title"
                                        name="product_name"
                                        value={products.product_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter Name"
                                    />
                                    <input type="file"
                                        onChange={(e) => handleImageChangeWel(e, 'product_image')}
                                        accept="image/*"
                                    /> <br />
                                    <label htmlFor="Video_title">Description</label>
                                    <textarea
                                        type="text"
                                        id="Video_title"
                                        name="product_description"
                                        value={products.product_description}
                                        onChange={handleInputChange}
                                        placeholder="Enter Description"
                                    />
                                    <label htmlFor="Video_title">Header</label>
                                    <input
                                        type="text"
                                        id="Video_title"
                                        name="product_header"
                                        value={products.product_header}
                                        onChange={handleInputChange}
                                        placeholder="Website Url"
                                    />

                                </div>
                                <div className="business-emails-container">
                                    <div className="business-emails-header">
                                        <span>Category</span>
                                        <button
                                            type="button"
                                            onClick={() => addField("product_category")}
                                            className="add-business-email-btn"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div>
                                        {products.product_category.map((product, index) => (
                                            <div key={index} className="business-email-input-container">
                                                <input
                                                    type="text"
                                                    value={product.label}
                                                    onChange={(e) =>
                                                        handleInputChanges("product_category", index, "label", e.target.value)
                                                    }
                                                    placeholder="Category Name"
                                                />
                                                <input
                                                    type="text"
                                                    value={product.value}
                                                    onChange={(e) =>
                                                        handleInputChanges("product_category", index, "value", e.target.value)
                                                    }
                                                    placeholder="Category Value"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeField("product_category", index)}
                                                    className="remove-business-email-btn"
                                                >
                                                    ✖
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
                            className={`collapsible-header ${openSections.appsection ? "opened" : ""}`}
                            onClick={() => toggleSection("appsection")}
                        >
                            <span>Content</span>
                            <span className={`arrow ${openSections.appsection ? "down" : "right"}`}>
                                <i className="ri-arrow-down-fill"></i>
                            </span>
                        </div>
                        {openSections.appsection && (
                            <div className="collapsible-content">
                                <div className="collapsible-section">
                                    <div
                                        className={`collapsible-header ${openSections.productsection ? "opened" : ""}`}
                                        onClick={() => toggleSection("productsection")}
                                    >
                                        <span>Ingredients</span>
                                        <span className={`arrow ${openSections.productsection ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.productsection && (
                                        <div className="collapsible-content">
                                            <div className="business-emails-container">
                                                <div className="business-emails-header">
                                                    <span>Ingredient</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => addIngredient("product_ingredients")}
                                                        className="add-business-email-btn"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div>
                                                    {products.product_ingredients.map((ingredient, index) => (
                                                        <div key={index} className="business-email-input-container">
                                                            <input
                                                                type="text"
                                                                value={ingredient.name}
                                                                onChange={(e) =>
                                                                    handleIngredientChange("product_ingredients", index, "name", e.target.value)
                                                                }
                                                                placeholder="Ingredient Name"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeIngredient("product_ingredients", index)}
                                                                className="remove-business-email-btn"
                                                            >
                                                                ✖
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
                                        className={`collapsible-header ${openSections.productsection1 ? "opened" : ""}`}
                                        onClick={() => toggleSection("productsection1")}
                                    >
                                        <span>Nutritional Information</span>
                                        <span className={`arrow ${openSections.productsection1 ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.productsection1 && (
                                        <div className="collapsible-content">
                                            <div className="business-emails-container">
                                                <div className="business-emails-header">
                                                    <span>Nutrition</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => addnutrition("product_nutritions")}
                                                        className="add-business-email-btn"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div>
                                                    {products.product_nutritions.map((nutrition, index) => (
                                                        <div key={index} className="business-email-input-container">
                                                            <input
                                                                type="text"
                                                                value={nutrition.name}
                                                                onChange={(e) =>
                                                                    handlenutritionChange("product_nutritions", index, "name", e.target.value)
                                                                }
                                                                placeholder="Nutrition Name"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={nutrition.value}
                                                                onChange={(e) =>
                                                                    handlenutritionChange("product_nutritions", index, "value", e.target.value)
                                                                }
                                                                placeholder="Nutrition Name"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removenutrition("product_nutritions", index)}
                                                                className="remove-business-email-btn"
                                                            >
                                                                ✖
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
                                        className={`collapsible-header ${openSections.productsection2 ? "opened" : ""}`}
                                        onClick={() => toggleSection("productsection2")}
                                    >
                                        <span>More Information</span>
                                        <span className={`arrow ${openSections.productsection2 ? "down" : "right"}`}>
                                            <i className="ri-arrow-down-fill"></i>
                                        </span>
                                    </div>
                                    {openSections.productsection2 && (
                                        <div className="collapsible-content">
                                            <h3 style={{ fontSize: '15px', margin: '10px 0px' }}>Allergens</h3>
                                            <div className="facilities-options-container">
                                                {allergens.map((facility) => (
                                                    <div
                                                        key={facility.name}
                                                        onClick={() => toggleFacility('product_allergens', facility.name, facility.icon)}
                                                        className={`facility-option-card ${products.product_allergens.some(
                                                            (allergen) => allergen.name === facility.name
                                                        )
                                                            ? 'selected'
                                                            : ''
                                                            }`}
                                                    >
                                                        <span id={`icon-${facility.name}`} className="facility-icon">
                                                            <img
                                                                src={facility.icon}
                                                                width="30px"
                                                                height="30px"
                                                                alt={facility.name}
                                                            />
                                                        </span>
                                                        <Tooltip
                                                            anchorId={`icon-${facility.name}`}
                                                            content={facility.name}
                                                            place="top"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <h3 style={{ fontSize: '15px', margin: '10px 0px' }}>Certicates</h3>
                                            <div className="facilities-options-container">
                                                {certi.map((facility, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() =>
                                                            toggleFacilitys("product_certificates", facility.icon)
                                                        }
                                                        className={`facility-option-card ${products.product_certificates.some(
                                                            (cert) => cert.icon === facility.icon
                                                        )
                                                            ? "selected"
                                                            : ""
                                                            }`}
                                                    >
                                                        <span className="facility-icon">
                                                            <img
                                                                src={facility.icon}
                                                                width="40px"
                                                                height="40px"
                                                                alt="icon"
                                                            />
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleicon(e, setCerti)}
                                            />
                                            <h3 style={{ fontSize: '15px', margin: '10px 0px' }}>Organic</h3>
                                            <div className="facilities-options-container">
                                                {organic.map((facility, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() =>
                                                            toggleFacilitys("product_Organic", facility.icon)
                                                        }
                                                        className={`facility-option-card ${products.product_Organic.some(
                                                            (cert) => cert.icon === facility.icon
                                                        )
                                                            ? "selected"
                                                            : ""
                                                            }`}
                                                    >
                                                        <span className="facility-icon">
                                                            <img
                                                                src={facility.icon}
                                                                width="40px"
                                                                height="40px"
                                                                alt="icon"
                                                            />
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleicon(e, setOrganic)}
                                            />
                                            <h3 style={{ fontSize: '15px', margin: '10px 0px' }}>Responsible consumption</h3>
                                            <div className="facilities-options-container">
                                                {consumption.map((facility, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() =>
                                                            toggleFacilitys("product_Responsible_consumption", facility.icon)
                                                        }
                                                        className={`facility-option-card ${products.product_Responsible_consumption.some(
                                                            (cert) => cert.icon === facility.icon
                                                        )
                                                            ? "selected"
                                                            : ""
                                                            }`}
                                                    >
                                                        <span className="facility-icon">
                                                            <img
                                                                src={facility.icon}
                                                                width="40px"
                                                                height="40px"
                                                                alt="icon"
                                                            />
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleicon(e, setConsumption)}
                                            />
                                            <h3 style={{ fontSize: '15px', margin: '10px 0px' }}>Recycling Stamps</h3>
                                            <div className="facilities-options-container">
                                                {recycling.map((facility, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() =>
                                                            toggleFacilitys("product_Recycling_stamps", facility.icon)
                                                        }
                                                        className={`facility-option-card ${products.product_Recycling_stamps.some(
                                                            (cert) => cert.icon === facility.icon
                                                        )
                                                            ? "selected"
                                                            : ""
                                                            }`}
                                                    >
                                                        <span className="facility-icon">
                                                            <img
                                                                src={facility.icon}
                                                                width="40px"
                                                                height="40px"
                                                                alt="icon"
                                                            />
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleicon(e, setRecycling)}
                                            />

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
                                                {products.Social_welcome_screen && (
                                                    <div className="image-preview-container">
                                                        <img
                                                            src={products.Social_welcome_screen}
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
                                                    value={products.Social_welcome_screen_time}
                                                    onChange={handleSliderChange}
                                                    className="welcome-screen-time-slider"
                                                />
                                                <span className="welcome-screen-time-display">
                                                    {products.Social_welcome_screen_time} seconds
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
                                                        handleSubmit("product", data); // Pass 'Business Text' and 'data'
                                                    }} role="button"><span class="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                                                </>
                                            ) : (
                                                <button class="button-57" style={{ width: '100%' }} onClick={() => handleUpdate(products._id, "product", data)} role="button"><span class="text">Update</span><span>Update</span></button>
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
                                                value={`${process.env.REACT_APP_FRONTEND_URL}display/qr-product/${qrvalueide}`}
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

export default ProductQr;
