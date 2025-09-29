import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useStream } from "../../../context/StreamProvider";
import { useEffect, useState } from "react";
import { useWebsiteSettings } from "../../../store/api/useWebsiteSettings";
import { socketInstance } from "../../../socket/socket";
import { usePeer } from "../../../hooks/usePeer";
import { LuUsers } from "react-icons/lu";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { RxCross1 } from "react-icons/rx";

export default function CallHeader() {
  const { userStreams } = useStream();
  const dispatch = useAppDispatch();
  const socket = socketInstance();
  const { room_id } = useAppSelector((state) => state.PeerJsSlice);
  const { myPeer } = usePeer();
  const Viewmanager = useAppSelector((state) => state.ViewManager);
  function endCall() {
    socket.emit("leave-call", {
      room_id: room_id,
      peer_id: myPeer?.current?.id,
      call_type: "video_call",
    });
    sessionStorage.removeItem("callStartTime");
    window.location.replace("/chat");
  }

  return (
    <div className="flex h-16 w-full items-center justify-between bg-gradient-to-l from-[#FCC60480] to-[#FFEDAB80] px-4 lg:px-8">
      <img
        src={`/CallIcons/whoxa_logo.png`}
        className="h-16 w-40 object-contain"
        alt=""
      />

      {Viewmanager.show_chat_in_call ? (
        <div
          onClick={() => {
            dispatch(updateViewState({ show_chat_in_call: false }));
          }}
          className="rounded-full bg-black bg-opacity-25 p-2 lg:hidden"
        >
          <RxCross1 className="text-xl" />
        </div>
      ) : (
        <div
          onClick={() => {
            dispatch(updateViewState({ show_chat_in_call: true }));
          }}
          className="rounded-full bg-black bg-opacity-25 p-2 lg:hidden"
        >
          <LuUsers className="text-xl" />
        </div>
      )}

      <div
        onClick={endCall}
        className="hidden cursor-pointer rounded-full bg-[#FA4343] px-4 py-1 text-white lg:block"
      >
        End Call
      </div>
    </div>
  );
}
