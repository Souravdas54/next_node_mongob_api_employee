// components/ConnectionTest.js
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ConnectionTest = () => {
    const [status, setStatus] = useState('Testing connection...');
    const [isOnline, setIsOnline] = useState(false);
    const [detectedPort, setDetectedPort] = useState(null);

    useEffect(() => {
        const testConnection = async () => {
            const commonPorts = [8500, 5000, 8000, 3001, 8080];
            const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8500/api';

            setStatus(`Testing connection to ${baseURL}...`);

            try {
                // Test the configured URL first
                await axios.get(baseURL.replace('/api'), { timeout: 5000 });
                setStatus('✅ Connected to backend successfully!');
                setIsOnline(true);
                setDetectedPort(new URL(baseURL).port);
                return;
            } catch (error) {
                console.log(`Failed to connect to ${baseURL}`);
            }

            // If configured URL fails, try common ports
            for (const port of commonPorts) {
                try {
                    setStatus(`Trying port ${port}...`);
                    const testURL = `http://localhost:${port}/api`;
                    await axios.get(testURL, { timeout: 3000 });
                    setStatus(`✅ Connected to backend on port ${port}!`);
                    setIsOnline(true);
                    setDetectedPort(port);

                    // Update environment suggestion
                    console.log(`Backend detected on port ${port}. Update your .env.local with:`);
                    console.log(`NEXT_PUBLIC_API_URL=http://localhost:${port}/api`);
                    return;
                } catch (error) {
                    console.log(`Port ${port} not available`);
                }
            }

            setStatus('❌ Cannot connect to backend on any common port (8500, 5000, 8000, 3001, 8080). Make sure your backend server is running.');
            setIsOnline(false);
        };

        testConnection();
    }, []);

    return (
        <div style={{
            padding: '15px',
            margin: '15px 0',
            backgroundColor: isOnline ? '#e8f5e9' : '#ffebee',
            border: `2px solid ${isOnline ? '#4caf50' : '#f44336'}`,
            borderRadius: '8px',
            fontSize: '14px'
        }}>
            <strong>Backend Connection:</strong> {status}
            <br />
            {detectedPort && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                    <strong>Detected backend on port: {detectedPort}</strong>
                    <br />
                    <small>Add this to your .env.local file:</small>
                    <br />
                    <code>NEXT_PUBLIC_API_URL=http://localhost:{detectedPort}/api</code>
                </div>
            )}
            {!isOnline && (
                <div style={{ marginTop: '10px' }}>
                    <strong>Troubleshooting steps:</strong>
                    <ol style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Make sure your backend server is running</li>
                        <li>Check which port your backend is using</li>
                        <li>Update the .env.local file with the correct port</li>
                        <li>Restart your frontend development server</li>
                    </ol>
                </div>
            )}
        </div>
    );
};

export default ConnectionTest;