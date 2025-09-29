import MessageHeader from "./MessageHeader";
import MessageBody from "./MessageBody";

import { useAppSelector } from "../../../utils/hooks";
import ConversationInfoDrawer from "../GroupInfo/ConversationInfoDrawer";
import SendMessage from "./SendMessage/SendMessage";
import IfUserBlocked from "./SendMessage/IfUserBlocked";

import { useTheme } from "../../../context/ThemeProvider";
import { ClipLoader } from "react-spinners";
import EmptyMessageList from "./EmptyMessageList";
import SearchMessageDrawer from "../GroupInfo/SearchMessageDrawer";
import DeleteSelectedMessage from "./SelectedMessageOption/DeleteSelectedMessage";
import ForwardSelectedMessage from "./SelectedMessageOption/ForwardSelectedMessage";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import IfGropIsBlockedByAdmin from "./SendMessage/IfGropIsBlockedByAdmin";

export default function MessageList() {
  const MessageListArray = useAppSelector((state) => state.MessageList);
  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  let { data: conversationInfo, isLoading } = useConversationInfo();
  let ChatListArray = useAppSelector((state) => state.chatList);
  // @ts-ignore
  const { theme } = useTheme();
  return (
    <>
      <MessageHeader />
      {MessageOptions.isMessageLoading ? (
        <div className="flex h-[83dvh] flex-col items-center justify-center gap-y-2 overflow-y-auto px-14 pb-10 lg:py-6">
          <ClipLoader color={theme == "dark" ? "white" : "black"} />
        </div>
      ) : (
        <>
          {MessageListArray.length === 0 ||
          (currentConversationData.public_group &&
            !ChatListArray.some(
              (chatUser) =>
                chatUser.conversation_id ===
                currentConversationData.conversation_id,
            )) ? (
            <EmptyMessageList />
          ) : (
            <MessageBody />
          )}
        </>
      )}

      <ConversationInfoDrawer />
      <SearchMessageDrawer />

      {MessageOptions.selectMessage ? (
        MessageOptions.delete_message ? (
          <DeleteSelectedMessage />
        ) : MessageOptions.forward_message ? (
          <ForwardSelectedMessage />
        ) : (
          <SendMessage />
        )
      ) : currentConversationData.is_block ? (
        <IfUserBlocked />
      ) : conversationInfo?.conversationDetails.blocked_by_admin ? (
        <IfGropIsBlockedByAdmin />
      ) : (
        <SendMessage />
      )}
    </>
  );
}
