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
} from "../../ui/svgs/AllSvgs";

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
    if (!videoStatus) {
      console.log("video status", videoStatus);
      remoteVideoRef.current.srcObject.getTracks()[1].enabled = false;
    }
    if (remoteVideoRef.current.srcObject !== null) {
      remoteVideoRef.current.srcObject.getTracks()[1].enabled = videoStatus;
    }
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

      peerRef.current.on("error", (error) => {
        console.log(error);
      });

      peerRef.current.on("call", (call) => {
        console.log("call", call);
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
  }, [callAccepted, user.peerId, video, audio, peerId]);

  useEffect(() => {
    if (hangupCall) {
      handleDisconnect();
    }
  }, [hangupCall]);

  const handleVideoCall = () => {
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

  const handleDisconnect = () => {
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

  const hangupCallHandler = () => {
    handleDisconnect();
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
                handleVideoCall();
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
              height={200}
              width={100}
              muted={audio}
              className=" rounded-md h-20 absolute top-16 right-10 shadow-lg shadow-black"
            />
          </div>
          <div>
            <video
              ref={remoteVideoRef}
              autoPlay
              height={500}
              width={550}
              muted={audio}
              className=" rounded-lg shadow shadow-black"
            />
          </div>
          <div className="flex mt-10 gap-2 justify-center">
            {audio ? (
              <button
                className="rounded-[50%] bg-secondary p-4"
                onClick={() => setAudio(!audio)}
              >
                <MicOff />
              </button>
            ) : (
              <button
                className="rounded-[50%] bg-secondary-content p-4"
                onClick={() => setAudio(!audio)}
              >
                <MicOn />
              </button>
            )}
            {video ? (
              <button
                className="rounded-[50%] bg-secondary p-4"
                onClick={() => stopVideo()}
              >
                <StopVideo />
              </button>
            ) : (
              <button
                className="rounded-[50%] bg-secondary-content p-4"
                onClick={() => startVideo()}
              >
                <VideoIcon />
              </button>
            )}
            <form method="dialog">
              <button
                className="bg-error rounded-[50%] p-4"
                onClick={() => {
                  hangupCallHandler();
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
