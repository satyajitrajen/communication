import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "../../../components/Button";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import {
  removeSelectedMessage,
  updateMessageOptions,
} from "../../../store/Slices/MessageOptionsSlice";
import useApiPost from "../../../hooks/PostData";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";
import { BlockUserRes } from "../../../types/ResType";
import { socketInstance } from "../../../socket/socket";
import { ClipLoader } from "react-spinners";
import {
  removeMessageList,
  updateMessagesByIds,
} from "../../../store/Slices/MessageListSlice";
import toast from "react-hot-toast";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { updateByConversationId } from "../../../store/Slices/ChatListSlice";
import { useStarMessageList } from "../../../store/api/useStarMessageList";
import TextTranslate from "../../../utils/TextTranslate";

export default function ReusableModal() {
  let dispatch = useAppDispatch();
  const { loading, postData } = useApiPost();
  const [messageDelete, setMessageDelete] = useState<
    "delete_from_everyone" | "delete_for_me" | ""
  >("");
  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  const userData = useAppSelector((state) => state.userData);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const MessageListArray = useAppSelector((state) => state.MessageList);
  const lastIndex = MessageListArray.length - 1;
  const selectedGroupMember = useAppSelector(
    (state) => state.SelectedGroupMember,
  );
  let { refetch } = useConversationInfo();
  let { refetch: refetchStarMessages } = useStarMessageList();

  async function close() {
    // if (MessageOptions.modalName == "delete_chat") {
    //   let message_id_list = MessageOptions.message_list
    //     ?.map((message) => message.message_id)
    //     .join(",")!;

    //   let removeMemberFromGroup = await postData("delete-messages", {
    //     message_id_list,
    //     delete_from_every_one: false,
    //   });
    //   refetch();
    //   toast.success(`${MessageOptions.message_list?.length} messages deleted `);
    // }
    dispatch(updateMessageOptions({ showModal: false }));
    dispatch(
      updateMessageOptions({
        selectMessage: false,
        delete_message: false,
        delete_only_from_me: false,
        message_list: [],
      }),
    );
  }

  async function yesDelete({
    delete_from_every_one,
  }: {
    delete_from_every_one?: boolean;
  }) {
    if (MessageOptions.modalName == "block_user") {
      let blockUserResponse: BlockUserRes = await postData("block-user", {
        conversation_id: currentConversationData.conversation_id,
      });

      dispatch(
        updateCurrentConversation({ is_block: blockUserResponse.is_block }),
      );
      socketInstance().emit("ChatList", {});
    } else if (MessageOptions.modalName == "clear_chat") {
      await postData("clear-all-chat", {
        message_id: MessageListArray[lastIndex].message_id,
        conversation_id: currentConversationData.conversation_id,
      });
      dispatch(
        updateByConversationId({
          conversation_id: currentConversationData.conversation_id,
          last_message: "",
          last_message_type: "text",
        }),
      );

      dispatch(removeMessageList());
      refetch();
      refetchStarMessages();
    } else if (MessageOptions.modalName == "remove_member") {
      await postData("remove-member-from-group", {
        remove_user_id: selectedGroupMember.User.user_id,
        conversation_id: currentConversationData.conversation_id,
      });
      refetch();
      toast.success(
        `${selectedGroupMember.User.first_name} ${selectedGroupMember.User.last_name} removed from group`,
      );
    } else if (
      MessageOptions.modalName == "exit_from_group" ||
      MessageOptions.modalName == "delete_group"
    ) {
      await postData("exit-from-group", {
        conversation_id: currentConversationData.conversation_id,
      });
      toast.success(
        `You Exited from group ${currentConversationData.group_name}`,
      );
      // Update group info
      refetch();
      // Update chatlist
      socketInstance().emit("ChatList", {});
      // Update messagelist
      dispatch(removeMessageList());
      dispatch(updateCurrentConversation({ conversation_id: -1 }));
    } else if (MessageOptions.modalName == "delete_chat") {
      let message_id_list = MessageOptions.message_list
        ?.map((message) => message.message_id)
        .join(",")!;

      await postData("delete-messages", {
        message_id_list,
        delete_from_every_one: String(delete_from_every_one),
        conversation_id: currentConversationData.conversation_id,
      });

      // Refetch the conversation details to update the media,links and document in sidebar =====================================
      refetch();
      // Refetch the star message ==================================================================================
      refetchStarMessages();
      // Update chatlist
      socketInstance().emit("ChatList", {});
      toast.success(`${MessageOptions.message_list?.length} messages deleted `);

      MessageOptions.message_list.map((singleMessage) => {
        if (
          singleMessage.delete_from_everyone ||
          singleMessage.delete_for_me
            .split(",")
            .includes(userData.user_id.toString())
        ) {
          // dispatch(removeMessagesByIds([singleMessage.message_id]));
        } else {
          dispatch(
            updateMessagesByIds({
              message: delete_from_every_one
                ? "🚫 This message was deleted!"
                : "🚫 You deleted this message!",
              message_id: singleMessage.message_id,
              delete_from_everyone: delete_from_every_one!,
              user_id: delete_from_every_one ? "" : String(userData.user_id),
            }),
          );
        }
      });

      // Clear selected message on close
      dispatch(removeSelectedMessage());
      dispatch(
        updateMessageOptions({
          message_list: [],
          delete_from_every_one: false,
          delete_message: false,
          selectMessage: false,
        }),
      );
    }
    dispatch(updateMessageOptions({ showModal: false }));
  }

  return (
    <>
      <Dialog
        open={MessageOptions.showModal}
        as="div"
        className="relative z-10"
        onClose={() => {
          // close();
        }}
      >
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-lg rounded-xl bg-modalBg p-6 shadow-[rgba(17,_17,_26,_0.3)_0px_0px_16px] backdrop-blur-md duration-300 ease-in-out data-[closed]:opacity-0"
            >
              <div
                onClick={() => {
                  close();
                }}
                className="absolute -right-3 -top-3 grid h-10 w-10 cursor-pointer place-content-center rounded-full bg-modalBg shadow-2xl"
              >
                <RxCross2 className="text-3xl" />
              </div>
              <DialogTitle as="h3" className="text-xl font-medium">
                {MessageOptions.title}
              </DialogTitle>
              <p className="mt-2 text-sm opacity-70">
                {MessageOptions.description}
              </p>
              <div
                className={`mb-2 ml-auto mr-0 mt-10 flex ${MessageOptions.modalName == "delete_chat" || MessageOptions.modalName == "exit_from_group" ? "w-[100%]" : "w-[70%]"} gap-3`}
              >
                <button
                  onClick={() => {
                    if (MessageOptions.delete_message) {
                      // dispatch(
                      //   updateMessageOptions({ delete_from_every_one: false }),
                      // );
                      yesDelete({ delete_from_every_one: false });
                      setMessageDelete("delete_for_me");
                    } else {
                      close();
                    }
                  }}
                  className={`relative h-11 ${MessageOptions.delete_only_from_me ? "" : "w-full"} ml-auto mr-0 min-w-fit overflow-hidden text-nowrap rounded-lg border border-[#FFEDAB] !bg-transparent px-4 py-2 text-base outline-none lg:px-9 lg:text-lg`}
                >
                  <div className="">
                    {MessageOptions.modalName == "delete_chat" ? (
                      loading && messageDelete == "delete_for_me" ? (
                        <ClipLoader size={25} />
                      ) : (
                        <TextTranslate text="Delete for me" />
                      )
                    ) : (
                      <TextTranslate text="Cancel" />
                    )}
                  </div>
                </button>

                {!MessageOptions.delete_only_from_me && (
                  <Button
                    onClickFunc={() => {
                      if (MessageOptions.delete_message) {
                        dispatch(
                          updateMessageOptions({ delete_from_every_one: true }),
                        );
                      }
                      yesDelete({ delete_from_every_one: true });
                      setMessageDelete("delete_from_everyone");
                    }}
                    className={`!h-11 min-w-fit ${(MessageOptions.delete_only_from_me, "MessageOptions.delete_only_from_me")} `}
                    text={
                      <TextTranslate
                        text={
                          loading && messageDelete == "delete_from_everyone" ? (
                            <ClipLoader size={25} />
                          ) : MessageOptions.modalName == "clear_chat" ? (
                            "Clear"
                          ) : MessageOptions.modalName == "delete_chat" ? (
                            "Delete for everyone"
                          ) : MessageOptions.modalName == "report_user" ? (
                            "Report"
                          ) : MessageOptions.modalName == "remove_member" ? (
                            "Remove"
                          ) : MessageOptions.modalName == "delete_group" ? (
                            "Delete Group"
                          ) : MessageOptions.modalName == "exit_from_group" ? (
                            "Exit From Group"
                          ) : MessageOptions.modalName == "block_user" ? (
                            currentConversationData.is_block ? (
                              "Unblock"
                            ) : (
                              "Block"
                            )
                          ) : (
                            ""
                          )
                        }
                      />
                    }
                  />
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
