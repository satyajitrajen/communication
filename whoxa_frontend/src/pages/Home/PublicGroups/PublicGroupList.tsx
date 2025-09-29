import { useEffect } from "react";
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
import { usePublicGroupList } from "../../../store/api/usePublicGroupList";
import { AllPublicGroup } from "../../../types/ResType";

export default function PublicGroupList({
  searchUser,
}: {
  searchUser: string;
}) {
  let {
    data: publicGroupList,
    isLoading,
    refetch: refetchPublicGroup,
  } = usePublicGroupList({
    group_name: searchUser,
  });
  let CreateGroup = useAppSelector((state) => state.CreateGroup);
  let userData = useAppSelector((state) => state.userData);
  let { data: groupSettingsData } = useGroupSettings();
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  const ChatListArray = useAppSelector((state) => state.chatList);
  const dispatch = useAppDispatch();
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

  // useEffect(() => {
  //   refetchContactlist();
  // }, [searchUser]);

  function changeCurrentConversation(group: AllPublicGroup) {
    if (group.conversation_id == currentConversationData.conversation_id) {
      return;
    }
    // let conversation_id =
    //   ChatListArray.find(
    //     (chatUser) => chatUser.conversation_id == group.conversation_id,
    //   )?.conversation_id ?? 0;

    // if (
    //   currentConversationData.conversation_id == conversation_id &&
    //   currentConversationData.conversation_id != 0
    // ) {
    //   return;
    // }

    dispatch(
      updateCurrentConversation({
        conversation_id: group.conversation_id,
        is_group: true,
        group_name: group.group_name,
        group_profile_image: group.group_profile_image,
        last_message: "",
        last_message_type: "",
        user_id: 0,
        user_name: "",
        phone_number: "",
        profile_image: "",
        is_block: false,
        createdAt: "",
        updatedAt: "",
        public_group: true,
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
      ) : publicGroupList?.allPublicGroup?.length == 0 ? (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>No Public group found</div>
        </div>
      ) : (
        // publicGroupList?.myContactList
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
        publicGroupList?.allPublicGroup
          .sort((a, b) => {
            const nameA = a?.group_name?.toLowerCase() || "";
            const nameB = b?.group_name?.toLowerCase() || "";
            return nameA.localeCompare(nameB);
          })
          .map((e) => {
            return (
              <>
                <div
                  onClick={() => {
                    changeCurrentConversation(e);
                    // if (location.pathname == "/contact-list") {
                    //   // changeCurrentConversation(e);
                    //   dispatch(
                    //     updateViewState({
                    //       show_chats_sidebar: false,
                    //     }),
                    //   );
                    //   return;
                    // }
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
                  className={`flex cursor-pointer items-center px-3 py-4 hover:bg-selectedChat ${false && "bg-selectedChat"}`}
                >
                  <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                    <LoadingSkeletonImageDynamic
                      radius=""
                      className="min-h-12 min-w-12 rounded-full object-cover 2xl:h-12 2xl:w-12"
                      image_height="100%"
                      image_url={e?.group_profile_image}
                      image_width=""
                    />
                  </div>

                  <div>
                    <div className="text-base font-medium capitalize text-darkText">
                      {e?.group_name}
                    </div>
                  </div>
                </div>
                <hr className="border-t border-borderColor" />
              </>
            );
          })
      )}
    </div>
  );
}
