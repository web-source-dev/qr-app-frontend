import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { QRCode } from "react-qrcode-logo";
import "../myqrcodecss/business.css";
import { useNavigate } from "react-router-dom";
import { useFormContext } from '../../../../../allqrcodeCustomizations/globalsetup/globaldata';


const VideosDataList = () => {
  const { setBusinessData, handleDeleteClick, handleActiveClick, formatDate, setFilteredData, setLoading, setError, businessData, filteredData, loading, error, handleSubmit, qrvalueide, handleUpdate, buyCredits, fetchBusinessData, handleDownload, handleBuyCredits, isPopupOpen, handleClosePopup } = useFormContext()

  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    company: "",
    status: "all",
    qrCodeText: "", // New filter for the QR code text
    scanLimit: "all",
  });
  const qrCodeRefs = useRef([]);

  const handleDownloadWithRef = (index) => {
    // Pass the correct ref for the clicked item
    const ref = qrCodeRefs.current[index];
    if (ref) {
      handleDownload(ref);
    }
  };
  const [qrDesign, setQrDesign] = useState({})
  const [customization, setCustomization] = useState({})
  const [configuration, setConfiguration] = useState({})
  const ref = useRef();
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {

    fetchBusinessData('videos');
    console.log('check data for business', businessData)
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let filtered = [...businessData];

    // Filter by company name
    if (filters.company) {
      filtered = filtered.filter((item) =>
        item.business_company
          .toLowerCase()
          .includes(filters.company.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      filtered = filtered.filter(
        (item) => item.configuration.qr_active === isActive
      );
    }

    // Filter by scan limit
    if (filters.scanLimit !== "all") {
      const limit = parseInt(filters.scanLimit, 10);
      filtered = filtered.filter((item) => item.configuration.scan_count <= limit);
    }
    if (filters.qrCodeText) {
      filtered = filtered.filter((item, index) =>
        (item.qrDesign?.logoText || `qr-code ${index + 1}`)
          .toLowerCase()
          .includes(filters.qrCodeText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [filters, businessData]);

  const handleEditClick = (id) => {
    // Find the selected business item by ID
    const selectedBusiness = businessData.find((item) => item._id === id);
    console.log(selectedBusiness)

    if (selectedBusiness) {
      // Set the selected qrDesign into state
      setQrDesign(selectedBusiness.qrDesign);
      setCustomization(selectedBusiness.customization);
      setConfiguration(selectedBusiness.configuration);

      // Check if businessdatasending is defined before saving it to localStorage
      const businessDataSending = selectedBusiness.businessdatasending || {}; // Default to empty object if undefined
      localStorage.setItem('qrDesign', JSON.stringify(selectedBusiness.qrDesign));
      localStorage.setItem('customization', JSON.stringify(selectedBusiness.customization));
      localStorage.setItem('configuration', JSON.stringify(selectedBusiness.configuration));
      localStorage.setItem('businessdatasending', JSON.stringify(selectedBusiness));
      localStorage.setItem('requestBusinessEdit', "true");
      localStorage.setItem('url', '/dashboard/generate/video?edit')

      setTimeout(() => {
        navigate("/dashboard/generate/video?edit");
      }, 3000);
    } else {
      console.error("Business item not found");
    }
  };



  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Filters Section */}
      <div className="filter-container">
        <input
          type="text"
          name="qrCodeText"
          placeholder="Search by QR code text"
          value={filters.qrCodeText}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          name="scanLimit"
          value={filters.scanLimit}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="all">All Scan Limits</option>
          <option value="50">Up to 50</option>
          <option value="100">Up to 100</option>
          <option value="500">Up to 500</option>
        </select>
      </div>

      {/* Business Data List */}
      {filteredData.length === 0 ? (
        <p>No data found.</p>
      ) : (
        filteredData.map((business, index) => (
          <div key={business._id} className="business-item">
            <div className="small-row-container-for-qr-code-display">
              <div className="display-sda">
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
                      value={`${process.env.REACT_APP_FRONTEND_URL}/display/qr-video/${business._id}`}
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
                <h3 className="type-of-qr">Video</h3> 
                  {business.qrDesign?.logoText || `Untitled `}
                  <p style={{fontWeight:'lighter',fontSize:'14px'}}><b>Created At: </b>{business.createdAt && formatDate(business.createdAt)}</p>
                  <div className="download-button" style={{ fontSize: "15px", fontWeight: 'lighter', padding: "0px 10px", marginTop:'20px' }} data-tooltip="Size: 175kb" onClick={() => handleDownloadWithRef(index)}>
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
              </div>

              <div className="show-scan-limit-or-status-of-qr">
                <div className="status-item">
                  <span className="status-label">Scan Count:</span>
                  <span className="status-value">{business.configuration.scan_count}</span>
                </div>

                <div className="status-item">
                  <span className="status-label">QR Status:</span>
                  <span
                    className={`status-value ${business.configuration.qr_active ? "active" : "inactive"}`}
                  >
                    {business.configuration.qr_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="status-item">
                  <span className="status-label">Password:</span>
                  <span
                    className={`status-value ${business.configuration.active_password ? "active" : "inactive"}`}
                  >
                    {business.configuration.active_password ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="status-item">
                  <span className="status-label">Scan Limit:</span>
                  <span
                    className={`status-value ${business.configuration.active_scan_limit ? "active" : "inactive"}`}
                  >
                    {business.configuration.active_scan_limit ? "Enabled" : "Disabled"}
                  </span>
                </div>

                <div className="status-item">
                  <span className="status-label">Time Scheduling:</span>
                  <span
                    className={`status-value ${business.configuration.active_time_scheduling ? "active" : "inactive"}`}
                  >
                    {business.configuration.active_time_scheduling ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="action-btns-for-qr-active-del-edit">

                <button className="btn-18" onClick={() => handleEditClick(business._id)}>
                  <span> edit</span>
                </button>
                <button className="btn-18" onClick={() => handleDeleteClick('videos', business._id)}>
                  <span> Delete</span>
                </button>


                <button className="btn-18" onClick={() => handleActiveClick(business._id)}>
                  <span> {business.configuration.qr_active ? "Deactivate" : "Activate"}</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VideosDataList;
