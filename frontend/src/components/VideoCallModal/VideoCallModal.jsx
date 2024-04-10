import Peer from "peerjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import userContext from "../../context/userContext";
import {
  EndCall,
  MicOff,
  MicOn,
  StopVideo,
  VideoIcon,
} from "../../assets/svgs/AllSvgs";
import { acceptVideoCall, handleDisconnect } from "../../lib/handleVideoCall";

function VideoCallModal({
  peerId,
  callAccepted,
  recieverId,
  current,
  videoStatus,
  hangupCall,
}) {
  const user = useContext(userContext);
  const socket = useSocket();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const peerRef = useRef(null);

  useEffect(() => {
    if (!videoStatus)
      remoteVideoRef.current.srcObject.getTracks()[1].enabled = false;
    if (remoteVideoRef.current.srcObject !== null)
      remoteVideoRef.current.srcObject.getTracks()[1].enabled = videoStatus;
  }, [videoStatus]);

  useEffect(() => {
    peerRef.current = new Peer(user.peerId);
    return () => {
      peerRef.current.disconnect();
    };
  }, [user.peerId]);

  const stopVideo = () => {
    localVideoRef.current.srcObject.getTracks()[1].enabled = false;
    socket.emit("video_status", {
      recieverId: recieverId,
      status: false,
    });
    setVideo(false);
  };

  const startVideo = () => {
    localVideoRef.current.srcObject.getTracks()[1].enabled = true;
    socket.emit("video_status", {
      recieverId: recieverId,
      status: true,
    });
    setVideo(true);
  };

  useEffect(() => {
    if (callAccepted) {
      document.getElementById("my_modal_video").close();
      document.getElementById("my_modal_video_call").showModal();

      peerRef.current.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.onloadedmetadata = () => {
              localVideoRef.current.play();
            };

            call.answer(stream);

            call.on("stream", (remoteStream) => {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.srcObject.onloadedmetadata = () => {
                remoteVideoRef.current.play();
              };
            });
          })
          .catch((error) => {
            console.error("Error accessing media devices:", error);
          });
      });
    }
  }, [callAccepted, user.peerId]);

  useEffect(() => {
    if (hangupCall) handleDisconnect(localVideoRef, remoteVideoRef);
  }, [hangupCall]);

  const hangupCallHandler = (localVideoRef, remoteVideoRef) => {
    handleDisconnect(localVideoRef, remoteVideoRef);
    socket.emit("disconnect_call", {
      recieverId: recieverId,
    });
  };

  return (
    <div>
      <dialog id="my_call_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center mt-2">Calling....</h3>
          <div className=" flex justify-center my-4"></div>
          <div className="flex mt-10 justify-center gap-3">
            <form method="dialog">
              <button className="btn btn-error">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_video" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center mt-2">
            Incoming Call...
          </h3>
          <div className=" flex justify-center my-4"></div>
          <div className="flex mt-10 justify-center gap-3">
            <button
              className="btn btn-success"
              onClick={() => {
                acceptVideoCall(
                  localVideoRef,
                  remoteVideoRef,
                  peerRef,
                  peerId,
                  socket,
                  user,
                  current,
                  recieverId
                );
              }}
            >
              Accept !
            </button>
            <form method="dialog">
              <button className="btn btn-error">Decline!</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_video_call" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Ongoing Call</h3>
          <div>
            <video
              ref={localVideoRef}
              autoPlay
              muted={audio}
              className=" rounded-md h-20 absolute top-16 right-10 shadow-lg shadow-black"
            />
          </div>
          <div>
            <video
              ref={remoteVideoRef}
              autoPlay
              muted={audio}
              className=" rounded-lg shadow shadow-black"
            />
          </div>
          <div className="flex mt-10 gap-2 justify-center">
            <button
              className={`rounded-[50%] ${
                audio ? "bg-secondary" : "bg-secondary-content"
              } p-4`}
              onClick={() => setAudio(!audio)}
            >
              {audio ? <MicOff /> : <MicOn />}
            </button>
            <button
              className={`rounded-[50%] ${
                audio ? "bg-secondary" : "bg-secondary-content"
              } p-4`}
              onClick={() => {
                video ? stopVideo() : startVideo();
              }}
            >
              {video ? <StopVideo /> : <VideoIcon />}
            </button>
            <form method="dialog">
              <button
                className="bg-error rounded-[50%] p-4"
                onClick={() => {
                  hangupCallHandler(remoteVideoRef, localVideoRef);
                }}
              >
                <EndCall />
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default VideoCallModal;
