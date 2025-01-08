import React, { createContext, useState,useEffect, useContext } from 'react';

// Define the context
const QRContext = createContext();

// Create a provider component
export const QRProvider = ({ children }) => {
    const [qrSettings, setQrSettings] = useState({
        ecLevel: 'M',                  // Error correction level (L, M, Q, H)
        enableCORS: true,             // Enable crossorigin attribute
        size: 120,                     // QR Code size in pixels
        quietZone: 0,                 // Quiet zone around the QR Code in pixels
        bgColor: '#FFFFFF',            // Background color
        fgColor: '#000000',            // Foreground color
        qrStyle: 'dots',               // Style of QR code modules ('dots', 'squares', 'fluid')
        eyeColor: [                    // Eye colors for positional patterns
            { outer: '#000000', inner: '#000000' }, // Top-left eye
            { outer: '#000000', inner: '#000000' }, // Top-right eye
            { outer: '#000000', inner: '#000000' }, // Bottom-left eye
        ],
        eyeRadius: [                   // Eye radii for positional patterns
            { outer: [0, 0, 0, 0], inner: [0, 0, 0, 0] }, // Top-left eye
            { outer: [0, 0, 0, 0], inner: [0, 0, 0, 0] }, // Top-right eye
            { outer: [0, 0, 0, 0], inner: [0, 0, 0, 0] }, // Bottom-left eye
        ],
        logo: null,                    // Logo URL or base64 string
        logoWidth: 30,                 // Logo width in pixels
        logoHeight: 30,                // Logo height in pixels
        logoOpacity: 1,                // Logo transparency (0 to 1)
        removeQrCodeBehindLogo: false, // Remove QR code points behind the logo
        logoPadding: 0,                // Padding around the logo
        logoPaddingStyle: 'square',    // Style of the logo padding ('square', 'circle')
        logoText: '',         // Text inside the QR code
        frame: 'qr-frame1',     
        qrvalueid: null,
        user_id: null,
    });

  const updateQrSettings = (newSettings) => {
    setQrSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };
  useEffect (() =>{
    const editableData = localStorage.getItem("requestBusinessEdit");
  if(editableData){
      setQrSettings(JSON.parse(localStorage.getItem("qrDesign")))
    }
},[])
console.log(qrSettings)

  return (
    <QRContext.Provider value={{ qrSettings, updateQrSettings }}>
      {children}
    </QRContext.Provider>
  );
};

// Custom hook to use the context
export const useQR = () => useContext(QRContext);
