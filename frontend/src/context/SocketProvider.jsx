import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export default function SocketProvider(props) {
  const socket = useMemo(() => io("ws://localhost:8900"), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
}
