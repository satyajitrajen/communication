import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageList } from "../../types/MessageListType";
import { ChatList } from "../../types/ChatListType";
import { ConversationsUser } from "../../types/ConversationInfoType";

const initialState: ConversationsUser = {
  conversations_user_id: 0,
  // @ts-ignore
  createdAt: "",
  is_admin: false,
  User: {
    bio: "",
    country: "",
    country_code: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    profile_image: "",
    user_id: 0,
    user_name: "",
  },
};

// Create a slice of the state
const SelectedGroupMemberSlice = createSlice({
  name: "SelectedGroupMember",
  initialState,
  reducers: {
    // Reducer to update the MessageList
    updateSelectedGroupMember(
      state,
      action: PayloadAction<Partial<ConversationsUser>>,
    ) {
      // console.log("action.payload", action.payload);
      // Directly modify the state to replace the chatList
      return { ...state, ...action.payload };
    },
  },
});

// Export the reducer and actions
export default SelectedGroupMemberSlice.reducer;

export const { updateSelectedGroupMember } = SelectedGroupMemberSlice.actions;
