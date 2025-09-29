import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageList, PollVote } from "../../types/MessageListType";
import dayjs from "dayjs";

// Define the initial state with an empty MessageList
const initialState: MessageList[] = [];

// Create a slice of the state
const MessageListSlice = createSlice({
  name: "MessageList",
  initialState,
  reducers: {
    // Reducer to update the MessageList
    updateMessageList(state, action: PayloadAction<MessageList[]>) {
      // return action.payload;
      return [...action.payload, ...state]; // Prepend the new messagelist at start of the messagelist
    },
    removeMessageList() {
      return []; //Remove Data from messagelist when user click on ther conversations from chatlist
    },
    // Reducer to remove messages by array of message_id
    removeMessagesByIds(state, action: PayloadAction<number[]>) {
      return state.filter(
        (message) => !action.payload.includes(message.message_id),
      );
    },
    updatePollVote(
      state,
      action: PayloadAction<{
        message_id: number;
        user_id: number;
        new_option_id: number;
      }>,
    ) {
      const { message_id, user_id, new_option_id } = action.payload;

      return state.map((message) => {
        if (message.message_id !== message_id) return message;

        return {
          ...message,
          pollData: message.pollData.map((pollOption) => {
            const pollOptionData = JSON.parse(JSON.stringify(pollOption)); // Deep copy
            // console.log(pollOptionData, "pollOption");

            return {
              ...pollOptionData,
              PollVotes:
                pollOptionData.poll_option_id === new_option_id
                  ? [
                      ...pollOptionData.PollVotes,
                      { user_id, updatedAt: new Date().toISOString() },
                    ]
                  : pollOptionData.PollVotes.filter(
                      (vote: PollVote) => vote.user_id !== user_id,
                    ),
            };
          }),
        };
      });
    },

    // updateMessagesByIds(
    //   state,
    //   action: PayloadAction<{ message_id: number; message: string }>,
    // ) {
    //   return state.map((message) => {
    //     if (action.payload.includes(message_id)) {
    //       return {
    //         ...message,
    //         message: message,

    //         // message_type: "delete_from_everyone",
    //       };
    //     }
    //     return message;
    //   });
    // },

    // Reducer to update the is_star_message field by message_id

    updateMessagesByIds(
      state,
      action: PayloadAction<{
        message_id: number;
        message: string;
        delete_from_everyone: boolean;
        user_id?: string;
      }>, // single object in payload
    ) {
      return state.map((message) => {
        if (message.message_id === action.payload.message_id) {
          return {
            ...message,
            message: action.payload.message,
            delete_for_me: action.payload.user_id || message.delete_for_me,
            delete_from_everyone: action.payload.delete_from_everyone,
            // message_type: "delete_from_everyone", // Uncomment if needed
          };
        }
        return message;
      });
    },
    updateMessagesReadStatusByIds(
      state,
      action: PayloadAction<{
        message_id: number;
      }>, // single object in payload
    ) {
      return state.map((message) => {
        if (message.message_id == action.payload.message_id) {
          return {
            ...message,
            message_read: 1,
          };
        }
        return message;
      });
    },

    updateIsStarMessage(
      state,
      action: PayloadAction<{ message_id: number; is_star_message: boolean }>,
    ) {
      const { message_id, is_star_message } = action.payload;
      const message = state.find((msg) => msg.message_id == message_id);

      if (message) {
        message.is_star_message = is_star_message;
      }
    },

    // Reducer to append a single object with date check
    appendMessageWithDateCheck(state, action: PayloadAction<MessageList>) {
      const lastMessage = state[state.length - 1];

      // Check if the last message is a date and if it's different from today's date
      // const todayUTC = dayjs().utc().format("YYYY-MM-DD");
      // const lastMessageDate = dayjs(lastMessage.message)
      //   .utc()
      //   .format("YYYY-MM-DD");

      // if (lastMessage.message_type !== "date" || lastMessageDate !== todayUTC) {
      //   // If the dates are different, append a date message first
      //   state.push({
      //     url: "",
      //     thumbnail: "",
      //     message_id: 0,
      //     message: dayjs().utc().format(),
      //     message_type: "date",
      //     message_read: 0,
      //     video_time: "",
      //     audio_time: "",
      //     latitude: "",
      //     longitude: "",
      //     shared_contact_name: "",
      //     shared_contact_number: "",
      //     forward_id: 0,
      //     reply_id: 0,
      //     status_id: 0,
      //     createdAt: "",
      //     updatedAt: "",
      //     senderId: 0,
      //     conversation_id: 0,
      //     is_star_message: false,
      //     myMessage: false,
      //     senderData: {
      //       profile_image: "",
      //       user_id: 0,
      //       user_name: "",
      //       first_name: "",
      //       last_name: "",
      //       phone_number: "",
      //     },
      //   });
      // }

      // Append the new message object
      state.push(action.payload);
    },
    updateReaction(
      state,
      action: PayloadAction<{
        message_id: number;
        user_id: number;
        reaction: string;
      }>,
    ) {
      const { message_id, user_id, reaction } = action.payload;

      return state.map((message) => {
        if (message.message_id !== message_id) return message;

        // Check if the user already reacted
        const updatedReactions = message.reactionData.some(
          (r) => r.user_id === user_id,
        )
          ? message.reactionData.map((r) =>
              r.user_id === user_id ? { ...r, reaction } : r,
            )
          : [...message.reactionData, { user_id, reaction, message_id }];

        return { ...message, reactionData: updatedReactions };
      });
    },
  },
});

// Export the reducer and actions
export default MessageListSlice.reducer;
export const {
  updateMessageList,
  removeMessagesByIds,
  appendMessageWithDateCheck,
  removeMessageList,
  updateIsStarMessage,
  updateMessagesByIds,
  updateMessagesReadStatusByIds,
  updatePollVote,
  updateReaction,
} = MessageListSlice.actions;
