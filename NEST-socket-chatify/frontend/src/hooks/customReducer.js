import React, { useContext, useEffect, useRef, useReducer } from "react";
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

  const initialState = {
    conversations: [],
    currentConversation: null,
    recievedMessage: null,
    callAccepted: false,
    hangupCall: false,
    notification: null,
    recieverId: null,
    videoStatus: true,
    peerId: "",
    messages: [],
  };

  function reducer(state, action) {
    switch (action.type) {
      case "SET_CONVERSATIONS":
        return { ...state, conversations: action.payload };
      case "SET_CURRENT_CONVERSATION":
        return { ...state, currentConversation: action.payload };
      case "SET_RECIEVED_MESSAGE":
        return { ...state, recievedMessage: action.payload };
      case "SET_CALL_ACCEPTED":
        return { ...state, callAccepted: action.payload };
      case "SET_HANGUP_CALL":
        return { ...state, hangupCall: action.payload };
      case "SET_NOTIFICATION":
        return { ...state, notification: action.payload };
      case "SET_RECIEVER_ID":
        return { ...state, recieverId: action.payload };
      case "SET_VIDEO_STATUS":
        return { ...state, videoStatus: action.payload };
      case "SET_PEER_ID":
        return { ...state, peerId: action.payload };
      case "SET_MESSAGES":
        return { ...state, messages: action.payload };
      default:
        return state;
    }
  }

  function Home() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const user = useContext(userContext);
    const socket = useRef();

    useEffect(() => {
      socket.current = io("ws://localhost:8900");
      socket.current.on("getMessage", (data) => {
        dispatch({ type: "SET_RECIEVED_MESSAGE", payload: data });
      });
      socket.current.on("getNotification", (data) => {
        dispatch({ type: "SET_NOTIFICATION", payload: data });
      });
      socket.current.on("join:room", (data) => {
        console.log("A user joined the room!");
        dispatch({ type: "SET_RECIEVER_ID", payload: data.recieverId });
      });
      socket.current.on("call:notification", async (data) => {
        console.log("call notification", data);
        if (data.status === "offline") {
          setTimeout(() => {
            document.getElementById("my_call_modal").close();
          }, 2000);
          toast("User is offline!", {
            icon: "🔴",
          });
          await notificationHandler(data.data, user.token);
          return;
        }
        console.log("call notification");
        dispatch({ type: "SET_PEER_ID", payload: data.peerId });
        dispatch({ type: "SET_RECIEVER_ID", payload: data.senderId });
        dispatch({ type: "SET_CURRENT_CONVERSATION", payload: data.conversationId });
        document.getElementById("my_modal_video").showModal();
      });
      socket.current.on("call:accept", () => {
        document.getElementById("my_modal_video").close();
        document.getElementById("my_call_modal").close();
        document.getElementById("my_modal_video_call").showModal();
        dispatch({ type: "SET_CALL_ACCEPTED", payload: true });
      });
      socket.current.on("video_status", (data) => {
        dispatch({ type: "SET_VIDEO_STATUS", payload: data.status });
      });
      socket.current.on("disconnect_call", () => {
        dispatch({ type: "SET_HANGUP_CALL", payload: true });
      });
    }, [user.token]);

    useEffect(() => {
      socket.current.emit("addUser", user.userId);
    }, [user]);

    useEffect(() => {
      const fetchConversations = async () => {
        try {
          const { data } = await getConversationByUser(user.userId);
          dispatch({ type: "SET_CONVERSATIONS", payload: data.conversations });
        } catch (error) {
          console.log(error);
        }
      };
      fetchConversations();
    }, [user.userId, state.notification]);

    useEffect(() => {
      const fetchMessages = async () => {
        try {
          const { data } = await getAllMessages(state.currentConversation);
          dispatch({ type: "SET_MESSAGES", payload: data.messages });
        } catch (error) {}
      };

      fetchMessages();
    }, [state.currentConversation]);

    return (
      <>
        <Toaster />
        <VideoCallModal
          peerId={state.peerId}
          callAccepted={state.callAccepted}
          recieverId={state.recieverId}
          current={state.currentConversation}
          videoStatus={state.videoStatus}
          hangupCall={state.hangupCall}
        />
        <div className="grid grid-cols-12">
          <div className="col-span-1">
            <NavBar
              notification={state.notification}
              setNotification={dispatch}
              socket={socket}
              conversations={state.conversations}
              fetchConversations={dispatch}
              settingCurrentConversation={dispatch}
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
                {state.conversations.length !== 0 ? (
                  state.conversations.map((con) => {
                    return (
                      <li
                        key={con._id}
                        className="cursor-pointer border-b border-opacity-10 border-accent-content py-2 hover:bg-primary-300 dark:hover:bg-primary-800 dark:bg-primary-800 dark:border-primary-700"
                        onClick={() => {
                          dispatch({ type: "SET_CURRENT_CONVERSATION", payload: con._id });
                        }}
                      >
                        <Conversations
                          notification={state.notification}
                          conversations={con}
                          userId={user.userId}
                          current={state.currentConversation}
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
              {state.currentConversation ? (
                <ChatBox
                  messages={state.messages}
                  conversationId={state.currentConversation}
                  socket={socket}
                  recievedMessage={state.recievedMessage}
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