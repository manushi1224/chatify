const handleDisconnect = (localVideoRef, remoteVideoRef) => {
  localVideoRef.current.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  remoteVideoRef.current.srcObject.getTracks().forEach((track) => {
    track.stop();
  });
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
    (stream) => {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    },
    (error) => {
      console.error("Error accessing media devices:", error);
    }
  );
  document.getElementById("my_modal_video").close();
  document.getElementById("my_modal_video_call").close();
};

const acceptVideoCall = (
  localVideoRef,
  remoteVideoRef,
  peerRef,
  peerId,
  socket,
  user,
  current,
  recieverId
) => {
  document.getElementById("my_modal_video").close();
  document.getElementById("my_modal_video_call").showModal();
  socket.emit("join:room", {
    recieverId: recieverId,
    senderId: user.userId,
    conversationId: current,
  });
  socket.emit("call:accept", {
    recieverId: recieverId,
    senderId: user.userId,
  });

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.onloadedmetadata = () => {
        localVideoRef.current.play();
      };
      const call = peerRef.current.call(peerId, stream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.srcObject.onloadedmetadata = () => {
          remoteVideoRef.current.play();
        };
      });
      call.on("error", (error) => {
        console.log(error);
      });
    })
    .catch((error) => {
      console.error("Error accessing media devices:", error);
    });
};

export { handleDisconnect, acceptVideoCall };
