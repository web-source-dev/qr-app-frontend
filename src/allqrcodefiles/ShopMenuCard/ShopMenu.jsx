import './ShopMenu.css'
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
import ShopMenuDisplay from './ShopMenuDisplay';
const ShopMenuForm = () => {
    const navigate = useNavigate()
    const { qrSettings } = useQR();
    const { customization, updateCustomization } = useCustomization();
    const user_id = localStorage.getItem('user_id');
    const { handleSubmit, qrvalueide, handleUpdate, buyCredits, handleDownload,handleDownload1, handleBuyCredits, isPopupOpen, handleClosePopup } = useFormContext()
    // Handle category name change
   // Updated state structure to include categories and other fields like shop name, etc.
   const [shopcatdata, setShopcatdata] = useState({
    categories: [],
    shopName: '',  // Example of another field
    shopDescription: '',  // Example of a description field
    shop_display_theme: 'defualt', // Example of
    shop_image_logo : '', // Example of
    shop_contact: '', // Example of a contact field
    shop_address: '', // Example of an address field
    shop_email: '', // Example of an email field
    shop_additional_info: '', // Example of
    shop_schedule: [
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
  console.log(shopcatdata)

  const data = { ...shopcatdata };
  useEffect(() => {
    if (!user_id) {
      navigate("/user/login"); // Navigate to the login page if user_id is not available
    } else {
      const editableData = localStorage.getItem("requestBusinessEdit");
      if (editableData) {
        setShopcatdata(JSON.parse(localStorage.getItem("businessdatasending")))
      } else {
        const savedData = localStorage.getItem("SaveData");
        if (savedData) {
          setShopcatdata(JSON.parse(savedData)); // Populate state with saved data
        }
        setTimeout(() => {
          localStorage.removeItem("SaveData");
          localStorage.removeItem("currentPath");
          localStorage.removeItem("nextpath");
          localStorage.removeItem("pricing")
        }, 3000);
      }
    }
  }, []);
  const editdataShowSidebar = localStorage.getItem("requestBusinessEdit");
  const [openSections, setOpenSections] = useState({}); // Track open/closed states
  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const handleThemeSelection = (theme) => {
    setShopcatdata((prevData) => ({
      ...prevData,
      shop_display_theme: theme,
    }));
  };
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_UPLOAD_PRESET;
  const ref = useRef();
  // Handle category name change
  const handleCategoryNameChange = (index, event) => {
    const newCategories = [...shopcatdata.categories];
    newCategories[index].categoryName = event.target.value;
    setShopcatdata({ ...shopcatdata, categories: newCategories });
  };
  // Handle product name change
  const handleProductNameChange = (categoryIndex, productIndex, event) => {
    const newCategories = [...shopcatdata.categories];
    newCategories[categoryIndex].products[productIndex].name = event.target.value;
    setShopcatdata({ ...shopcatdata, categories: newCategories });
  };
  // Handle product price change
  const handleProductPriceChange = (categoryIndex, productIndex, event) => {
    const newCategories = [...shopcatdata.categories];
    newCategories[categoryIndex].products[productIndex].price = event.target.value;
    setShopcatdata({ ...shopcatdata, categories: newCategories });
  };
  // Handle shop name change
  const handleShopNameChange = (event) => {
    setShopcatdata({ ...shopcatdata, shopName: event.target.value });
  };
  // Handle shop description change
  const handleShopDescriptionChange = (event) => {
    setShopcatdata({ ...shopcatdata, shopDescription: event.target.value });
  };
  // Add a new category
  const addCategory = () => {
    setShopcatdata({
      ...shopcatdata,
      categories: [...shopcatdata.categories, { categoryName: '', products: [] }],
    });
  };
  // Remove a category
  const removeCategory = (index) => {
    const newCategories = shopcatdata.categories.filter((_, i) => i !== index);
    setShopcatdata({ ...shopcatdata, categories: newCategories });
  };
  // Add a new product to a category
  const addProduct = (categoryIndex) => {
    const newCategories = [...shopcatdata.categories];
    newCategories[categoryIndex].products.push({ name: '', price: '', image: '' });
    setShopcatdata({ ...shopcatdata, categories: newCategories });
  };
  // Remove a product from a category
  const removeProduct = (categoryIndex, productIndex) => {
    const newCategories = [...shopcatdata.categories];
    newCategories[categoryIndex].products = newCategories[categoryIndex].products.filter(
      (_, i) => i !== productIndex
    );
    setShopcatdata({ ...shopcatdata, categories: newCategories });
  };
  // Upload image to Cloudinary and return the image URL
  const handleImageUpload = async (event, categoryIndex, productIndex) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      // Upload to Cloudinary
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData);

      // Get the image URL from Cloudinary response
      const imageUrl = response.data.secure_url;

      // Update the product image URL in state
      const newCategories = [...shopcatdata.categories];
      newCategories[categoryIndex].products[productIndex].image = imageUrl;
      setShopcatdata({ ...shopcatdata, categories: newCategories });

    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    console.log('click')
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      // Upload to Cloudinary
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, formData);

      // Get the image URL from Cloudinary response
      const imageUrl = response.data.secure_url;

      // Update the shop logo in state
      setShopcatdata({ ...shopcatdata, shop_image_logo: imageUrl });
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };
  // Handle change for shop fields
  const handleShopFieldChange = (field, value) => {
    setShopcatdata({ ...shopcatdata, [field]: value });
  };
  const toggleOpenClose = (dayIndex) => {
    const updatedSchedule = [...shopcatdata.shop_schedule];
    const currentDay = updatedSchedule[dayIndex];
    if (currentDay.time_slots.length === 0) {
      updatedSchedule[dayIndex].time_slots = [{ start_time: '08:00', end_time: '20:00' }];
    } else {
      updatedSchedule[dayIndex].time_slots = [];
    }
    setShopcatdata({ ...shopcatdata, shop_schedule: updatedSchedule });
  };
  const handleTimeSlotChange = (dayIndex, timeIndex, field, value) => {
    const newSchedule = [...shopcatdata.shop_schedule];
    newSchedule[dayIndex].time_slots[timeIndex][field] = value;
    setShopcatdata({ ...shopcatdata, shop_schedule: newSchedule });
  };
  const addTimeSlot = (dayIndex) => {
    const newSchedule = [...shopcatdata.shop_schedule];
    newSchedule[dayIndex].time_slots.push({ start_time: '', end_time: '' });
    setShopcatdata({ ...shopcatdata, shop_schedule: newSchedule });
  };
  const removeTimeSlot = (dayIndex, timeIndex) => {
    const newSchedule = [...shopcatdata.shop_schedule];
    newSchedule[dayIndex].time_slots.splice(timeIndex, 1);
    setShopcatdata({ ...shopcatdata, shop_schedule: newSchedule });
  };
  return (
    <div className="business-info-page">
    <div className="collapsible-container">
      <div className="business-form-container">
      <div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.theme ? "opened" : ""}`}
            onClick={() => toggleSection("theme")}
          >
            <span>Select Theme</span>
            <span className={`arrow ${openSections.theme ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.theme && (
            <div className="collapsible-content">
              <div className="selection-of-section">
                <div className="toggle-switch">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={shopcatdata.shop_display_theme === 'defualt'}
                      onChange={() => handleThemeSelection('defualt')}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="toggle-label" onClick={() => handleThemeSelection('defualt')} >Default</span>
                </div>

                <div className="theme-images">
                
                  <img
                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271510/qbafqacdvs0q6a6hx7ds.png"
                    alt="Theme 1"
                    onClick={() => handleThemeSelection('theme1')}
                    className={`theme-image ${shopcatdata.shop_display_theme === 'theme1' ? 'selected' : ''}`}
                  />
                  <img
                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271482/gazekfr7ybdzyek1ykqg.png"
                    alt="Theme 2"
                    onClick={() => handleThemeSelection('theme2')}
                    className={`theme-image ${shopcatdata.shop_display_theme === 'theme2' ? 'selected' : ''}`}
                  />
                  <img
                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1734271525/souzx0g1mw6bne9ovukp.png"
                    alt="Theme 3"
                    onClick={() => handleThemeSelection('theme3')}
                    className={`theme-image ${shopcatdata.shop_display_theme === 'theme3' ? 'selected' : ''}`}
                  />
                </div>
              </div>

            </div>
          )}
        </div>
        <div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.section0 ? "opened" : ""}`}
            onClick={() => toggleSection("section0")}
          >
            <span>Shop Information</span>
            <span className={`arrow ${openSections.section0 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.section0 && (
            <div className="collapsible-content">
 <form>
      <div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.shopitemsdetail ? "opened" : ""}`}
            onClick={() => toggleSection("shopitemsdetail")}
          >
            <span>Basic Shop Info</span>
            <span className={`arrow ${openSections.shopitemsdetail ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.shopitemsdetail && (
            <div className="collapsible-content">
                    {/* Shop Name Input */}
                    <div className="shop-menu-basic-info-container">
  {/* <!-- Shop Name Input --> */}
  <div className="shop-menu-basic-info-item">
    <label for="shop-name" className="shop-menu-basic-info-label">Shop Name</label>
    <input
      type="text"
      id="shop-name"
      placeholder="Enter Shop Name"
      value={shopcatdata.shopName}
      onChange={handleShopNameChange}
    />
  </div>

  {/* <!-- Shop Description Input --> */}
  <div className="shop-menu-basic-info-item">
    <label for="shop-description" className="shop-menu-basic-info-label">Shop Description</label>
    <textarea
      id="shop-description"
      placeholder="Enter Shop Description"
      value={shopcatdata.shopDescription}
      onChange={handleShopDescriptionChange}
    />
  </div>

  {/* <!-- Shop Logo Upload --> */}
  <div className="shop-menu-basic-info-item">
    <label for="shop-logo" className="shop-menu-basic-info-label">Shop Logo</label>
    <input
      type="file"
      id="shop-logo"
      onChange={handleLogoUpload}
    />
    {shopcatdata.shop_image_logo && (
      <div className="shop-menu-basic-info-logo-container">
        <img
          src={shopcatdata.shop_image_logo}
          className="shop-menu-basic-info-logo"
          alt="Shop Logo"
        />
      </div>
    )}
  </div>
</div>

                </div>
)}
</div>
<div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.shopnamedetail2 ? "opened" : ""}`}
            onClick={() => toggleSection("shopnamedetail2")}
          >
            <span>Contact Info</span>
            <span className={`arrow ${openSections.shopnamedetail2 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.shopnamedetail2 && (
            <div className="collapsible-content">
<div className="shop-menu-basic-info-container">
  {/* <!-- Shop Contact Input --> */}
  <div className="shop-menu-basic-info-item">
    <label for="shop-contact" className="shop-menu-basic-info-label">Shop Contact</label>
    <input
      type="text"
      id="shop-contact"
      placeholder="Enter Shop Contact"
      value={shopcatdata.shop_contact}
      onChange={(e) => handleShopFieldChange('shop_contact', e.target.value)}
    />
  </div>

  {/* <!-- Shop Address Input --> */}
  <div className="shop-menu-basic-info-item">
    <label for="shop-address" className="shop-menu-basic-info-label">Shop Address</label>
    <input
      type="text"
      id="shop-address"
      placeholder="Enter Shop Address"
      value={shopcatdata.shop_address}
      onChange={(e) => handleShopFieldChange('shop_address', e.target.value)}
    />
  </div>

  {/* <!-- Shop Email Input --> */}
  <div className="shop-menu-basic-info-item">
    <label for="shop-email" className="shop-menu-basic-info-label">Shop Email</label>
    <input
      type="email"
      id="shop-email"
      placeholder="Enter Shop Email"
      value={shopcatdata.shop_email}
      onChange={(e) => handleShopFieldChange('shop_email', e.target.value)}
    />
  </div>
</div>


            </div>
            )}
</div>
<div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.shopnamedetail3 ? "opened" : ""}`}
            onClick={() => toggleSection("shopnamedetail3")}
          >
            <span>Additional Info</span>
            <span className={`arrow ${openSections.shopnamedetail3 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.shopnamedetail3 && (
            <div className="collapsible-content">
  {/* Shop Additional Info */}
          <div className="shop-menu-basic-info-item">
    <label for="shop-description" className="shop-menu-basic-info-label">Additional Info</label>
    <textarea
      id="shop-description"
      placeholder="Additional Info"
      value={shopcatdata.shop_additional_info}
      onChange={(e) => handleShopFieldChange('shop_additional_info', e.target.value)}
    />
  </div>

                </div>
)}
</div>

<div className="collapsible-section">
          <div
            className={`collapsible-header ${openSections.shopnamedetail4 ? "opened" : ""}`}
            onClick={() => toggleSection("shopnamedetail4")}
          >
            <span>Set Menu</span>
            <span className={`arrow ${openSections.shopnamedetail4 ? "down" : "right"}`}>
              <i className="ri-arrow-down-fill"></i>
            </span>
          </div>
          {openSections.shopnamedetail4 && (
            <div className="collapsible-content">
<div className="category-container">
    

  {shopcatdata.categories.map((category, categoryIndex) => (
    <div key={categoryIndex} className="category-section">
      <div className="category-header">
        <label htmlFor={`category-name-${categoryIndex}`} className="category-label">
          Category Name
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
            placeholder="Category Name"
            value={category.categoryName}
            onChange={(e) => handleCategoryNameChange(categoryIndex, e)}
          />


      <div className="product-list">
        {category.products.map((product, productIndex) => (
          <div key={productIndex} className="product-item">
            <div className="product-input-group">
              <div className="product-input-group-wrapper">
              <label htmlFor={`product-name-${productIndex}`} className="product-label">Product Name</label>
              <button type="button" onClick={() => removeProduct(categoryIndex, productIndex)} className="remove-product-btn">
                  X
                </button>
              </div>
              <input
                  type="text"
                  id={`product-name-${productIndex}`}
                  placeholder="Product Name"
                  value={product.name}
                  onChange={(e) => handleProductNameChange(categoryIndex, productIndex, e)}
                />
            </div>

            <div className="product-input-group">
              <label htmlFor={`product-price-${productIndex}`} className="product-label">Price</label>
              <input
                type="number"
                id={`product-price-${productIndex}`}
                placeholder="Price"
                value={product.price}
                onChange={(e) => handleProductPriceChange(categoryIndex, productIndex, e)}
              />
            </div>

            <div className="product-image-group">
              <label htmlFor={`product-image-${productIndex}`} className="product-label">Image</label>
              <input
                type="file"
                id={`product-image-${productIndex}`}
                onChange={(e) => handleImageUpload(e, categoryIndex, productIndex)}
              />
              {product.image && <img src={product.image} width="60px" height="60px" alt="Product" />}
            </div>
          </div>
        ))}
      </div>

      <div className="add-product-section">
        <label htmlFor="add-product" className="add-product-label">Add Product</label>
        <button type="button" onClick={() => addProduct(categoryIndex)} className="add-product-btn">
          +
        </button>
      </div>
    </div>
  ))}
  <div className="add-category-section">
    <label htmlFor="add-category" className="add-category-label">Add Category</label>
    <button type="button" onClick={addCategory} className="add-category-btn">
      +
    </button>
  </div>
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
                                {shopcatdata.shop_schedule.map((schedule, dayIndex) => (
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
  
    </form>
    
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
                  </div> <br />
                  {buyCredits ? (
                    <div className="buy-credits-container">
                      <h2>Buy Credits</h2>
                      <p>
                        To create and customize QR codes, you need to purchase additional credits.
                        <br />
                      </p>
<button className="button-57" style={{width:'100%'}} onClick={() => handleBuyCredits(data)} role="button"><span className="text">Buy Credits</span><span>You don't have credits</span></button>
                    </div>
                  ) : (

                    !editdataShowSidebar ? (
                      <>
<button className="button-57" style={{width:'100%'}}         onClick={() => {
                            handleSubmit("shopmenu", data); // Pass 'Business Text' and 'data'
                          }} role="button"><span className="text"> {!qrvalueide && 'Generate QR' || 'Update QR'}</span><span> {!qrvalueide && 'Generate QR' || 'Update QR'}</span></button>
                      </>
                    ) : (
<button className="button-57" style={{width:'100%'}} onClick={() => handleUpdate(shopcatdata._id, "shopmenu", data)} role="button"><span className="text">Update</span><span>Update</span></button>
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
                      value={`${process.env.REACT_APP_FRONTEND_URL}/display/qr-shopmenu/${qrvalueide}`}
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

                  {/* Download Button */}
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
        <div className="mobile-container-camera-wrapper">
          <div className="camera-mobile">
          </div>
        </div>
            <ShopMenuDisplay data={shopcatdata} customization={customization} />
      </div>
    </div>
    
  );
};

export default ShopMenuForm;
