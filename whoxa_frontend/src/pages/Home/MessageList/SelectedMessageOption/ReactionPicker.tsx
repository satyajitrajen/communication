import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { MessageList } from "../../../../types/MessageListType";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useTheme } from "../../../../context/ThemeProvider";
import useApiPost from "../../../../hooks/PostData";
import { updateReaction } from "../../../../store/Slices/MessageListSlice";

export default function ReactionPicker({
  messageData,
}: {
  messageData: MessageList;
}) {
  let dispatch = useAppDispatch();
  let currentConversation = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  const { loading, postData } = useApiPost();

  const userData = useAppSelector((state) => state.userData);
  // @ts-ignore
  const { theme } = useTheme();

  async function handleEmojiClick(emoji: EmojiClickData) {
    const giveReactionRes = await postData("give-reaction", {
      conversation_id: currentConversation.conversation_id,
      reaction: emoji.emoji,
      message_id: messageData.message_id,
    });
    // console.log(giveReactionRes, "giveReactionRes");

    dispatch(
      updateReaction({
        message_id: messageData.message_id,
        user_id: userData.user_id,
        reaction: emoji.emoji,
      }),
    );
  }

  return (
    <>
      <div
        className={`absolute -top-12 ${messageData.myMessage ? "right-0" : "-left-4"} pl-2 opacity-0 ${MessageOptions.selectMessage ? "" : "group-hover:opacity-100"}`}
        // className={`pl-2 opacity-0 ${["video", "image", "link", "location"].includes(messageData.message_type!) && "absolute right-3 top-3"} ${MessageOptions.selectMessage ? "" : "group-hover:opacity-100"}`}
      >
        <div
          className={`relative text-darkText ${messageData.myMessage ? "" : "text-darkText"} `}
        >
          <div
            style={{ zIndex: 9999 }}
            className="z-50 items-center font-semibold shadow-2xl"
          >
            <EmojiPicker
              width={window.innerWidth<= 500?300:350}
              reactionsDefaultOpen={true}
              reactions={["1f44d", "1f603", "1f622", "1f621", "1f44e"]}
              theme={theme == "dark" ? Theme.DARK : Theme.LIGHT}
              onEmojiClick={handleEmojiClick}
              allowExpandReactions={true}
              autoFocusSearch={false}
              // open={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
