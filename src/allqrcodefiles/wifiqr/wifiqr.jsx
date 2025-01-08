import React, { useState, useRef, useEffect } from 'react';
import { useGlobalLocal } from '../../allqrcodeCustomizations/globallocalqr/GlobalLocalQr';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';
import { QRCode } from 'react-qrcode-logo';
import './wifiqr.css'
const Wifiqr = () => {
  // Initialize state with an object
  const { handleDownload1, qrSettings, handleSubmit, isDownload, qrvalueide } = useGlobalLocal();
  const editdataShowSidebar = localStorage.getItem("requestBusinessEdit");
  const user_id = localStorage.getItem('user_id');

  // State for storing wifi data and QR string
  const [wifiData, setWifiData] = useState({
    wifi_name: '',
    wifi_password: '',
    hidden_network: false,
    wifi_encryption: 'WPA',
    user_id,
    qrLocalData: ''  // QR code data is now part of wifiData state directly
  });

  const ref = useRef();

  // Handler functions for each input
  const handleSsidChange = (e) => {
    setWifiData((prevState) => ({
      ...prevState,
      wifi_name: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setWifiData((prevState) => ({
      ...prevState,
      wifi_password: e.target.value,
    }));
  };

  const handleEncryptionChange = (e) => {
    setWifiData((prevState) => ({
      ...prevState,
      wifi_encryption: e.target.value,
    }));
  };

  const handleHiddenNetworkChange = (e) => {
    setWifiData((prevState) => ({
      ...prevState,
      hidden_network: e.target.checked,
    }));
  };

  // Destructure updated state
  const { wifi_name, wifi_password, hidden_network, wifi_encryption } = wifiData;

  // Generate the QR code string
  const qrString = `WIFI:T:${wifi_encryption};S:${wifi_name};P:${wifi_password};${hidden_network ? 'H:true;' : ''}`;

  // Sync qrLocalData state when qrString changes
  useEffect(() => {
    // Update qrLocalData directly in wifiData
    setWifiData((prevState) => ({
      ...prevState,
      qrLocalData: qrString,
    }));
  }, [qrString]);  // Re-run whenever qrString changes

  return (
  <div className='flex-group'>
    <div className='wifi-container'>
    <h1>Generate Wifi Qr</h1>
      <div className="wifi-form">
        <div className="flex-input">
          <div className="form-group">
            <label className="form-label">Enter your Wifi SSID:</label>
            <input
              type="text"
              value={wifiData.wifi_name}
              onChange={handleSsidChange}
              placeholder="SSID"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Enter your Wifi Password:</label>
            <input
              type="text"
              value={wifiData.wifi_password}
              onChange={handlePasswordChange}
              placeholder="Password"
            />
          </div>
        </div>
        <div className="flex-input">
          <div className="form-group">
            <label className="form-label">Select Encryption Type:</label>
            <select
              value={wifiData.wifi_encryption}
              onChange={handleEncryptionChange}
            >
              <option value="WPA">WPA</option>
              <option value="WEP">WEP</option>
              <option value="nopassword">No Password</option>
            </select>
          </div>

          <div className="form-group">
  <label htmlFor="hiddenNetwork" className="form-label">Hidden Network</label>
  <div className="toggle-switch">
    <input
      type="checkbox"
      id="hiddenNetwork"
      checked={wifiData.hidden_network}
      onChange={handleHiddenNetworkChange}
      className="toggle-checkbox"
    />
    <label htmlFor="hiddenNetwork" className="toggle-label">
      <span className="toggle-inner"></span>
      <span className="toggle-switch-btn"></span>
    </label>
  </div>
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
            className={`${qrSettings.frame}`}>

            <QRCode
              value={qrString}
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
              handleSubmit("wifi", wifiData); // Pass the entire wifiData including qrLocalData
            }} role="button">
              <span className="text"> Generate QR</span>
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

export default Wifiqr;
