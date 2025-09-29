import { ArchiveList, ChatList } from "../../../types/ChatListType";
import { CallList } from "../../../types/ResType";
import { useAppSelector } from "../../../utils/hooks";

// Define the props interface
interface CallInCallHistoryProps {
  callData: CallList;
}

// Define the functional component with the proper type
export default function CallInCallHistory({
  callData,
}: CallInCallHistoryProps) {
  const userData = useAppSelector((state) => state.userData);

  return (
    <>
      <div className={"flex items-center gap-0 text-xs text-darkText"}>
        {callData.call_type == "video_call" ? (
          <>
            <div className="grid h-6 w-6 place-content-center rounded-full">
              <img
                src={`${callData.missed_call == "1" ? "/CallIcons/missed_video_call.png" : callData.user_id == userData.user_id ? "/CallIcons/outgoing_video_call.png" : "/CallIcons/incoming_video_call.png"}`}
                className="h-4 w-4"
                alt=""
              />
            </div>
            <div>
              {callData.missed_call == "1"
                ? "Missed Video Call"
                : callData.user_id == userData.user_id
                  ? "Outgoing Video Call"
                  : "Incoming Video Call"}
            </div>
          </>
        ) : (
          <>
            <div className="grid h-6 w-6 place-content-center rounded-full">
              <img
                src={`${callData.missed_call == "1" ? "/CallIcons/missed_audio_call.png" : callData.user_id == userData.user_id ? "/CallIcons/outgoing_audio_call.png" : "/CallIcons/incoming_audio_call.png"}`}
                className="h-4 w-4"
                alt=""
              />
            </div>
            <div>
              {callData.missed_call == "1"
                ? "Missed Audio Call"
                : callData.user_id == userData.user_id
                  ? "Outgoing Audio Call"
                  : "Incoming Audio Call"}
            </div>
          </>
        )}
      </div>
    </>
  );
}
