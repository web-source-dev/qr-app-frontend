import React, { createContext, useEffect, useState } from 'react';

// Create the context
export const GlobalConfigContext = createContext();

// Create the provider
export const GlobalConfigProvider = ({ children }) => {
    const [globalConfig, setGlobalConfig] = useState({
        scanLimit: 0,
        timeScheduling: { since: '', until: '' },
        password: '',
        active_scan_limit: false,
        active_time_scheduling: false,
        active_password: false,
    qrvalueid: null,
    user_id: null, // Set this dynamically if needed
    });
    useEffect (() =>{
        const editableData = localStorage.getItem("requestBusinessEdit");
      if(editableData){
          setGlobalConfig(JSON.parse(localStorage.getItem("configuration")))
        }
    },[])
console.log(globalConfig)
    const updateGlobalConfig = (newConfig) => {
        setGlobalConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
    };
    
    return (
        <GlobalConfigContext.Provider value={{ globalConfig, updateGlobalConfig }}>
            {children}
        </GlobalConfigContext.Provider>
    );
};
