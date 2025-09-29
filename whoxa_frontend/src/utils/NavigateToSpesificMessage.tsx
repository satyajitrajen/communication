import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import scrollToMessage from "./scrollToMessage";
import { updateNavigateToSpesificMessage } from "../store/Slices/NavigateToSpesificMessageSlice";
import { socketInstance } from "../socket/socket";

export default function NavigateToSpesificMessage() {
  let CurrentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  let NavigateToSpesificMessageData = useAppSelector(
    (state) => state.NavigateToSpesificMessage,
  );
  let MessageOptionsData = useAppSelector((state) => state.MessageOptions);
  const MessageListArray = useAppSelector((state) => state.MessageList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (NavigateToSpesificMessageData.navigate_to_message == true) {
      navigateToMessage();
    }
  }, [NavigateToSpesificMessageData.navigate_to_message, MessageListArray]);

  async function navigateToMessage() {
    // alert("navigate")
    let spesificMessage = MessageListArray.find(
      (message) =>
        message.message_id == NavigateToSpesificMessageData.message_id,
    );

    if (spesificMessage) {
      let message_id = NavigateToSpesificMessageData.message_id?.toString();
      setTimeout(() => {
        // @ts-ignore
        scrollToMessage(message_id, true, true);
      }, 300);
      dispatch(
        updateNavigateToSpesificMessage({
          conversation_id: 0,
          navigate_to_message: false,
          message_id: 0,
        }),
      );
    }
  }

  return <div></div>;
}
