"use client";
import React, { useEffect } from "react";
import { useStream } from "../../../context/StreamProvider";
import { FiMic, FiMicOff } from "react-icons/fi";
import { usePeer } from "../../../hooks/usePeer";
import { useAppSelector } from "../../../utils/hooks";

export default function VideoGrid() {
  const { userStreams } = useStream();

  const { myPeer } = usePeer();

  const { updateCurrentStream } = useStream();
  const ConnectedUser = useAppSelector((state) => state.ConnectedUser);
  const userData = useAppSelector((state) => state.userData);

  useEffect(() => {
    console.log(userStreams, "userStreams+++++++++++++++");
  }, [userStreams]);
  return (
    <div className="flex h-[22%] gap-3 overflow-hidden overflow-x-scroll">
      {Object.values(userStreams)
        .filter((userStream) => userStream.currentVideo == false)
        // .flatMap((userStream) => Array.from({ length: 3 }, () => userStream))
        .map(
          ({
            peerId,
            stream,
            userName,
            isAudioEnabled,
            isLocal,
            isVideoEnabled,
            userId,
          }) => (
            <div
              className="relative w-40 shrink-0 overflow-hidden rounded-lg lg:w-64"
              id={peerId}
              key={peerId}
            >
              <div className="absolute bottom-2 left-4 z-10">
                {ConnectedUser.length >= 1 && userData.user_id == userId
                  ? "You"
                  : ConnectedUser.find((user) => user.user_id == userId)
                      ?.first_name +
                    " " +
                    ConnectedUser.find((user) => user.user_id == userId)
                      ?.last_name}
                {/* {peerId === "local" ? "(You)" : ""} */}
              </div>

              {isVideoEnabled ? (
                <video
                  style={{ transform: "scaleX(-1)" }} // to mirror the camera
                  className="h-full w-full cursor-pointer object-cover"
                  ref={(video) => video && (video.srcObject = stream)}
                  onClick={() => {
                    updateCurrentStream(peerId);
                  }}
                  muted={isLocal}
                  autoPlay
                  playsInline
                />
              ) : isAudioEnabled ? (
                <div
                  onClick={() => {
                    updateCurrentStream(peerId);
                  }}
                  style={{
                    backgroundImage: `url(${ConnectedUser.find((user) => user.user_id == userId)?.profile_image})`,
                  }}
                  className={`z-20 h-full w-full cursor-pointer overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat`}
                >
                  <div className="grid h-full w-full place-content-center bg-white bg-opacity-40 backdrop-blur-sm">
                    <div>
                      <img
                        src={
                          ConnectedUser.find((user) => user.user_id == userId)
                            ?.profile_image
                        }
                        className="h-28 w-28 rounded-full object-cover"
                        alt=""
                      />
                      <audio
                        autoPlay
                        className="hidden"
                        playsInline
                        muted={isLocal}
                        ref={(audio) => {
                          if (audio && stream) {
                            audio.srcObject = stream;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    updateCurrentStream(peerId);
                  }}
                  style={{
                    backgroundImage: `url(${ConnectedUser.find((user) => user.user_id == userId)?.profile_image})`,
                  }}
                  className={`z-20 h-full w-full cursor-pointer overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat`}
                >
                  <div className="grid h-full w-full place-content-center bg-white bg-opacity-40 backdrop-blur-sm">
                    <div>
                      <img
                        src={
                          ConnectedUser.find((user) => user.user_id == userId)
                            ?.profile_image
                        }
                        className="h-28 w-28 rounded-full object-cover"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute right-4 top-2 rounded-full bg-gray-300 bg-opacity-40 p-1">
                {isAudioEnabled ? (
                  <FiMic className="text-xl text-black" />
                ) : (
                  <FiMicOff className="text-xl text-black" />
                )}
              </div>
            </div>
          ),
        )}
    </div>
  );
}
