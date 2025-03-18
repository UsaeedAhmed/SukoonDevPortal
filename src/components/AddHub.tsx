import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Toast from "./Toast";

const AddHub = () => {
  const [hubName, setHubName] = useState("");
  const [hubType, setHubType] = useState<"tenant" | "homeManager">("tenant");
  const [loading, setLoading] = useState(false);
  const [hubCreated, setHubCreated] = useState(false);
  const [hubData, setHubData] = useState<{
    name: string;
    type: string;
    linkCode: string;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);

  const generateLinkCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const linkCode = generateLinkCode();
      const hubData = {
        homeName: hubName,
        homeType: hubType === "tenant" ? "tenant" : "admin",
        hubCode: linkCode,
        userId: "",
        image: "",
        pinned: false,
        unitName: "",
        units: [],
      };

      const docRef = await addDoc(collection(db, "userHubs"), hubData);

      setHubData({
        name: hubName,
        type: hubType === "tenant" ? "tenant" : "admin",
        linkCode,
      });
      setHubCreated(true);
    } catch (err) {
      console.error("Failed to create hub:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setHubCreated(false);
    setHubData(null);
    setHubName("");
    setHubType("tenant");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <HubContainer>
      <h1>Add Hub</h1>
      <p>Create a new hub</p>

      {!hubCreated ? (
        <HubForm onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="hubName">Hub Name</label>
            <input
              type="text"
              id="hubName"
              value={hubName}
              onChange={(e) => setHubName(e.target.value)}
              required
              placeholder="Enter hub name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hubType">Hub Type</label>
            <select
              id="hubType"
              value={hubType}
              onChange={(e) =>
                setHubType(e.target.value as "tenant" | "homeManager")
              }
              required
            >
              <option value="tenant">Tenant Hub</option>
              <option value="homeManager">Home Manager Hub</option>
            </select>
          </div>

          <button type="submit" disabled={loading || !hubName}>
            {loading ? "Creating..." : "Create Hub"}
          </button>
        </HubForm>
      ) : (
        <SuccessContainer>
          <div className="success-info">
            <h3>Hub Created Successfully</h3>
            <p>
              <strong>Name:</strong> {hubData?.name}
            </p>
            <p>
              <strong>Type:</strong> {hubData?.type}
            </p>
            <p>
              <strong>Link Code:</strong>{" "}
              <CodeButton
                onClick={() => copyToClipboard(hubData?.linkCode || "")}
              >
                <Code>{hubData?.linkCode}</Code>
              </CodeButton>
            </p>
          </div>

          <button className="reset-button" onClick={resetForm}>
            Create Another Hub
          </button>
        </SuccessContainer>
      )}

      <BackButton to="/">Back to Home</BackButton>
      <Toast message="Copied to clipboard!" isVisible={showToast} />
    </HubContainer>
  );
};

const HubContainer = styled.div`
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

const HubForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
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

    input,
    select {
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

const SuccessContainer = styled.div`
  background: #2a2b38;
  padding: 2.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
  max-width: 500px;
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

export default AddHub;
