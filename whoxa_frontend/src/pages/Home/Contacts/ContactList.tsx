import { useContactList } from "../../../store/api/useContactList";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { addOrRemoveUserId } from "../../../store/Slices/CreateGroupSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useTheme } from "../../../context/ThemeProvider";
import { useGroupSettings } from "../../../store/api/useGroupSettings";
import toast from "react-hot-toast";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";
import { removeMessageList } from "../../../store/Slices/MessageListSlice";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { MyContactList } from "../../../types/SendMessageType";
import TextTranslate from "../../../utils/TextTranslate";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { useEffect, useState } from "react";

export default function ContactList({ searchUser }: { searchUser: string }) {
  let {
    data: contactListUser,
    isLoading,
    refetch: refetchContactlist,
  } = useContactList({
    full_name: searchUser,
  });
  let CreateGroup = useAppSelector((state) => state.CreateGroup);
  let userData = useAppSelector((state) => state.userData);
  let { data: groupSettingsData } = useGroupSettings();
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  const ChatListArray = useAppSelector((state) => state.chatList);
  const dispatch = useAppDispatch();
  const [has_any_contacts, sethas_any_contacts] = useState(false);
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const navigate = useNavigate();
  // @ts-ignore
  const { theme } = useTheme();
  const location = useLocation();
  let {
    data,
    isLoading: conversationInfoLoading,
    refetch,
  } = useConversationInfo();

  useEffect(() => {
    if (
      contactListUser?.myContactList?.length &&
      contactListUser?.myContactList?.filter(
        (contact) => userData.user_id != contact?.userDetails?.user_id,
      ).length > 0 && userData.user_id
    ) {
      sethas_any_contacts(true);
    }
  }, [contactListUser, userData.user_id]);

  function changeCurrentConversation(member: MyContactList) {
    if (member.userDetails.user_id == userData.user_id) {
      return;
    }
    let conversation_id =
      ChatListArray.find(
        (chatUser) => chatUser.user_id == member.userDetails.user_id,
      )?.conversation_id ?? 0;

    if (
      currentConversationData.conversation_id == conversation_id &&
      currentConversationData.conversation_id != 0
    ) {
      return;
    }

    dispatch(
      updateCurrentConversation({
        conversation_id: conversation_id,
        is_group: false,
        group_name: "",
        group_profile_image: "",
        last_message: "",
        last_message_type: "",
        user_id: member.userDetails.user_id,
        user_name: member.full_name,
        phone_number: member.phone_number,
        email_id: member.userDetails.email_id,
        profile_image: member.userDetails.profile_image,
        is_block: false,
        createdAt: "",
        updatedAt: "",
      }),
    );
    dispatch(removeMessageList());
    refetch();
  }

  return (
    <div className="my-5 flex h-[60vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-20">
      {isLoading ? (
        <div className="grid h-full place-content-center">
          <ClipLoader size={23} color={theme == "dark" ? "white" : "black"} />
        </div>
      ) : contactListUser?.myContactList?.filter(
          (contact) => userData.user_id != contact?.userDetails?.user_id,
        ).length == 0 ? (
        has_any_contacts ? (
          <div className="grid h-96 place-content-center gap-5">
            <img
              className="mx-auto h-16 w-16"
              src="/LightIcons/no_search_result_found.png"
              alt=""
            />
            <div>No Contacts Found</div>
          </div>
        ) : (
          <div className="grid h-96 place-content-center gap-5">
            <img
              className="mx-auto h-16 w-16"
              src="/LightIcons/contact_not_found_light.png"
              alt=""
            />
            <div className="px-5 text-center">
              Install the Whoxa mobile app first to sync your account and
              display your contacts here.
            </div>
          </div>
        )
      ) : (
        // contactListUser?.myContactList
        //   // .filter(
        //   //   (contact) =>
        //   //     contact.full_name
        //   //       .toLowerCase()
        //   //       .includes(searchUser.toLowerCase()) &&
        //   //     userData.user_id != contact?.userDetails?.user_id,
        //   // )
        //   .filter(
        //     (contact) => userData.user_id != contact?.userDetails?.user_id,
        //   )
        //   .map((e) => {
        contactListUser?.myContactList
          .filter(
            (contact) => userData.user_id !== contact?.userDetails?.user_id,
          )
          .sort((a, b) => {
            const nameA = a?.full_name?.toLowerCase() || "";
            const nameB = b?.full_name?.toLowerCase() || "";
            return nameA.localeCompare(nameB);
          })
          .map((e) => {
            return (
              <>
                <div
                  onClick={() => {
                    if (location.pathname == "/contact-list") {
                      changeCurrentConversation(e);
                      dispatch(
                        updateViewState({
                          show_chats_sidebar: false,
                        }),
                      );
                      return;
                    }

                    if (
                      CreateGroup.user_id.length >=
                        Number(groupSettingsData?.settings[0].max_members) &&
                      !CreateGroup.user_id.includes(e?.userDetails?.user_id)
                    ) {
                      toast.error(
                        `Max group memeber size is ${groupSettingsData?.settings[0].max_members}`,
                        { position: "bottom-left" },
                      );
                      return;
                    }
                    dispatch(
                      addOrRemoveUserId({
                        user_id: e.userDetails.user_id,
                      }),
                    );
                    //   if (
                    //     currentConversationData.conversation_id != e.conversation_id
                    //   ) {
                    //     dispatch(updateCurrentConversation(e));
                    //     dispatch(removeMessageList());
                    //   }
                  }}
                  onContextMenu={() => {
                    //   handleBlockContextMenu(e);
                    //   setSelectedConversation(e);
                  }}
                  //   key={e.id}
                  className={`flex cursor-pointer items-center px-3 py-4 hover:bg-selectedChat ${CreateGroup.user_id.includes(e?.userDetails?.user_id) && "bg-selectedChat"}`}
                >
                  <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                    <LoadingSkeletonImageDynamic
                      radius=""
                      className="min-h-12 min-w-12 rounded-full object-cover 2xl:h-12 2xl:w-12"
                      image_height="100%"
                      image_url={e?.userDetails?.profile_image}
                      image_width=""
                    />
                    {OnlineUserList.onlineUserList.includes(
                      e?.userDetails?.user_id?.toString(),
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
                      {e?.full_name}
                    </div>

                    <div className="flex items-center gap-x-1">
                      {/* <LiaCheckDoubleSolid className="text-lg text-primary" /> */}
                      <div className="line-clamp-1 flex w-full max-w-[12.5rem] gap-x-1 text-[13px] text-lightText">
                        {e?.userDetails?.user_name}
                      </div>
                    </div>
                  </div>
                  {CreateGroup.user_id.includes(e?.userDetails?.user_id) && (
                    <div className="ml-auto grid h-full grid-cols-1 place-content-center gap-y-2 text-center">
                      <img
                        className="h-5 w-5"
                        src="/Home/contact_selected.png"
                        alt=""
                      />
                    </div>
                  )}
                </div>
                <hr className="border-t border-borderColor" />
              </>
            );
          })
      )}

      {location.pathname != "/contact-list" &&
        CreateGroup.user_id.length > 1 && (
          <div className="absolute bottom-10 flex h-24 w-full items-end bg-gradient-to-t from-primary to-transparent lg:bottom-0">
            <div
              onClick={() => {
                navigate("/create-group");
              }}
              className="primary-gradient mx-auto my-5 w-[90%] cursor-pointer rounded-lg py-2 text-center"
            >
              <TextTranslate text="Next" />
            </div>
          </div>
        )}
    </div>
  );
}
