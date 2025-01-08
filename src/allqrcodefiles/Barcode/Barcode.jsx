import Barcode from 'react-barcode';
import React, { useState, useRef } from 'react';
import { useGlobalLocal } from '../../allqrcodeCustomizations/globallocalqr/GlobalLocalQr';
import './Barcode.css'

const BarcodeGenerator = () => {
    const { handleDownload1 } = useGlobalLocal();
    const user_id = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage
    const [gtin, setGtin] = useState('');
    const [barcodeFormat, setBarcodeFormat] = useState('EAN13');
    const [barcodeGenerated, setBarcodeGenerated] = useState(false);
    const [barcodeStyle, setBarcodeStyle] = useState({
        width: 2,
        height: 80,
        lineColor: '#000',
        background: '#fff',
        margin: 10,
        quietZone: 1,
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 5,
        font: 'monospace',
        fontOptions: 'bold',
        fontSize: 14,

    });
    const ref = useRef(null);

    console.log(barcodeStyle)
    // Define the length of valid GTINs for different barcode formats
    const barcodeLengthLimits = {
        EAN13: 12,
        UPC: 11,
        EAN8: 7,
        CODE128: 127,  // No fixed length
        CODE39: 38,    // No fixed length
        ITF14: 13,
        CODABAR: 15,   // Example length
    };

    const handleChange = (e) => {
        // Get the GTIN value and trim it to the barcode length limit
        const newGtin = e.target.value.slice(0, barcodeLengthLimits[barcodeFormat]);
        setGtin(newGtin);
    };

    const handleFormatChange = (e) => {
        setBarcodeFormat(e.target.value);
        setGtin(''); // Reset GTIN when barcode format is changed
    };
    console.log('gtin', JSON.stringify({ gtin, user_id, format: barcodeFormat }))
    const handleGenerateBarcode = async () => {
        if (gtin && gtin.length === barcodeLengthLimits[barcodeFormat]) {
            try {
                const data = JSON.stringify({ gtin, user_id, format: barcodeFormat })
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/local-setup/barcode`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: data,
                });

                if (response.status === 200) {
                    setBarcodeGenerated(true);
                    console.log('Barcode saved successfully!');
                } else {
                    console.error('Failed to save barcode');
                }
            } catch (error) {
                console.error('Error saving barcode:', error);
            }
        } else {
            console.error(`Invalid GTIN length for ${barcodeFormat}`);
        }
    };

    const handleStyle = (e) => {
        const { name, value } = e.target;
        setBarcodeStyle((prev) => ({
            ...prev,
            [name]: name === 'width' || name === 'height' || name === 'margin' || name === 'quietZone' || name === 'textMargin' || name === 'fontSize'
                ? parseInt(value, 10)
                : value,
        }));
    };
    return (
        <div className='flex-group'>
            <div className='wifi-container'>
                <div style={{marginBottom:'20px',padding:'10px 0px', borderBottom:'2px solid #6318ff'}}>
                    <h1>Enter GTIN to generate barcode</h1>
                    <input
                        type="text"
                        value={gtin}
                        onChange={handleChange}
                        placeholder="Enter GTIN"
                        maxLength={barcodeLengthLimits[barcodeFormat]} // Limit input length based on barcode format
                    />

                    {/* Barcode format dropdown */}
                    <div style={{ marginTop: '10px' }}>
                        <label>Select Barcode Format:</label>
                        <select value={barcodeFormat} onChange={handleFormatChange}>
                            <option value="EAN13">EAN13</option>
                            <option value="UPC">UPC</option>
                            <option value="EAN8">EAN8</option>
                            <option value="CODE128">CODE128</option>
                            <option value="CODE39">CODE39</option>
                            <option value="ITF14">ITF14</option>
                            <option value="CODABAR">CODABAR</option>
                        </select>
                    </div>

                   <div style={{marginTop:'10px', display:'flex', alignItems:'center' , justifyContent:'center' }}>
                   <button className="button-57" style={{ width: '20%'}} 
                     onClick={handleGenerateBarcode} role="button">
                <span className="text"> Generate Barcode</span>
                <span> Generate Barcode</span>
              </button>
                   </div>

                </div>
                <div className="design-barcode" style={{ display: 'flex', gap: '40px' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className='flex-div-inner'>
                            <div>
                                <label>Line Color:</label>
                                <input
                                    type="color"
                                    name="lineColor"
                                    value={barcodeStyle.lineColor}
                                    onChange={handleStyle}
                                />
                            </div>
                            <div>
                                <label>Background Color:</label>
                                <input
                                    type="color"
                                    name="background"
                                    value={barcodeStyle.background}
                                    onChange={handleStyle}
                                />
                            </div>

                            <div>
                                <label>Display Value:</label>
                                <br />
                                <label class="switches">
                                    <input type="checkbox"
                                        name="displayValue"
                                        checked={barcodeStyle.displayValue}
                                        onChange={(e) => handleStyle({ target: { name: 'displayValue', value: e.target.checked } })}
                                    />
                                    <span class="slideresds"></span>
                                </label>
                            </div>
                        </div>
                        <div className='flex-div-inner'>
                            <div>
                                <label>Line Width:</label>
                                <input
                                    type="range"
                                    name="width"
                                    min="1"
                                    max="4"
                                    value={barcodeStyle.width}
                                    onChange={handleStyle}
                                />
                            </div>
                            <div>
                                <label>Line Height:</label>
                                <input
                                    type="range"
                                    name="height"
                                    min="60"
                                    max="100"
                                    value={barcodeStyle.height}
                                    onChange={handleStyle}
                                />

                            </div>
                            <div>
                                <label>Quiet Zone:</label>
                                <input
                                    type="range"
                                    name="quietZone"
                                    min="0"
                                    max="50"
                                    value={barcodeStyle.quietZone}
                                    onChange={handleStyle}
                                />
                            </div>
                        </div>
                        <div className='flex-div-inner'>
                            <div>
                                <label>Text Align:</label>
                                <select
                                    name="textAlign"
                                    value={barcodeStyle.textAlign}
                                    onChange={handleStyle}
                                >
                                    <option value="center">Center</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                            <div>
                                <label>Text Position:</label>
                                <select
                                    name="textPosition"
                                    value={barcodeStyle.textPosition}
                                    onChange={handleStyle}
                                >
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                            </div>
                            <div>
                                <label>Font:</label>
                                <select
                                    name="font"
                                    value={barcodeStyle.font}
                                    onChange={handleStyle}
                                >
                                    <option value="monospace">Monospace</option>
                                    <option value="serif">Serif</option>
                                    <option value="sans-serif">Sans-serif</option>
                                </select>
                            </div>
                        </div>
                        <div className='flex-div-inner'>
                        <div>
                                <label>Font Options:</label>
                                <select
                                    name="fontOptions"
                                    value={barcodeStyle.fontOptions}
                                    onChange={handleStyle}
                                >
                                    <option value="bold">Bold</option>
                                    <option value="italic">Italic</option>
                                    <option value="bold italic">Bold Italic</option>
                                    <option value="">None</option>
                                </select>
                            </div>
                            <div>
                                <label>Text Margin:</label>
                                <input
                                    type="range"
                                    name="textMargin"
                                    min="0"
                                    max="20"
                                    value={barcodeStyle.textMargin}
                                    onChange={handleStyle}
                                />
                            </div>
                            <div>
                                <label>Font Size:</label>
                                <input
                                    type="range"
                                    name="fontSize"
                                    min="8"
                                    max="30"
                                    value={barcodeStyle.fontSize}
                                    onChange={handleStyle}
                                />
                            </div>
                        </div>
                        <div className='flex-div-inner'>
                            <div>
                            <label>Flat Rendering:</label> <br />
                            <label class="switches">
                                    <input type="checkbox"
                                         name="flat"
                                         checked={barcodeStyle.flat}
                                         onChange={(e) => handleStyle({ target: { name: 'flat', value: e.target.checked } })}
                                     />
                                    <span class="slideresds"></span>
                                </label>
                            </div>
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
                        </div>
                    </div>

                </div>
            </div>

            <div className="display-mobile">
                <div className="display-image-container" style={{ overflowX: 'auto' }}>
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        {/* Display Barcode */}
                        {barcodeGenerated && (
                            <div
                                ref={ref}>
                                <Barcode value={gtin} format={barcodeFormat}
                                    width={barcodeStyle.width} // Line thickness
                                    height={barcodeStyle.height} // Line height
                                    lineColor={barcodeStyle.lineColor} // Color of the barcode lines
                                    background={barcodeStyle.background} // Background color of the barcode
                                    margin={barcodeStyle.quietZone} // Quiet zone (space around the barcode)
                                    displayValue={barcodeStyle.displayValue} // Display the value below the barcode
                                    textAlign={barcodeStyle.textAlign} // Align the text below the barcode
                                    textPosition={barcodeStyle.textPosition} // Position of the text relative to the barcode
                                    textMargin={barcodeStyle.textMargin} // Margin between the barcode and the text
                                    font={barcodeStyle.font} // Font family for the text
                                    fontOptions={barcodeStyle.fontOptions} // Font options: 'bold', 'italic', etc.
                                    fontSize={barcodeStyle.fontSize} // Font size of the text
                                    flat={barcodeStyle.flat} // For rendering with better performance (flat: true)
                                />
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
    );
};

export default BarcodeGenerator;
