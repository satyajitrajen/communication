import { useContactList } from "../../../store/api/useContactList";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import {
  addOrRemoveUserId,
  updateCreateGroupData,
} from "../../../store/Slices/CreateGroupSlice";
import { ClipLoader } from "react-spinners";
import { useTheme } from "../../../context/ThemeProvider";
import useApiPost from "../../../hooks/PostData";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import toast from "react-hot-toast";
import { useGroupSettings } from "../../../store/api/useGroupSettings";

export default function AddMemberContactList({
  searchUser,
}: {
  searchUser: string;
}) {
  // @ts-ignore
  const { theme } = useTheme();
  let { isLoading: isContactLoading, data: contactListUser } = useContactList({
    full_name: searchUser,
  });
  let CreateGroup = useAppSelector((state) => state.CreateGroup);
  let CurrentConversation = useAppSelector(
    (state) => state.CurrentConversation,
  );
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  const dispatch = useAppDispatch();
  const { loading, postData } = useApiPost();
  let { refetch } = useConversationInfo();
  let { data: groupSettingsData } = useGroupSettings();

  async function addMemberToGroup() {
    let addMemberToGroup = await postData("add-member-to-group", {
      multiple_user_id: CreateGroup.user_id.join(","),
      conversation_id: CurrentConversation.conversation_id,
    });

    dispatch(
      updateCreateGroupData({
        show_add_member_modal: false,
        existing_member_user_id: [],
        user_id: [],
      }),
    );
    toast.success(`${CreateGroup.user_id.length} member added to group`);
    refetch();
  }
  return (
    <div className="my-5 flex h-[60vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden lg:pb-20">
      {isContactLoading && (
        <div className="flex h-[83vh] flex-col items-center justify-center gap-y-2 overflow-y-auto px-14 py-6">
          <ClipLoader color={theme == "dark" ? "white" : "black"} />
        </div>
      )}
      {contactListUser?.myContactList.length == 0 ? (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>No contacts found</div>
        </div>
      ) : (
        contactListUser?.myContactList
          // .filter((contact) =>
          //   contact.full_name.toLowerCase().includes(searchUser.toLowerCase()),
          // )
          .map((e) => {
            return (
              <>
                <div
                  onClick={() => {
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
                        user_id: e.userDetails?.user_id,
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
                  // if member is allready in the group then can not be removed from here
                  style={{
                    pointerEvents: CreateGroup.existing_member_user_id.includes(
                      e?.userDetails?.user_id,
                    )
                      ? "none"
                      : "auto",
                  }}
                  className={`flex cursor-pointer items-center justify-start px-3 py-4 hover:bg-selectedChat ${CreateGroup.user_id.includes(e?.userDetails?.user_id) && "bg-selectedChat"} ${
                    CreateGroup.existing_member_user_id.includes(
                      e?.userDetails?.user_id,
                    ) && "opacity-70"
                  }`}
                >
                  {CreateGroup?.user_id.includes(e?.userDetails?.user_id) ||
                  CreateGroup?.existing_member_user_id?.includes(
                    e?.userDetails?.user_id,
                  ) ? (
                    <div className="ml-2 mr-4 grid h-full grid-cols-1 place-content-center gap-y-2 text-center">
                      <img
                        className="h-5 w-5"
                        src="/Home/selected_checkbox.png"
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="ml-2 mr-4 grid h-full grid-cols-1 place-content-center gap-y-2 text-center">
                      <img
                        className="h-5 w-5"
                        src="/Home/Empty_checkbox.png"
                        alt=""
                      />
                    </div>
                  )}
                  <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                    <LoadingSkeletonImageDynamic
                      radius=""
                      className="h-10 w-10 rounded-full object-cover 2xl:h-12 2xl:w-12"
                      image_height="100%"
                      image_url={e?.userDetails?.profile_image}
                      image_width=""
                    />
                    {OnlineUserList?.onlineUserList?.includes(
                      e?.userDetails?.user_id.toString(),
                    ) && (
                      <img
                        className="absolute bottom-0 right-0 z-30 h-4 w-4"
                        src="/Home/Online_Green_dot.png"
                        alt=""
                      />
                    )}
                  </div>

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
                </div>
                <hr className="border-t border-borderColor" />
              </>
            );
          })
      )}

      {CreateGroup.user_id.length !== 0 && (
        <div className="absolute bottom-0 flex h-24 w-full items-end bg-gradient-to-t from-primary to-transparent">
          <div
            onClick={() => {
              addMemberToGroup();
              // navigate("/create-group");
            }}
            className=" primary-gradient mx-auto my-5 w-[90%] cursor-pointer rounded-lg py-2 text-center"
          >
            {loading ? (
              <ClipLoader
                size={19}
                color={theme == "dark" ? "white" : "black"}
              />
            ) : (
              "Add Member"
            )}
          </div>
        </div>
      )}
    </div>
  );
}
