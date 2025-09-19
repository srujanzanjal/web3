import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  isConnected: boolean;
  connectWallet: () => void;
  disconnect: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = () => {
    // Mock wallet connection
    setUser({ address: '0x1234...5678', ensName: null });
    setIsConnected(true);
  };

  const disconnect = () => {
    setUser(null);
    setIsConnected(false);
  };

  return (
    <AuthContext.Provider value={{ user, isConnected, connectWallet, disconnect }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};