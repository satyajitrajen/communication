import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SendMessageData } from "../../types/SendMessageType";

const initialState: SendMessageData = {
  conversation_id: 0,
  audio_time: "",
  forward_id: 0,
  latitude: "",
  longitude: "",
  message: "",
  message_type: "",
  phone_number: "",
  reply_id: 0,
  status_id: 0,
  url: "",
  thumbnail_url: "",
  video_time: "",
  showEmojiPicker: false,
  showAttachmentOptions: false,
  fileName: "",
  other_user_id: 0,
};

// Create a slice of the state
const SendMessageSlice = createSlice({
  name: "SendMessageData",
  initialState,
  reducers: {
    // Reducer to update the MessageList
    updateSendMessageData(
      state,
      action: PayloadAction<Partial<SendMessageData>>,
    ) {
      return { ...state, ...action.payload };
    },
  },
});

// Export the reducer and actions
export default SendMessageSlice.reducer;
export const { updateSendMessageData } = SendMessageSlice.actions;
