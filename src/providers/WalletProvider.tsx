import React, { ReactNode } from 'react';
import '@rainbow-me/rainbowkit/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

// Mock wallet provider for now - in production you'd use RainbowKit
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  return <div>{children}</div>;
};