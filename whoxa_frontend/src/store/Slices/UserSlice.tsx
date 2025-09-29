import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResData } from "../../types/UserDataType";

const initialState: ResData = {
  bio: "",
  country: "",
  country_full_name: "",
  country_code: "",
  device_token: "",
  dob: "",
  first_name: "",
  gender: "",
  last_name: "",
  last_seen: 0,
  password: "",
  phone_number: "",
  profile_image: "",
  user_id: 0,
  user_name: "",
  one_signal_player_id: "",
  avatar_id: 0,
  Blocked_by_admin: false,
  is_account_deleted: false,
  viewed_by_admin: false,
};

const UserSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    updateSpesificUserData(state, action: PayloadAction<Partial<ResData>>) {
      // console.log("action.payload", action.payload);
      return { ...state, ...action.payload };
    },
    updateUserData(state, action: PayloadAction<ResData>) {
      // console.log("action.payload", action.payload);
      return action.payload;
    },
  },
});

export default UserSlice.reducer;
export const { updateSpesificUserData, updateUserData } = UserSlice.actions;
