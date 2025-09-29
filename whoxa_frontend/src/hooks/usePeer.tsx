import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { useStream } from "../context/StreamProvider";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { socketInstance } from "../socket/socket";
import { useNavigate } from "react-router-dom";
import { updatePeerData } from "../store/Slices/PeerJsSlice";

const PEER_PORT = 4001;
let peerInstance: Peer | null = null; // Global variable to prevent multiple instances

export const usePeer = () => {
  const { addUserStream, removeUserStream, updateUserStream } = useStream();
  const { isVideoEnabled, isAudioEnabled, room_id } = useAppSelector(
    (state) => state.PeerJsSlice,
  );
  const userData = useAppSelector((state) => state.userData);
  const [isAnyOneConnected, setIsAnyOneConnected] = useState(false);
  // let room_id = "3187049a-504f-4b11-9096-d11abb307813";
  const myPeer = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socket = socketInstance(); // Store socket in a ref
  const ConnectedUser = useAppSelector((state) => state.ConnectedUser);
  const navigate = useNavigate();
  const call_type = sessionStorage.getItem("call_type");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ConnectedUser.length >= 2) {
      setIsAnyOneConnected(true);
    }
    if (ConnectedUser.length <= 1 && isAnyOneConnected) {
      disposePeer();
    }
  }, [ConnectedUser]);

  useEffect(() => {
    if (!userData.user_id) {
      return;
    }
    if (peerInstance) {
      myPeer.current = peerInstance;
      return; // Use existing peer instead of creating a new one
    }

    peerInstance = new Peer(undefined, {
      host: "/",
      port: PEER_PORT,
    });

    myPeer.current = peerInstance;

    // console.log(userData.user_id, "outside open event userData.user_id");

    peerInstance.on("open", (id) => {
      // console.log(userData.user_id, "userData.user_id");
      // let startTime = Date.now();
      // sessionStorage.setItem("callStartTime", startTime);

      dispatch(
        updatePeerData({
          isVideoEnabled: call_type == "video_call" ? true : false,
        }),
      );
      navigator.mediaDevices
        .getUserMedia({
          video: call_type == "video_call" ? true : false,
          audio: true,
        })
        .then((stream) => {
          console.log(stream, "audio stream");

          socket.emit("join-call", {
            room_id: room_id,
            peer_id: id,
            user_name: userData.user_name,
            user_id: userData.user_id,
          });

          streamRef.current = stream;

          addUserStream({
            peerId: myPeer.current?.id!,
            userName: "You",
            userId: userData.user_id,
            stream,
            isAudioEnabled,
            isVideoEnabled: call_type == "video_call" ? true : false,
            isLocal: true,
            currentVideo: true,
            isScreenSharing: false,
          });

          peerInstance?.on("call", (call) => {
            console.log("Received call from:", call.metadata); // Logs metadata

            call.answer(stream);
            call.on("stream", (userStream) => {
              // console.log(call.metadata, "call.metadata inside stream");
              if (!sessionStorage.getItem("callStartTime")) {
                sessionStorage.setItem("callStartTime", Date.now().toString());
              }

              addUserStream({
                peerId: call.peer,
                stream: userStream,
                isLocal: false,
                userName: call.metadata.user_name || "Guest",
                userId: call.metadata.user_id,
                isAudioEnabled: true,
                isVideoEnabled: call_type == "video_call" ? true : false,
                currentVideo: false,
                isScreenSharing: false,
              });
            });
          });

          socket.on(
            "user-connected-to-call",
            ({
              peer_id,
              user_name,
              user_id,
            }: {
              peer_id: string;
              user_name: string;
              user_id: number;
            }) => {
              setTimeout(() => {
                console.log(peer_id, user_name, user_id, "new user data");

                const call = peerInstance?.call(peer_id, stream, {
                  metadata: {
                    user_id: userData.user_id,
                    user_name: userData.user_name,
                  },
                });
                console.log(call, "call user res");

                call?.on("stream", (userStream) => {
                  if (!sessionStorage.getItem("callStartTime")) {
                    sessionStorage.setItem(
                      "callStartTime",
                      Date.now().toString(),
                    );
                  }
                  addUserStream({
                    peerId: call.peer,
                    stream: userStream,
                    isLocal: false,
                    userName: user_name,
                    userId: user_id,
                    isAudioEnabled: true,
                    isVideoEnabled: call_type == "video_call" ? true : false,
                    currentVideo: false,
                    isScreenSharing: false,
                  });
                });
              }, 100);
            },
          );

          socket.on("user-disconnected-from-call", (peer_id: string) => {
            removeUserStream(peer_id);

            // if (ConnectedUser.length <= 2) {
            //   disposePeer();
            // }
          });
          socket.on("call-changes", (data) => {
            updateUserStream(data?.peer_id!, {
              isAudioEnabled:
                data.isAudioEnabled != undefined ? data.isAudioEnabled : true,
              isVideoEnabled:
                data.isVideoEnabled != undefined ? data.isVideoEnabled : true,
            });
          });
        })
        .catch((err) => console.error("Media devices error:", err));
    });

    return () => {};
  }, [userData.user_id]);

  // Dispose peer and cleanup
  const disposePeer = () => {
    if (peerInstance) {
      peerInstance.destroy(); // Destroy peer instance
    }
    streamRef.current?.getTracks().forEach((track) => track.stop()); // Stop media tracks

    peerInstance = null; // Reset the global peer instance
    window.location.replace("/chat");
  };

  // Toggle video without re-fetching stream
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoEnabled;
      });
      updateUserStream(peerInstance?.id!, { isVideoEnabled });
    }
  }, [isVideoEnabled]);

  // Toggle audio without re-fetching stream
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isAudioEnabled;
      });
      updateUserStream(myPeer.current?.id!, { isAudioEnabled });
    }
  }, [isAudioEnabled]);

  return { myPeer, streamRef };
};
