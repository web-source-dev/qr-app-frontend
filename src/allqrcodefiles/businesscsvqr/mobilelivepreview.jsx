
    import React from 'react';
    import './businessCsvqr.css';
    import DefualtBusinessTheme from './themes/defualtbusinesstheme';
    
    const MobileBusinessPreview = ({ businessData, customization = {} }) => {
        return (
            <>
                    <DefualtBusinessTheme  businessData={businessData} customization={customization} />
            </>
        );
    };
    
    export default MobileBusinessPreview;
    
