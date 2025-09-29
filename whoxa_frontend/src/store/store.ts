import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./Slices/UserSlice";
import ViewManagerSlice from "./Slices/ViewManagerSlice";
import MessageOptionsSlice from "./Slices/MessageOptionsSlice";
import ChatListSlice from "./Slices/ChatListSlice";
import MessageListSlice from "./Slices/MessageListSlice";
import CurrentConversationSlice from "./Slices/CurrentConversationSlice";
import SendMessageSlice from "./Slices/SendMessageSlice";
import UserLastSeenSlice from "./Slices/UserLastSeenSlice";
import OnlineUserSlice from "./Slices/OnlineUserSlice";
import ConnectedUserSlice from "./Slices/ConnectedUserSlice";
import TypingUserListSlice from "./Slices/TypingUserListSlice";
import CreateGroupSlice from "./Slices/CreateGroupSlice";
import SelectedGroupMemberSlice from "./Slices/SelectedGroupMemberSlice";
import SearchMessageSlice from "./Slices/SearchMessageSlice";
import ForwardMessageSlice from "./Slices/ForwardMessageSlice";
import NavigateToSpesificMessageSlice from "./Slices/NavigateToSpesificMessageSlice";
import ArchiveListSlice from "./Slices/ArchiveListSlice";
import LanguageTextListSlice from "./Slices/LanguageTextListSlice";
import PollSlice from "./Slices/PollSlice";
import PeerJsSlice from "./Slices/PeerJsSlice";
import CallDataSlice from "./Slices/CallDataSlice";
import MeetingScheduleSlice from "./Slices/MeetingScheduleSlice";
import StatusSlice from "./Slices/StatusSlice";
import AddStatusSlice from "./Slices/AddStatusSlice";
import PinMessagesSlice from "./Slices/PinMessagesSlice";
// Create the Redux store
export const store = configureStore({
  reducer: {
    // Add reducers here
    userData: UserSlice,
    ViewManager: ViewManagerSlice,
    MessageOptions: MessageOptionsSlice,
    meetingSchedule: MeetingScheduleSlice,
    chatList: ChatListSlice,
    archiveList: ArchiveListSlice,
    MessageList: MessageListSlice,
    CurrentConversation: CurrentConversationSlice,
    SendMessageData: SendMessageSlice,
    UserLastSeenList: UserLastSeenSlice,
    OnlineUserList: OnlineUserSlice,
    ConnectedUser: ConnectedUserSlice,
    TypingUserList: TypingUserListSlice,
    CreateGroup: CreateGroupSlice,
    SelectedGroupMember: SelectedGroupMemberSlice,
    SearchMessage: SearchMessageSlice,
    ForwardMessage: ForwardMessageSlice,
    NavigateToSpesificMessage: NavigateToSpesificMessageSlice,
    LanguageTextList: LanguageTextListSlice,
    PeerJsSlice: PeerJsSlice,
    PollData: PollSlice,
    CallData: CallDataSlice,
    status: StatusSlice,
    addStatus: AddStatusSlice,
    PinMessages: PinMessagesSlice,
  },
});

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
