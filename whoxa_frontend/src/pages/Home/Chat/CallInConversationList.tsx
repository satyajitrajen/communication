import { ArchiveList, ChatList } from "../../../types/ChatListType";
import { useAppSelector } from "../../../utils/hooks";

// Define the props interface
interface CallInConversationListProps {
  messageData: ChatList | ArchiveList;
}

// Define the functional component with the proper type
export default function CallInConversationList({
  messageData,
}: CallInConversationListProps) {
  const userData = useAppSelector((state) => state.userData);

  return (
    <>
      <div className={"flex items-center gap-0 text-xs text-darkText"}>
        {messageData.last_message_type == "video_call" ? (
          <>
            <div className="grid h-6 w-6 place-content-center rounded-full">
              <img
                src={`${messageData.last_message.split("")[0] == "1" ? "/CallIcons/missed_video_call.png" : messageData.user_id == userData.user_id ? "/CallIcons/outgoing_video_call.png" : "/CallIcons/incoming_video_call.png"}`}
                className="h-4 w-4"
                alt=""
              />
            </div>
            <div>
              {messageData.last_message.split("")[0] == "1"
                ? "Missed Video Call"
                : messageData.user_id == userData.user_id
                  ? "Outgoing Video Call"
                  : "Incoming Video Call"}
            </div>
          </>
        ) : (
          <>
            <div className="grid h-6 w-6 place-content-center rounded-full">
              <img
                src={`${messageData.last_message.split("")[0] == "1" ? "/CallIcons/missed_audio_call.png" : messageData.user_id == userData.user_id ? "/CallIcons/outgoing_audio_call.png" : "/CallIcons/incoming_audio_call.png"}`}
                className="h-4 w-4"
                alt=""
              />
            </div>
            <div>
              {messageData.last_message.split("")[0] == "1"
                ? "Missed Audio Call"
                : messageData.user_id == userData.user_id
                  ? "Outgoing Audio Call"
                  : "Incoming Audio Call"}
            </div>
          </>
        )}
      </div>
    </>
  );
}
