import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ContactListRes } from "../../types/SendMessageType";

const initialState: ContactListRes = {
  message: "",
  myContactList: [],
  success: true,
  pagination: {
    count: 0,
    currentPage: 1,
    totalPages: 1,
  },
};

const ContactListSlice = createSlice({
  name: "contactList",
  initialState,
  reducers: {
    updateSpesificContactList(
      state,
      action: PayloadAction<Partial<ContactListRes>>,
    ) {
      // console.log("action.payload", action.payload);
      return { ...state, ...action.payload };
    },
    updateContactListRes(state, action: PayloadAction<ContactListRes>) {
      // console.log("action.payload", action.payload);
      return action.payload;
    },
  },
});

export default ContactListSlice.reducer;
export const { updateSpesificContactList, updateContactListRes } =
  ContactListSlice.actions;
