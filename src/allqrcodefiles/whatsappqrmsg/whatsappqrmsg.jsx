import React, { useState, useRef, useEffect } from 'react';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';
import { QRCode } from 'react-qrcode-logo';
import { useGlobalLocal } from '../../allqrcodeCustomizations/globallocalqr/GlobalLocalQr';

const WhatsAppQrGenerator = () => {
  const { handleDownload, qrSettings, handleSubmit,handleDownload1, isDownload } = useGlobalLocal();
  const user_id = localStorage.getItem('user_id');
  const ref = useRef(null);
  
  // State object for all necessary data
  const [whatsappData, setWhatsappData] = useState({
    phone_number: '',
    message: '',
    qr_code: '',
    user_id
  });

  // Effect hook to update QR code whenever phone_number or message changes
  useEffect(() => {
    if (whatsappData.phone_number && whatsappData.message) {
      // Format the phone number (remove non-numeric characters, if necessary)
      const formattedPhoneNumber = whatsappData.phone_number.replace(/[^\d]/g, '');

      // URL-encode the message to ensure proper handling of special characters
      const encodedMessage = encodeURIComponent(whatsappData.message);

      // Generate the WhatsApp link
      const whatsappLink = `https://wa.me/${formattedPhoneNumber}?text=${encodedMessage}`;

      // Update the state with the QR code data
      setWhatsappData((prevData) => ({
        ...prevData,
        qr_code: whatsappLink,
      }));
    }
  }, [whatsappData.phone_number, whatsappData.message]);  // Dependency array ensures it runs only when phone_number or message changes

  // Handle phone number change
  const handlePhoneNumberChange = (e) => {
    setWhatsappData((prevData) => ({
      ...prevData,
      phone_number: e.target.value,
    }));
  };

  // Handle message change
  const handleMessageChange = (e) => {
    setWhatsappData((prevData) => ({
      ...prevData,
      message: e.target.value,
    }));
  };

  return (
    <div className='flex-group'>
    <div className='wifi-container'>
      <h1>WhatsApp Qr</h1>
      <div className="wifi-form">

      <div className="flex-input">
          <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input
          type="text"
          value={whatsappData.phone_number}
          onChange={handlePhoneNumberChange}
          placeholder="Phone Number"
        />
        <label className="form-label">Message:</label>
        <textarea
          value={whatsappData.message}
          onChange={handleMessageChange}
          placeholder="Message"
        />
      </div>
      </div>
      </div>
        <div className="qr-deigningig-component">
          <QRCodeGenerator />
          <div className='qr-display-container-fix-it'>
            <div
              ref={ref}
              style={{
                '--bg-color': qrSettings.bgColor || '#ffffff',
                '--fg-color': qrSettings.fgColor || '#000',
              }}
              className={`${qrSettings.frame}`}
            >
              <QRCode
                value={whatsappData.qr_code}
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

            {isDownload === false ? (
              <button className="button-57" style={{ width: '100%' }} onClick={() => {
                handleSubmit("whatsapqr", whatsappData); // Pass the entire wifiData including qrLocalData
              }} role="button">
                <span className="text">Generate QR</span>
                <span> Generate QR</span>
              </button>
            ) : (
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
            )}
          </div>
        </div>
      </div>
      <div className="display-mobile">
    <div className="display-image-container">
               <img
                src='https://res.cloudinary.com/dcvqytwuq/image/upload/v1734957191/ph6qu7cfgfxvntymqnxy.png'
                alt={''}
                className="display-image"
              />
    </div>
    </div>
    </div>
  );
};

export default WhatsAppQrGenerator;
