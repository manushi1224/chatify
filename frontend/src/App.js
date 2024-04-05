import axios from "axios";
import { useCallback, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SocketProvider from "./context/SocketProvider";
import userContext from "./context/userContext";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import VideoCall from "./pages/VideoCall";

import "./App.css";

function App() {
  const getLocalItem = () => {
    return JSON.parse(localStorage.getItem("items"));
  };
  const isAuth = getLocalItem();
  const [session, setSession] = useState(isAuth || "");
  const [currentUser, setCurrentUser] = useState();

  const setLocalItem = (token, userId, peerId) => {
    localStorage.setItem("items", JSON.stringify({ token, userId, peerId }));
    return true;
  };

  const login = useCallback((jwttoken, uid, peerId) => {
    setSession({
      token: jwttoken,
      userId: uid,
      peerId: peerId,
    });
    setLocalItem(jwttoken, uid, peerId);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("items");
    setSession({
      token: "",
      userId: "",
      peerId: "",
    });
    setCurrentUser(null);
  }, []);

  const { token, userId, peerId } = session;

  const getUserData = async () => {
    if (token) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_KEY}/api/user/${userId}`
        );
        setCurrentUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <userContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        token: token,
        currentUser: currentUser,
        getUserData: getUserData,
        login: login,
        logout: logout,
        getLocalItem: getLocalItem,
        setLocalItem: setLocalItem,
        peerId: peerId,
      }}
    >
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LogIn />}></Route>
            <Route path="/chat" element={<Home users={currentUser} />}></Route>
            <Route path={`/call/:callId`} element={<VideoCall />}></Route>
          </Routes>
        </Router>
      </SocketProvider>
    </userContext.Provider>
  );
}

export default App;
