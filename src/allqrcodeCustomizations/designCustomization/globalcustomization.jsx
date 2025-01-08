import React, { createContext, useContext,useEffect, useState } from 'react';

// Create the context
const CustomizationContext = createContext();

// Custom provider component
export const CustomizationProvider = ({ children }) => {
  const [customization, setCustomization] = useState({
    titleColor: '',
    textColor: '',
    primaryColor: '',
    secondaryColor: '',
    buttonColor: '',
    icons_color: '',
    fontFamily: '',
    buttonTextColor: '',
    qrvalueid: null,
    user_id: null, // Set this dynamically if needed
  });

  const updateCustomization = (key, value) => {
    setCustomization((prev) => ({ ...prev, [key]: value }));
  };
  useEffect (() =>{
    const editableData = localStorage.getItem("requestBusinessEdit");
  if(editableData){
    setCustomization(JSON.parse(localStorage.getItem("customization")))
    }
},[])
  return (
    <CustomizationContext.Provider value={{ customization, updateCustomization }}>
      {children}
    </CustomizationContext.Provider>
  );
};

// Custom hook for accessing the customization context
export const useCustomization = () => useContext(CustomizationContext);
