import React, { useEffect } from "react";
import Profile from "./Profile";
import RightSideOptions from "./RightSideOptions";
import PinMessages from "./PinMessages/PinMessages";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { socketInstance } from "../../../socket/socket";
import { removePinMessageList } from "../../../store/Slices/PinMessagesSlice";

export default function MessageHeader() {
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (currentConversationData.conversation_id >= 1) {
      dispatch(removePinMessageList());
      socketInstance().emit("pinMessageList", {
        conversation_id: currentConversationData.conversation_id,
      });
    }
  }, [currentConversationData.conversation_id]);

  return (
    <div className="relative">
      <div className="flex h-20 w-full items-center justify-between border-b border-borderColor bg-messageHead p-5 px-2 lg:px-10 2xl:h-24">
        <Profile />
        <RightSideOptions />
      </div>
      {currentConversationData.conversation_id >= 1 && <PinMessages />}
    </div>
  );
}
