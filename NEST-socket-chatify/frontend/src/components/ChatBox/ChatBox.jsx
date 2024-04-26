import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { getConversationById } from "../../apis/conversationApis";
import { sendNewMessage } from "../../apis/messageApis";
import { getUserById } from "../../apis/userApis";
import { SendButton } from "../../assets/svgs/AllSvgs";
import { useSocket } from "../../context/SocketProvider";
import userContext from "../../context/userContext";
import renderDate from "../../lib/renderDate";
import ChatBubble from "../../ui/ChatBubble";
import ChatNav from "../ChatNav/ChatNav";

function ChatBox({ messages, conversationId, recievedMessage, onlineUsers }) {
  const user = useContext(userContext);
  const [chatRoomMessages, setChatRoomMessages] = useState();
  const [reciever, setReciever] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [recieverId, setRecieverId] = useState();
  const socket = useSocket();
  const chatRef = useRef();
  const dates = new Set();

  useEffect(() => {
    recievedMessage &&
      setChatRoomMessages((prev) => [...prev, recievedMessage]);
  }, [recievedMessage]);

  useEffect(() => {
    const fetchRecieverId = async () => {
      try {
        const { data } = await getConversationById(conversationId, user.token);
        const recieverId = data.members.find(
          (member) => member !== user.userId
        );
        setRecieverId(recieverId);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecieverId();
  }, [conversationId, user.userId, user.token]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserById(user.token, recieverId);
        setReciever(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [recieverId, user.token]);

  useEffect(() => {
    setChatRoomMessages(messages);
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, reciever]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") {
      toast.error("Message cannot be empty");
      return;
    }
    if (!socket) {
      toast.error("socket not connected");
      return;
    }
    socket.emit("sendMessage", {
      senderId: user.userId,
      recieverId: recieverId,
      message: newMessage,
    });

    try {
      const { data } = await sendNewMessage({
        conversationId,
        senderId: user.userId,
        recieverId: recieverId,
        message: newMessage,
        token: user.token,
      });
      setChatRoomMessages((prevMessages) => {
        const updatedMessages = prevMessages
          ? [...prevMessages, data.newMessage]
          : [data.newMessage];
        return updatedMessages;
      });

      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full overflow-y-hidden">
      {reciever && (
        <ChatNav
          reciever={reciever?.user}
          conversationId={conversationId}
          user={user}
          onlineUsers={onlineUsers}
        />
      )}
      <Toaster></Toaster>
      <div className="flex flex-col gap-4 w-full px-10 pt-24 pb-32">
        {chatRoomMessages &&
          reciever &&
          chatRoomMessages.map((message, index) => {
            const dateNum = moment(
              message.createdAt || new Date().toLocaleDateString
            ).format("DD-MM-yyyy");
            return (
              <div key={message._id} ref={chatRef}>
                {!dates.has(dateNum) && renderDate(message, dateNum, dates)}
                {message.senderId !== user.userId ? (
                  <ChatBubble
                    reciever_profile={reciever.user.imageUrl}
                    message={message}
                    isSender={true}
                    key={index}
                  />
                ) : (
                  <ChatBubble message={message} isSender={false} key={index} />
                )}
              </div>
            );
          })}
      </div>
      <div className="fixed w-[67%] bottom-0 rounded-t-xl bg-success-content p-4">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="flex"
        >
          <input
            placeholder="Type Something..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="textarea textarea-bordered w-full"
          ></input>
          <button
            type="submit"
            disabled={newMessage === ""}
            className="flex disabled:opacity-60 items-center bg-primary text-primary-content gap-1 px-4 py-2 mx-4 my-4 font-semibold tracking-widest rounded-md"
          >
            Send
            <SendButton />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
