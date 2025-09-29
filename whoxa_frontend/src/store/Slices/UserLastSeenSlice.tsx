import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LastSeenUserRes, OnlineUserRes } from "../../types/OnlineUserType";

const initialState: LastSeenUserRes = {
  lastSeenUserList: [],
};

// Create a slice of the state
const UserLastSeenSlice = createSlice({
  name: "UserLastSeenList",
  initialState,
  reducers: {
    // Reducer to update the chatList
    UserLastSeenSliceUserList(state, action: PayloadAction<LastSeenUserRes>) {
      return action.payload;
    },
  },
});

// Export the reducer and actions
export default UserLastSeenSlice.reducer;
export const { UserLastSeenSliceUserList } = UserLastSeenSlice.actions;
