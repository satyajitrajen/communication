import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageList } from "../../types/MessageListType";

// Define the type for your state
interface MessageOptionState {
  selectMessage: boolean;
  message_list: MessageList[];
  showModal: boolean;
  modalName:
    | "clear_chat"
    | "delete_chat"
    | "report_user"
    | "block_user"
    | "remove_member"
    | "exit_from_group"
    | "delete_group"
    | "";
  title: string;
  description: string;
  totalPages: number;
  currentPage: string;
  isMessageLoading: boolean;
  isMoreMessageLoading: boolean;
  delete_message: boolean;
  delete_only_from_me: boolean;
  delete_from_every_one: boolean;
  show_forward_message_modal: boolean;
  show_create_poll_modal: boolean;
  show_view_poll_vote_modal: boolean;
  show_view_reaction_modal: boolean;  
  show_send_location_modal: boolean;
  message_id: number;
  show_select_about_modal: boolean;
  forward_message: boolean;
  show_pin_message_modal: boolean;
  messageListAtTop: boolean;
  show_all_star_messages: boolean;
  pinned_duration?: "1_day" | "7_days" | "1_month" | "lifetime";
}

// Define the initial state using the MessageOptionState interface
const initialState: MessageOptionState = {
  selectMessage: false,
  message_list: [],
  showModal: false,
  modalName: "",
  title: "",
  description: "",
  totalPages: 0,
  currentPage: "",
  isMessageLoading: false,
  isMoreMessageLoading: false,
  delete_message: false,
  delete_only_from_me: false,
  forward_message: false,
  show_view_reaction_modal: false,
  show_forward_message_modal: false,
  show_pin_message_modal: false,
  show_select_about_modal: false,
  delete_from_every_one: false,
  messageListAtTop: false,
  show_all_star_messages: false,
  show_send_location_modal: false,
  pinned_duration: "1_day",
  show_create_poll_modal: false,
  show_view_poll_vote_modal: false,
  message_id: 0,
};

// Create the slice with proper TypeScript types
const MessageOptionsSlice = createSlice({
  name: "MessageOptions",
  initialState,
  reducers: {
    // Updates the state with partial payload
    updateMessageOptions(
      state,
      action: PayloadAction<Partial<MessageOptionState>>,
    ) {
      return { ...state, ...action.payload };
    },

    // Append a message object to the list
    addMessage(state, action: PayloadAction<MessageList>) {
      state.message_list.push(action.payload);
    },

    // Remove a message object from the list by message_id
    removeMessage(state, action: PayloadAction<number>) {
      state.message_list = state.message_list.filter(
        (message) => message.message_id !== action.payload,
      );
    },

    // Remove all selected message
    removeSelectedMessage(state) {
      state.message_list = [];
    },
  },
});

// Export the reducer and actions
export default MessageOptionsSlice.reducer;
export const {
  updateMessageOptions,
  addMessage,
  removeSelectedMessage,
  removeMessage,
} = MessageOptionsSlice.actions;
