import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArchiveList } from "../../types/ChatListType";

// Define the initial state with an empty chatList
const initialState: ArchiveList[] = [];

// Create a slice of the state
const ArchiveListSlice = createSlice({
  name: "archiveList",
  initialState,
  reducers: {
    updateArchiveList(state, action: PayloadAction<ArchiveList[]>) {
      // Directly modify the state to replace the chatList
      return action.payload;
    },
  },
});

// Export the reducer and actions
export default ArchiveListSlice.reducer;
export const { updateArchiveList } = ArchiveListSlice.actions;
