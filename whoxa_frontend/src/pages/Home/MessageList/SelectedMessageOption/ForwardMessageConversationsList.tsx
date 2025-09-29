import LoadingSkeletonImageDynamic from "../../../../components/LoadingSkeletonImageDynamic";
import { useTheme } from "../../../../context/ThemeProvider";
import useApiPost from "../../../../hooks/PostData";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateForwardedList } from "../../../../store/Slices/ForwardMessageSlice";
import { MessageList } from "../../../../types/MessageListType";
import { socketInstance } from "../../../../socket/socket";
import { IoCheckmarkOutline } from "react-icons/io5";

export default function ForwardMessageConversationsList({
  searchUser,
}: {
  searchUser: string;
}) {
  // @ts-ignore
  const { theme } = useTheme();

  const ChatListArray = useAppSelector((state) => state.chatList);

  let ForwardMessageData = useAppSelector((state) => state.ForwardMessage);
  let CurrentConversation = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const MessageOptions = useAppSelector((state) => state.MessageOptions);

  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  const dispatch = useAppDispatch();
  const { loading, postData } = useApiPost();

  async function forwardMessage({
    conversation_id,
  }: {
    conversation_id: number;
  }) {
    if (!MessageOptions.message_list) return; // Check if message_list is defined

    for (const e of MessageOptions.message_list) {
      let sendMessageRes: MessageList = await postData("send-message", {
        message: e.message,
        url: e.url,
        thumbnail: e.thumbnail,
        message_type: e.message_type,
        video_time: e.video_time,
        audio_time: e.audio_time,
        latitude: e.latitude,
        longitude: e.longitude,
        shared_contact_name: e.shared_contact_name,
        shared_contact_number: e.shared_contact_number,
        forward_id: e.message_id,
        reply_id: 0,
        conversation_id: conversation_id,
        shared_contact_profile_image: e.shared_contact_profile_image,
      });

      // Handle the response (if needed)
      console.log(sendMessageRes, "sendMessageRes++++++++++++++++++++++++++=");
      if (sendMessageRes) {
        // Update Chat list
        socketInstance().emit("ChatList", {});
      }
    }
  }

  return (
    <div className="my-5 flex h-[60vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden">
      {ChatListArray?.length != 0 &&
        ChatListArray?.filter(
          (conversations) =>
            conversations.group_name
              .toLowerCase()
              .includes(searchUser.toLowerCase()) ||
            conversations.user_name
              .toLowerCase()
              .includes(searchUser.toLowerCase()),
        ).map((e) => {
          return (
            <>
              <div
                className={`flex cursor-pointer items-center justify-start px-3 py-4 hover:bg-selectedChat ${
                  ForwardMessageData.forwarded_conversations_id.includes(
                    e.conversation_id,
                  ) && "opacity-70"
                }`}
              >
                <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                  <LoadingSkeletonImageDynamic
                    radius=""
                    className="h-10 w-10 rounded-full object-cover 2xl:h-12 2xl:w-12"
                    image_height="100%"
                    image_url={e?.profile_image || e.group_profile_image}
                    image_width=""
                  />
                  {OnlineUserList.onlineUserList.includes(
                    e.user_id.toString(),
                  ) && (
                    <img
                      className="absolute bottom-0 right-0 z-30 h-4 w-4"
                      src="/Home/Online_Green_dot.png"
                      alt=""
                    />
                  )}
                </div>

                <div>
                  <div className="text-base font-medium capitalize text-darkText">
                    {e.is_group ? e.group_name : e.user_name}
                  </div>

                  {/* <div className="flex items-center gap-x-1">
                    <div className="line-clamp-1 flex w-full max-w-[12.5rem] gap-x-1 text-[13px] text-lightText">
                      {e.is_group ? e.group_name : e.user_name}
                    </div>
                  </div> */}
                </div>

                <button
                  onClick={() => {
                    dispatch(
                      updateForwardedList({
                        conversation_id: e.conversation_id,
                      }),
                    );
                    forwardMessage({ conversation_id: e.conversation_id });
                  }}
                  // if member is allready in the group then can not be removed from here
                  style={{
                    pointerEvents:
                      ForwardMessageData.forwarded_conversations_id.includes(
                        e.conversation_id,
                      )
                        ? "none"
                        : "auto",
                  }}
                  className={`relative ml-auto mr-3 h-9 w-24 overflow-hidden rounded-full border ${
                    ForwardMessageData.forwarded_conversations_id.includes(
                      e.conversation_id,
                    )
                      ? "border-[#D6D6D6]"
                      : "border-[#FCC605]"
                  } px-4 text-base font-medium outline-none`}
                >
                  {ForwardMessageData.forwarded_conversations_id.includes(
                    e.conversation_id,
                  ) ? (
                    <span className="flex items-center gap-1">
                      <IoCheckmarkOutline className="text-lg text-[#D6D6D6]" />
                      <span>Sent</span>
                    </span>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
              <hr className="border-t border-borderColor" />
            </>
          );
        })}

      {/* {CreateGroup.user_id.length !== 0 && (
        <div className="absolute bottom-0 flex h-24 w-full items-end bg-gradient-to-t from-primary to-transparent">
          <div
            onClick={() => {
              addMemberToGroup();
              // navigate("/create-group");
            }}
            className="primary-gradient mx-auto my-5 w-[90%] cursor-pointer rounded-lg py-2 text-center"
          >
            {loading ? (
              <ClipLoader
                size={19}
                color={theme == "dark" ? "white" : "black"}
              />
            ) : (
              "Add Member"
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}
