import React, { useEffect, useState } from 'react';
import '../myqrcodecss/AllMyGeneratedHeader.css'; // Import the CSS file
import BusinessDataList from './business';
import SocialDataList from './social';
import ShopMenuDataList from './shopmenu';
import SmsDataList from '../static/sms';
import WifiDataList from '../static/wifi';
import FacebookDataList from '../static/facebook';
import WhatsappDataList from '../static/whatsapp';
import EmailDataList from '../static/email';
import InstagramDataList from '../static/instagram';
import VcardDataList from '../static/vcard';
import MessageDataList from '../static/message';
import UrlDataList from '../static/url';
import ImagesDataList from './Imagesqr';
import VideosDataList from './video';
import MusicDataList from './music';
import PdfDataList from './pdf';
import VcardDataLists from './Vcardplus'
import ListofLinksDataList from './listofLinks';
import CoupanDataList from './coupan';
import LandingPageDataList from './landingpage';
import AppDataList from './appdata';
import ProductDataList from './product';
import EventDataList from './Event';

const AllMyGeneratedHeader = () => {

  const [selectedOption, setSelectedOption] = useState('business'); // Default selection

  const [dynamicData, setDynamicData] = useState({
    business: 'This is data for QR1.',
    social: 'This is data for QR2.',
    shopmenu: 'This is data for QR3.',
    images: 'This is data for QR4.',
    videos: 'This is data for QR5.',
    music: 'This is data for QR6.',
    pdf: 'This is data for QR7.',
    vcardplus: 'This is data for QR8.',
    listoflinks: 'This is data for QR9.',
    coupan: 'This is data for QR10.',
    landingpage: 'This is data for QR11.',
    app: 'This is data for QR12.',
    product: 'This is data for QR13.',
    event: 'This is data for QR14.',
  });

  const [staticData, setStaticData] = useState({
    sms: 'This is data for QR1.',
    whatsapp: 'This is data for QR2.',
    wifi: 'This is data for QR3.',
    email: 'This is data for QR4.',
    facebook: 'This is data for QR5.',
    instagram: 'This is data for QR6.',
    vcard: 'This is data for QR7.',
    message: 'This is data for QR8.',
    url: 'This is data for QR9.',
    barcode: 'This is data for QR9.',
    
  });

  const [dataType, setDataType] = useState(dynamicData); // Track if 'static' or 'dynamic' is selected
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown open/close state

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleDataTypeChange = (type) => {
    setDataType(type); // Update data type (static or dynamic)
    setDropdownOpen(false); // Close dropdown after selection
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };
  useEffect(()=>{
    if(dataType === staticData){
      setSelectedOption('sms'); // Default selection to 'business' if static data is selected
    }
    if(dataType === dynamicData){
      setSelectedOption('business'); // Default selection to 'business' if business data is edited and dynamic data is selected
    }
  },[dataType])
  return (
    <div className="container">
      <div className="header-of-mr-qr-codes">
        {/* Dropdown button for Static/Dynamic selection */}
        <div className="data-type-dropdown">
          <button className="dropdown-button" onClick={toggleDropdown}>
            {dataType === dynamicData ? 'Dynamic' : 'Static'}
            <span className={`arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                className={`dropdown-item ${dataType === dynamicData ? 'active' : ''}`}
                onClick={() => handleDataTypeChange(dynamicData)}
              >
                Dynamic
              </button>
              <button
                className={`dropdown-item ${dataType === staticData ? 'active' : ''}`}
                onClick={() => handleDataTypeChange(staticData)}
              >
                Static
              </button>
            </div>
          )}
        </div>

        {/* Navigation for QR types */}
        <nav className="navbar">
          <ul className="navbar-list">
            {Object.keys(dataType).map((option) => (
              <li
                key={option}
                className={`navbar-item ${selectedOption === option ? 'active' : ''}`}
                onClick={() => handleOptionChange(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Data Container */}
      <div className="data-container">
        {/* Render corresponding data based on selected dataType and option */}
        {dataType === dynamicData && selectedOption === 'business' && <BusinessDataList socialdata="business" />}
        {dataType === dynamicData && selectedOption === 'social' && <SocialDataList socialdata="social" />}
        {dataType === dynamicData && selectedOption === 'shopmenu' && <ShopMenuDataList socialdata="shopmenu" />}
        {dataType === dynamicData && selectedOption === 'images' && <ImagesDataList socialdata="images" />}
        {dataType === dynamicData && selectedOption === 'videos' && <VideosDataList socialdata="videos" />}
        {dataType === dynamicData && selectedOption === 'music' && <MusicDataList socialdata="music" />}
        {dataType === dynamicData && selectedOption === 'pdf' && <PdfDataList socialdata="pdf" />}
        {dataType === dynamicData && selectedOption === 'vcardplus' && <VcardDataLists socialdata="vcardplus" />}
        {dataType === dynamicData && selectedOption === 'listoflinks' && <ListofLinksDataList socialdata="listoflinks" />}
        {dataType === dynamicData && selectedOption === 'coupan' && <CoupanDataList socialdata="coupan" />}
        {dataType === dynamicData && selectedOption === 'landingpage' && <LandingPageDataList socialdata="landingpage" />}
        {dataType === dynamicData && selectedOption === 'app' && <AppDataList socialdata="app" />}
        {dataType === dynamicData && selectedOption === 'product' && <ProductDataList socialdata="product" />}
        {dataType === dynamicData && selectedOption === 'event' && <EventDataList socialdata="event" />}

        {dataType === staticData && selectedOption === 'sms' && <SmsDataList />}
        {dataType === staticData && selectedOption === 'whatsapp' && <WhatsappDataList />}
        {dataType === staticData && selectedOption === 'wifi' && <WifiDataList />}
        {dataType === staticData && selectedOption === 'email' && <EmailDataList />}
        {dataType === staticData && selectedOption === 'facebook' && <FacebookDataList />}
        {dataType === staticData && selectedOption === 'instagram' && <InstagramDataList />}
        {dataType === staticData && selectedOption === 'vcard' && <VcardDataList />}
        {dataType === staticData && selectedOption === 'message' && <MessageDataList />}
        {dataType === staticData && selectedOption === 'url' && <UrlDataList />}
        {/* {dataType === staticData && selectedOption === 'barcode' && ''} */}
      </div>
    </div>
  );
};

export default AllMyGeneratedHeader;
