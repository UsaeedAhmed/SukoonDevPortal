import React from 'react';
import styled from 'styled-components';

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible }) => {
  return (
    <ToastContainer isVisible={isVisible}>
      {message}
    </ToastContainer>
  );
};

const ToastContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #2a2b38;
  color: #ffeba7;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1000;
`;

export default Toast; 