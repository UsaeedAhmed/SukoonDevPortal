import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AvailableItems from "./AvailableItems";

const HomeScreen = () => {
  return (
    <HomeContainer>
      <h1>Sukoon Dev Portal</h1>
      <p>Manage your hubs and devices</p>

      <div className="action-buttons">
        <ActionButton to="/add-hub">
          <div className="icon">🔌</div>
          <h2>Add Hub</h2>
          <p>Create a new hub</p>
        </ActionButton>

        <ActionButton to="/add-device">
          <div className="icon">📱</div>
          <h2>Add Device</h2>
          <p>Create a new device</p>
        </ActionButton>
      </div>

      <AvailableItems />
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;

  h1 {
    margin-bottom: 0.5rem;
  }

  p {
    color: #d3d3d3;
    margin-bottom: 3rem;
  }

  .action-buttons {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 3rem;
  }
`;

const ActionButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #2a2b38;
  border-radius: 12px;
  padding: 2rem;
  width: 250px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h2 {
    color: #ffeba7;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #d3d3d3;
    margin: 0;
    font-size: 0.9rem;
  }
`;

export default HomeScreen;
