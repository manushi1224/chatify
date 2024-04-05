import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import userContext from "../../context/userContext";
import ChatBubble from "../../ui/ChatBubble";
import { SendButton } from "../../ui/svgs/AllSvgs";
import ChatNav from "../ChatNav/ChatNav";

function ChatBox({
  messages,
  conversationId,
  socket,
  recievedMessage,
  callAccepted,
}) {
  const user = useContext(userContext);
  const [chatRoomMessages, setChatRoomMessages] = useState();
  const [reciever, setReciever] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [recieverId, setRecieverId] = useState();

  useEffect(() => {
    recievedMessage &&
      setChatRoomMessages((prev) => [...prev, recievedMessage]);
  }, [recievedMessage]);

  useEffect(() => {
    const fetchRecieverId = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_KEY}/api/conversations/conversation/${conversationId}`
        );
        const recieverId = res.data.conversation.members.find(
          (member) => member !== user.userId
        );
        setRecieverId(recieverId);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecieverId();
  }, [conversationId, user.userId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_KEY}/api/user/${recieverId}`
        );
        // console.log(response);
        setReciever(response.data.user);
      } catch (error) {
        // console.log(error);
      }
    };

    fetchUser();
  }, [recieverId]);

  useEffect(() => {
    setChatRoomMessages(messages);
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") {
      toast.error("Message cannot be empty");
      return;
    }
    try {
      if (!socket.current) {
        toast.error("socket.current not connected");
        return;
      }
      socket.current.emit("sendMessage", {
        senderId: user.userId,
        recieverId: recieverId,
        text: newMessage,
      });

      const res = await axios.post(
        `${process.env.REACT_APP_API_KEY}/api/messages/`,
        {
          conversationId: conversationId,
          sender: user.userId,
          text: newMessage,
        }
      );
      setChatRoomMessages([...chatRoomMessages, res.data.messages]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full">
      {reciever && (
        <ChatNav
          reciever={reciever}
          conversationId={conversationId}
          user={user}
          callAccepted={callAccepted}
        />
      )}

      <Toaster></Toaster>
      <div className="flex flex-col gap-4 w-full px-10 pt-20 pb-10">
        {chatRoomMessages &&
          reciever &&
          chatRoomMessages.map((message, index) => {
            return message.sender !== user.userId ? (
              <ChatBubble
                message={message}
                isSender={true}
                key={index}
                imageAvatar={reciever.userName}
              />
            ) : (
              <ChatBubble message={message} isSender={false} key={index} />
            );
          })}
      </div>
      <div className="sticky bottom-0 rounded-t-xl bg-success-content p-4">
        <form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          className="flex"
        >
          <textarea
            placeholder="Type Something..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="textarea textarea-bordered textarea-base w-full"
          ></textarea>
          <button
            type="submit"
            disabled={newMessage === ""}
            className="flex items-center bg-primary text-primary-content gap-1 px-4 py-2 mx-4 my-4 font-semibold tracking-widest rounded-md duration-300 hover:gap-2 hover:translate-x-3"
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
