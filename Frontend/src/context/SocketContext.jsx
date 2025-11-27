import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(undefined); // Use undefined to detect if Provider is missing

export const useSocket = () => {
  const context = useContext(SocketContext);
  // If context is undefined, it means we're outside the Provider
  // If context is null, it means Provider exists but socket isn't initialized yet (which is fine)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context; // This will be null initially, then the socket object once connected
};

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const newSocket = io(SOCKET_URL, {
        auth: {
          token,
        },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else {
      // If no token, ensure socket is null
      setSocket(null);
    }
  }, [token]);

  // Always provide the context, even if socket is null
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

