import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateGroup } from "../../types/ChatListType";

const initialState: CreateGroup = {
  user_id: [],
  existing_member_user_id: [],
  createNewGroup: false,
  group_name: "",
  group_name_limit: 25,
  show_add_member_modal: false,
  public_group: false,
};

const CreateGroupSlice = createSlice({
  name: "CreateGroup",
  initialState,
  reducers: {
    updateCreateGroupData(state, action: PayloadAction<Partial<CreateGroup>>) {
      return { ...state, ...action.payload };
    },
    addOrRemoveUserId(state, action: PayloadAction<{ user_id: number }>) {
      const { user_id } = action.payload;

      // Add user_id to the array if it's not already present
      if (!state.user_id.includes(user_id)) {
        state.user_id.push(user_id);
      } else {
        // Remove user_id from the array if it's present
        state.user_id = state.user_id.filter((id) => id !== user_id);
      }
    },
    addUserId(state, action: PayloadAction<{ user_id: number }>) {
      const { user_id } = action.payload;

      // Append user_id to the array if it's not already present
      if (!state.user_id.includes(user_id)) {
        state.user_id.push(user_id);
      }
    },
  },
});

export default CreateGroupSlice.reducer;
export const { updateCreateGroupData, addUserId, addOrRemoveUserId } =
  CreateGroupSlice.actions;
