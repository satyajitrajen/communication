import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageList } from "../../types/MessageListType";

// Define the type for your state
interface ForwareMessageState {
  selectMessage: boolean;
  forwarded_conversations_id: number[];
}

// Define the initial state using the ForwareMessageState interface
const initialState: ForwareMessageState = {
  selectMessage: false,
  forwarded_conversations_id: [],
};

// Create the slice with proper TypeScript types
const ForwardMessageSlice = createSlice({
  name: "ForwardMessage",
  initialState,
  reducers: {
    updateForwardedList(
      state,
      action: PayloadAction<{ conversation_id: number }>,
    ) {
      const { conversation_id } = action.payload;

      // Add user_id to the array if it's not already present
      if (!state.forwarded_conversations_id.includes(conversation_id)) {
        state.forwarded_conversations_id.push(conversation_id);
      }
    },
    // // Append a message object to the list
    // addMessage(state, action: PayloadAction<MessageList>) {
    //   state.message_list?.push(action.payload);
    // },
    // // Remove a message object from the list by message_id
    clearnForwardedList(state, action: PayloadAction) {
      state.forwarded_conversations_id = [];
    },
  },
});

// Export the reducer and actions
export default ForwardMessageSlice.reducer;
export const { updateForwardedList, clearnForwardedList } =
  ForwardMessageSlice.actions;
