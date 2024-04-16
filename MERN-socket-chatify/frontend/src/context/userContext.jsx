import { createContext } from "react";

const userContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  currentUser: null,
  peerId: null,
  peerInstance: null,
  getUserData: () => {},
  login: () => {},
  logout: () => {},
  getLocalItem: () => {},
  setLocalItem: () => {},
});

export default userContext;
