// GlobalLocalContext.js
import React, { createContext, useState, useContext } from 'react';
import domtoimage from 'dom-to-image';
import { useQR } from '../qrCodeCustomization/globalqrcodedesign';
import axios from 'axios';


// Create the context
const GlobalLocalContext = createContext();

// Create a provider component
export const GlobalLocalProvider = ({ children }) => {
      const { qrSettings } = useQR();
      const [qrvalueide, setqrvalueide] = useState('');
      const [isDownload ,setIsDownload] = useState(false);
      const user_id = localStorage.getItem('user_id')
      const [fetchedData,setFetchedData] = useState([]);
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


const handleSubmit = async (param,data) => {
  try {
    const savedata = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/local-setup/qr/${param}`,data)
    console.log("Data saved:", savedata.data);

    const qride = savedata.data.qrid
    setqrvalueide(savedata.data.qrid)

    if(!qride){
      return console.log("NOt qrid saved");
    }
    const submissionDataQr = {
      ...qrSettings,
      qrvalueid:qride,
      user_id, // Ensure user_id is properly passed
    };

      // Save new design
      const designQrResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/dyn-qr/save-design-qr`,
        submissionDataQr
      );
      console.log(designQrResponse.data);
      setIsDownload(true);
    } catch (error) {
    console.error("Error in handleSubmit:", error);
  }
}

const fetchData = async (socialdata) => {
  if (!user_id) {
    console.error("User ID is missing in localStorage");
    return;
  }

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/local-setup/all-social-data/${socialdata}`, // Include socialdata in the URL path
      {
        params: { user_id }, // Pass user_id as a query parameter
      }
    );
    setFetchedData(response.data)
  } catch (error) {
    console.error("Error fetching business data:", error);
  }
};

const handleDelete = async (platform,id) => {
  console.log("Delete business:", id);
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/local-setup/user/delete/${platform}/${id}`);
  } catch (error) {
    console.error("Error in handleDelete:", error);
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
  return (
    <GlobalLocalContext.Provider value={{formatDate,handleDownload1,fetchedData,fetchData,handleDelete,handleDownload, qrSettings,handleSubmit , isDownload , qrvalueide}}>
      {children}
    </GlobalLocalContext.Provider>
  );
};

// Create a custom hook to use the context
export const useGlobalLocal = () => useContext(GlobalLocalContext);
