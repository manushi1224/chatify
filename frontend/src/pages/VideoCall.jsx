import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import Peer from "peerjs";

const VideoCall = () => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [callStarted, setCallStarted] = useState(false);
  const [peerInstance, setPeerInstance] = useState(null);
  const [socketId, setSocketId] = useState("");
  const [video, setVideo] = useState(true);
  const socket = useSocket();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const handleUserJoin = useCallback(({ senderId, id }) => {
    console.log("incoming call", senderId, id);
    setSocketId(id);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoin);
    return () => {
      socket.off("user:joined", handleUserJoin);
    };
  }, [socket, handleUserJoin]);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
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

    setPeerInstance(peer);

    return () => {
      peer.disconnect();
    };
  }, []);

  const startCall = () => {
    if (remotePeerId.trim() === "") {
      alert("Please enter a valid remote peer ID");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.onloadedmetadata = () => {
          localVideoRef.current.play();
        };

        const call = peerInstance.call(remotePeerId, stream);

        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.srcObject.onloadedmetadata = () => {
            remoteVideoRef.current.play();
          };
        });

        setCallStarted(true);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  const stopVideo = (videoRef) => {
    videoRef.current.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    setVideo(false);
  };

  const startVideo = (videoRef) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
        setVideo(true);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  return (
    <div>
      <h1>Video Calling App</h1>
      {socketId && <h4>Connected</h4>}
      {!callStarted && (
        <div>
          <input
            type="text"
            placeholder="Enter remote peer ID"
            value={remotePeerId}
            onChange={(e) => setRemotePeerId(e.target.value)}
          />
          <button onClick={startCall}>Start Call</button>
        </div>
      )}
      <div className="flex">
        <div>
          <h2>Your ID: {peerId}</h2>
          <video ref={localVideoRef} autoPlay />
          {video ? (
            <button onClick={() => stopVideo(localVideoRef)}>Stop Video</button>
          ) : (
            <button onClick={() => startVideo(localVideoRef)}>
              Start Video
            </button>
          )}
        </div>
        <div>
          <h2>Remote Video</h2>
          <video ref={remoteVideoRef} autoPlay />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

