import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnlineUserRes } from "../../types/OnlineUserType";

const initialState: OnlineUserRes = { onlineUserList: [] };

// Create a slice of the state
const OnlineUserSlice = createSlice({
  name: "OnlineUserList",
  initialState,
  reducers: {
    updateOnlineUserList(state, action: PayloadAction<OnlineUserRes>) {
      return action.payload;
    },
  },
});

// Export the reducer and actions
export default OnlineUserSlice.reducer;
export const { updateOnlineUserList } = OnlineUserSlice.actions;
