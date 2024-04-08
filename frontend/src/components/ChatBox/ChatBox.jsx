import React, { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { getConversationById } from "../../apis/conversationApis";
import { getUserById } from "../../apis/userApis";
import userContext from "../../context/userContext";
import ChatBubble from "../../ui/ChatBubble";
import { SendButton } from "../../ui/svgs/AllSvgs";
import ChatNav from "../ChatNav/ChatNav";
import { sendNewMessage } from "../../apis/messageApis";
import moment from "moment";

function ChatBox({ messages, conversationId, socket, recievedMessage }) {
  const user = useContext(userContext);
  const [chatRoomMessages, setChatRoomMessages] = useState();
  const [reciever, setReciever] = useState();
  const [newMessage, setNewMessage] = useState("");
  const [recieverId, setRecieverId] = useState();
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
  }, [messages]);

  const renderDate = (chat, dateNum) => {
    const timestampDate = moment(chat.createdAt, "YYYY-MM-DD").format(
      "DD/MM/yyyy"
    );
    const yesterday = moment().subtract(1, "day").format("DD/MM/yyyy");
    const todayDate = moment().format("DD/MM/yyyy");

    dates.add(dateNum);
    return (
      <span className="flex justify-center">
        <span className="bg-secondary-content rounded-xl px-3 py-1 text-sm">
          {timestampDate === todayDate
            ? "Today"
            : timestampDate === yesterday
            ? "Yesterday"
            : timestampDate}
        </span>
      </span>
    );
  };

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
    });
    setChatRoomMessages([...chatRoomMessages, data.messages]);
    setNewMessage("");
  };

  return (
    <div className="relative w-full">
      {reciever && (
        <ChatNav
          reciever={reciever}
          conversationId={conversationId}
          user={user}
        />
      )}
      <Toaster></Toaster>
      <div className="flex flex-col gap-4 w-full px-10 pt-32 pb-10 h-[42rem]">
        {chatRoomMessages &&
          reciever &&
          chatRoomMessages.map((message, index) => {
            const dateNum = moment(message.createdAt).format("ddMMyyyy");
            return (
              <div key={message._id}>
                {!dates.has(dateNum) && renderDate(message, dateNum)}
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
