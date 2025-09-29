import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanguageTextListRes } from "../../types/LanguageTextList";

const initialState: LanguageTextListRes = {
  language: "",
  language_alignment: "",
  message: "",
  results: [],
  success: true,
};

// Create a slice of the state
const LanguageTextListSlice = createSlice({
  name: "LanguageTextList",
  initialState,
  reducers: {
    updateLanguageTextList(state, action: PayloadAction<LanguageTextListRes>) {
      return action.payload;
    },
  },
});

// Export the reducer and actions
export default LanguageTextListSlice.reducer;
export const { updateLanguageTextList } = LanguageTextListSlice.actions;
