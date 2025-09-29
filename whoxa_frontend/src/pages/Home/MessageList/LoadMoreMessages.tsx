import React, { useEffect, useState } from "react";
import { useAtTop } from "react-scroll-to-bottom";
import { socketInstance } from "../../../socket/socket";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { ClipLoader } from "react-spinners";

import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";
import { useTheme } from "../../../context/ThemeProvider";

export default function LoadMoreMessages() {
  const MessageList = useAppSelector((state) => state.MessageList);
  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const [loadNewData, setLoadNewData] = useState(false);
  // @ts-ignore
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  const messageListDetails = useAppSelector((state) => state.MessageOptions);

  setTimeout(() => {
    setLoadNewData(true);
  }, 1500);

  useEffect(() => {
    if (
      loadNewData == true &&
      messageListDetails.messageListAtTop &&
      messageListDetails.totalPages.toString() != messageListDetails.currentPage
    ) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // console.log(timeZone, "timeZone");
      if (MessageOptions.isMessageLoading) {
        return;
      }
      socketInstance().emit("messageReceived", {
        conversation_id: currentConversationData.conversation_id,
        user_timezone: timeZone,
        page: Number(messageListDetails.currentPage) + 1,
      });
      dispatch(
        updateMessageOptions({
          isMoreMessageLoading: true,
        }),
      );
    }
  }, [messageListDetails.messageListAtTop]);

  return (
    <>
      {messageListDetails.isMoreMessageLoading && (
        <div className="flex h-14 w-full justify-center">
          <ClipLoader size={23} color={theme == "dark" ? "white" : "black"} />
        </div>
      )}
    </>
  );
}
