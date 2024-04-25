import React, { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getConversationByUser } from "../apis/conversationApis";
import { getAllMessages } from "../apis/messageApis";
import ChatBox from "../components/ChatBox/ChatBox";
import Conversations from "../components/Conversations/Conversations";
import NavBar from "../components/NavBar/NavBar";
import VideoCallModal from "../components/VideoCallModal/VideoCallModal";
import userContext from "../context/userContext";
import { ThreeDots } from "../assets/svgs/AllSvgs";
import { notificationHandler } from "../lib/notificationHandler";
import toast, { Toaster } from "react-hot-toast";

function Home() {
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [recievedMessage, setRecievedMessage] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [hangupCall, setHangupCall] = useState(false);
  const [notification, setNotification] = useState();
  const [recieverId, setRecieverId] = useState();
  const [videoStatus, setVideoStatus] = useState(true);
  const [peerId, setPeerId] = useState("");
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const user = useContext(userContext);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setRecievedMessage({
        sender: data.senderId,
        message: data.message,
        createdAt: data.createdAt,
      });
    });
    socket.current.on("getNotification", (data) => {
      setNotification({
        sender: data.senderId,
        text: data.text,
        userName: data.userName,
        type: data.type,
        notificationId: data.notificationId,
      });
    });
    socket.current.on("join:room", (data) => {
      setRecieverId(data.recieverId);
    });
    socket.current.on("call:notification", async (data) => {
      if (data.status === "offline") {
        setTimeout(() => {
          document.getElementById("my_call_modal").close();
        }, 2000);
        toast("User is offline!", {
          icon: "🔴",
        });
        await notificationHandler(data.data, user.token);
        return;
      } else {
        console.log("call notification");
        setPeerId(data.peerId);
        setRecieverId(data.senderId);
        setCurrentConversation(data.conversationId);
        document.getElementById("my_modal_video").showModal();
      }
    });
    socket.current.on("call:accept", () => {
      document.getElementById("my_modal_video").close();
      document.getElementById("my_call_modal").close();
      document.getElementById("my_modal_video_call").showModal();
      setCallAccepted(true);
    });
    socket.current.on("video_status", (data) => {
      setVideoStatus(data.status);
    });
    socket.current.on("disconnect_call", () => {
      setHangupCall(true);
    });
  }, [user.token]);

  useEffect(() => {
    const handleFocus = () => {
      socket.current.emit("addUser", user.userId);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(users.filter((user) => user !== user.userId));
      });
    };

    const handleBlur = () => {
      if (onlineUsers) socket.current.emit("removeUser", user.userId);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [user, onlineUsers]);

  const fetchConversations = (response) => {
    setConversations(response);
  };

  const settingCurrentConversation = (id) => {
    setCurrentConversation(id);
  };

  useEffect(() => {
    if (!user.token) return;
    const fetchUsers = async () => {
      try {
        const { data } = await getConversationByUser(user.userId, user.token);
        fetchConversations(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [user.userId, notification, user.token]);

  useEffect(() => {
    if (!currentConversation) return;
    const fetchMessages = async () => {
      try {
        const { data } = await getAllMessages(currentConversation, user.token);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [currentConversation, user.token]);

  return (
    <>
      <Toaster />
      <VideoCallModal
        peerId={peerId}
        callAccepted={callAccepted}
        recieverId={recieverId}
        current={currentConversation}
        videoStatus={videoStatus}
        hangupCall={hangupCall}
      />
      <div className="grid grid-cols-12">
        <div className="col-span-1">
          <NavBar
            notification={notification}
            setNotification={setNotification}
            conversations={conversations}
            fetchConversations={fetchConversations}
            settingCurrentConversation={settingCurrentConversation}
          />
        </div>
        <div className="col-span-3">
          <ul className="menu px-4 w-full min-h-full text-base-content">
            <div className="bg-base-200 rounded-xl p-4 mb-2 flex justify-between">
              <h3 className="text-xl font-bold">Chat</h3>
              <div className="dropdown dropdown-left">
                <div tabIndex={0} role="button" className="h-5 pt-1">
                  <ThreeDots />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu shadow bg-secondary-content rounded-box w-52 mt-4"
                >
                  <li>
                    <span onClick={() => user.logout()}>Log Out</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-2 h-full bg-primary-content p-2 rounded-xl">
              {conversations && conversations.length !== 0 ? (
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
                })
              ) : (
                <div className="flex flex-col">
                  <span className="p-5 text-center">No Conversation!</span>
                  <span
                    className="text-center text-secondary cursor-pointer"
                    onClick={() => {
                      document.getElementById("my_modal_1").showModal();
                    }}
                  >
                    Get Started!
                  </span>
                </div>
              )}
            </div>
          </ul>
        </div>
        <div className="col-span-8">
          <section className="bg-base-100 rounded sticky top-0 h-screen overflow-y-auto shadow-inner shadow-slate-400">
            {currentConversation ? (
              <ChatBox
                messages={messages}
                conversationId={currentConversation}
                recievedMessage={recievedMessage}
                onlineUsers={onlineUsers}
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
