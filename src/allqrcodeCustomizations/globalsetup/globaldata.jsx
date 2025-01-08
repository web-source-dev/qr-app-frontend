import React, { useState, useRef,createContext, useContext,useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo'
import axios from 'axios';
import Configuration from '../../allqrcodefiles/stats/configuration/Configuration';
import { GlobalConfigContext } from '../../allqrcodefiles/stats/configuration/globalconfig';
import CustomizationForm from '../../allqrcodeCustomizations/designCustomization/DesignCustomization';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';
import { useQR } from '../../allqrcodeCustomizations/qrCodeCustomization/globalqrcodedesign';
import domtoimage from 'dom-to-image';
import { useCustomization }  from '../../allqrcodeCustomizations/designCustomization/globalcustomization';
import { useLocation, useNavigate } from'react-router-dom';
import MyComponent from '../../allqrcodeCustomizations/globalsetup/check';

// Create the context
const FormContext = createContext();

// Create the provider
export const FormProvider = ({ children }) => {
    const navigate = useNavigate()
  const { customization, updateCustomization } = useCustomization();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { qrSettings } = useQR();
  const [qrvalueide, setqrvalueId] = useState("")
  const location = useLocation();
  const [qrDesignId, setQrDesignId] = useState('')
  const user_id = localStorage.getItem('user_id');
  const { globalConfig } = useContext(GlobalConfigContext);
  const [buyCredits, setBuyCredits] = useState(false)
  const [businessData, setBusinessData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (routepath, data) => {
    console.log('routepath', routepath)
    console.log('Form data:', data);
    if(qrvalueide){
        return handleUpdate(qrvalueide,routepath,data)
    }
    try {
 
      const businessResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/global-setup/qr/${routepath}`,
        data
      );
      console.log('Business data saved:', businessResponse.data);
      if (businessResponse.data.sts === 1 || businessResponse.data.sts === 2){
      
       return setBuyCredits(true)
      }
      // Extract QR ID from response
      const qrvalueid = businessResponse.data.qrid;
      setqrvalueId(qrvalueid);

      if (!qrvalueid) {
        console.error('QR value ID not returned from business data save.');
        return; // Stop further execution if QR ID is not available
      }
      // 2. Save configuration data
      const configData = {
        user_id, // Assuming user_id is available in the current scope
        qr_id: qrvalueid, // Using qrvalueid from the business response
        scanLimit: globalConfig.scanLimit,
        timeScheduling: globalConfig.timeScheduling,
        qrPassword: globalConfig.password,
        active_scan_limit: globalConfig.active_scan_limit,
        active_time_scheduling: globalConfig.active_time_scheduling,
        active_password: globalConfig.active_password,
      };

      const configResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/dyn-qr/add-configuration`,
        configData
      );
      console.log('Configuration saved:', configResponse.data);

      // 3. Save design customization
      const submissionData = {
        ...customization, // Assuming customization is part of the state
        qrvalueid,
        user_id, // Ensure user_id is defined in the current scope
      };

      const designResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/dyn-qr/savedesign`,
        submissionData
      );
      console.log('Customization saved:', designResponse.data);
        
        // Handle saving/updating the QR code design
        const submissionDataQr = {
          ...qrSettings,
          qrvalueid,
          user_id, // Ensure user_id is properly passed
        };
  
          // Save new design
          const designQrResponse = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/dyn-qr/save-design-qr`,
            submissionDataQr
          );
          setQrDesignId(designQrResponse.data.id);
          console.log("QR code design saved:", designQrResponse.data);

      setIsPopupOpen(true); // Open the popup
    } catch (error) {
      console.error('Error occurred:', error.response?.data || error.message);
    }
  };
  const handleUpdate = async (id,routepath, data) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/global-setup/qr/edit/${routepath}/${id}`,
        data
      );
  
      if (response.data.sts === 1) {
        console.log("Error:", response.data.error);
      } else if (response.data.sts === 0) {
        console.log("Update Successful:", response.data);
      }
      const submissionDataQr = {
        ...qrSettings,
        qrvalueid:id,
        user_id, // Ensure user_id is properly passed
      };
      const updateqrdesigndata = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/diplay/qr/data/edit/qr-design/${id}`,submissionDataQr)
      if(updateqrdesigndata.data.sts === 1){
       console.log(updateqrdesigndata.data)
      }
      const configData = {
        user_id, // Assuming user_id is available in the current scope
        qr_id: id, // Using qrvalueid from the business response
        scanLimit: globalConfig.scanLimit,
        timeScheduling: globalConfig.timeScheduling,
        qrPassword: globalConfig.password,
        active_scan_limit: globalConfig.active_scan_limit,
        active_time_scheduling: globalConfig.active_time_scheduling,
        active_password: globalConfig.active_password,
      };
      const updateqrconfigdata = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/diplay/qr/data/edit/qr-config/${id}`,configData)
      if(updateqrconfigdata.data.sts === 1){
       console.log(updateqrconfigdata.data)
      }
      const submissionData = {
        ...customization, // Assuming customization is part of the state
        qrvalueid:id,
        user_id, // Ensure user_id is defined in the current scope
      };
      const updatebusinessdesign = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/diplay/qr/data/edit/qr-customization/${id}`,submissionData)
      if (updatebusinessdesign){
        console.log(updatebusinessdesign.data)
      }

      console.log('data update')

      setTimeout(() => {
          localStorage.removeItem('socialdatasending')
          localStorage.removeItem('configuration')
          localStorage.removeItem('customization')
          localStorage.removeItem('qrDesign')
          localStorage.removeItem('requestBusinessEdit')

          navigate('/sidebar')
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  }
  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup
  }; 
      const handleDownload = async (ref) => {
        try {
          if (!ref) return;
      
          // Generate QR code as PNG and allow download
          const dataUrl = await domtoimage.toPng(ref);
      
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "qr-code-with-frame.png";
          link.click();
        } catch (error) {
          console.error("Error in handleDownload:", error);
        }
      };

  const handleBuyCredits = async (data) => {
    // Save businessData to localStorage as JSON
    localStorage.setItem("SaveData", JSON.stringify(data));
   // Save the current page path to localStorage
   // Navigate to the home page or "Buy Credits" page
   localStorage.setItem("pricing",'true')
   navigate("/sidebar");
  };
  const fetchBusinessData = async (socialdata) => {
    if (!user_id) {
      console.error("User ID is missing in localStorage");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/global-setup/all-social-data/${socialdata}`, // Include socialdata in the URL path
        {
          params: { user_id }, // Pass user_id as a query parameter
        }
      );
      

      setBusinessData(response.data);
      setFilteredData(response.data); // Initialize filtered data
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching business data:", error);
      setError("Failed to load business data");
      setLoading(false);
    }
  };
  
  const handleDeleteClick = async (platform,id) => {
    console.log("Delete business:", id);
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/global-setup/user/delete/${platform}/${id}`);
      setBusinessData(businessData.filter((item) => item._id!== id));
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  const handleActiveClick = async (id) => {
    console.log("Toggle active status:", id);
    try {
      // API call to toggle the active status
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/diplay/qr/data/user/toggle-active/${id}`
      );
  
      // Update local state with the updated configuration
      setBusinessData((prevBusinessData) =>
        prevBusinessData.map((item) =>
          item._id === id
            ? { ...item, configuration: response.data.data } // Use the updated data from the server
            : item
        )
      );
      console.log("Toggle success:", response.data.message);
    } catch (error) {
      console.error("Error in handleActiveClick:", error);
      alert("Failed to toggle active status. Please try again.");
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // months are 0-based
    const year = date.getFullYear();
    
    // Return the date in the desired format
    return `${day}/${month}/${year}`;
  };
  const handleDownload1 = async (ref) => {
          try {
            if (!ref.current) return;
      
            // Generate QR code as PNG and allow download
            const dataUrl = await domtoimage.toPng(ref.current);
      
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "qr-code-with-frame.png";
            link.click();
          } catch (error) {
            console.error("Error in handleDownload:", error);
    };
  }
  return (
    <FormContext.Provider value={{handleDownload1,formatDate,setBusinessData,handleDeleteClick,handleActiveClick,setFilteredData,setLoading,setError,businessData,filteredData ,loading,error,handleSubmit,qrvalueide,fetchBusinessData,handleUpdate,buyCredits ,handleDownload,handleBuyCredits,isPopupOpen,handleClosePopup }}>
      {children}
    </FormContext.Provider>
  );
};

// Hook to use the context
export const useFormContext = () => useContext(FormContext);
