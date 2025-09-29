// src/store/adminSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminState {
  name: string;
  profilePic: string;
  isAdmin: boolean;
  adminEmail: string;
}

const initialState: AdminState = {
  name: "",
  profilePic: "",
  isAdmin: false,
  adminEmail: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminDetails(state, action: PayloadAction<AdminState>) {
      state.name = action.payload.name;
      state.profilePic = action.payload.profilePic;
      state.isAdmin = action.payload.isAdmin;
      state.adminEmail = action.payload.adminEmail;
      localStorage.setItem("adminDetails", JSON.stringify(action.payload)); // Save to localStorage
    },
    clearAdminDetails(state) {
      state.name = "";
      state.profilePic = "";
      state.isAdmin = false;
      state.adminEmail = "";
      localStorage.removeItem("adminDetails"); // Remove from localStorage
    },
  },
});

export const { setAdminDetails, clearAdminDetails } = adminSlice.actions;
export default adminSlice.reducer;
