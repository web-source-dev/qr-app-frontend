import React, { useState } from 'react';
import { useQR } from './globalqrcodedesign';
import './designqrform.css';

const QRCodeGenerator = () => {
    const { qrSettings, updateQrSettings } = useQR();
    const [logoFile, setLogoFile] = useState(null);
    const [activeSection, setActiveSection] = useState('frame'); // Default section to display

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Logo = reader.result;
                updateQrSettings({ logo: base64Logo }); // Update the QR settings with the uploaded logo
                setLogoFile(base64Logo); // Update the local state for preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePredefinedLogoSelect = (logoUrl) => {
        updateQrSettings({ logo: logoUrl }); // Update the QR settings with the selected logo
        setLogoFile(logoUrl); // Update the local state for preview
    };


    const handleFrameChange = (frame) => {
        updateQrSettings({ frame });
    };

    const handleShapeChange = (shape) => {
        updateQrSettings({ qrStyle: shape });
    };

    const handleEyeColorChange = (part, color) => {
        // Create a new array with updated color for all eyes
        const updatedEyeColor = qrSettings.eyeColor.map(eye => ({
            ...eye,
            [part]: color,  // Update the specific part (outer or inner) for all eyes
        }));

        // Update the settings with the new colors
        updateQrSettings({ eyeColor: updatedEyeColor });
    };

    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    const handleEyeRadiusClick = (radiusType, radiusValue) => {
        const newEyeRadius = qrSettings.eyeRadius.map(eye => ({
            ...eye,
            [radiusType]: radiusValue,
        }));
        updateQrSettings({ eyeRadius: newEyeRadius });
    };
    const handleEyeRadiusClicks = (radiusType, radiusValue) => {
        const newEyeRadius = qrSettings.eyeRadius.map(eye => ({
            ...eye,
            [radiusType]: radiusValue,
        }));
        updateQrSettings({ eyeRadius: newEyeRadius });
    };

    return (
        <div className="qr-design-customization-container">

            {/* Section Navigation */}
            <div className="qr-design-customization-nav">
                {[
                    { label: 'Frame', section: 'frame' },
                    { label: 'Logo', section: 'logo' },
                    { label: 'Shape', section: 'shape' },
                    { label: 'Settings', section: 'settings' }, // New section for settings
                ].map((item) => (
                    <button
                        key={item.section}
                        className={`qr-design-customization-button ${activeSection === item.section ? 'active' : ''}`}
                        onClick={() => handleSectionClick(item.section)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
                {/* <input type="text" placeholder='Enter Your Qr Name' name='logoText' value={qrSettings.logoText} onChange={(e)=> updateQrSettings({logoText : e.target.value})}/> */}

            {activeSection === 'logo' && (
                <div className="qr-design-customization">
                    <label htmlFor="logoUpload" className="qr-design-customization-label">Upload Logo:</label>
                    <input
                        type="file"
                        id="logoUpload"
                        className="qr-design-customization-file-input"
                        onChange={handleLogoUpload}
                    />

                    <div className="qr-design-predefined-logos">
                        <p>Select a logo:</p>
                        <div className="qr-design-logo-options">
                            {[
                                { name: 'YouTube', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoiMtJG_PC4lsb3-GZAiTZkUXAm3VlkJC1Ag&s' },
                                { name: 'Twitter', url: 'https://store-images.s-microsoft.com/image/apps.26737.9007199266244427.c75d2ced-a383-40dc-babd-1ad2ceb13c86.ed1d047e-03d9-4cd8-a342-c4ade1e58951' },
                                { name: 'Instagram', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
                                { name: 'Facebook', url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' },
                                { name: 'LinkedIn', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' },
                                { name: 'WhatsApp', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' },
                                { name: 'Snapchat', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAcGGEKoUBqyoaeSM-6LUktNzqDm48YUhXPg&s' },
                                { name: 'Pinterest', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png' },
                                { name: 'Reddit', url: 'https://images.squarespace-cdn.com/content/v1/5c5554d316b64061c6f8a20d/1630949829757-WXNOUZ8R4QQCXMIY4YMG/What-Is-The-Reddit-Logo-Called.png' },
                                { name: 'TikTok', url: 'https://store-images.s-microsoft.com/image/apps.3793.13634052595610511.c45457c9-b4af-46b0-8e61-8d7c0aec3f56.bbc8b3d1-941b-42c2-a610-e100e2aae247' },
                                { name: 'Spotify', url: 'https://yt3.googleusercontent.com/vuOdWtsiJ02ciel4pqaheZbl3SJx5uP5xu_xJlAilwFRKsvYjZqHGiIGvZxWKVHIEHvVRhQctrc=s900-c-k-c0x00ffffff-no-rj' },
                                { name: 'GitHub', url: 'https://avatars.githubusercontent.com/u/59704711?s=200&v=4' },
                                { name: 'Dribbble', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeE6dMZcvr1HxEGTFEG9-sjVNnjQDh1I48iw&s' },
                                { name: 'Discord', url: 'https://yt3.googleusercontent.com/Ws_BpAWD46mOjCW3XCnsZ0YmghW-6fhMf6d9pvCvb4g8JJftgvL54039U1mgh31OchR4ApMTezc=s900-c-k-c0x00ffffff-no-rj' },
                                { name: 'Telegram', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/1200px-Telegram_2019_Logo.svg.png' },
                            ].map((logo) => (
                                <button
                                    key={logo.name}
                                    className="qr-design-logo-button"
                                    onClick={() => handlePredefinedLogoSelect(logo.url)} // Handle logo selection
                                >
                                    <img src={logo.url} alt={logo.name} className="qr-design-logo-icon" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {activeSection === 'shape' && (
                <div className="qr-design-customization">
                    <div className="qr-design-customization-shape-container">
                        {[
                            { type: 'dots', name: 'Dots', image: 'https://help.globalvision.co/__attachments/1622933607/image2020-12-17_7-13-3.png%3Fversion=1&modificationDate=1608207185145&cacheVersion=1&api=v2?inst-v=3f987fc3-af87-483c-9434-bccf283ff5ff' },
                            { type: 'squares', name: 'Squares', image: 'https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg' },
                            { type: 'fluid', name: 'Fluid', image: 'https://raw.githubusercontent.com/gcoro/react-qrcode-logo/HEAD/res/qrcode-ts-fluid.png' },
                        ].map((shape, index) => (
                            <div
                                key={index}
                                className={`qr-design-customization-shape ${qrSettings.qrStyle === shape.type ? 'selected' : ''}`}
                                onClick={() => handleShapeChange(shape.type)}
                            >
                                <img src={shape.image} alt={shape.type} className="qr-design-customization-shape-img" />
                            </div>
                        ))}
                    </div>
                    <div className="radius-selection-container">
                        <div className="radius-selection">
                            <h4>Choose Outer Radius Style:</h4>
                            <div className="radius-images">
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733323926/mslpkc7tk5xqvkl6g5dm.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [35, 10, 10, 10])}
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733324222/muuvwrj3o6xcglhyst7y.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [40, 40, 40, 40])}
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733324410/dlty00fwkiiqrzznqirh.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [40, 40, 40, 0])}
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733324415/exr9v8kw0zfxdyrqb0qf.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [40, 40, 0, 40])}
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733324423/duwaswq0zzvjitob8kea.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [40, 0, 40, 40])}
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733324431/dk6v49obpmtn55tqkhjm.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [0, 40, 40, 40])}
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733323934/gt37yvxqyx0gacswxd8u.png"
                                    alt="Curved Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [10, 0, 10, 40])}
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733324108/qnqpg9vvdrj8oaf2hhb0.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [10, 10, 10, 10])}
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733324110/igpsjdn4t5csojpv1n7k.png"
                                    alt="Curved Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [0, 0, 0, 0])}
                                />
                                <img
                                    src="https://etmantra.com/wp-content/uploads/Lapse-1.svg"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [7, 25, 7, 25])}
                                />
                                <img
                                    src="https://cdn.join.com/625ec3c08218850008974828/predium-logo-m.png"
                                    alt="Curved Radius"
                                    onClick={() => handleEyeRadiusClick('outer', [35, 0, 35, 0])}
                                />
                            </div>
                        </div>
                        <div className="radius-selection">
                            <h4>Choose Inner Radius Style:</h4>
                            <div className="radius-images">
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325387/rihg9bu7iiquepkq88dk.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [0, 0, 0, 0])}  // Apply 10px radius to all inner sides of all eyes
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325391/fvtmqi14fzuo3tnbebtc.png"
                                    alt="Curved Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [25, 10, 25, 10])}  // Apply different inner radius to all eyes
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325395/ggdtqounfhl2v4uaajb6.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [40, 0, 30, 0])}  // Apply 10px radius to all inner sides of all eyes
                                />

                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325399/eoqwikfqhj3loyld2qz4.png"
                                    alt="Curved Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [0, 40, 0, 30])}  // Apply different inner radius to all eyes
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325403/bqntq5qpfedsna20daap.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [40, 40, 0, 0])}  // Apply 10px radius to all inner sides of all eyes
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325407/susdpaynxmb6gxvvfgv0.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [0, 40, 0, 0])}  // Apply 10px radius to all inner sides of all eyes
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325411/lzxtqfg4ki8wtjnw1ai4.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [40, 0, 30, 40])}  // Apply 10px radius to all inner sides of all eyes
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325416/vfzbbijamymgplpq9eof.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [40, 40, 40, 0])}  // Apply 10px radius to all inner sides of all eyes
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325421/eepgto3dnvf4nmbepukq.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [0, 40, 40, 40])}  // Apply 10px radius to all inner sides of all eyes
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325426/rfu1corieyzb9ieebu29.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [40, 40, 0, 40])}  // Apply 10px radius to all inner sides of all eyes
                                />
                                <img
                                    src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733325568/ekbuiuvdu35sxai6kjaf.png"
                                    alt="Round Radius"
                                    onClick={() => handleEyeRadiusClicks('inner', [2, 2, 2, 2])}  // Apply 10px radius to all inner sides of all eyes
                                />
                            </div>
                            <div className="eye-color-selector">
                                <label className="eye-color-label">Outer Eye Color:</label>
                                <input
                                    type="color"
                                    value={qrSettings.eyeColor[0].outer} // Use the outer color of the first eye as the value
                                    onChange={(e) => handleEyeColorChange('outer', e.target.value)} // Apply to all outer eyes
                                    className="eye-color-input"
                                />
                                <label className="eye-color-label">Outer Eye Color:</label>
                                <input
                                    type="color"
                                    value={qrSettings.eyeColor[0].inner} // Use the inner color of the first eye as the value
                                    onChange={(e) => handleEyeColorChange('inner', e.target.value)} // Apply to all inner eyes
                                    className="eye-color-input"
                                />
                            </div>


                        </div>

                    </div>
                </div>
            )}

            {activeSection === 'frame' && (
                <div>
                    <div className="qr-design-customization">
                        <div className="qr-design-customization-frame-container">
                            {[
                                { name: 'qr-frame1', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1733366078/n6chgdqy10bl5aoqptq9.png' },
                                { name: 'qr-frame12', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735185353/ft9fbgmwvg0sjbtihzhr.png' },
                                { name: 'qr-frame3', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735114705/gc3yrugzohpfsfxbcpcq.png' },
                                { name: 'qr-frame10', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735114745/l3dadoneq5n1x60ko1ew.png' },
                                { name: 'qr-frame14', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735185362/nj5pwhhowq35vbbrwt5c.png' },
                                { name: 'qr-frame11', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735185348/nkst60aeqthyinydqd9i.png' },
                                { name: 'qr-frame4', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735114709/n4kuhk2ziuzbprxais1q.png' },
                                { name: 'qr-frame15', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735185366/edcirluppl8hhqacwqq9.png' },
                                { name: 'qr-frame5', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735114717/nw2wztpusuzw5y8v9anq.png' },
                                { name: 'qr-frame2', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735114700/d9lhe4mrl2bbt4gd1vol.png' },
                                { name: 'qr-frame16', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735185370/ygzsot8fbiefeelhtbke.png' },
                                { name: 'qr-frame6', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735114728/kcmfx4opkgexdvkt56wh.png' },
                                { name: 'qr-frame7', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735114733/hr6xexmzo4cjkwt51ctd.png' },
                                { name: 'qr-frame17', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735185375/sddsdjrtmdu0tv3l8qok.png' },
                                { name: 'qr-frame8', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735114736/xhsk3vi5ljimuedrrcg5.png' },
                                { name: 'qr-frame9', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735114741/ytbxme9umupg07l0szvp.png' },
                                { name: 'qr-frame13', url: 'https://res.cloudinary.com/dcvqytwuq/image/upload/v1735185357/biyuqmequ517qnqtlwbe.png' },
                            ].map((frame, index) => (
                                <div
                                    key={index}
                                    className={`qr-design-customization-frame ${qrSettings.frame === frame.name ? 'selected' : ''}`}
                                    onClick={() => handleFrameChange(frame.name)}
                                >
                                    <img src={frame.url} alt={frame.name} className="qr-design-customization-frame-img" />
                                </div>
                            ))}
                        </div>

                    </div> <br />
                    <div className="qr-design-customization-color-section">
                        <div className="color-picker-container">
                            <label className='label-bold-small-big' htmlFor="fgColor">Foreground Color:</label>
                            <div className="color-picker-wrappers">
                                <input
                                    type="color"
                                    value={qrSettings.fgColor}
                                    onChange={(e) => updateQrSettings({ fgColor: e.target.value })}
                                />
                                {qrSettings.fgColor && <p>{qrSettings.fgColor}</p>}
                            </div>
                        </div>
                        <div className="color-picker-container">
                            <label className='label-bold-small-big' htmlFor="bgColor">Background Color:</label>
                            <div className="color-picker-wrappers">

                                <input
                                    type="color"
                                    value={qrSettings.bgColor}
                                    onChange={(e) => updateQrSettings({ bgColor: e.target.value })}
                                />
                                {qrSettings.bgColor && <p>{qrSettings.bgColor}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {activeSection === 'settings' && (
                <div className="qr-design-customization">

                    <div className="settings-row">
                        <div className="input-group">
                            <label>Correction Level:</label>
                            <select
                                value={qrSettings.ecLevel}
                                onChange={(e) => updateQrSettings({ ecLevel: e.target.value })}
                            >
                                <option value="L">L</option>
                                <option value="M">M</option>
                                <option value="Q">Q</option>
                                <option value="H">H</option>
                            </select>
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="input-group">
                            <label>Logo Width:</label>
                            <input
                                type="number"
                                value={qrSettings.logoWidth}
                                min="30"
                                max="50"
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (value >= 30 && value <= 50) {
                                        updateQrSettings({ logoWidth: value });
                                    }
                                }}
                            />
                        </div>
                        <div className="input-group">
                            <label>Logo Height:</label>
                            <input
                                type="number"
                                value={qrSettings.logoHeight}
                                min="30"
                                max="65"
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (value >= 30 && value <= 50) {
                                        updateQrSettings({ logoHeight: value });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="input-group">
                            <label>Logo Opacity:</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={qrSettings.logoOpacity}
                                onChange={(e) => updateQrSettings({ logoOpacity: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="input-group">
                            <label>Logo Padding:</label>
                            <input
                                type="number"
                                value={qrSettings.logoPadding}
                                min="0"
                                max="10"
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (value >= 0 && value <= 10) {
                                        updateQrSettings({ logoPadding: value });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="input-group">
                            <label>Logo Padding Style:</label>
                            <select
                                value={qrSettings.logoPaddingStyle}
                                onChange={(e) => updateQrSettings({ logoPaddingStyle: e.target.value })}
                            >
                                <option value="solid">Solid</option>
                                <option value="circle">Circle</option>
                                <option value="">None</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
            

        </div>
    );
};

export default QRCodeGenerator;
