import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import styled from 'styled-components';
import Toast from './Toast';

interface Item {
  id: string;
  name: string;
  type: string;
  linkCode: string;
}

const AvailableItems = () => {
  const [availableHubs, setAvailableHubs] = useState<Item[]>([]);
  const [availableDevices, setAvailableDevices] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchAvailableItems();
  }, []);

  const fetchAvailableItems = async () => {
    try {
      // Fetch unlinked hubs (null userId)
      const nullHubsQuery = query(
        collection(db, 'userHubs'),
        where('userId', '==', null)
      );
      const nullHubsSnapshot = await getDocs(nullHubsQuery);
      const nullHubs = nullHubsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().homeName,
        type: doc.data().homeType,
        linkCode: doc.data().hubCode
      }));

      // Fetch unlinked hubs (empty userId)
      const emptyHubsQuery = query(
        collection(db, 'userHubs'),
        where('userId', '==', '')
      );
      const emptyHubsSnapshot = await getDocs(emptyHubsQuery);
      const emptyHubs = emptyHubsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().homeName,
        type: doc.data().homeType,
        linkCode: doc.data().hubCode
      }));

      // Combine both hub results
      setAvailableHubs([...nullHubs, ...emptyHubs]);

      // Fetch unlinked devices (null hubCode)
      const nullDevicesQuery = query(
        collection(db, 'devices'),
        where('hubCode', '==', null)
      );
      const nullDevicesSnapshot = await getDocs(nullDevicesQuery);
      const nullDevices = nullDevicesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().deviceName,
        type: doc.data().deviceType,
        linkCode: doc.data().linkCode
      }));

      // Fetch unlinked devices (empty hubCode)
      const emptyDevicesQuery = query(
        collection(db, 'devices'),
        where('hubCode', '==', '')
      );
      const emptyDevicesSnapshot = await getDocs(emptyDevicesQuery);
      const emptyDevices = emptyDevicesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().deviceName,
        type: doc.data().deviceType,
        linkCode: doc.data().linkCode
      }));

      // Combine both device results
      setAvailableDevices([...nullDevices, ...emptyDevices]);
    } catch (error) {
      console.error('Error fetching available items:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAvailableItems();
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

  const handleDelete = async (id: string, type: 'hub' | 'device') => {
    try {
      const collectionRef = type === 'hub' ? 'userHubs' : 'devices';
      await deleteDoc(doc(db, collectionRef, id));
      if (type === 'hub') {
        setAvailableHubs(prev => prev.filter(hub => hub.id !== id));
      } else {
        setAvailableDevices(prev => prev.filter(device => device.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return <LoadingText>Loading available items...</LoadingText>;
  }

  return (
    <Container>
      <HeaderContainer>
        <h2>Available Items</h2>
        <RefreshButton onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </RefreshButton>
      </HeaderContainer>
      
      <GridLayout>
        <Section>
          <h2>Hubs</h2>
          <ItemGrid>
            {availableHubs.map(hub => (
              <ItemCard key={hub.id}>
                <ItemInfo>
                  <h3>{hub.name}</h3>
                  <p>Type: {hub.type}</p>
                  <p>
                    Link Code:{' '}
                    <CodeButton onClick={() => copyToClipboard(hub.linkCode)}>
                      <Code>{hub.linkCode}</Code>
                    </CodeButton>
                  </p>
                </ItemInfo>
                <DeleteButton onClick={() => handleDelete(hub.id, 'hub')}>
                  Delete
                </DeleteButton>
              </ItemCard>
            ))}
          </ItemGrid>
        </Section>

        <Section>
          <h2>Devices</h2>
          <ItemGrid>
            {availableDevices.map(device => (
              <ItemCard key={device.id}>
                <ItemInfo>
                  <h3>{device.name}</h3>
                  <p>Type: {device.type}</p>
                  <p>
                    Link Code:{' '}
                    <CodeButton onClick={() => copyToClipboard(device.linkCode)}>
                      <Code>{device.linkCode}</Code>
                    </CodeButton>
                  </p>
                </ItemInfo>
                <DeleteButton onClick={() => handleDelete(device.id, 'device')}>
                  Delete
                </DeleteButton>
              </ItemCard>
            ))}
          </ItemGrid>
        </Section>
      </GridLayout>
      <Toast message="Copied to clipboard!" isVisible={showToast} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    color: #ffeba7;
    margin: 0;
  }
`;

const RefreshButton = styled.button`
  background: #ffeba7;
  color: #2a2b38;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #ffe07a;
    transform: translateY(-1px);
    color: #2a2b38;
  }
  
  &:disabled {
    background: #3a3b4a;
    cursor: not-allowed;
    transform: none;
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  h2 {
    color: #ffeba7;
    margin-bottom: 1rem;
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const ItemCard = styled.div`
  background: #2a2b38;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemInfo = styled.div`
  h3 {
    color: #ffeba7;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #d3d3d3;
    margin: 0.25rem 0;
  }
`;

const Code = styled.span`
  background: #1a1b24;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  color: #ffeba7;
  transition: background-color 0.2s ease;
`;

const CodeButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover span {
    background: #2a2b38;
  }
`;

const DeleteButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #ff5252;
  }
`;

const LoadingText = styled.p`
  color: #d3d3d3;
  text-align: center;
  margin: 2rem 0;
`;

export default AvailableItems;