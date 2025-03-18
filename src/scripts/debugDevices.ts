import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const extractDevicesData = async () => {
  try {
    console.log('Starting to extract devices data...');
    
    // Get all documents from devices collection
    const devicesSnapshot = await getDocs(collection(db, 'devices'));
    
    // Convert to array of objects
    const devices = devicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Log the data in a formatted way
    console.log('\n=== DEVICES DATA ===');
    console.log(`Total devices found: ${devices.length}`);
    console.log('\nDevices:');
    devices.forEach((device, index) => {
      console.log(`\n[Device ${index + 1}]`);
      console.log('ID:', device.id);
      console.log('Name:', device.deviceName);
      console.log('Type:', device.deviceType);
      console.log('Link Code:', device.linkCode);
      console.log('Hub Code:', device.hubCode);
      console.log('On:', device.on);
      console.log('Pinned:', device.pinned);
      console.log('-------------------');
    });
    
    // Also save to a JSON file (for browser download)
    const jsonString = JSON.stringify(devices, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devices_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('\nData has been downloaded as JSON file.');
    
  } catch (error) {
    console.error('Error extracting devices data:', error);
  }
};

// Function to run the extraction
const runDebug = () => {
  console.log('Running devices data extraction...');
  extractDevicesData();
};

// Add a button to the page to trigger the extraction
const addDebugButton = () => {
  const button = document.createElement('button');
  button.textContent = 'Extract Devices Data';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    z-index: 9999;
    font-family: Arial, sans-serif;
  `;
  button.onclick = runDebug;
  document.body.appendChild(button);
};

// Run when the script is loaded
addDebugButton(); 