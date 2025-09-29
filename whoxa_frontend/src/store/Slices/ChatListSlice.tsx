import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatList, ChatListRes } from "../../types/ChatListType";

// Define the initial state with an empty chatList
const initialState: ChatList[] = [];

// Create a slice of the state
const ChatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    // Reducer to update the chatList
    updateChatList(state, action: PayloadAction<ChatList[]>) {
      // console.log("action.payload", action.payload);
      // Directly modify the state to replace the chatList
      return action.payload;
    },

    updateByConversationId(
      state,
      action: PayloadAction<{
        conversation_id: any;
        last_message: string;
        last_message_type: string;
      }>, // single object in payload
    ) {
      // console.log(action.payload, "action.payload");

      return state.map((conversation) => {
        if (conversation.conversation_id == action.payload.conversation_id) {
          return {
            ...conversation,
            last_message: action.payload.last_message,
            last_message_type: action.payload.last_message_type,
          };
        }
        return conversation;
      });
    },
    updateUnreadCountByConversationId(
      state,
      action: PayloadAction<{
        conversation_id: any;
      }>, // single object in payload
    ) {
      // console.log(action.payload, "action.payload");

      return state.map((conversation) => {

        if (
          Number(conversation.conversation_id) ==
          Number(action.payload.conversation_id)
        ) {
          return {
            ...conversation,
            unread_count: 0,
          };
        }
        return conversation;
      });
    },
  },
});

// Export the reducer and actions
export default ChatListSlice.reducer;
export const {
  updateChatList,
  updateByConversationId,
  updateUnreadCountByConversationId,
} = ChatListSlice.actions;
