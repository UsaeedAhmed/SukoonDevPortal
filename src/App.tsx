import { useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import AddDevice from './components/AddDevice';
import AddHub from './components/AddHub';
import DeviceDetails from './components/DeviceDetails';
import './App.css';

// Import debug scripts only in development mode
// if (process.env.NODE_ENV === 'development') {
//   import('./scripts');
// }

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // If no user is logged in, show the login page
  if (!user) {
    return <LoginForm />;
  }

  // Main app content when authenticated
  return (
    <Router>
      <AppContainer>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/add-device" element={<AddDevice />} />
            <Route path="/add-hub" element={<AddHub />} />
            <Route path="/device/:id" element={<DeviceDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </AppContainer>
    </Router>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  
  .main-content {
    padding-top: 5rem;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export default App;
