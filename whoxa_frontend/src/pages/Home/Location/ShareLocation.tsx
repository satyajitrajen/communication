import React from "react";
import Button from "../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { MessageList } from "../../../types/MessageListType";
import useApiPost from "../../../hooks/PostData";
import { socketInstance } from "../../../socket/socket";
import scrollToMessage from "../../../utils/scrollToMessage";
import { updateSendMessageData } from "../../../store/Slices/SendMessageSlice";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";
import toast from "react-hot-toast";
import { appendMessageWithDateCheck } from "../../../store/Slices/MessageListSlice";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";

export default function ShareLocation() {
  let sendMessageData = useAppSelector((state) => state.SendMessageData);

  const { loading: sendMessageLoading, progress, postData } = useApiPost();
  const dispatch = useAppDispatch();
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  async function shareLocationApiCall() {
    // Make the API call with the constructed FormData

    let messageFormData = new FormData();

    if (
      currentConversationData.conversation_id != -1 &&
      currentConversationData.conversation_id != 0
    ) {
      // Append conversation_id
      messageFormData.append(
        "conversation_id",
        currentConversationData.conversation_id.toString(),
      );
    } else {
      messageFormData.append(
        "phone_number",
        currentConversationData.phone_number,
      );
    }

    messageFormData.append(
      "message_type",
      String(sendMessageData.message_type),
    );
    messageFormData.append("message", String(sendMessageData.message));
    messageFormData.append("latitude", String(sendMessageData.latitude));
    messageFormData.append("longitude", String(sendMessageData.longitude));
    messageFormData.append(
      "other_user_id",
      String(currentConversationData.user_id),
    );
    let sendMessageRes: MessageList = await postData(
      "send-message",
      messageFormData,
      "multipart/form-data",
    );

    // Handle the response (if needed)
    if (sendMessageRes) {
      // @ts-ignore
      if (sendMessageRes.is_block) {
        toast.error(`${currentConversationData.user_name} Blocked You! `);
        return;
      }

      // append new message to message list

      if (
        currentConversationData.conversation_id == 0 ||
        currentConversationData.conversation_id == -1
      ) {
        dispatch(
          updateCurrentConversation({
            conversation_id: sendMessageRes.conversation_id,
          }),
        );
      }

      if (
        sendMessageRes.conversation_id ==
        currentConversationData.conversation_id
      ) {
        dispatch(appendMessageWithDateCheck(sendMessageRes));
      }

      // console.log(sendMessageRes.message_id, sendMessageRes.message_id);
      setTimeout(() => {
        scrollToMessage(sendMessageRes.message_id, false, true);
        dispatch(updateMessageOptions({ show_send_location_modal: false }));
        // Remove Value from input box
        dispatch(
          updateSendMessageData({
            message: "",
            message_type: "",
            reply_id: 0,
          }),
        );
      }, 500);

      // Update Chat list
      socketInstance().emit("ChatList", {});
    } else {
      // Error handling here
    }
  }

  return (
    <div className="relative">
      <div className="absolute -bottom-3 left-2 w-full">
        <div className="mx-auto flex h-14 w-[90%] items-center justify-between rounded-lg border border-[#FCC604] bg-[#FFF8E0] px-2">
          <div className="flex items-center gap-2">
            <img
              className="h-7 w-7 object-contain"
              src="/MessageListIcons/location_icon.png"
              alt=""
            />
            <span className="text-sm text-black">
              {sendMessageData.message}
            </span>
          </div>
          <div>
            <Button
              onClickFunc={shareLocationApiCall}
              className={"!h-9 w-fit text-nowrap !px-4 !text-sm"}
              text={"Share Location"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
