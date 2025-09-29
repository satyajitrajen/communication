import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for your state
interface ViewState {
  show_image?: boolean;
  image_src?: string[];
  showOtherProfile?: boolean;
  showMediaDocLinks?: boolean;
  showStarMessageList?: boolean;
  showSearchMessage?: boolean;
  showBlockUserList?: boolean;
  showArchiveList?: boolean;
  showChangeProfileModal?: boolean;
  showPrivacyPolicy?: boolean;
  showTermsAndCondition?: boolean;
  currentIndex?: number;
  show_select_language_modal?: boolean;
  show_chats_sidebar?: boolean;
  show_accept_call_modal?: boolean;
  show_call_declined_modal?: boolean;
  show_chat_in_call?: boolean;
  showSubscription?: boolean;
  showStatusModal?: boolean;
  showMyStatusModal?: boolean;
  showAddStatusModal?: boolean;
  currentStatusUser?: number;
  showStatusViews?: boolean;
  currentStatusId?: number;
}

// Define the initial state using the ViewState interface
const initialState: ViewState = {
  show_image: false,
  image_src: [],
  showOtherProfile: false,
  showMediaDocLinks: false,
  showSearchMessage: false,
  showStarMessageList: false,
  showBlockUserList: false,
  showArchiveList: false,
  showChangeProfileModal: false,
  showPrivacyPolicy: false,
  showTermsAndCondition: false,
  currentIndex: 0,
  show_select_language_modal: false,
  show_chats_sidebar: true,
  show_accept_call_modal: false,
  show_call_declined_modal: false,
  show_chat_in_call: false,
  showSubscription: false,
  showStatusModal: false,
  showMyStatusModal: false,
  showAddStatusModal: false,
  showStatusViews: false,
  currentStatusId: undefined,
};

// Create the slice with proper TypeScript types
const ViewManagerSlice = createSlice({
  name: "ViewManager",
  initialState,
  reducers: {
    setViewImage(state, action: PayloadAction<ViewState>) {
      // Update the state with the new image view data
      state.show_image = action.payload.show_image;
      state.image_src = action.payload.image_src;
      state.currentIndex = action.payload.currentIndex;
    },
    toggleProfileView(state, action: PayloadAction<boolean>) {
      // Toggle the showOtherProfile property
      state.showOtherProfile = action.payload;
    },
    updateViewState(state, action: PayloadAction<Partial<ViewState>>) {
      // Partial<FilterState> allows you to specify which fields to update, do not remove the 'Partial' keyword
      return { ...state, ...action.payload };
    },
  },
});

// Export the reducer and actions
export default ViewManagerSlice.reducer;
export const { setViewImage, toggleProfileView, updateViewState } =
  ViewManagerSlice.actions;
