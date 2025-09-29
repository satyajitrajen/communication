import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageList } from "../../types/MessageListType";
import { ArchiveList, ChatList } from "../../types/ChatListType";

const initialState: ChatList | ArchiveList = {
  conversation_id: -1,
  createdAt: "",
  group_name: "",
  group_profile_image: "",
  is_block: false,
  is_group: false,
  last_message: "",
  last_message_type: "",
  phone_number: "",
  profile_image: "",
  updatedAt: "",
  user_id: 0,
  user_name: "",
  unread_count: 0,
  public_group: false,
  email_id: "",
};

// Create a slice of the state
const CurrentConversationSlice = createSlice({
  name: "CurrentConversation",
  initialState,
  reducers: {
    // Reducer to update the CurrentConversation
    updateCurrentConversation(state, action: PayloadAction<Partial<ChatList>>) {
      return { ...state, ...action.payload };
    },
    // Reducer to reset the CurrentConversation to the initial state
    resetCurrentConversation() {
      return initialState;
    },
  },
});

// Export the reducer and actions
export default CurrentConversationSlice.reducer;

export const { updateCurrentConversation, resetCurrentConversation } =
  CurrentConversationSlice.actions;
