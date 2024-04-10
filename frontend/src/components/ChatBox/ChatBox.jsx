import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { getConversationById } from "../../apis/conversationApis";
import { sendNewMessage } from "../../apis/messageApis";
import { getUserById } from "../../apis/userApis";
import userContext from "../../context/userContext";
import renderDate from "../../lib/renderDate";
import ChatBubble from "../../ui/ChatBubble";
import { SendButton } from "../../ui/svgs/AllSvgs";
import ChatNav from "../ChatNav/ChatNav";

function ChatBox({ messages, conversationId, socket, recievedMessage }) {
  const user = useContext(userContext);
  const [chatRoomMessages, setChatRoomMessages] = useState();
  const [reciever, setReciever] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [recieverId, setRecieverId] = useState();
  const chatRef = useRef();
  const dates = new Set();

  useEffect(() => {
    recievedMessage &&
      setChatRoomMessages((prev) => [...prev, recievedMessage]);
  }, [recievedMessage]);

  useEffect(() => {
    const fetchRecieverId = async () => {
      try {
        const { data } = await getConversationById(conversationId);
        const recieverId = data.conversation.members.find(
          (member) => member !== user.userId
        );
        setRecieverId(recieverId);
      } catch (error) {}
    };

    fetchRecieverId();
  }, [conversationId, user.userId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user } = await getUserById(recieverId);
        setReciever(user);
      } catch (error) {}
    };

    fetchUser();
  }, [recieverId]);

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
    if (!socket.current) {
      toast.error("socket.current not connected");
      return;
    }
    socket.current.emit("sendMessage", {
      senderId: user.userId,
      recieverId: recieverId,
      text: newMessage,
    });

    const { data } = await sendNewMessage({
      conversationId,
      sender: user.userId,
      text: newMessage,
      token: user.token,
    });
    setChatRoomMessages([...chatRoomMessages, data.messages]);
    setNewMessage("");
  };

  return (
    <div className="relative w-full overflow-y-hidden">
      {reciever && (
        <ChatNav
          reciever={reciever}
          conversationId={conversationId}
          user={user}
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
                {message.sender !== user.userId ? (
                  <ChatBubble
                    reciever_profile={reciever.imageUrl}
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
