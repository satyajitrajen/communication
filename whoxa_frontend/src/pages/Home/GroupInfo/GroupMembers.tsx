import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ContextMenuTrigger } from "rctx-contextmenu";
import React from "react";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateCreateGroupData } from "../../../store/Slices/CreateGroupSlice";
import { TbUserPlus } from "react-icons/tb";
import { updateSelectedGroupMember } from "../../../store/Slices/SelectedGroupMemberSlice";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import useApiPost from "../../../hooks/PostData";
import toast from "react-hot-toast";
import { removeMessageList } from "../../../store/Slices/MessageListSlice";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";
import { ConversationsUser } from "../../../types/ConversationInfoType";
import TextTranslate from "../../../utils/TextTranslate";

export default function GroupMembers() {
  let { data, isLoading, refetch } = useConversationInfo();
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  let userData = useAppSelector((state) => state.userData);
  let dispatch = useAppDispatch();
  const { loading, postData } = useApiPost();

  const selectedGroupMember = useAppSelector(
    (state) => state.SelectedGroupMember,
  );
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const ChatListArray = useAppSelector((state) => state.chatList);

  async function makeGrouAdmin() {
    let createGroupAdminRes = await postData("create-group-admin", {
      new_user_id: selectedGroupMember.User.user_id,
      remove_from_admin: selectedGroupMember.is_admin ? true : false,
      conversation_id: currentConversationData.conversation_id.toString(),
    });
    refetch();
    toast.success(
      `${selectedGroupMember.User.first_name} ${selectedGroupMember.User.last_name} ${selectedGroupMember.is_admin ? "removed from" : "is now"} group admin`,
    );
  }

  function changeCurrentConversation(member: ConversationsUser) {
    if (member.User.user_id == userData.user_id) {
      return;
    }
    let conversation_id =
      ChatListArray.find((chatUser) => chatUser.user_id == member.User.user_id)
        ?.conversation_id ?? 0;
    console.log(member, "member++++++++++++++++++++++++");
    console.log(member.User.user_name, "member.User.user_name");

    dispatch(
      updateCurrentConversation({
        conversation_id: conversation_id,
        is_group: false,
        group_name: "",
        group_profile_image: "",
        last_message: "",
        last_message_type: "",
        user_id: member.User.user_id,
        user_name: member.User.user_name,
        phone_number: member.User.phone_number,
        profile_image: member.User.profile_image,
        is_block: false,
        createdAt: "",
        updatedAt: "",
      }),
    );
    dispatch(removeMessageList());
    refetch();
  }

  return (
    <>
      {data?.conversationDetails.is_group && (
        <div className="cursor-pointer items-center space-y-3 border border-borderColor bg-otherProfileSidebar px-8 py-4 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
          <div className="flex justify-between">
            <div className="text-sm text-darkText">
              <TextTranslate text="Add Group Members" />
            </div>
            <div className="pr-3 text-sm text-darkText">
              {data.conversationDetails.ConversationsUsers.length}
            </div>
          </div>

          {data.conversationDetails.ConversationsUsers.find(
            (convoUser) => convoUser.User.user_id === userData.user_id,
          )?.is_admin && (
            <div
              onClick={() => {
                let existing_member_user_id =
                  data.conversationDetails.ConversationsUsers.map(
                    (user) => user.User.user_id,
                  );
                dispatch(
                  updateCreateGroupData({
                    show_add_member_modal: true,
                    existing_member_user_id: existing_member_user_id,
                  }),
                );
              }}
              className={`flex cursor-pointer items-center py-2`}
            >
              <div className="relative mr-3 grid h-14 w-14 place-content-center rounded-full bg-[#FDE693] text-black 2xl:h-12 2xl:w-12">
                <TbUserPlus className="h-5 w-5 object-cover 2xl:h-7 2xl:w-7" />
              </div>

              <div className="text-base font-medium capitalize text-darkText">
                Add Member
              </div>
            </div>
          )}

          {data?.conversationDetails.ConversationsUsers.map((member) => {
            return (
              <>
                <ContextMenuTrigger id="my-context-menu-2">
                  <div
                    onContextMenu={() => {
                      dispatch(updateSelectedGroupMember(member));
                    }}
                    className="flex"
                  >
                    <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                      <LoadingSkeletonImageDynamic
                        radius=""
                        className="mr-3 h-10 w-10 rounded-full object-cover 2xl:h-12 2xl:w-12"
                        image_height="100%"
                        image_url={member.User.profile_image}
                        image_width=""
                      />
                      {OnlineUserList.onlineUserList.includes(
                        member.User.user_id.toString(),
                      ) && (
                        <img
                          onClick={() => {
                            changeCurrentConversation(member);
                          }}
                          className="absolute bottom-0 right-0 z-30 h-4 w-4"
                          src="/Home/Online_Green_dot.png"
                          alt=""
                        />
                      )}
                    </div>
                    <div
                      onClick={() => {
                        changeCurrentConversation(member);
                      }}
                      className="w-full"
                    >
                      <div className="text-sm font-medium capitalize text-darkText">
                        {member.User.user_id == userData.user_id
                          ? "You"
                          : member.User.user_name}
                      </div>
                      <div className="flex justify-between">
                        <div className="font-SourceSansPro line-clamp-1 items-center gap-x-1 text-sm text-[#959595]">
                          {member.User.bio}
                        </div>
                        {member.is_admin && (
                          <div className="font-SourceSansPro line-clamp-1 items-center gap-x-1 rounded-lg bg-[#FEF4D1] px-3 py-1 text-xs text-[#717171]">
                            <TextTranslate text="Group Admin" />
                          </div>
                        )}
                      </div>
                    </div>

                    {data.conversationDetails.ConversationsUsers.find(
                      (convoUser) =>
                        convoUser.User.user_id === userData.user_id,
                    )?.is_admin && (
                      <Menu>
                        <MenuButton className="inline-flex items-center gap-2 rounded-md px-1 py-1.5 text-sm/6 font-semibold shadow-2xl focus:outline-none">
                          <PiDotsThreeVerticalBold
                            onClick={() => {
                              dispatch(updateSelectedGroupMember(member));
                            }}
                            className="cursor-pointer text-2xl"
                          />
                        </MenuButton>

                        <MenuItems className="absolute right-12 w-52 rounded-xl border border-borderColor bg-modalBg p-1 text-sm transition duration-200 ease-out focus:outline-none">
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => makeGrouAdmin()}
                                className={`group flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 ${
                                  active ? "bg-dropdownOptionHover" : ""
                                }`}
                              >
                                {member.is_admin
                                  ? "Remove From Admin"
                                  : "Make Group Admin"}
                              </button>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateMessageOptions({
                                      showModal: true,
                                      title: `Are you sure you want Remove ${selectedGroupMember.User.first_name} ${selectedGroupMember.User.last_name} From this Group??`,
                                      description: "",
                                      modalName: "remove_member",
                                    }),
                                  )
                                }
                                className={`group flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 ${
                                  active ? "bg-dropdownOptionHover" : ""
                                }`}
                              >
                                Remove
                              </button>
                            )}
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                    )}
                  </div>
                </ContextMenuTrigger>
              </>
            );
          })}
          {/* <ContextMenu
              appendTo="body"
              id="my-context-menu-2"
              className="!rounded-xl !bg-modalBg"
            >
              <ContextMenuItem className="hover:!bg-dropdownOptionHover">
                Make Group Admin
              </ContextMenuItem>

              <ContextMenuItem
                onClick={() =>
                  dispatch(
                    updateMessageOptions({
                      showModal: true,
                      title: `Are you sure you want Remove @Aanna From this Group??`,
                      description:
                        "This chat will be empty but will remain in your chat list.",
                      modalName: "clear_chat",
                    }),
                  )
                }
                className="hover:!bg-dropdownOptionHover"
              >
                Remove
              </ContextMenuItem>
            </ContextMenu> */}
        </div>
      )}
    </>
  );
}
