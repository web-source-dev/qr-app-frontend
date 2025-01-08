import React, { useState, useRef, useEffect } from 'react';
import { useGlobalLocal } from '../../allqrcodeCustomizations/globallocalqr/GlobalLocalQr';
import { QRCode } from 'react-qrcode-logo';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';

const Smsqr = () => {
  const { handleDownload, qrSettings, handleSubmit, isDownload,handleDownload1 } = useGlobalLocal();
  const user_id = localStorage.getItem('user_id');  // Assuming user_id is stored in localStorage
  
  const [smsData, setSmsData] = useState({
    phone_number: '',
    message: '',
    user_id,
    qr_data: ''
  });

  const ref = useRef(null);

  const handlePhoneNumberChange = (e) => {
    setSmsData({ ...smsData, phone_number: e.target.value });
  };

  const handleMessageChange = (e) => {
    setSmsData({ ...smsData, message: e.target.value });
  };

  // Generate QR data based on phone number and message
  useEffect(() => {
    if (smsData.phone_number && smsData.message) {
      setSmsData({
        ...smsData,
        qr_data: `sms:${smsData.phone_number}?body=${encodeURIComponent(smsData.message)}`
      });
    }
  }, [smsData.phone_number, smsData.message]);

  return (
    <div className='flex-group'>
    <div className='wifi-container'>
      <h1>Sms Qr</h1>
      <div className="wifi-form">

      <div className="flex-input">
          <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input
          type="text"
          value={smsData.phone_number}
          onChange={handlePhoneNumberChange}
          placeholder="Phone Number"
        />
        <label className="form-label">Message</label>
        <input
          type="text"
          value={smsData.message}
          onChange={handleMessageChange}
          placeholder="Message"
        />
      </div>
      </div>
      </div>
        <div className="qr-deigningig-component">
          <QRCodeGenerator />
          <div className="qr-display-container-fix-it">
            <div
              ref={ref}
              style={{
                '--bg-color': qrSettings.bgColor || '#ffffff',
                '--fg-color': qrSettings.fgColor || '#000',
              }}
              className={`${qrSettings.frame}`}
            >
                <QRCode
                  value={smsData.qr_data}
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
              <button
                className="button-57"
                style={{ width: '100%' }}
                onClick={() => handleSubmit('smsqr', smsData)}  // Submit the entire smsData
                role="button"
              >
                <span className="text">Generate QR</span>
                <span>Generate Qr</span>
              </button>
            ) : (
              <div
                className="download-button"
                data-tooltip="Size: 175kb"
                onClick={() => handleDownload1(ref)}  // Handle download
              >
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

export default Smsqr;
