import React from "react";
import { MessageList, PollData } from "../../../../types/MessageListType";
import { LinearProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { useConversationInfo } from "../../../../store/api/useConversationInfo";
import useApiPost from "../../../../hooks/PostData";
import { updatePollVote } from "../../../../store/Slices/MessageListSlice";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";

export default function PollResult({
  messageData,
}: {
  messageData: MessageList;
}) {
  // Calculate total votes for this poll
  const totalVotes = messageData.pollData.reduce(
    (acc, poll) => acc + poll.PollVotes.length,
    0,
  );

  return (
    <div className="my-4 flex flex-col gap-3">
      {messageData.pollData.map((poll) => (
        <SingleOption
          key={poll.poll_option_id}
          poll={poll}
          totalVotes={totalVotes}
          messageData={messageData}
        />
      ))}
    </div>
  );
}

export function SingleOption({
  poll,
  totalVotes,
  messageData,
}: {
  poll: PollData;
  totalVotes: number;
  messageData: MessageList;
}) {
  // Calculate percentage of votes for this option
  const voteCount = poll.PollVotes.length;
  const votePercentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
  let userData = useAppSelector((state) => state.userData);
  let { data } = useConversationInfo();
  const { loading, postData } = useApiPost();
  const dispatch = useAppDispatch();
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  async function voteInPoll() {
    await postData("vote", {
      poll_option_id: poll.poll_option_id,
      message_id: poll.message_id,
      conversation_id: currentConversationData.conversation_id,
    });

    // Update it in real-time in message list
    // dispatch(
    //   updatePollVote({
    //     message_id: poll.message_id,
    //     new_option_id: poll.poll_option_id,
    //     user_id: userData.user_id,
    //   }),
    // );
  }

  return (
    <div
      onClick={() => {
        if (!poll.PollVotes.some((vote) => vote.user_id === userData.user_id)) {
          voteInPoll();
        }
      }}
      className="flex w-full cursor-pointer items-center gap-2"
    >
      {/* Selected Option Icon */}
      {poll.PollVotes.some((vote) => vote.user_id === userData.user_id) ? (
        <img
          className="h-6 w-6 object-contain"
          src="/MessageListIcons/selected_option.png"
          alt="Selected Option"
        />
      ) : (
        <img
          className="h-6 w-6 object-contain"
          src="/MessageListIcons/not_selected_option.png"
          alt="Not Selected Option"
        />
      )}

      <div className="w-full">
        {/* Poll Option and Voter Avatar */}
        <div className="flex items-end justify-between">
          <div className="text-sm font-medium">{poll.optionText}</div>

          {/* Show first voter’s avatar (if available) */}
          {/* {poll.PollVotes.length > 0 && (
            <img
              className="h-7 w-7 rounded-full object-cover"
              src="https://s3-alpha-sig.figma.com/img/20b8/8955/d6e91b0f9cbf6e8b1d6959045013c348?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=oukxKsv0X0zysan-jYmuJTVlXBD-QYIbq8iFQPdU10M74fXHWXakAqn8VLQ5NPM0XI2kkU~qVtw5LFZrHZzxUaM-EWUpOIwsO2RHGTv7HGAgUg5r~73j3tWJc0tkZ3Vnge7wVWDbTPijyFr5dfLt1IhOId-cNHE8rMDFzk8HZ9AcinpPq3siPSSJHRHFwgPPbdGZTdLQuk4~Hx5PjWwN44KBPKiQdKpqYCmftCi8pdSwaL4dbI6kGaxrfSpHyr~29zmonowfOWSOpxj49~hHIvrxJzxezskjw1VSps9udjQR4JHtkZbhdyjInqnaMLHukQIQ9pxnH1ELcYFFX1w9kA__" // Replace with actual user avatar if available
              alt="Voter Avatar"
            />
          )} */}
          {/* Show first voter’s avatar (if available) */}
          <div
            onClick={() => {
              dispatch(
                updateMessageOptions({
                  show_view_poll_vote_modal: true,
                  message_id: messageData.message_id,
                }),
              );
            }}
            className="flex h-7 w-fit -space-x-1"
          >
            {data?.conversationDetails && poll.PollVotes.length > 0 && (
              <>
                {poll.PollVotes.slice(0, 4).map((vote) => (
                  <img
                    key={vote.user_id} // Always add a key in map loops
                    className="h-7 w-7 rounded-full object-cover"
                    src={
                      vote.user_id === userData.user_id
                        ? userData.profile_image
                        : data!.conversationDetails.ConversationsUsers.find(
                            (convoUser) =>
                              convoUser.User.user_id === vote.user_id,
                          )?.User.profile_image
                    }
                    alt=""
                  />
                ))}
                {poll.PollVotes.length > 4 && (
                  <div className="grid h-7 w-7 place-content-center rounded-full bg-pinMessageListHeader text-xs">
                    +{poll.PollVotes.length - 4}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Progress Bar for Votes */}
        <div className="mt-2">
          <LinearProgress
            variant="determinate"
            value={votePercentage}
            sx={{ height: 6, borderRadius: 4 }}
            color="inherit"
          />
        </div>

        {/* Display Vote Count */}
        <div className="mt-1 text-xs text-gray-500">{voteCount} votes</div>
      </div>
    </div>
  );
}
