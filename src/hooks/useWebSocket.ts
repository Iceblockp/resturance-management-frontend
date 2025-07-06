// src/hooks/useWebSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "../components/auth/AuthProvider";

export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isAuthenticated, user } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated && user) {
      const socketInstance = io("http://localhost:8080", {
        // withCredentials: true,
        // transports: ["websocket", "polling"],
        autoConnect: true,
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return socket;
};
