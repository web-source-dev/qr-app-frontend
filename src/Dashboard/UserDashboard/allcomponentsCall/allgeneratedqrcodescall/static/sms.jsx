import React, { useState, useEffect, useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import "../myqrcodecss/business.css";
import { useNavigate } from "react-router-dom";
import { useGlobalLocal } from "../../../../../allqrcodeCustomizations/globallocalqr/GlobalLocalQr";


const SmsDataList = () => {
  const { handleDownload, fetchData, handleDelete,formatDate, fetchedData } = useGlobalLocal();
  console.log(fetchedData)
  const navigate = useNavigate()
  const ref = useRef();
  const qrCodeRefs = useRef([]);

  const handleDownloadWithRef = (index) => {
    // Pass the correct ref for the clicked item
    const ref = qrCodeRefs.current[index];
    if (ref) {
      handleDownload(ref);
    }
  };
  useEffect(() => {

    fetchData('smsqr');
  }, []);


  return (
    <div>
      {/* Business Data List */}
      {fetchedData.length === 0 ? (
        <p>No data found.</p>
      ) : (
        fetchedData.map((business, index) => (
          <div key={business._id} className="business-item">
            <div className="small-row-container-for-qr-code-display">
              <h3>{index + 1}.</h3>
              <div className="qr-code-display-container">
                <div
                  ref={(el) => (qrCodeRefs.current[index] = el)}
                  style={{
                    "--bg-color": business.qrDesign?.bgColor || "#ffffff",
                    "--fg-color": business.qrDesign?.fgColor || "#000",
                  }}
                  className={`${business.qrDesign?.frame || ""}`}
                >
                  <QRCode
                    value={`${business.qr_data}`}
                    ecLevel={business.qrDesign?.ecLevel || "L"}
                    enableCORS={business.qrDesign?.enableCORS || true}
                    size={100}
                    quietZone={business.qrDesign?.quietZone || 10}
                    bgColor={business.qrDesign?.bgColor || "#ffffff"}
                    fgColor={business.qrDesign?.fgColor || "#000"}
                    qrStyle={business.qrDesign?.qrStyle || "squares"}
                    eyeColor={business.qrDesign?.eyeColor || "#000"}
                    eyeRadius={business.qrDesign?.eyeRadius || 0}
                    logoImage={business.qrDesign?.logo}
                    logoWidth={business.qrDesign?.logoWidth || 40}
                    logoHeight={business.qrDesign?.logoHeight || 40}
                    logoOpacity={business.qrDesign?.logoOpacity || 1}
                    removeQrCodeBehindLogo={
                      business.qrDesign?.removeQrCodeBehindLogo || false
                    }
                    logoPadding={business.qrDesign?.logoPadding || 0}
                    logoPaddingStyle={business.qrDesign?.logoPaddingStyle || ""}
                  />
                </div>
              </div>
              <div className="text-for-each-qr-name-or-short-title">
                
              <h3 className="type-of-qr">Sms</h3> 
                  {business.qrDesign?.logoText || `Untitled `}
                {/* Format the created_at date */}
                <p style={{fontWeight:'lighter',fontSize:'14px'}}><b>Created At: </b>{business.created_at && formatDate(business.created_at)}</p>
              </div>
              <p style={{width:'300px',textAlign:'center' }}>This QR is static and does not allow tracking, so there will be no record of scans.</p>
              <div className="action-btns-for-qr-active-del-edit">
                <div className="download-button" data-tooltip="Size: 175kb" onClick={() => handleDownloadWithRef(index)}>
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
                <button
                  className="btn-18"
                  onClick={() => handleDelete('smsqr', business._id)}
                >
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SmsDataList;
