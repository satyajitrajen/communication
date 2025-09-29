import React from "react";
import { MessageList } from "../../../types/MessageListType";
import { IoCallOutline } from "react-icons/io5";
import { useAppSelector } from "../../../utils/hooks";

// Define the props interface
interface CallInMessageListProps {
  messageData: MessageList;
}

// Define the functional component with the proper type
export default function CallInMessageList({
  messageData,
}: CallInMessageListProps) {
  const userData = useAppSelector((state) => state.userData);

  return (
    <>
      <div
        className={
          "flex h-12 w-48 items-center gap-2 rounded-lg bg-secondary p-1 text-xs text-darkText"
        }
      >
        {messageData.message_type == "video_call" ? (
          <>
            <div className="grid h-8 w-8 place-content-center rounded-full bg-otherMessageBg">
              <img
                src={`${messageData.message.split("")[0] == "1" ? "/CallIcons/missed_video_call.png" : messageData.senderId == userData.user_id ? "/CallIcons/outgoing_video_call.png" : "/CallIcons/incoming_video_call.png"}`}
                className="h-4 w-4"
                alt=""
              />
            </div>
            <div>
              {messageData.message.split("")[0] == "1"
                ? "Missed Video Call"
                : messageData.senderId == userData.user_id
                  ? "Outgoing Video Call"
                  : "Incoming Video Call"}
            </div>
          </>
        ) : (
          <>
            <div className="grid h-8 w-8 place-content-center rounded-full bg-otherMessageBg">
              <img
                src={`${messageData.message.split("")[0] == "1" ? "/CallIcons/missed_audio_call.png" : messageData.senderId == userData.user_id ? "/CallIcons/outgoing_audio_call.png" : "/CallIcons/incoming_audio_call.png"}`}
                className="h-4 w-4"
                alt=""
              />
            </div>
            <div>
              {messageData.message.split("")[0] == "1"
                ? "Missed Audio Call"
                : messageData.senderId == userData.user_id
                  ? "Outgoing Audio Call"
                  : "Incoming Audio Call"}
            </div>
          </>
        )}
      </div>
    </>
  );
}
