import { useEffect, useState } from "react";
import { BsCameraVideo } from "react-icons/bs";
import { IoImageOutline, IoLocationOutline } from "react-icons/io5";
import chatSidebarTime from "../../../utils/chatSidebarTime";
import { ChatList } from "../../../types/ChatListType";
import { HiOutlineDocumentText } from "react-icons/hi";

import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuItem,
} from "rctx-contextmenu";
import { socketInstance } from "../../../socket/socket";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";
import { removeMessageList } from "../../../store/Slices/MessageListSlice";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { BlockUserRes } from "../../../types/ResType";
import useApiPost from "../../../hooks/PostData";
import { updateSearchMessageResult } from "../../../store/Slices/SearchMessageSlice";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import toast from "react-hot-toast";
import CallInConversationList from "./CallInConversationList";
import { RiContactsLine } from "react-icons/ri";
import { PulseLoader } from "react-spinners";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import TextTranslate from "../../../utils/TextTranslate";

export default function ArchiveConversationList({
  searchUser,
}: {
  searchUser: string;
}) {
  const { loading, postData } = useApiPost();
  useEffect(() => {
    socketInstance().emit("ChatList", {});
  }, []);
  const dispatch = useAppDispatch();

  const OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  const TypingUserList = useAppSelector((state) => state.TypingUserList);
  const archiveList = useAppSelector((state) => state.archiveList);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  const [SelectedConversation, setSelectedConversation] = useState<ChatList>();

  async function blockUser() {
    let blockUserResponse: BlockUserRes = await postData("block-user", {
      conversation_id: SelectedConversation?.conversation_id,
    });
    if (
      SelectedConversation?.conversation_id ==
      currentConversationData.conversation_id
    ) {
      dispatch(
        updateCurrentConversation({ is_block: blockUserResponse.is_block }),
      );
    }
    socketInstance().emit("ChatList", {});
  }

  async function unArchiveConversation() {
    const unArchiveRes = await postData("add-to-archive", {
      conversation_id: SelectedConversation?.conversation_id,
    });

    socketInstance().emit("ChatList", {});
    toast.success("Conversation Unarchived", { position: "bottom-left" });
  }

  async function deleteConversation() {
    await postData("delete-chatlist", {
      conversation_id: SelectedConversation?.conversation_id,
    });

    // if deleted conversation is current coversation than remove the message list =======================================
    if (
      currentConversationData.conversation_id ==
      SelectedConversation?.conversation_id
    ) {
      dispatch(removeMessageList());
      dispatch(
        updateCurrentConversation({
          conversation_id: -1,
          group_name: "",
          group_profile_image: "",
          profile_image: "",
          user_id: 0,
          is_group: false,
        }),
      );
    }

    socketInstance().emit("ChatList", {});
    toast.success("Conversation Deleted!", { position: "bottom-left" });
  }

  const handleBlockContextMenu = (e: ChatList) => {
    e;
  };

  return (
    <>
      <div className="flex h-[80vh] w-full flex-col overflow-y-auto overflow-x-hidden lg:max-w-md">
        {archiveList.length == 0 ? (
          <div className="grid h-96 place-content-center gap-5">
            <img
              className="mx-auto h-16 w-16"
              src="/LightIcons/no_search_result_found.png"
              alt=""
            />
            <div>No Conversations Found</div>
          </div>
        ) : (
          archiveList
            .filter(
              (chat) =>
                chat.user_name
                  .toLowerCase()
                  .includes(searchUser.toLowerCase()) ||
                chat.group_name
                  .toLowerCase()
                  .includes(searchUser.toLowerCase()),
            )
            .map((e) => {
              return (
                <>
                  <ContextMenuTrigger id="my-context-menu-1">
                    <div
                      onClick={() => {
                        if (
                          currentConversationData.conversation_id !=
                          e.conversation_id
                        ) {
                          dispatch(updateCurrentConversation(e));
                          dispatch(removeMessageList());
                          dispatch(updateSearchMessageResult([]));
                          dispatch(
                            updateViewState({ showSearchMessage: false }),
                          );
                          dispatch(
                            updateViewState({
                              show_chats_sidebar: false,
                            }),
                          );
                        }
                      }}
                      onContextMenu={() => {
                        handleBlockContextMenu(e);
                        setSelectedConversation(e);
                      }}
                      //   key={e.id}
                      className={`group flex cursor-pointer items-center px-3 py-4 hover:bg-selectedChat ${currentConversationData.conversation_id == e.conversation_id && "bg-selectedChat"}`}
                    >
                      <div className="relative mr-3 h-14 w-14 2xl:min-h-12 2xl:min-w-12">
                        <LoadingSkeletonImageDynamic
                          radius=""
                          className="min-h-1 min-w-12 rounded-full object-cover"
                          image_height="100%"
                          image_url={
                            e.is_group ? e.group_profile_image : e.profile_image
                          }
                          image_width=""
                        />
                        {!e.is_group &&
                          OnlineUserList.onlineUserList.includes(
                            e.user_id.toString(),
                          ) && (
                            <img
                              className="absolute bottom-0 right-0 z-30 h-4 w-4"
                              src="/Home/Online_Green_dot.png"
                              alt=""
                            />
                          )}
                      </div>
                      {/* <img
                    src={e.is_group ? e.group_profile_image : e.profile_image}
                    className="mr-3 h-10 w-10 rounded-full object-cover 2xl:h-12 2xl:w-12"
                    alt=""
                  /> */}
                      <div>
                        <div className="text-base font-medium capitalize text-darkText">
                          {e.is_group ? e.group_name : e.user_name}
                        </div>

                        <div className="flex items-center gap-x-1">
                          {/* <LiaCheckDoubleSolid className="text-lg text-primary" /> */}
                          <div className="line-clamp-1 flex w-full max-w-[12.5rem] gap-x-1 text-[13px] text-lightText">
                            {/* First check for typing ====================================================================================*/}
                            <>
                              {TypingUserList.typingUserList.filter((typing) =>
                                typing.conversation_id.includes(
                                  e.conversation_id.toString(),
                                ),
                              ).length != 0 ? (
                                <div className="flex items-center">
                                  {/* <div className="text-[#FDD030] mr-2">Typing</div> */}
                                  <PulseLoader
                                    speedMultiplier={0.85}
                                    color="#FDD030"
                                    size={8}
                                  />
                                </div>
                              ) : (
                                <>
                                  {e.last_message_type == "image" ? (
                                    <>
                                      <IoImageOutline className="fa fa-solid fa-image w-5 text-xl text-gray-500" />{" "}
                                      Image
                                    </>
                                  ) : e.last_message_type == "gif" ? (
                                    <>
                                      😈
                                      <div>Gif</div>
                                    </>
                                  ) : e.last_message_type == "video" ? (
                                    <>
                                      <BsCameraVideo className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
                                      Video
                                    </>
                                  ) : e.last_message_type == "document" ? (
                                    <>
                                      <HiOutlineDocumentText className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
                                      Document
                                    </>
                                  ) : e.last_message_type == "location" ? (
                                    <>
                                      <IoLocationOutline className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
                                      Location
                                    </>
                                  ) : e.last_message_type == "text" ? (
                                    <span className="line-clamp-1 w-full">
                                      {e.last_message}
                                    </span>
                                  ) : e.last_message_type == "link" ? (
                                    <>
                                      <span>🔗</span>
                                      <span className="line-clamp-1 w-full">
                                        {e.last_message}
                                      </span>
                                    </>
                                  ) : e.last_message_type == "contact" ? (
                                    <>
                                      <RiContactsLine />
                                      <span className="line-clamp-1">
                                        Contact
                                      </span>
                                    </>
                                  ) : e.last_message_type == "video_call" ||
                                    e.last_message_type == "audio_call" ? (
                                    <>
                                      <CallInConversationList messageData={e} />
                                    </>
                                  ) : (
                                    <>{e.last_message}</>
                                  )}
                                </>
                              )}
                            </>
                          </div>
                        </div>
                      </div>

                      <div className="ml-auto grid h-full grid-cols-1 place-content-start gap-y-2 text-center">
                        <div className="min-w-20 text-xs text-lightText">
                          {chatSidebarTime(e.updatedAt)}
                        </div>
                        <div className="mx-auto flex w-fit gap-1">
                          {Number(e.unread_count) > 0 ? (
                            <div className="primary-gradient z-10 mx-auto grid h-5 w-5 place-content-center rounded-full text-xs text-white">
                              {e.unread_count}
                            </div>
                          ) : (
                            <>
                              <div className="h-5 w-5"></div>
                            </>
                          )}
                          {/* <div className="hidden group-hover:inline"> */}
                          <Menu>
                            <MenuButton
                              onClick={(event) => {
                                event.stopPropagation(); // Prevents the parent onClick event
                                setSelectedConversation(e);
                              }}
                              className="invisible items-center font-semibold shadow-2xl focus:outline-none group-hover:visible data-[focus]:outline-0"
                            >
                              <IoIosArrowDown className="cursor-pointer text-xl" />
                            </MenuButton>

                            <MenuItems
                              transition
                              anchor="bottom end"
                              className="z-10 w-52 origin-top-right rounded-xl border border-borderColor bg-modalBg p-1 text-sm/6 transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                            >
                              <MenuItem>
                                <button
                                  onClick={() => {
                                    unArchiveConversation();
                                  }}
                                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
                                >
                                  <TextTranslate text="Unarchive Chat" />
                                </button>
                              </MenuItem>
                              <MenuItem>
                                <button
                                  onClick={() => {
                                    deleteConversation();
                                  }}
                                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
                                >
                                  <TextTranslate text="Delete Chat" />
                                </button>
                              </MenuItem>

                              {!e.is_group && (
                                <MenuItem>
                                  <button
                                    onClick={() => {
                                      blockUser();
                                    }}
                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
                                  >
                                    <TextTranslate
                                      text={e.is_block ? "Unblock" : "Block"}
                                    />
                                  </button>
                                </MenuItem>
                              )}
                            </MenuItems>
                          </Menu>
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                    <hr className="border-t border-borderColor" />
                  </ContextMenuTrigger>
                </>
              );
            })
        )}
      </div>

      {SelectedConversation?.is_group ? (
        <ContextMenu id="my-context-menu-1" className="!rounded-xl !bg-modalBg">
          <ContextMenuItem
            onClick={() => {
              unArchiveConversation();
            }}
            className="hover:!bg-dropdownOptionHover"
          >
            <TextTranslate text="Unarchive Chat" />
          </ContextMenuItem>
          {/* <ContextMenuItem className="hover:!bg-dropdownOptionHover">
            Mute Notification
          </ContextMenuItem> */}
          <ContextMenuItem
            onClick={() => {
              deleteConversation();
            }}
            className="hover:!bg-dropdownOptionHover"
          >
            <TextTranslate text="Delete Chat" />
          </ContextMenuItem>
        </ContextMenu>
      ) : (
        <ContextMenu id="my-context-menu-1" className="!rounded-xl !bg-modalBg">
          <ContextMenuItem
            onClick={() => {
              unArchiveConversation();
            }}
            className="hover:!bg-dropdownOptionHover"
          >
            <TextTranslate text="Unarchive Chat" />
          </ContextMenuItem>
          {/* <ContextMenuItem className="hover:!bg-dropdownOptionHover">
            Mute Notification
          </ContextMenuItem> */}
          <ContextMenuItem
            onClick={() => {
              deleteConversation();
            }}
            className="hover:!bg-dropdownOptionHover"
          >
            <TextTranslate text="Delete Chat" />
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              blockUser();
            }}
            className="hover:!bg-dropdownOptionHover"
          >
            <TextTranslate
              text={SelectedConversation?.is_block ? "Unblock" : "Block"}
            />
          </ContextMenuItem>
        </ContextMenu>
      )}
    </>
  );
}
