import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CallData } from "../../types/ResType";

// @ts-ignore
const initialState: CallData = {};

// Create a slice of the state
const CallDataSlice = createSlice({
  name: "CallData",
  initialState,
  reducers: {
    updateCallData(state, action: PayloadAction<CallData>) {
      return action.payload;
    },
  },
});

// Export the reducer and actions
export default CallDataSlice.reducer;
export const { updateCallData } = CallDataSlice.actions;
