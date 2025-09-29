import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";
import {
  setQuestion,
  addOption,
  updateOption,
  removeOption,
  resetPoll,
} from "../../../../store/Slices/PollSlice"; // Import Poll Actions
import TextTranslate from "../../../../utils/TextTranslate";
import Button from "../../../../components/Button";
import useApiPost from "../../../../hooks/PostData";
import toast from "react-hot-toast";
import { useTheme } from "../../../../context/ThemeProvider";
import { useTranslateText } from "../../../../hooks/useTranslateText";
import { ClipLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { MessageList } from "../../../../types/MessageListType";
import { useConversationInfo } from "../../../../store/api/useConversationInfo";
import { formatRelativeTime } from "../../../../utils/formatUTCtoLocalDate";

export default function ViewPollVoteModal() {
  const dispatch = useAppDispatch();
  const translate = useTranslateText();

  // Select Poll Data
  let userData = useAppSelector((state) => state.userData);
  let { data } = useConversationInfo();
  let MessageOptions = useAppSelector((state) => state.MessageOptions);
  const [messageData, setmessageData] = useState<MessageList>();
  const { conversation_id } = useAppSelector(
    (state) => state.CurrentConversation,
  );

  let messageList = useAppSelector((state) => state.MessageList);

  // Close Modal
  const close = () => {
    dispatch(updateMessageOptions({ show_view_poll_vote_modal: false }));
  };

  useEffect(() => {
    if (MessageOptions.message_id == 0) return;

    setmessageData(
      messageList.find(
        (message) => message.message_id === MessageOptions.message_id,
      ),
    );
  }, [MessageOptions.message_id, messageList]);

  return (
    <Dialog
      open={MessageOptions.show_view_poll_vote_modal}
      as="div"
      className="relative z-10"
      onClose={() => {}}
    >
      <div className="fixed inset-0 z-10 flex min-h-full items-center justify-center p-4 backdrop-blur-sm">
        <DialogPanel className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-modalBg shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out data-[closed]:opacity-0">
          <div className="py-3 shadow-lg">
            <DialogTitle as="h3" className="text-center">
              <span className="text-xl font-medium">
                <TextTranslate text="Poll Votes" />
              </span>
              <span
                onClick={close}
                className="curpo absolute right-4 cursor-pointer text-red-500"
              >
                <TextTranslate text="Close" />
              </span>
            </DialogTitle>
          </div>

          {/* Poll Question Input */}
          <div className="my-8 flex flex-col px-4">
            <div className="space-y-1">
              <div>
                <TextTranslate text="Title" />
              </div>
              <input
                value={messageData?.message}
                disabled
                className="w-full rounded-xl border border-borderColor bg-transparent px-4 py-2 outline-none"
                type="text"
                placeholder={translate("")}
              />
            </div>
          </div>

          {/* Poll Options */}
          <div className="px-3">
            <TextTranslate text="Options" />
            <div className="mb-5 mt-3 space-y-5">
              {messageData?.pollData.map((option, index) => (
                <div className="flex flex-col">
                  <div
                    key={index}
                    className="relative flex items-center gap-3 rounded-lg border border-borderColor px-4 py-3"
                  >
                    <div className="w-full bg-transparent outline-none">
                      {option.optionText}
                    </div>
                    <div className="text-nowrap text-[#FCC604]">
                      {option.PollVotes.length} Votes
                    </div>
                  </div>
                  {data?.conversationDetails &&
                    option.PollVotes.map((vote, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className="relative mx-auto flex w-[95%] items-center gap-3 border border-borderColor px-4"
                          >
                            <div className="w-full bg-transparent py-2 outline-none">
                              <div className="flex items-center gap-2">
                                <img
                                  className="h-8 w-8 rounded-full object-cover"
                                  src={
                                    vote.user_id == userData.user_id
                                      ? userData.profile_image
                                      : data?.conversationDetails?.ConversationsUsers.find(
                                          (convoUser) =>
                                            convoUser.User.user_id ===
                                            vote.user_id,
                                        )?.User.profile_image
                                  } // Replace with actual user avatar if available
                                  alt=""
                                />
                                <div>
                                  {vote.user_id == userData.user_id
                                    ? "You"
                                    : `${
                                        data!.conversationDetails.ConversationsUsers.find(
                                          (convoUser) =>
                                            convoUser.User.user_id ===
                                            vote.user_id,
                                        )?.User.first_name
                                      } ${
                                        data!.conversationDetails.ConversationsUsers.find(
                                          (convoUser) =>
                                            convoUser.User.user_id ===
                                            vote.user_id,
                                        )?.User.last_name
                                      }`}
                                </div>
                              </div>
                            </div>
                            <div className="text-nowrap text-sm text-lightText">
                              {formatRelativeTime(vote.updatedAt)}
                            </div>
                          </div>
                        </>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
