import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PinMessageListRes } from "../../types/ResType";

const initialState: PinMessageListRes = {
  message: "",
  success: false,
  PinMessageList: [],
};

// Create a slice of the state
const PinMessagesSlice = createSlice({
  name: "PinMessages",
  initialState,
  reducers: {
    updatePinMessages(state, action: PayloadAction<PinMessageListRes>) {
      // return { ...state, ...action.payload };
      return action.payload;
    },
    removePinMessageList() {
      // return { ...state, ...action.payload };
      return initialState;
    },
  },
});

// Export the reducer and actions
export default PinMessagesSlice.reducer;

export const { updatePinMessages, removePinMessageList } =
  PinMessagesSlice.actions;
