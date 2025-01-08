// SendEmailBroadcast.js (Frontend - React)

import React, { useState } from 'react';
import axios from 'axios';

const SendEmailBroadcast = () => {
    const [tag, setTag] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setStatus('Sending...');

            // Send POST request to the backend to trigger the email broadcast
            const response = await axios.post('http://localhost:5000/user/send-broadcast', {
                tag: tag,
                subject: subject,
                body: body
            });

            if (response.status === 200) {
                setStatus('Email broadcast sent successfully');
            } else {
                setStatus('Failed to send broadcast');
            }
        } catch (error) {
            setStatus('Error sending email broadcast');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Send Email Broadcast</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tag (e.g., DONORS): </label>
                    <input 
                        type="text" 
                        value={tag}
                        onChange={(e) => setTag(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Subject: </label>
                    <input 
                        type="text" 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Body: </label>
                    <textarea 
                        value={body}
                        onChange={(e) => setBody(e.target.value)} 
                        required
                    />
                </div>
                <button type="submit">Send Broadcast</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
};

export default SendEmailBroadcast;