import { useState } from "react";
import Participants from "./Participants";
import MessageBody from "../MessageList/MessageBody";
import { useAppSelector } from "../../../utils/hooks";
import ChatInCall from "./ChatInCall";

export default function ChatAndParticipents() {
  const [selectedTab, setSelectedTab] = useState(0);
  const ConnectedUser = useAppSelector((state) => state.ConnectedUser);
  const ViewManager = useAppSelector((state) => state.ViewManager);
  return (
    <div
      className={` ${ViewManager.show_chat_in_call ? "translate-x-0" : "translate-x-full"} fixed left-0 z-20 h-screen w-full border border-borderColor bg-primary shadow-xl transition-all duration-300 lg:relative lg:max-h-[90dvh] lg:w-[25%] lg:translate-x-0 lg:rounded-lg`}
    >
      <div className="mb-3 flex w-full flex-col items-center gap-4 sm:mb-10 sm:justify-between">
        <div className="mt-2 flex w-[95%] justify-start gap-4 rounded-lg bg-[#FAE390] px-2 py-1 lg:gap-6">
          <div
            onClick={() => {
              setSelectedTab(0);
            }}
            className={`p-2 ${
              selectedTab == 0 ? "bg-primary" : "text-black"
            } w-full cursor-pointer rounded-lg text-center text-sm font-medium`}
          >
            Chat
          </div>

          <div
            onClick={() => {
              setSelectedTab(1);
            }}
            className={`p-2 ${
              selectedTab == 1 ? "bg-primary" : "text-black"
            } w-full cursor-pointer rounded-lg text-center text-sm font-medium`}
          >
            Participants({ConnectedUser.length})
          </div>
        </div>

        {selectedTab == 0 && <ChatInCall />}

        {selectedTab == 1 && <Participants />}
      </div>
    </div>
  );
}
