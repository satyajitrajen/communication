import React from "react";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { RiDeleteBin6Line, RiUserForbidLine } from "react-icons/ri";
import { TbMessageReport } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";
import { MdLogout } from "react-icons/md";
import TextTranslate from "../../../utils/TextTranslate";

export default function GroupActions() {
  let { data } = useConversationInfo();
  let currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  let dispatch = useAppDispatch();
  let userData = useAppSelector((state) => state.userData);

  return (
    <>
      {/* Other Options */}
      {!data?.conversationDetails.is_group && (
        <div
          onClick={() =>
            dispatch(
              updateMessageOptions({
                showModal: true,
                title: `Are you sure you want ${currentConversationData.is_block ? "Unblock" : "Block"} ${currentConversationData.user_name}?`,
                description: "",
                modalName: "block_user",
              }),
            )
          }
          className="flex cursor-pointer items-center border border-borderColor bg-otherProfileSidebar px-10 py-2 2xl:py-3"
        >
          <div className="flex items-center gap-3 text-sm text-[#FF2525]">
            <RiUserForbidLine className="text-lg" />
            <div className="">
              {currentConversationData.is_block ? "Unblock" : "Block"}{" "}
              {currentConversationData.is_group
                ? currentConversationData.group_name
                : currentConversationData.user_name}
            </div>
          </div>
        </div>
      )}
      <div className="flex cursor-pointer items-center border border-borderColor bg-otherProfileSidebar px-10 py-2 2xl:py-3">
        <div
          onClick={() =>
            dispatch(
              updateMessageOptions({
                // title: `Are you sure you want Report ${currentConversationData.user_name}?`,
                // description: "",
                modalName: "report_user",
              }),
            )
          }
          className="flex items-center gap-3 text-sm text-[#FF2525]"
        >
          <TbMessageReport className="text-lg" />
          <div className="">
            Report{" "}
            {currentConversationData.is_group
              ? currentConversationData.group_name
              : currentConversationData.user_name}
          </div>
        </div>
      </div>

      {data?.conversationDetails.is_group && (
        <>
          {data?.conversationDetails.ConversationsUsers.find(
            (convoUser) => convoUser.User.user_id === userData.user_id,
          )?.is_admin ? (
            <div className="flex cursor-pointer items-center border border-borderColor bg-otherProfileSidebar px-10 py-2 2xl:py-3">
              <div
                onClick={() =>
                  dispatch(
                    updateMessageOptions({
                      showModal: true,
                      title: `Are you sure you want Exit from ${currentConversationData.group_name}?`,
                      description: "",
                      modalName: "exit_from_group",
                    }),
                  )
                }
                className="flex items-center gap-3 text-sm text-[#FF2525]"
              >
                <MdLogout className="text-lg" />
                <div className="">Exit From Group</div>
              </div>
            </div>
          ) : (
            // <div className="flex cursor-pointer items-center border border-borderColor bg-otherProfileSidebar px-10 py-2 2xl:py-3">
            //   <div
            //     onClick={() =>
            //       dispatch(
            //         updateMessageOptions({
            //           showModal: true,
            //           title: `Are you sure you want Delete this group ${currentConversationData.group_name}?`,
            //           description: "All the chats will be deleted!",
            //           modalName: "delete_group",
            //         }),
            //       )
            //     }
            //     className="flex items-center gap-3 text-sm text-[#FF2525]"
            //   >
            //     <RiDeleteBin6Line className="text-lg" />
            //     <div className="">Delete Group</div>
            //   </div>
            // </div>
            <div className="flex cursor-pointer items-center border border-borderColor bg-otherProfileSidebar px-10 py-2 2xl:py-3">
              <div
                onClick={() =>
                  dispatch(
                    updateMessageOptions({
                      showModal: true,
                      title: `Are you sure you want Exit from ${currentConversationData.group_name}?`,
                      description: "",
                      modalName: "exit_from_group",
                    }),
                  )
                }
                className="flex items-center gap-3 text-sm text-[#FF2525]"
              >
                <MdLogout className="text-lg" />
                <div className="">
                  <TextTranslate text="Exit From Group" />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
