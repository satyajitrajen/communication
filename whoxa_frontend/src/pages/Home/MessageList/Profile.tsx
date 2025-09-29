import { PulseLoader } from "react-spinners";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import {
  setViewImage,
  toggleProfileView,
  updateViewState,
} from "../../../store/Slices/ViewManagerSlice";
import { formatLastSeen } from "../../../utils/formatUTCtoLocalDate";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { useEffect, useState } from "react";
import { TypingUserList } from "../../../types/OnlineUserType";
import TextTranslate from "../../../utils/TextTranslate";
import { IoChevronBack } from "react-icons/io5";
import { resetCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";

export default function Profile() {
  let dispatch = useAppDispatch();
  const [currentConversationTyping, setcurrentConversationTyping] =
    useState<TypingUserList[]>();
  let currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const userData = useAppSelector((state) => state.userData);
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  let UserLastSeenList = useAppSelector((state) => state.UserLastSeenList);
  let TypingUserList = useAppSelector((state) => state.TypingUserList);
  let { data: conversationInfo, isLoading } = useConversationInfo();
  // console.log(UserLastSeenList, "UserLastSeenList");

  useEffect(() => {
    setcurrentConversationTyping(
      TypingUserList.typingUserList.filter(
        (typing) =>
          typing.conversation_id ==
          currentConversationData.conversation_id.toString(),
      ),
    );
  }, [TypingUserList]);

  return (
    <div className="flex items-center sm:gap-2">
      {/* Back button ===========================================================*/}
      <IoChevronBack
        onClick={() => {
          dispatch(
            updateViewState({
              show_chats_sidebar: true,
            }),
          );
          dispatch(resetCurrentConversation());
        }}
        className="mr-2 flex w-fit cursor-pointer text-2xl lg:hidden"
      />

      <div
        onClick={() => {
          dispatch(
            setViewImage({
              show_image: true,
              image_src: [
                currentConversationData.is_group
                  ? currentConversationData.group_profile_image
                  : currentConversationData.profile_image,
              ],
            }),
          );
        }}
        className="mr-3 h-10 w-10 cursor-pointer overflow-hidden rounded-full 2xl:h-12 2xl:w-12"
      >
        <LoadingSkeletonImageDynamic
          radius=""
          className="h-10 w-10 object-cover 2xl:h-12 2xl:w-12"
          image_height="100%"
          image_url={
            currentConversationData.is_group
              ? currentConversationData.group_profile_image
              : currentConversationData.profile_image
          }
          image_width=""
        />
      </div>
      <div className="flex flex-col">
        <div
          onClick={() => {
            dispatch(toggleProfileView(true));
          }}
          className="cursor-pointer text-sm font-medium capitalize text-darkText sm:text-base"
        >
          {currentConversationData.is_group
            ? currentConversationData.group_name
            : currentConversationData.user_name}
        </div>

        {currentConversationData.is_group ? (
          <>
            {TypingUserList.typingUserList.filter(
              (typing) =>
                typing.conversation_id ==
                currentConversationData.conversation_id.toString(),
            ).length !== 0 ? (
              <div className="flex items-center">
                <div className="mr-2 text-xs text-[#FDD030] sm:text-sm">
                  {!isLoading &&
                    currentConversationTyping &&
                    currentConversationTyping.length > 0 && (
                      <>
                        {currentConversationTyping
                          .map((typingUser) => {
                            // Find the corresponding user details from conversationInfo
                            const user =
                              conversationInfo?.conversationDetails.ConversationsUsers.find(
                                (user) =>
                                  user.User.user_id.toString() ===
                                  typingUser.user_id,
                              );

                            // Return the user name if found, otherwise return a fallback
                            return user ? user.User.user_name : "Unknown User"; // Fallback in case user is not found
                          })
                          .join(", ")}{" "}
                        {currentConversationTyping.length > 1 ? "are" : "is"}{" "}
                        typing...
                      </>
                    )}
                </div>
                {/* <PulseLoader speedMultiplier={0.85} color="#FDD030" size={8} /> */}
              </div>
            ) : (
              <div className="line-clamp-1 text-xs text-lightText sm:text-sm">
                {(() => {
                  const members =
                    conversationInfo?.conversationDetails.ConversationsUsers ||
                    [];
                  const names = members.map((user) =>
                    user.User.user_id == userData.user_id
                      ? "You"
                      : user.User.first_name,
                  );
                  const maxVisible = 3;
                  const visibleNames = names.slice(0, maxVisible).join(", ");
                  const remainingCount = names.length - maxVisible;

                  return (
                    <>
                      {visibleNames}
                      {remainingCount > 0 && (
                        <span
                          onClick={() => {
                            dispatch(toggleProfileView(true));
                          }}
                          className="cursor-pointer text-darkText"
                        >
                          {` +${remainingCount} More`}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </>
        ) : (
          <>
            {TypingUserList.typingUserList.filter(
              (typing) =>
                typing.conversation_id ==
                currentConversationData.conversation_id.toString(),
            ).length != 0 ? (
              <div className="flex items-center">
                <div className="mr-2 text-xs text-[#FDD030] sm:text-sm">
                  Typing...
                </div>
                {/* <PulseLoader speedMultiplier={0.85} color="#FDD030" size={8} /> */}
              </div>
            ) : (
              <>
                {OnlineUserList.onlineUserList.includes(
                  currentConversationData.user_id.toString(),
                ) ? (
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <img
                      className="h-3 w-3"
                      src="/Home/Online_Green_dot.png"
                      alt=""
                    />
                    <div>
                      <TextTranslate text="Online" />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-lightText sm:text-sm">
                    {formatLastSeen(
                      UserLastSeenList.lastSeenUserList.filter(
                        (user) =>
                          user.user_id == currentConversationData.user_id,
                      )[0]?.updatedAt,
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
