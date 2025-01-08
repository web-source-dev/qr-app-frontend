import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeStep = ({ userId, downloadQRCode, setCurrentStep }) => {
  return (
    <div className="qr-form-container">
      <h2>Submit</h2>
      <button className="submit-btn" onClick={downloadQRCode}>Download QR Code</button>
      <QRCodeCanvas id="qr-code-canvas" value={`http://localhost:3000/user/${userId}`} size={300} fgColor="#000000" bgColor="#ffffff" />
      <button onClick={() => setCurrentStep(1)}>Back</button>
      <button onClick={() => setCurrentStep(3)}>Next</button>
    </div>
  );
};

export default QRCodeStep;
