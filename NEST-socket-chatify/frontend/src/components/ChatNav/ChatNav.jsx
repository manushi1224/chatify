import React from "react";
import { useSocket } from "../../context/SocketProvider";
import ImageAvatar from "../../ui/ImageAvatar";
import { VideoIcon } from "../../assets/svgs/AllSvgs";

function ChatNav({ reciever, conversationId, user, onlineUsers }) {
  const socket = useSocket();

  const handleVideoCall = () => {
    document.getElementById("my_call_modal").showModal();
    socket.emit("call:notification", {
      recieverId: reciever._id,
      senderId: user.userId,
      conversationId,
      userName: user.currentUser.userName,
      peerId: user.peerId,
    });

    socket.emit("join:room", {
      recieverId: reciever._id,
      senderId: user.userId,
      conversationId,
      userName: user.userName,
    });
  };

  return (
    <div className="fixed z-10 bg-primary p-4 w-[66.8%] rounded-lg top-0">
      <div className="flex justify-between items-center py-1">
        <ImageAvatar src={reciever?.imageUrl}>
          <span
            className={`flex flex-col ${
              onlineUsers?.find((user) => user.userId === reciever._id) &&
              "-mt-2"
            }`}
          >
            <h3 className="text-xl text-base-100 font-bold">
              {reciever.userName}
            </h3>
            {onlineUsers?.find((user) => user.userId === reciever._id) ? (
              <span className="text-green-600 text-sm font-semibold">
                online
              </span>
            ) : null}
          </span>
        </ImageAvatar>
        <button onClick={() => handleVideoCall()}>
          <VideoIcon fill={true} />
        </button>
      </div>
    </div>
  );
}

export default ChatNav;
