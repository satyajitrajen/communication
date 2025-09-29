import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectedUser } from "../../types/ResType";

const initialState: ConnectedUser[] = [];

// Create a slice of the state
const ConnectedUserSlice = createSlice({
  name: "ConnectedUser",
  initialState,
  reducers: {
    updateConnectedUserList(state, action: PayloadAction<ConnectedUser[]>) {
      return action.payload;
    },
  },
});

// Export the reducer and actions
export default ConnectedUserSlice.reducer;
export const { updateConnectedUserList } = ConnectedUserSlice.actions;
