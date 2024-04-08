import React, { useState } from "react";
import ImageAvatar from "./ImageAvatar";
import axios from "axios";
import Loader from "./Loader";

function UserList({
  userName,
  current,
  conversations,
  newChat,
  imageUrl,
  socket,
  senderId,
  recieverId,
  senderName,
}) {
  const [isLoading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    setLoading(true);
    console.log("Chatting with", userName);
    try {
      const notify = await axios.post(
        `${process.env.REACT_APP_API_KEY}/api/notifications`,
        {
          senderId,
          recieverId,
          text: "You have a new message!",
          userName: senderName,
          type: "request",
        }
      );

      console.log("Notification sent", notify.data);

      socket.current.emit("sendNotification", {
        senderId: senderId,
        recieverId: recieverId,
        text: "You have a new message!",
        userName: senderName,
        type: "request",
        notificationId: notify.data.notification._id,
      });

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-8 content-center justify-between bg-primary-content gap-3 w-full rounded-md mb-2">
        <div className="col-span-1"></div>
        <div className="flex col-span-4">
          <ImageAvatar src={imageUrl} />
          <span
            className={`${
              current === conversations?._id ? "text-neutral font-semibold" : ""
            } mt-3 px-4`}
          >
            {userName}
          </span>
        </div>
        <div className="col-span-1"></div>

        {newChat && (
          <div className="modal-action my-3">
            <form method="dialog">
              <button
                onClick={(e) => {
                  handleSubmit(e);
                }}
                className="btn btn-sm"
              >
                {isLoading ? <Loader /> : "Chat"}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default UserList;
