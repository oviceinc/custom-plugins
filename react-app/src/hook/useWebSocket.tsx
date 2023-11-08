import { useEffect, useState, useCallback } from "react";
import { MessageEvents } from "../type";

const useWebSocket = (onMessage: (message: MessageEvents) => void) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const newSocket = new WebSocket(
      process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:4000"
    );

    newSocket.onopen = () => {
      setIsConnected(true);
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message as MessageEvents);
    };

    newSocket.onclose = (event) => {
      setIsConnected(false);
    };

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
        setSocket(null);
      }
    };
  }, [onMessage]);

  const sendMessage = useCallback(
    (message: any) => {
      if (socket) {
        socket.send(JSON.stringify(message));
      }
    },
    [socket]
  );

  return { isConnected, sendMessage };
};

export default useWebSocket;
