import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PollState {
  question: string;
  options: string[];
}

const initialState: PollState = {
  question: "",
  options: ["", ""], // At least two options initially
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setQuestion(state, action: PayloadAction<string>) {
      state.question = action.payload;
    },
    updateOption(
      state,
      action: PayloadAction<{ index: number; value: string }>,
    ) {
      state.options[action.payload.index] = action.payload.value;
    },
    addOption(state) {
      state.options.push("");
    },
    removeOption(state, action: PayloadAction<number>) {
      if (state.options.length > 2) {
        state.options.splice(action.payload, 1);
      }
    },
    resetPoll() {
      return initialState;
    },
  },
});

export const { setQuestion, updateOption, addOption, removeOption, resetPoll } =
  pollSlice.actions;
export default pollSlice.reducer;
