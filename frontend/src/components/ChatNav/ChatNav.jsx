import React from "react";
// import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";
import ImageAvatar from "../../ui/ImageAvatar";
import { VideoIcon } from "../../ui/svgs/AllSvgs";

function ChatNav({ reciever, conversationId, user, callAccepted }) {
  const socket = useSocket();
  // const navigate = useNavigate();

  // const localVideoRef = useRef(null);
  // const remoteVideoRef = useRef(null);

  const handleVideoCall = () => {
    document.getElementById("my_call_modal").showModal();
    socket.emit("call:notification", {
      recieverId: reciever._id,
      senderId: user.userId,
      conversationId,
      userName: user.userName,
      peerId: user.peerId,
    });

    socket.emit("join:room", {
      recieverId: reciever._id,
      senderId: user.userId,
      conversationId,
      userName: user.userName,
    });
    // navigate(`/call/${conversationId}`);
  };

  return (
    <div className="fixed z-10 bg-primary p-4 w-[66.8%] rounded-lg top-0">
      <div className="flex justify-between items-center">
        <ImageAvatar size={30} userName={reciever.userName}>
          <h3 className="text-xl text-base-100 font-bold">
            {reciever.userName}
          </h3>
        </ImageAvatar>
        <button onClick={() => handleVideoCall()}>
          <VideoIcon />
        </button>
      </div>
    </div>
  );
}

export default ChatNav;
