import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypingUserListRes } from "../../types/OnlineUserType";

// Define the type for your state
interface NavigateToMessageState {
  message_id?: number;
  conversation_id?: number;
  navigate_to_message?: boolean;
}

// Define the initial state using the ViewState interface
const initialState: NavigateToMessageState = {
  conversation_id: 0,
  message_id: 0,
  navigate_to_message: false,
};

// Create a slice of the state
const NavigateToSpesificMessageSlice = createSlice({
  name: "NavigateTospesificMessage",
  initialState,
  reducers: {
    updateNavigateToSpesificMessage(
      state,
      action: PayloadAction<NavigateToMessageState>,
    ) {
      return { ...state, ...action.payload };
    },
  },
});

// Export the reducer and actions
export default NavigateToSpesificMessageSlice.reducer;
export const { updateNavigateToSpesificMessage } =
  NavigateToSpesificMessageSlice.actions;
