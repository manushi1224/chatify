import React, { useContext, useState } from "react";
import { sendNotification } from "../apis/notificationApis";
import userContext from "../context/userContext";
import ImageAvatar from "./ImageAvatar";
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
  const user = useContext(userContext);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const notify = await sendNotification({
        senderId,
        recieverId,
        text: "You have a new message!",
        userName: senderName,
        type: "request",
        token: user.token,
      });
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
        <div className="flex col-span-4 p-2 mt-1">
          <ImageAvatar src={imageUrl}>
            <span
              className={`${
                current === conversations?._id
                  ? "text-neutral font-semibold"
                  : ""
              } px-4`}
            >
              {userName}
            </span>
          </ImageAvatar>
        </div>
        <div className="col-span-1"></div>

        {newChat && (
          <div className="modal-action my-3">
            <form method="dialog">
              <button
                onClick={() => {
                  handleSubmit();
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
