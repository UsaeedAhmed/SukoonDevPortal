import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <StyledHeader>
      <div className="header-content">
        <h2>Dev Portal</h2>
        {user && (
          <div className="user-section">
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  background-color: #2a2b38;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  h2 {
    color: #ffeba7;
    margin: 0;
    font-size: 1.5rem;
  }

  .user-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-email {
    color: #d3d3d3;
    font-size: 0.9rem;
  }

  .logout-btn {
    background-color: transparent;
    border: 1px solid #ffeba7;
    color: #ffeba7;
    padding: 0.4em 0.8em;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .logout-btn:hover {
    background-color: #ffeba7;
    color: #2a2b38;
  }
`;

export default Header; 