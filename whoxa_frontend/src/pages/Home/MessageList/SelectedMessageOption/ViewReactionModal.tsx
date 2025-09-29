import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";
import TextTranslate from "../../../../utils/TextTranslate";
import { useTranslateText } from "../../../../hooks/useTranslateText";
import { useEffect, useState } from "react";
import { MessageList } from "../../../../types/MessageListType";
import { useConversationInfo } from "../../../../store/api/useConversationInfo";
import { RxCross1 } from "react-icons/rx";

export default function ViewReactionModal() {
  const dispatch = useAppDispatch();

  // Select Poll Data
  const userData = useAppSelector((state) => state.userData);
  const { data } = useConversationInfo();
  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  const [messageData, setmessageData] = useState<MessageList>();
  const messageList = useAppSelector((state) => state.MessageList);

  // Close Modal
  const close = () => {
    dispatch(updateMessageOptions({ show_view_reaction_modal: false }));
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
      open={MessageOptions.show_view_reaction_modal}
      as="div"
      className="relative z-10"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 flex min-h-full items-center justify-center p-4 backdrop-blur-sm">
        <DialogPanel className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-modalBg shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out data-[closed]:opacity-0">
          <div className="py-3 shadow-lg">
            <DialogTitle as="h3" className="text-center">
              <span className="text-xl font-medium">
                <TextTranslate text="Reactions" />
              </span>
              <span
                onClick={close}
                className="curpo absolute right-4 cursor-pointer"
              >
                <RxCross1 className="mt-1 text-lg" />
              </span>
            </DialogTitle>
          </div>

          {/* Poll Options */}
          <div className="px-3">
            <div className="mb-5 mt-3 space-y-5">
              {data?.conversationDetails &&
                messageData?.reactionData.map((reaction, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="relative mx-auto flex w-[95%] items-center gap-3 px-4"
                      >
                        <div className="w-full bg-transparent py-2 outline-none">
                          <div className="flex items-center gap-2">
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={
                                reaction.user_id == userData.user_id
                                  ? userData.profile_image
                                  : data?.conversationDetails?.ConversationsUsers.find(
                                      (convoUser) =>
                                        convoUser.User.user_id ===
                                        reaction.user_id,
                                    )?.User.profile_image
                              } // Replace with actual user avatar if available
                              alt=""
                            />
                            <div>
                              {reaction.user_id == userData.user_id
                                ? "You"
                                : `${
                                    data!.conversationDetails.ConversationsUsers.find(
                                      (convoUser) =>
                                        convoUser.User.user_id ===
                                        reaction.user_id,
                                    )?.User.first_name
                                  } ${
                                    data!.conversationDetails.ConversationsUsers.find(
                                      (convoUser) =>
                                        convoUser.User.user_id ===
                                        reaction.user_id,
                                    )?.User.last_name
                                  }`}
                            </div>
                          </div>
                        </div>
                        <div className="text-nowrap text-xl text-lightText">
                          {reaction.reaction}
                          {/* {formatRelativeTime(vote.updatedAt)} */}
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
