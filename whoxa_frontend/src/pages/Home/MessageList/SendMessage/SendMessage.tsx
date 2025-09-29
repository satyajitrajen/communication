import { VscSend } from "react-icons/vsc";
import { useTheme } from "../../../../context/ThemeProvider";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import EmojiPickerCompo from "./EmojiPickerCompo";
import useApiPost from "../../../../hooks/PostData";
import { MessageList } from "../../../../types/MessageListType";
import { appendMessageWithDateCheck } from "../../../../store/Slices/MessageListSlice";
import SelectFile from "./SelectFile";
import ShowSelectedFile from "./ShowSelectedFile";
import { useFile } from "../../../../context/FileProvider";
import { ClipLoader } from "react-spinners";
import base64ToFile from "../../../../utils/base64ToFile";
import { socketInstance } from "../../../../socket/socket";
import SelectedReplyMessage from "../ReplyMessage/SelectedReplyMessage";
import { useScrollToBottom } from "react-scroll-to-bottom";
import { useEffect, useRef, useState } from "react";
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

export default function SendMessage() {
  // @ts-ignore
  const { theme } = useTheme();
  const messageData = useAppSelector((state) => state.SendMessageData);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previouse_conversation_id = currentConversationData.conversation_id;
  const [isStoppedTyping, setIsStoppedTyping] = useState(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // ✅ holds timeout across renders
  const { selectedFile, setSelectedFile } = useFile();
  const { refetch } = useConversationInfo();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const dispatch = useAppDispatch();
  const { loading: sendMessageLoading, progress, postData } = useApiPost();
  const scrollToBottom = useScrollToBottom();
  const translate = useTranslateText();
  const location = useLocation();

  const keydownListenerRef = useRef<(e: KeyboardEvent) => void>(); // Ref for event listener

  // To send message on enter key press Starts ===================================================================
  useEffect(() => {
    // Function to handle key down
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevents newline
        if (selectedFile || messageData.message?.trim() !== "") {
          sendMessageApiCall(e);
        }
      }
    };

    // Assign the handler to the ref
    keydownListenerRef.current = handleKeyDown;
  }, [selectedFile, messageData]); // Update whenever selectedFile changes

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
  }, []);

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
  // To send message on enter key press Ends ===================================================================

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault(); // Prevent default behavior
  //       // alert("enter key press");
  //       if (selectedFile) {
  //         sendMessageApiCall(e);
  //       }
  //     }
  //   };

  //   // Attach the event listener
  //   window.addEventListener("keydown", handleKeyDown);

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  async function sendMessageApiCall(e: any) {
    e.preventDefault();
    // If message is sending then new message can not be send ===================================================
    if (sendMessageLoading) {
      return;
    }
    let messageFormData = new FormData();

    // Ensure conversation_id is present, otherwise return early
    if (
      !currentConversationData.conversation_id &&
      currentConversationData.phone_number == "" &&
      currentConversationData.email_id == ""
    ) {
      return;
    }
    // Ensure message_type is present, otherwise return early
    if (!messageData.message_type) {
      return;
    }

    if (currentConversationData.phone_number != "") {
      messageFormData.append(
        "phone_number",
        currentConversationData.phone_number,
      );
    } else {
      if (
        currentConversationData.conversation_id != -1 &&
        currentConversationData.conversation_id != 0
      ) {
        // Append conversation_id
        messageFormData.append(
          "conversation_id",
          currentConversationData.conversation_id.toString(),
        );
        messageFormData.append(
          "other_user_id",
          String(currentConversationData.user_id),
        );
      } else {
        messageFormData.append(
          "other_user_id",
          String(currentConversationData.user_id),
        );
      }
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
    switch (messageData.message_type) {
      case "text": {
        if (messageData.message) {
          messageFormData.append("message", messageData.message);
        }
        break;
      }
      case "image": {
        messageFormData.append("files", selectedFile!);
        break;
      }
      case "video": {
        if (messageData.thumbnail_url != "" && messageData.thumbnail_url) {
          messageFormData.append("files", selectedFile!);
          const thumbnailBlob = base64ToFile(
            messageData.thumbnail_url,
            "image/png",
            "thumbnail.png",
          );
          messageFormData.append("files", thumbnailBlob);
        } else {
          console.log("return");
          return;
        }
        break;
      }
      case "document":
        messageFormData.append("files", selectedFile!);
        break;

      default:
        // Handle unknown message_type or cases that don't need extra fields
        messageFormData.append("message_type", messageData.message_type!);
        break;
    }

    // Append other optional fields that might be relevant regardless of type
    if (messageData.forward_id) {
      messageFormData.append("forward_id", messageData.forward_id.toString());
    }

    if (messageData.reply_id) {
      messageFormData.append("reply_id", messageData.reply_id.toString());
    }

    if (messageData.status_id) {
      messageFormData.append("status_id", messageData.status_id.toString());
    }

    // Make the API call with the constructed FormData
    let sendMessageRes: MessageList = await postData(
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
      setIsStoppedTyping(true);
      // @ts-ignore
      if (sendMessageRes.is_block) {
        toast.error(`${currentConversationData.user_name} Blocked You! `);
        return;
      }

      scrollToBottom();
      // append new message to message list

      if (
        currentConversationData.conversation_id == 0 ||
        currentConversationData.conversation_id == -1
      ) {
        if (!messageData.other_user_id) {
          dispatch(
            updateCurrentConversation({
              conversation_id: sendMessageRes.conversation_id,
            }),
          );
        }
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

      // Remove selected files
      setSelectedFile(null);

      // console.log(sendMessageRes.message_id, sendMessageRes.message_id);
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

  async function sendTypingStatus() {
    // Emit typing status only if typing had stopped before
    if (isStoppedTyping) {
      socketInstance().emit("isTyping", {
        conversation_id: currentConversationData.conversation_id,
        is_typing: 1,
      });
      setIsStoppedTyping(false); // Mark typing has started
    }

    // Clear existing timeout to reset inactivity timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to emit "typing: false" after 3 seconds of no typing
    typingTimeoutRef.current = setTimeout(() => {
      socketInstance().emit("isTyping", {
        conversation_id: currentConversationData.conversation_id,
        is_typing: 0,
      });
      setIsStoppedTyping(true); // Mark typing has stopped
    }, 3000);
  }

  return (
    <div
      className={` ${location.pathname != "/video-call" && location.pathname != "/status" && "absolute"} -bottom-16 lg:bottom-5  flex w-full ${isIOS ? (isKeyboardOpen ? "-translate-y-20" : "-translate-y-20") : isKeyboardOpen ? "-translate-y-14" : "-translate-y-14"} items-center justify-center transition-all duration-300 md:translate-y-0`}
    >
      <div className="flex w-[90%] items-center gap-3 xl:w-[90%]">
        <div
          className={`relative flex h-fit w-full gap-2 rounded-xl ${selectedFile == null && "border"} bg-secondary ${theme == "dark" ? "border-[#EEEEEE14]" : "border-[#B0B0B0]"} `}
        >
          <EmojiPickerCompo />
          <ShowSelectedFile
            progress={progress}
            sendMessageLoading={sendMessageLoading}
          />
          <SelectedReplyMessage />
          <form
            className="w-full"
            // onSubmit={sendMessageApiCall}
          >
            {/* <input
              value={messageData.status_id ? "" : messageData.message}
              onChange={(e) => {
                sendTypingStatus();
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
            /> */}

            <textarea
              ref={inputRef}
              value={
                ["location", "gif"].includes(messageData.message_type!)
                  ? ""
                  : messageData.message
              }
              onChange={(e) => {
                const textarea = e.target;

                // Auto-resize logic
                textarea.style.height = "auto";
                textarea.style.height = `${textarea.scrollHeight}px`;

                sendTypingStatus();
                if (sendMessageLoading) {
                  return;
                }

                const value = textarea.value;

                if (value.trim() === "") {
                  textarea.style.height = "auto"; // Reset to default if cleared
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
                setIsKeyboardOpen(true);
                dispatch(
                  updateViewState({
                    showOtherProfile: false,
                    showSearchMessage: false,
                    showStarMessageList: false,
                    showMediaDocLinks: false,
                  }),
                );
              }}
              onBlur={() => {
                setIsKeyboardOpen(false);
              }}
              className="h-full w-full resize-none bg-transparent px-2 py-1 pt-3 text-sm placeholder-lightText outline-none"
              placeholder={translate("Type Message")}
              rows={1} // Start with single line
              style={{
                maxHeight: "9rem", // Set max height before scrolling
                overflowY: "auto",
              }}
            />
          </form>
          <SelectFile />
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
  );
}
