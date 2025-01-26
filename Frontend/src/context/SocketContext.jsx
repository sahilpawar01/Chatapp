import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import io from "socket.io-client";
const socketContext = createContext();

// it is a hook.
export const useSocketContext = () => {
  return useContext(socketContext);
};
 
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useAuth();

  useEffect(() => {
    if (authUser) {
      const newSocket = io("http://localhost:5002/", {
        query: {
          userId: authUser.user._id,
        },
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Moved the messageDeleted event listener here
      newSocket.on('messageDeleted', (deletedMessageId) => {
        // Note: setMessages is not defined in this context, so this might need to be handled differently
        console.log('Message deleted:', deletedMessageId);
      });

      return () => {
        newSocket.off('messageDeleted');
        newSocket.off('getOnlineUsers');
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
