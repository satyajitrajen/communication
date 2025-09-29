import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchResult } from "../../types/MessageListType";

const initialState: SearchResult[] = [];

// Create a slice of the state
const SearchMessageSlice = createSlice({
  name: "SearchMessage",
  initialState,
  reducers: {
    updateSearchMessageResult(state, action: PayloadAction<SearchResult[]>) {
      // return { ...state, ...action.payload };
      return action.payload;
    },
  },
});

// Export the reducer and actions
export default SearchMessageSlice.reducer;

export const { updateSearchMessageResult } = SearchMessageSlice.actions;
