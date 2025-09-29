import React from "react";
import { MessageList } from "../../../../types/MessageListType";
import PollResult from "./PollResult";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";
import { useAppDispatch } from "../../../../utils/hooks";

export default function PollMessages({
  messageData,
}: {
  messageData: MessageList;
}) {
  let dispatch = useAppDispatch();
  return (
    <>
      <div className="min-w-64 sm:min-w-80 p-2 pb-10">
        <div className="pb-1 text-base">{messageData.message}</div>
        <div className="flex gap-1">
          <img
            className="h-4 w-4 object-contain"
            src="/MessageListIcons/selected_option.png"
            alt=""
          />
          <div className="text-xs">Select one</div>
        </div>

        <PollResult messageData={messageData} />
        <div
          onClick={() => {
            dispatch(
              updateMessageOptions({
                show_view_poll_vote_modal: true,
                message_id: messageData.message_id,
              }),
            );
          }}
          className="absolute bottom-0 left-0 w-full cursor-pointer bg-black py-3 text-center text-white"
        >
          View Vote
        </div>
      </div>
    </>
  );
}
