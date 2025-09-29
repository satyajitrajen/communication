import { useDebugValue, useEffect, useRef, useState } from "react";
import { socketInstance } from "./socket";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import {
  updateByConversationId,
  updateChatList,
  updateUnreadCountByConversationId,
} from "../store/Slices/ChatListSlice";
import { ArchiveListRes, ChatListRes } from "../types/ChatListType";
import { MessageList, MessageListRes } from "../types/MessageListType";
import {
  appendMessageWithDateCheck,
  updateMessageList,
  updateMessagesByIds,
  updateMessagesReadStatusByIds,
  updatePollVote,
  updateReaction,
} from "../store/Slices/MessageListSlice";
import { updateMessageOptions } from "../store/Slices/MessageOptionsSlice";
import {
  LastSeenUserRes,
  OnlineUserRes,
  TypingUserListRes,
} from "../types/OnlineUserType";
import { updateOnlineUserList } from "../store/Slices/OnlineUserSlice";
import { UserLastSeenSliceUserList } from "../store/Slices/UserLastSeenSlice";
import { updateTypingUserList } from "../store/Slices/TypingUserListSlice";
import { updateArchiveList } from "../store/Slices/ArchiveListSlice";
import scrollToMessage from "../utils/scrollToMessage";
import { useConversationInfo } from "../store/api/useConversationInfo";
import {
  CallData,
  ConnectedUserListRes,
  PinMessageListRes,
} from "../types/ResType";
import { updateConnectedUserList } from "../store/Slices/ConnectedUserSlice";
import { updateViewState } from "../store/Slices/ViewManagerSlice";
import { updateCallData } from "../store/Slices/CallDataSlice";
import { updatePeerData } from "../store/Slices/PeerJsSlice";
import { updateCurrentConversation } from "../store/Slices/CurrentConversationSlice";
import { updatePinMessages } from "../store/Slices/PinMessagesSlice";

export default function ListenAllEvents() {
  const dispatch = useAppDispatch();
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const userData = useAppSelector((state) => state.userData);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  let { refetch: refetchConversationInfo } = useConversationInfo();
  let MessageList = useAppSelector((state) => state.MessageList);
  // Use useRef to store the latest value of currentConversationData.conversation_id
  const currentConversationIdRef = useRef(
    currentConversationData.conversation_id,
  );
  const messageListRef = useRef(MessageList);
  const userDataRef = useRef(userData);

  useEffect(() => {
    messageListRef.current = MessageList;
  }, [MessageList]);

  useEffect(() => {
    userDataRef.current = userData;
  }, [userData]);

  // Keep ref updated with the latest conversation_id
  useEffect(() => {
    currentConversationIdRef.current = currentConversationData.conversation_id;
  }, [currentConversationData]);

  function newMessageCommingSound() {
    // const audio = new Audio(
    //   "http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav",
    // );
    const audio = new Audio("/audio/achive-sound-132273.mp3");
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }

  function appendMessageToMessageList(MessageListRes: MessageListRes) {
    if (Array.isArray(MessageListRes.MessageList)) {
      // dispatch(removeMessageList());
      dispatch(
        updateMessageOptions({
          currentPage: MessageListRes.currentPage,
          totalPages: MessageListRes.totalPages,
          isMessageLoading: false,
          isMoreMessageLoading: false,
          messageListAtTop: false,
        }),
      );
      dispatch(updateMessageList(MessageListRes.MessageList));
      setTimeout(() => {
        scrollToMessage(
          MessageListRes.MessageList[MessageListRes.MessageList.length - 1]
            .message_id,
          false,
          false,
        );
      }, 10);
    } else {
      // Play message comming sound
      newMessageCommingSound();
      dispatch(updateMessageOptions({ messageListAtTop: false }));
      // console.log(
      //   currentConversationIdRef.current,
      //   "currentConversationIdRef.current __________________________-",
      // );
      // console.log(
      //   MessageListRes.conversation_id,
      //   "MessageListRes.conversation_id __________________________-",
      // );

      // Use the current value from the ref to compare conversation_ids
      if (
        String(currentConversationIdRef.current) ==
        String(MessageListRes.conversation_id)
      ) {
        // refetchConversationInfo to update the media link and docs in sidebar
        refetchConversationInfo();

        // @ts-ignore
        let messageData: MessageList = MessageListRes;
        messageData.myMessage =
          String(messageData.senderId) === String(userDataRef.current.user_id);

        console.log(messageData.senderId, "messageData.senderId");
        console.log(userDataRef.current.user_id, "userData.user_id");

        console.log(messageData.myMessage, "messageData.myMessage");

        dispatch(appendMessageWithDateCheck(messageData));

        // notify other user that you have seen the message in real-time ===================================================================

        // setInterval(() => {
        //   if (isVisible) {
        //     socketInstance().emit("messageViewed", {
        //       conversation_id: currentConversationIdRef.current,
        //       message_id: MessageListRes.message_id,
        //     });
        //   }
        // }, 2000);
        // Set up the interval to check visibility every 2 seconds
        intervalRef.current = setInterval(() => {
          if (document.hidden) return; // Skip if the tab is not visible
          // Emit the event if the tab is visible
          socketInstance().emit("messageViewed", {
            conversation_id: currentConversationIdRef.current,
            message_id: MessageListRes.message_id,
          });
          dispatch(
            updateUnreadCountByConversationId({
              conversation_id: currentConversationIdRef.current,
            }),
          );
          // Clear the interval once the messageViewed is emitted
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }, 1000);

        setTimeout(() => {
          scrollToMessage(MessageListRes.message_id, false, true);
        }, 10);
      }
    }
  }

  useEffect(() => {
    const socket = socketInstance();

    socket.on("onlineUsers", (onlineUsers: OnlineUserRes) => {
      dispatch(updateOnlineUserList(onlineUsers));
    });

    socket.on("userLastSeenList", (userLastSeenList: LastSeenUserRes) => {
      dispatch(UserLastSeenSliceUserList(userLastSeenList));
    });

    socket.on("isTyping", (userTypingList: TypingUserListRes) => {
      dispatch(updateTypingUserList(userTypingList));
    });

    socket.on("ChatList", (ChatListRes: ChatListRes) => {
      console.log(ChatListRes.chatList, "ChatListRes.chatList");
      dispatch(updateChatList(ChatListRes.chatList));
    });

    socket.on("ArchiveList", (ChatListRes: ArchiveListRes) => {
      dispatch(updateArchiveList(ChatListRes.archiveList));
    });

    socket.on("messageReceived", (MessageListRes: MessageListRes) => {
      appendMessageToMessageList(MessageListRes);
    });
    socket.on(
      "connected-user-list",
      (ConnectedUserListRes: ConnectedUserListRes) => {
        dispatch(updateConnectedUserList(ConnectedUserListRes.connectedUsers));
      },
    );

    socket.on(
      "update_poll_vote",
      ({
        message_id,
        poll_option_id,
        conversation_id,
        user_id,
      }: {
        message_id: number;
        poll_option_id: number;
        conversation_id: number;
        user_id: number;
      }) => {
        console.log(message_id, poll_option_id, conversation_id, user_id);

        dispatch(
          updatePollVote({
            message_id: message_id,
            new_option_id: poll_option_id,
            user_id: user_id,
          }),
        );
      },
    );

    socket.on(
      "update_data",
      ({
        conversation_id,
        delete_from_everyone_ids,
        update_pin_message,
      }: {
        conversation_id: number;
        delete_from_everyone_ids: number[];
        update_pin_message?: boolean;
      }) => {
        if (
          update_pin_message &&
          conversation_id === currentConversationIdRef.current
        ) {
          socketInstance().emit("pinMessageList", {
            conversation_id: conversation_id,
          });
          return;
        }

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        socketInstance().emit("ChatList", {});
        console.log(conversation_id, "conversation_id");
        console.log(
          currentConversationIdRef.current,
          "currentConversationIdRef.current",
        );

        // Use the current value from the ref
        if (conversation_id === currentConversationIdRef.current) {
          console.log(delete_from_everyone_ids, "delete_from_everyone_ids");

          console.log(
            currentConversationIdRef.current,
            "currentConversationIdRef.current",
          );

          console.log(conversation_id, "remote conversation_id");

          if (
            delete_from_everyone_ids?.length != 0 &&
            delete_from_everyone_ids?.length != undefined
          ) {
            console.log(MessageList, "MessageList+++++++++++++++++++");

            // update messages in message list ========================================================
            delete_from_everyone_ids.map((message_id) => {
              console.log(
                typeof message_id,
                "type of message_id +++++++++++++++++++++++++++++++",
              );

              dispatch(
                updateMessagesByIds({
                  message: "🚫 This message was deleted!",
                  message_id: Number(message_id),
                  delete_from_everyone: true,
                }),
              );
              console.log(
                messageListRef.current[messageListRef.current.length - 1],
                "messageListRef.current[messageListRef.current.length - 1]",
              );
              console.log(message_id, "message_id++++++++++++++");

              // Update chatlist if message is last message in messagelist =============================================
              if (
                messageListRef.current[messageListRef.current.length - 1]
                  .message_id == message_id
              ) {
                dispatch(
                  updateByConversationId({
                    conversation_id: currentConversationIdRef.current,
                    last_message: "🚫 This message was deleted!",
                    last_message_type: "text",
                  }),
                );
              }
            });
          } else {
            socket.emit("messageReceived", {
              conversation_id: conversation_id,
              user_timezone: timeZone,
              per_page_message: 1,
            });
          }
        }

        // update messages in message list ========================================================
        // delete_from_everyone_ids.map((message_id) => {
        //   // Update chatlist if message is last message in messagelist =============================================
        //   if (
        //     messageListRef.current[messageListRef.current.length - 1]
        //       .message_id == message_id
        //   ) {
        //     dispatch(
        //       updateByConversationId({
        //         conversation_id: currentConversationIdRef.current,
        //         last_message: "🚫 This message was deleted!",
        //         last_message_type: "text",
        //       }),
        //     );
        //   }
        // });
      },
    );
    socket.on(
      "update_reactions",
      ({
        message_id,
        reaction,
        conversation_id,
        user_id,
      }: {
        message_id: number;
        reaction: string;
        conversation_id: number;
        user_id: number;
      }) => {
        dispatch(
          updateReaction({
            message_id,
            user_id,
            reaction,
          }),
        );
      },
    );
    socket.on(
      "update_message_read",
      ({ message_id }: { message_id: number }) => {
        dispatch(updateMessagesReadStatusByIds({ message_id }));
      },
    );

    socket.on("call_user", (callData: CallData) => {
      dispatch(updateCallData(callData));
      dispatch(updatePeerData({ room_id: callData.room_id }));

      let conversationData = {
        conversation_id: Number(callData.conversation_id),
        is_group: callData.is_group,
        group_name: callData.senderName,
        group_profile_image: callData.sender_profile_image,
        last_message: "",
        last_message_type: "",
        user_id: callData.receiverId,
        user_name: callData.senderName,
        phone_number: callData.sender_phone_number,
        profile_image: callData.sender_profile_image,
        is_block: false,
        createdAt: "",
        updatedAt: "",
        unread_count: 0,
        public_group: false,
      };
      sessionStorage.setItem("call_type", callData.call_type);
      localStorage.setItem("room_id", callData.room_id);
      // To Update current conversation
      dispatch(updateCurrentConversation(conversationData));
      sessionStorage.setItem(
        "currentConversation",
        JSON.stringify(conversationData),
      );

      dispatch(
        updateViewState({
          show_accept_call_modal: true,
        }),
      );
    });
    socket.on(
      "call_decline",
      (callDeclinedData: {
        call_decline: boolean;
        conversation_id: number;
        message_id: number;
      }) => {
        dispatch(
          updateViewState({
            show_call_declined_modal: true,
          }),
        );
      },
    );
    socket.on("pinMessageList", (pinMessageList: PinMessageListRes) => {
      dispatch(updatePinMessages(pinMessageList));
    });
  }, []);

  return <></>;
}
