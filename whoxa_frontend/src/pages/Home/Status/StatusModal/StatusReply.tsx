import { VscSend } from "react-icons/vsc";
import { useTheme } from "../../../../context/ThemeProvider";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import useApiPost from "../../../../hooks/PostData";
import { MessageList } from "../../../../types/MessageListType";
import { appendMessageWithDateCheck } from "../../../../store/Slices/MessageListSlice";
import { useFile } from "../../../../context/FileProvider";
import { ClipLoader } from "react-spinners";
import base64ToFile from "../../../../utils/base64ToFile";
import { socketInstance } from "../../../../socket/socket";
import { useScrollToBottom } from "react-scroll-to-bottom";
import { useEffect, useRef } from "react";
import scrollToMessage from "../../../../utils/scrollToMessage";
import {
  toggleProfileView,
  updateViewState,
} from "../../../../store/Slices/ViewManagerSlice";
import { useConversationInfo } from "../../../../store/api/useConversationInfo";
import toast from "react-hot-toast";
import { updateCurrentConversation } from "../../../../store/Slices/CurrentConversationSlice";
import { useTranslateText } from "../../../../hooks/useTranslateText";
import { useLocation } from "react-router-dom";
import EmojiPickerCompo from "../../MessageList/SendMessage/EmojiPickerCompo";

export default function StatusReply() {
  // @ts-ignore
  const { theme } = useTheme();
  const messageData = useAppSelector((state) => state.SendMessageData);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const { refetch } = useConversationInfo();

  const dispatch = useAppDispatch();
  const { loading: sendMessageLoading, progress, postData } = useApiPost();
  const translate = useTranslateText();
  const location = useLocation();

  const keydownListenerRef = useRef<(e: KeyboardEvent) => void>(); // Ref for event listener

  // To send message on enter key press Starts ===================================================================
  useEffect(() => {
    // Function to handle key down
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior

        if (messageData.message != "") {
          sendMessageApiCall(e);
        }
      }
    };

    // Assign the handler to the ref
    keydownListenerRef.current = handleKeyDown;
  }, [messageData]); // Update whenever selectedFile changes

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (keydownListenerRef.current) {
        keydownListenerRef.current(e); // Call the current handler in the ref
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  async function sendMessageApiCall(e: any) {
    e.preventDefault();

    // If message is sending then new message can not be send ===================================================
    if (sendMessageLoading) {
      return;
    }
    const messageFormData = new FormData();

    // Ensure message_type is present, otherwise return early
    if (!messageData.message_type) {
      return;
    }

    if (messageData.other_user_id) {
      messageFormData.delete("other_user_id");
      messageFormData.delete("conversation_id");
      messageFormData.delete("phone_number");
      messageFormData.append(
        "other_user_id",
        String(messageData.other_user_id),
      );
    }
    // Append message_type
    messageFormData.append("message_type", messageData.message_type!);

    // Append message type and the corresponding data based on message_type
    // switch (messageData.message_type) {
    //   case "text": {
    if (messageData.message) {
      messageFormData.append("message", messageData.message);
    }
    //   break;
    // }
    // case "image": {
    //   messageFormData.append("files", selectedFile!);
    //   break;
    // }
    // case "video": {
    //   if (messageData.thumbnail_url != "" && messageData.thumbnail_url) {
    //     messageFormData.append("files", selectedFile!);
    //     const thumbnailBlob = base64ToFile(
    //       messageData.thumbnail_url,
    //       "image/png",
    //       "thumbnail.png",
    //     );
    //     messageFormData.append("files", thumbnailBlob);
    //   } else {
    //     console.log("return");
    //     return;
    //   }
    //   break;
    // }
    // case "document":
    //   messageFormData.append("files", selectedFile!);
    //   break;

    // default:
    //   // Handle unknown message_type or cases that don't need extra fields
    //   messageFormData.append("message_type", messageData.message_type!);
    //   break;
    // }

    if (messageData.status_id) {
      messageFormData.append("status_id", messageData.status_id.toString());
    }

    // Make the API call with the constructed FormData
    const sendMessageRes: MessageList = await postData(
      "send-message",
      messageFormData,
      "multipart/form-data",
    );

    // Handle the response (if needed)
    if (sendMessageRes) {
      socketInstance().emit("isTyping", {
        conversation_id: currentConversationData.conversation_id,
        is_typing: 0,
      });
      // @ts-ignore
      if (sendMessageRes.is_block) {
        toast.error(`${currentConversationData.user_name} Blocked You! `);
        return;
      }
      if (
        sendMessageRes.conversation_id ==
        currentConversationData.conversation_id
      ) {
        dispatch(appendMessageWithDateCheck(sendMessageRes));
      }

      // Remove Value from input box
      dispatch(
        updateSendMessageData({
          message: "",
          message_type: "",
          reply_id: 0,
          other_user_id: 0,
        }),
      );
      toast.success("Status Reply sent!");
      setTimeout(() => {
        scrollToMessage(sendMessageRes.message_id, false, true);
      }, 1000);
      // Refetch the media in sidebar ===============================================================
      refetch();
      // Update Chat list
      socketInstance().emit("ChatList", {});
    } else {
      // Error handling here
    }
  }

  return (
    <div className="absolute bottom-24 z-[9999] flex items-center gap-2 rounded-full p-2">
      <div
        className={` ${location.pathname != "/video-call" && location.pathname != "/status" && "absolute"} flex w-full -translate-y-12 items-center justify-center transition-all duration-300 md:translate-y-0`}
      >
        <div className="flex w-[90%] items-center gap-3 xl:w-[100%]">
          <div
            className={`relative flex h-12 w-full gap-2 rounded-xl ${true && "border"} bg-secondary ${theme == "dark" ? "border-[#EEEEEE14]" : "border-[#B0B0B0]"} `}
          >
            <EmojiPickerCompo />

            <form
              className="w-full"
              // onSubmit={sendMessageApiCall}
            >
              <input
                value={messageData.message}
                onChange={(e) => {
                  if (sendMessageLoading) {
                    return;
                  }
                  dispatch(
                    updateSendMessageData({
                      conversation_id: currentConversationData.conversation_id,
                      message: e.target.value,
                      message_type: "text",
                    }),
                  );
                }}
                onFocus={() => {
                  dispatch(
                    updateViewState({
                      showOtherProfile: false,
                      showSearchMessage: false,
                      showStarMessageList: false,
                      showMediaDocLinks: false,
                    }),
                  );
                }}
                type="text"
                className="h-full w-full bg-transparent px-2 text-sm placeholder-lightText outline-none"
                placeholder={translate("Type Message")}
              />
            </form>
          </div>
          <div
            onClick={(e) => {
              if (messageData.message_type == "video") {
                if (
                  messageData.thumbnail_url == "" ||
                  !messageData.thumbnail_url
                ) {
                  return;
                }
              }
              sendMessageApiCall(e);
            }}
            className="primary-gradient grid h-11 min-w-12 cursor-pointer place-content-center rounded-xl"
          >
            {messageData.conversation_id ==
              currentConversationData.conversation_id && sendMessageLoading ? (
              <ClipLoader size={25} className="" />
            ) : (
              <VscSend className="-rotate-45 text-xl" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
