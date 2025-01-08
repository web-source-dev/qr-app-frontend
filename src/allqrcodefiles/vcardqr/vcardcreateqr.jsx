import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobalLocal } from '../../allqrcodeCustomizations/globallocalqr/GlobalLocalQr';
import QRCodeGenerator from '../../allqrcodeCustomizations/qrCodeCustomization/designformofQR';
import { QRCode } from 'react-qrcode-logo';

const VcardCreate = () => {
    const { handleDownload, qrSettings, handleSubmit, isDownload,handleDownload1 } = useGlobalLocal();
    const ref = useRef(null);
    const user_id = localStorage.getItem('user_id');  // Get user ID from localStorage

    const [vcard_qr_value, setVcardQrValue] = useState({
        v_card_name: '',
        v_card_email: '',
        v_card_phone_number: '',
        v_card_address: '',
        v_card_image: '', // This will hold the Cloudinary image URL
        user_id,
        qr_data: ''
    });

    // Cloudinary setup
    const cloudName = 'dcvqytwuq';
    const uploadPreset = 'my_qr_preset'; // Replace with your actual preset

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        // Validate file type and size
        if (file && !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert('Invalid file type. Please upload an image (JPEG/PNG/GIF).');
            return;
        }

        if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File size is too large. Please upload an image smaller than 5MB.');
            return;
        }

        // Prepare form data for Cloudinary upload
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', uploadPreset);
        uploadData.append('cloud_name', cloudName);

        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, uploadData);

            if (response.status === 200) {
                const imageUrl = response.data.secure_url; // Get the secure URL
                setVcardQrValue((prev) => ({ ...prev, v_card_image: imageUrl })); // Update state with image URL
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    // Handle changes to input fields
    const handleVcardInputChange = (e) => {
        const { name, value } = e.target;
        setVcardQrValue((prev) => ({ ...prev, [name]: value }));
    };

    // Create the VCard string and update the QR data
    useEffect(() => {
        const { v_card_name, v_card_email, v_card_phone_number, v_card_address, v_card_image } = vcard_qr_value;

        // Generate the VCard string
        if (v_card_name && v_card_email && v_card_phone_number) {
            const vcardString = `BEGIN:VCARD\nVERSION:3.0\nN:${v_card_name}\nEMAIL:${v_card_email}\nTEL:${v_card_phone_number}\nADR:${v_card_address}\nIMG;VALUE=URI:${v_card_image}\nEND:VCARD`;

            // Update qr_data state with the VCard string
            setVcardQrValue((prev) => ({
                ...prev,
                qr_data: vcardString
            }));
        }
    }, [vcard_qr_value.v_card_name, vcard_qr_value.v_card_email, vcard_qr_value.v_card_phone_number, vcard_qr_value.v_card_address, vcard_qr_value.v_card_image]);

    return (
        <div className='flex-group'>
            <div className='wifi-container'>
                <h1>V Card Qr</h1>
                <div className="wifi-form">

                    <div className="flex-input">
                        <div className="form-group">
                            <label className="form-label">Name:</label>
                            <input
                                type="text"
                                name="v_card_name"
                                value={vcard_qr_value.v_card_name}
                                onChange={handleVcardInputChange}
                                placeholder="Name"
                            />
                            <label className="form-label">Email:</label>

                            <input
                                type="text"
                                name="v_card_email"
                                value={vcard_qr_value.v_card_email}
                                onChange={handleVcardInputChange}
                                placeholder="Email"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number:</label>

                            <input
                                type="text"
                                name="v_card_phone_number"
                                value={vcard_qr_value.v_card_phone_number}
                                onChange={handleVcardInputChange}
                                placeholder="Phone Number"
                            />
                            <label className="form-label">Address:</label>

                            <input
                                type="text"
                                name="v_card_address"
                                value={vcard_qr_value.v_card_address}
                                onChange={handleVcardInputChange}
                                placeholder="Address"
                            />
                        </div>
                        {/* Image upload input */}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Image:</label>

                        <input
                            type="file"
                            onChange={handleImageChange}
                            name="v_card_image"
                        />
                    </div>
                </div>
                <div className="qr-deigningig-component">
                    <QRCodeGenerator />
                    <div className='qr-display-container-fix-it'>
                        <div
                            ref={ref}
                            style={{
                                '--bg-color': qrSettings.bgColor || '#ffffff',
                                '--fg-color': qrSettings.fgColor || '#000',
                            }}
                            className={`${qrSettings.frame}`}
                        >
                            <QRCode
                                value={vcard_qr_value.qr_data}  // QR code will now contain the VCard data
                                ecLevel={qrSettings.ecLevel}
                                enableCORS={qrSettings.enableCORS}
                                size={qrSettings.size}
                                quietZone={qrSettings.quietZone}
                                bgColor={qrSettings.bgColor}
                                fgColor={qrSettings.fgColor}
                                qrStyle={qrSettings.qrStyle}
                                eyeColor={qrSettings.eyeColor}
                                eyeRadius={qrSettings.eyeRadius}
                                logoImage={qrSettings.logo}
                                logoWidth={qrSettings.logoWidth}
                                logoHeight={qrSettings.logoHeight}
                                logoOpacity={qrSettings.logoOpacity}
                                removeQrCodeBehindLogo={qrSettings.removeQrCodeBehindLogo}
                                logoPadding={qrSettings.logoPadding}
                                logoPaddingStyle={qrSettings.logoPaddingStyle}
                            />
                        </div>
                        <br />

                        {isDownload === false ? (
                            <button className="button-57" style={{ width: '100%'}} onClick={() => {
                                handleSubmit("vcardqr", vcard_qr_value); // Pass the entire vcard data
                            }} role="button">
                                <span className="text"> Generate QR</span>
                                <span> Generate QR</span> 
                            </button>
                        ) : (
                            <div className="download-button" data-tooltip="Size: 175kb" onClick={() => handleDownload1(ref)}>
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
                        )}
                    </div>
                </div>
            </div>
            <div className="display-mobile">
                <div className="display-image-container">
                    <img
                        src='https://res.cloudinary.com/dcvqytwuq/image/upload/v1734957191/ph6qu7cfgfxvntymqnxy.png'
                        alt={''}
                        className="display-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default VcardCreate;
