import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatBox from "../components/ChatBox/ChatBox";
import Conversations from "../components/Conversations/Conversations";
import NavBar from "../components/NavBar/NavBar";
import VideoCallModal from "../components/VideoCallModal/VideoCallModal";
import userContext from "../context/userContext";

function Home() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [recievedMessage, setRecievedMessage] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [notification, setNotification] = useState();
  const [recieverId, setRecieverId] = useState();
  const [peerId, setPeerId] = useState("");
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const user = useContext(userContext);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      console.log(socket.current.id, data.senderId, data.text, data.createdAt);
      setRecievedMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: data.createdAt,
      });
    });
    socket.current.on("getNotification", (data) => {
      console.log(data.senderId, data.text, "notification recieved!!");
      setNotification({
        sender: data.senderId,
        text: data.text,
        userName: data.userName,
        type: data.type,
        notificationId: data.notificationId,
      });
    });
    socket.current.on("call:notification", (data) => {
      console.log("call notification", data);
      setPeerId(data.peerId);
      setRecieverId(data.senderId);
      setCurrentConversation(data.conversationId);
      document.getElementById("my_modal_video").showModal();
    });
    socket.current.on("call:accept", (data) => {
      document.getElementById("my_modal_video").close();
      document.getElementById("my_call_modal").close();
      document.getElementById("my_modal_video_call").showModal();
      setCallAccepted(true);
    });
    return () => {
      socket.current.off("join:room");
    };
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", user.userId);
    socket.current.on("getUsers", (users) => {
      // console.log(users);
      // setOnlineUsers(users);
    });
  }, [user]);

  const fetchConversations = (response) => {
    setConversations(response);
  };

  const settingCurrentConversation = (id) => {
    setCurrentConversation(id);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_KEY}/api/conversations/conversationByUser/${user.userId}`
        );
        fetchConversations(response.data.conversations);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [user.userId, notification]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_KEY}/api/messages/${currentConversation}`
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [currentConversation]);

  return (
    <>
      <VideoCallModal
        peerId={peerId}
        callAccepted={callAccepted}
        recieverId={recieverId}
        current={currentConversation}
      />
      <div className="grid grid-cols-12">
        <div className="col-span-1">
          <NavBar
            notification={notification}
            socket={socket}
            conversations={conversations}
            fetchConversations={fetchConversations}
            settingCurrentConversation={settingCurrentConversation}
          />
        </div>
        <div className="col-span-3">
          <ul className="menu px-4 w-full min-h-full text-base-content">
            <div className="bg-base-200 rounded-xl p-4 mb-2">
              <h3 className="text-xl font-bold">Chat</h3>
            </div>
            <div className="mt-2 h-full bg-primary-content p-2 rounded-xl">
              {conversations &&
                conversations.map((con) => {
                  return (
                    <li
                      key={con._id}
                      className="cursor-pointer border-b border-opacity-10 border-accent-content py-2 hover:bg-primary-300 dark:hover:bg-primary-800 dark:bg-primary-800 dark:border-primary-700"
                      onClick={() => {
                        settingCurrentConversation(con._id);
                      }}
                    >
                      <Conversations
                        notification={notification}
                        conversations={con}
                        userId={user.userId}
                        current={currentConversation}
                      />
                    </li>
                  );
                })}
            </div>
          </ul>
        </div>
        <div className="col-span-8">
          <section className="bg-base-100 rounded sticky top-0 h-screen overflow-y-auto shadow-inner shadow-slate-400">
            {currentConversation ? (
              <ChatBox
                messages={messages}
                conversationId={currentConversation}
                socket={socket}
                recievedMessage={recievedMessage}
              />
            ) : (
              <h1 className="text-center">Select a conversation</h1>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Home;
