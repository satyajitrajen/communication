import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/ConversationInfoType";

interface MeetingScheduleState {
  isModalOpen: boolean;
  title: string;
  selectedMember: User | null;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  meetingDetails: string;
  searchQuery: string;
}

type MeetingScheduleField = keyof Omit<MeetingScheduleState, 'isModalOpen'>;
type MeetingScheduleValue = MeetingScheduleState[MeetingScheduleField];

const initialState: MeetingScheduleState = {
  isModalOpen: false,
  title: "",
  selectedMember: null,
  date: "",
  startTime: "",
  endTime: "",
  meetingLink: "https://meet.example.com/meet-9f3b2x",
  meetingDetails: "",
  searchQuery: "",
};

const meetingScheduleSlice = createSlice({
  name: "meetingSchedule",
  initialState,
  reducers: {
    // Open/close modal actions
    openMeetingModal: (state) => {
      state.isModalOpen = true;
    },
    closeMeetingModal: (state) => {
      state.isModalOpen = false;
      // Reset form when modal is closed
      Object.assign(state, { ...initialState, isModalOpen: false });
    },
    // Single action to update any field
    updateField: (
      state,
      action: PayloadAction<{
        field: MeetingScheduleField;
        value: MeetingScheduleValue;
      }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value as never;
    },
    // Reset the entire form
    resetForm: (state) => {
      Object.assign(state, { ...initialState, isModalOpen: state.isModalOpen });
    },
  },
});

export const {
  openMeetingModal,
  closeMeetingModal,
  updateField,
  resetForm,
} = meetingScheduleSlice.actions;

export default meetingScheduleSlice.reducer;
