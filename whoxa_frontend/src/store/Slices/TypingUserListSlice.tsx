import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypingUserListRes } from "../../types/OnlineUserType";

const initialState: TypingUserListRes = { typingUserList: [] };

// Create a slice of the state
const TypingUserListSlice = createSlice({
  name: "TypingUserList",
  initialState,
  reducers: {
    updateTypingUserList(state, action: PayloadAction<TypingUserListRes>) {
      return action.payload;
    },
  },
});

// Export the reducer and actions
export default TypingUserListSlice.reducer;
export const { updateTypingUserList } = TypingUserListSlice.actions;
