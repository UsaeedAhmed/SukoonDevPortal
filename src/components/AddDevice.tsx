import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Toast from './Toast';

const DEVICE_TYPES = [
  { id: 'ac', name: 'Air Conditioner', icon: '❄️' },
  { id: 'dishwasher', name: 'Dishwasher', icon: '🧼' },
  { id: 'fan', name: 'Fan', icon: '🌀' },
  { id: 'heatconvector', name: 'Heat Convector', icon: '🔥' },
  { id: 'light', name: 'Light', icon: '💡' },
  { id: 'smartdoor', name: 'Smart Door', icon: '🚪' },
  { id: 'speaker', name: 'Speaker', icon: '🔊' },
  { id: 'thermostat', name: 'Thermostat', icon: '🌡️' },
  { id: 'tv', name: 'TV', icon: '📺' },
  { id: 'washingmachine', name: 'Washing Machine', icon: '👕' }
];

interface Device {
  id: string;
  name: string;
  icon: string;
}

const AddDevice = () => {
  const [deviceName, setDeviceName] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [deviceCreated, setDeviceCreated] = useState(false);
  const [deviceData, setDeviceData] = useState<{ name: string; type: string; linkCode: string } | null>(null);
  const [showToast, setShowToast] = useState(false);

  const generateLinkCode = async () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 5;
    const maxAttempts = 100; // Prevent infinite loops
    let attempts = 0;

    try {
      // Fetch all existing link codes once
      const devicesRef = collection(db, 'devices');
      const querySnapshot = await getDocs(devicesRef);

      // Store existing codes in a Set for fast lookups
      const existingCodes = new Set();
      querySnapshot.forEach(doc => {
        const linkCode = doc.data().linkCode;
        if (linkCode) existingCodes.add(linkCode);
      });

      console.log(`Found ${existingCodes.size} existing link codes`);

      // Generate a new unique code
      let code;
      do {
        attempts++;
        code = Array.from({ length: codeLength }, () =>
          chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('');

        if (attempts >= maxAttempts) {
          throw new Error(`Failed to generate unique code after ${maxAttempts} attempts. Please try again.`);
        }
      } while (existingCodes.has(code));

      console.log(`Generated unique code after ${attempts} attempts`);
      return code;

    } catch (error) {
      console.error('Error generating link code:', error);
      throw new Error('Failed to generate link code. Please try again.');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName || !selectedType) return;
    
    setLoading(true);
    try {
      const linkCode = await generateLinkCode();
      
      // Initialize device-specific fields based on type
      const deviceSpecificFields = {
        ac: {
          temp: '',
          windMode: '',
          autoMode: ''
        },
        dishwasher: {
          length: '',
          soap: false,
          waterTemp: ''
        },
        fan: {
          rpm: ''
        },
        heatconvector: {
          temp: ''
        },
        light: {
          brightness: '',
          brightnessMode: ''
        },
        smartdoor: {
          locked: false
        },
        speaker: {
          volume: ''
        },
        thermostat: {
          temp: '',
          autoMode: ''
        },
        tv: {
          volume: '',
          brightness: ''
        },
        washingmachine: {
          length: '',
          soap: false,
          waterTemp: ''
        }
      };

      const deviceData = {
        deviceName,
        deviceType: selectedType,
        linkCode,
        hubCode: '',
        on: false,
        pinned: false,
        ...deviceSpecificFields[selectedType as keyof typeof deviceSpecificFields]
      };

      const docRef = await addDoc(collection(db, 'devices'), deviceData);
      
      setDeviceData({
        name: deviceName,
        type: DEVICE_TYPES.find(d => d.id === selectedType)?.name || selectedType,
        linkCode
      });
      setDeviceCreated(true);
    } catch (err) {
      console.error('Failed to create device:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDeviceCreated(false);
    setDeviceData(null);
    setDeviceName('');
    setSelectedType('');
  };

  if (deviceCreated) {
    return (
      <DeviceContainer>
        <SuccessContainer>
          <div className="success-info">
            <h3>Device Created Successfully</h3>
            <p><strong>Name:</strong> {deviceData?.name}</p>
            <p><strong>Type:</strong> {deviceData?.type}</p>
            <p>
              <strong>Link Code:</strong>{' '}
              <CodeButton onClick={() => copyToClipboard(deviceData?.linkCode || '')}>
                <Code>{deviceData?.linkCode}</Code>
              </CodeButton>
            </p>
          </div>
          
          <button className="reset-button" onClick={resetForm}>
            Create Another Device
          </button>
        </SuccessContainer>
        
        <BackButton to="/">Back to Home</BackButton>
        <Toast message="Copied to clipboard!" isVisible={showToast} />
      </DeviceContainer>
    );
  }

  return (
    <DeviceContainer>
      <h1>Add Device</h1>
      <p>Create a new device</p>
      
      <DeviceForm onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deviceName">Device Name</label>
          <input
            type="text"
            id="deviceName"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            required
            placeholder="Enter device name"
          />
        </div>
        
        <div className="form-group">
          <label>Device Type</label>
          <DeviceGrid>
            {DEVICE_TYPES.map(device => (
              <DeviceTypeButton
                key={device.id}
                type="button"
                selected={selectedType === device.id}
                onClick={() => setSelectedType(device.id)}
              >
                <div className="icon">{device.icon}</div>
                <span>{device.name}</span>
              </DeviceTypeButton>
            ))}
          </DeviceGrid>
        </div>
        
        <button type="submit" disabled={loading || !deviceName || !selectedType}>
          {loading ? 'Creating...' : 'Create Device'}
        </button>
      </DeviceForm>
      
      <BackButton to="/">Back to Home</BackButton>
      <Toast message="Copied to clipboard!" isVisible={showToast} />
    </DeviceContainer>
  );
};

const DeviceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }
  
  p {
    color: #d3d3d3;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
`;

const DeviceForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  background: #2a2b38;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  .form-group {
    margin-bottom: 2rem;
    
    label {
      display: block;
      margin-bottom: 0.75rem;
      color: #ffeba7;
      font-size: 1.1rem;
      font-weight: 500;
    }
    
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.875rem;
      border: 2px solid #3a3b4a;
      border-radius: 8px;
      background: #1a1b24;
      color: #fff;
      font-size: 1rem;
      
      &:focus {
        outline: none;
        border-color: #ffeba7;
      }
    }
  }
  
  button {
    background: #ffeba7;
    color: #2a2b38;
    border: none;
    padding: 0.875rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: all 0.3s ease;
    margin-top: 1rem;
    
    &:hover {
      background: #ffe07a;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background: #3a3b4a;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const DeviceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const DeviceTypeButton = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${props => props.selected ? '#ffeba7' : '#1a1b24'};
  color: ${props => props.selected ? '#2a2b38' : '#fff'};
  border: 2px solid ${props => props.selected ? '#ffeba7' : '#3a3b4a'};
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
  min-height: 120px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.selected ? 'rgba(255, 235, 167, 0.1)' : 'transparent'};
    border-radius: 10px;
    z-index: 0;
  }
  
  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    position: relative;
    z-index: 1;
  }
  
  span {
    font-size: 0.875rem;
    text-align: center;
    font-weight: ${props => props.selected ? '600' : '400'};
    position: relative;
    z-index: 1;
    line-height: 1.3;
    padding: 0 0.5rem;
  }

  ${props => props.selected && `
    &::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 1rem;
      color: #2a2b38;
    }
  `}
`;

const SuccessContainer = styled.div`
  background: #2a2b38;
  padding: 2.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  .success-info {
    margin-bottom: 2rem;
    
    h3 {
      color: #ffeba7;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }
    
    p {
      color: #d3d3d3;
      margin: 0.75rem 0;
      font-size: 1.1rem;
    }
  }
  
  .reset-button {
    background: #ffeba7;
    color: #2a2b38;
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      background: #ffe07a;
      transform: translateY(-1px);
    }
  }
`;

const Code = styled.span`
  background: #1a1b24;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: monospace;
  color: #ffeba7;
  transition: all 0.2s ease;
  font-size: 1rem;
  border: 1px solid #3a3b4a;
`;

const CodeButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  
  &:hover span {
    background: #2a2b38;
    border-color: #ffeba7;
  }
`;

const BackButton = styled(Link)`
  background-color: transparent;
  border: 2px solid #ffeba7;
  color: #ffeba7;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 1rem;
  
  &:hover {
    background-color: #ffeba7;
    color: #2a2b38;
    transform: translateY(-1px);
  }
`;

export default AddDevice; 
