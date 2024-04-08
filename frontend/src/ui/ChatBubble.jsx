import React from "react";
import ImageAvatar from "./ImageAvatar";

const getTime = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString();
};

function ChatBubble({ reciever_profile, message, isSender }) {
  return (
    <>
      <div className={`flex ${isSender ? "" : "justify-end"} mb-4`}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2 mt-7">
          {isSender && (
            <div className="chat-image avatar">
              <ImageAvatar src={reciever_profile} />
            </div>
          )}
        </div>
        <div>
          <time
            className={`text-xs py-1 px-1 opacity-50 flex ${
              isSender ? " justify-start" : "justify-end"
            }`}
          >
            {getTime(message.createdAt)}
          </time>
          <div
            className={`flex max-w-96 rounded-lg px-3 py-2 gap-3 ${
              isSender ? " bg-base-content" : "bg-secondary text-secondary-text"
            }`}
          >
            <p
              className={` ${
                isSender ? " text-base-100" : "text-secondary-content"
              }`}
            >
              {message.text}
            </p>
          </div>
        </div>
      </div>
    </>
    // <div
    //   className={`chat chat-${isSender ? "start" : "end"}`}
    //   key={message._id}
    // >
    // {isSender && (
    //   <div className="chat-image avatar">
    //     <ImageAvatar userName={imageAvatar} size={35} />
    //   </div>
    // )}

    // <div className="chat-header">
    //   <time className="text-xs opacity-50">{getTime(message.createdAt)}</time>
    // </div>
    //   <div className={`chat-bubble ${isSender ? "chat-bubble-secondary" : ""}`}>
    //     {message.text}
    //   </div>
    // </div>
  );
}

export default ChatBubble;
