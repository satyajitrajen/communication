import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: { status_text: string; files: File[] } = {
  status_text: "",
  files: [],
};

const AddStatusSlice = createSlice({
  name: "addStatus",
  initialState,
  reducers: {
    updateAddStatus(
      state,
      action: PayloadAction<{ status_text: string; files: File[] }>,
    ) {
      return { ...state, ...action.payload };
    },
  },
});

export default AddStatusSlice.reducer;
export const { updateAddStatus } = AddStatusSlice.actions;
