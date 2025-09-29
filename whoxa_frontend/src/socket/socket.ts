// @ts-nocheck
import Cookies from "js-cookie";
import { io } from "socket.io-client";

let socket: SocketIOClient;

export const initiateSocketConnection = () => {
  if (!socket) {
    const token = Cookies.get("whoxa_auth_token");
    socket = io(`${import.meta.env.VITE_SOCKET_URL}?token=${token}`, {
      path: "/socket",
    });
    // socket = io(`http://192.168.0.27:1808`);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const socketInstance = () => {
  if (!socket) {
    const token = Cookies.get("whoxa_auth_token");
    socket = io(`${import.meta.env.VITE_SOCKET_URL}?token=${token}`, {
      path: "/socket",
    });

    // socket = io(`http://192.168.0.27:1808`);
  }
  return socket;
};
