import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useParams } from 'react-router-dom';
import ImagesDisplay from './Mobiledisplay';
import VideoDisplay from './MobileVideoDisplay';

const DisplayImages = () => {
  const { qrId } = useParams(); // Get qrId from URL params
  const [configData, setConfigData] = useState(null);
  const [password, setPassword] = useState('');
  const [businessDataGet, setBusinessData] = useState(null);
  const [error, setError] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [ConfigurationData, setConfigurationData] = useState([]);

  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        const configResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/diplay/qr/data/configuration/${qrId}`);
        setConfigData(configResponse.data.config);
        console.log('Configuration data fetched:', configResponse.data.config);
  
        if (configResponse.data.config?.active_password) {
          setIsPasswordRequired(true);
        } else {
          // No password required, fetch business data and configuration data
          fetchSocialData(configResponse.data.config);
          fetchConfigurationData(configResponse.data.config);
        }
      } catch (error) {
        setError('Failed to fetch configuration data.');
        console.error(error);
      }
    };
  
    fetchConfigData();
  }, [qrId]);
  
  const fetchConfigurationData = async (config) => {
    try {
      if (!config?.qr_active) {
        setError('QR code is inactive.');
        return;
      }
  
      const DesignCardResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/diplay/qr/data/designofcard/${qrId}`);
      setConfigurationData(DesignCardResponse.data.DesignOfCardComponent);
      console.log('Configuration data fetched:', DesignCardResponse.data.DesignOfCardComponent);
    } catch (error) {
      setError('Failed to fetch design card data.');
      console.error(error);
    }
  };
  
  const fetchSocialData = async (config) => {
    try {
      if (!config?.qr_active) {
        setError('QR code is inactive.');
        return;
      }
  
      const businessResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/diplay/qr/data/video/${qrId}`);
      setBusinessData(businessResponse.data.SocialDataSend);
      localStorage.setItem("afterScan", "true");
      console.log('Business data fetched:', businessResponse.data.SocialDataSend);
    } catch (error) {
      setError('Failed to fetch business data.');
      console.error(error);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
  
    if (!password) {
      setError('Please enter a password.');
      return;
    }
  
    try {
      if (password === configData?.qrPassword) {
        fetchSocialData(configData);
        fetchConfigurationData(configData);
        setIsPasswordCorrect(true);
      } else {
        setError('Incorrect password.');
      }
    } catch (error) {
      setError('An error occurred while checking the password.');
      console.error(error);
    }
  };
  return (
    <div>

      {isPasswordRequired && !isPasswordCorrect ? (
        <form onSubmit={handlePasswordSubmit}>
          <label>
            Enter Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
      ) : (
        <div>
          {businessDataGet ? (
            <div className='small-preview-data-from-scanning'>
                <VideoDisplay ConfigurationShopMenuData={ConfigurationData} shopMenuDataGet={businessDataGet}  />
            </div>
          ) : (
            <div>{error}</div>
            
          )}
        </div>
      )}
    </div>
  );
};

export default DisplayImages;
