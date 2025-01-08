import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const VcardShowqrData = () => {
    const { id } = useParams(); // Get the vCard ID from the URL
    const [vCardData, setVCardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the vCard data when the component mounts
    useEffect(() => {
        const fetchVCardData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/dyn-qr/vcard/${id}`);
                setVCardData(response.data); // Store the data in state
                setLoading(false); // Set loading to false once the data is fetched
            } catch (err) {
                setError('Error fetching vCard data');
                setLoading(false);
            }
        };
    
        fetchVCardData(); // Trigger API call only once when the component mounts
    }, [id]); // Depend on `id` (URL parameter), not on other state or props
    
    // Function to generate vCard .vcf file and trigger download
    const generateVCardFile = () => {
        const { v_card_name, v_card_email, v_card_phone_number, v_card_address, v_card_image } = vCardData;

        // Ensure the image URL from Cloudinary is properly formatted (encode URL if needed)
        const encodedImageUrl = encodeURI(v_card_image); // Encode the URL to handle special characters

        // Create vCard format
        const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${v_card_name}
EMAIL:${v_card_email}
TEL:${v_card_phone_number}
ADR:${v_card_address}
PHOTO;VALUE=URI:${encodedImageUrl}  // Image URL reference
END:VCARD`;

        // Create a Blob with vCard data
        const blob = new Blob([vCardContent], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        
        // Create an anchor tag to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${v_card_name.replace(' ', '_')}_contact.vcf`; // Name the file with the vCard name
        link.click(); // Trigger download
        URL.revokeObjectURL(url); // Revoke the object URL after download
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {vCardData ? (
                <div>
                    <h2>{vCardData.v_card_name}</h2>
                    <img 
                        src={vCardData.v_card_image} 
                        alt={vCardData.v_card_name} 
                        style={{ width: '100px', height: '100px' }} 
                    />
                    <p>Email: {vCardData.v_card_email}</p>
                    <p>Phone: {vCardData.v_card_phone_number}</p>
                    <p>Address: {vCardData.v_card_address}</p>
                    <p>Scans: {vCardData.scan_count}</p>

                    {/* Button to save contact to vCard file */}
                    <button onClick={generateVCardFile}>Save Contact</button>
                </div>
            ) : (
                <div>No vCard found</div>
            )}
        </div>
    );
};

export default VcardShowqrData;
