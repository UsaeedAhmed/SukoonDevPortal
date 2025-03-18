import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';

// Mock data for devices
const mockDevices = [
  { id: 1, name: 'Smart Thermostat', category: 'Climate Control', image: '🌡️' },
  { id: 2, name: 'Security Camera', category: 'Security', image: '📹' },
  { id: 3, name: 'Smart Lock', category: 'Security', image: '🔒' },
  { id: 4, name: 'Light Bulb', category: 'Lighting', image: '💡' },
  { id: 5, name: 'Smart Speaker', category: 'Audio', image: '🔊' },
  { id: 6, name: 'Motion Sensor', category: 'Sensors', image: '👁️' },
  { id: 7, name: 'Smart Plug', category: 'Power', image: '🔌' },
  { id: 8, name: 'Other Device', category: 'Uncategorized', image: '📱' },
];

interface Device {
  id: number;
  name: string;
  category: string;
  image: string;
}

const DeviceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Find device from mock data
    const deviceId = parseInt(id || '0');
    const foundDevice = mockDevices.find(d => d.id === deviceId);
    
    if (foundDevice) {
      setDevice(foundDevice);
      setLoading(false);
    } else {
      setError('Device not found');
      setLoading(false);
    }
  }, [id]);

  const generateQRCode = async () => {
    if (!device) return;
    
    setQrLoading(true);
    
    // Simulate API call to generate QR code
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/devices/${id}/qr`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // const data = await response.json();
      
      // Simulate API response
      setTimeout(() => {
        // Mock JWT token with actual device data
        const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZCI6IiR7aWR9IiwiZGV2aWNlTmFtZSI6IiR7ZGV2aWNlLm5hbWV9IiwiY2F0ZWdvcnkiOiIke2RldmljZS5jYXRlZ29yeX0iLCJpYXQiOjE2MTY3NjY0MDB9`;
        setQrData(mockJwt);
        setQrLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to generate QR code', err);
      setQrLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrData || !qrRef.current) return;
    
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match SVG
    const svgRect = svgElement.getBoundingClientRect();
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
    
    // Create an image from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Draw the image on the canvas
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Convert canvas to PNG
      const pngUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${device?.name.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Clean up
      URL.revokeObjectURL(svgUrl);
    };
    
    img.src = svgUrl;
  };

  const printQRCode = () => {
    if (!qrData || !qrRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Device QR Code - ${device?.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .qr-container {
              margin: 30px auto;
            }
            h1 {
              color: #333;
            }
            .device-info {
              margin: 20px 0;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <h1>${device?.name} QR Code</h1>
          <div class="device-info">
            <p><strong>Category:</strong> ${device?.category}</p>
            <p><strong>Device ID:</strong> ${id}</p>
          </div>
          <div class="qr-container">
            ${svgData}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-spinner"></div>
        <p>Loading device details...</p>
      </LoadingContainer>
    );
  }

  if (error || !device) {
    return (
      <ErrorContainer>
        <p>{error || 'Device not found'}</p>
        <BackButton to="/add-device">Back to Devices</BackButton>
      </ErrorContainer>
    );
  }

  return (
    <DeviceContainer>
      <h1>Device Details</h1>
      
      <DeviceCard>
        <div className="device-icon">{device.image}</div>
        <h2>{device.name}</h2>
        <p className="category">{device.category}</p>
      </DeviceCard>
      
      {!qrData ? (
        <button 
          className="generate-button" 
          onClick={generateQRCode}
          disabled={qrLoading}
        >
          {qrLoading ? 'Generating...' : 'Generate QR Code'}
        </button>
      ) : (
        <QRCodeContainer>
          <div className="qr-info">
            <h3>QR Code Generated</h3>
            <p><strong>Device:</strong> {device.name}</p>
            <p><strong>Category:</strong> {device.category}</p>
            <p><strong>ID:</strong> {id}</p>
          </div>
          
          <div className="qr-code" ref={qrRef}>
            <QRCodeSVG 
              value={qrData} 
              size={200} 
              bgColor="#FFFFFF" 
              fgColor="#000000" 
              level="H" 
              includeMargin={true}
            />
          </div>
          
          <div className="qr-actions">
            <button className="action-button" onClick={downloadQRCode}>
              Download QR Code
            </button>
            <button className="action-button" onClick={printQRCode}>
              Print QR Code
            </button>
          </div>
          
          <button className="reset-button" onClick={() => setQrData(null)}>
            Generate New QR Code
          </button>
        </QRCodeContainer>
      )}
      
      <NavigationButtons>
        <BackButton to="/add-device">Back to Devices</BackButton>
        <BackButton to="/">Home</BackButton>
      </NavigationButtons>
    </DeviceContainer>
  );
};

const DeviceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  
  h1 {
    margin-bottom: 2rem;
  }
  
  .generate-button {
    margin: 2rem 0;
    padding: 0.8rem 1.5rem;
    background-color: #ffeba7;
    color: #2a2b38;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background-color: #5e6681;
      color: #ffeba7;
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
`;

const DeviceCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #2a2b38;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  
  .device-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    color: #ffeba7;
    margin: 0 0 0.5rem 0;
  }
  
  .category {
    color: #d3d3d3;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #2a2b38;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 400px;
  
  .qr-code {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    padding: 10px;
    border-radius: 8px;
  }
  
  .qr-info {
    width: 100%;
    margin-bottom: 1.5rem;
    
    h3 {
      color: #ffeba7;
      margin-bottom: 1rem;
    }
    
    p {
      color: #d3d3d3;
      text-align: left;
      margin: 0.5rem 0;
    }
  }
  
  .qr-actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
    
    .action-button {
      background-color: #3f4156;
      color: #fff;
      border: none;
      padding: 0.6rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #4a4c6a;
      }
    }
  }
  
  .reset-button {
    background-color: transparent;
    border: 1px solid #ffeba7;
    color: #ffeba7;
    padding: 0.6rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #ffeba7;
      color: #2a2b38;
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const BackButton = styled(Link)`
  background-color: transparent;
  border: 1px solid #ffeba7;
  color: #ffeba7;
  padding: 0.6em 1.2em;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ffeba7;
    color: #2a2b38;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  
  p {
    margin-top: 1rem;
    color: #d3d3d3;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  
  p {
    color: #ff6b6b;
    margin-bottom: 1rem;
  }
`;

export default DeviceDetails; 