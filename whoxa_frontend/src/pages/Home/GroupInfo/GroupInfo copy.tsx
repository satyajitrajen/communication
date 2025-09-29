/* eslint-disable prefer-const */
import React from "react";
import { CiStar } from "react-icons/ci";
import { FaAngleRight, FaPlay } from "react-icons/fa6";
import { RiUserForbidLine, RiDeleteBin6Line } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { TbMessageReport } from "react-icons/tb";
import {
  setViewImage,
  toggleProfileView,
  updateViewState,
} from "../../../store/Slices/ViewManagerSlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { GoDotFill } from "react-icons/go";
import TextTranslate from "../../../utils/TextTranslate";

export default function GroupInfo() {
  let dispatch = useAppDispatch();

  function closeSideBar() {
    dispatch(toggleProfileView(false));
  }

  let { data, isLoading } = useConversationInfo();
  let OnlineUserList = useAppSelector((state) => state.OnlineUserList);
  let userData = useAppSelector((state) => state.userData);

  const urls = data?.mediaData?.filter((message) => {
    return (
      (message.message_type === "image" || message.message_type === "video") &&
      message.url
    );
  });

  const image_urls = urls?.map((message) => message.url.replace(/\\/g, "/"));

  return (
    <div className="flex h-screen min-w-80 flex-col bg-secondary shadow-inner 2xl:min-w-96">
      <div
        style={{
          backgroundSize: "100%",
        }}
        className="mb-4 h-80 w-full space-y-5 bg-[url('/Home/profile_bg.png')] bg-no-repeat xl:space-y-7"
      >
        <div className="flex items-center gap-3 px-3 pt-16 font-semibold text-black 2xl:pt-16">
          <RxCross2
            className="cursor-pointer text-2xl"
            onClick={() => {
              closeSideBar();
            }}
          />
          <span className="">
            <TextTranslate
              text={
                data?.conversationDetails.is_group == true
                  ? "Group Info"
                  : "Contact Info"
              }
            />
          </span>
        </div>
        {/* Profile Image */}
        <div className="grid place-content-center gap-y-2 text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-primary p-2 2xl:h-36 2xl:w-36">
            <LoadingSkeletonImageDynamic
              radius=""
              className={`mx-auto h-20 w-20 rounded-full bg-secondary object-cover p-2 2xl:h-32 2xl:w-32`}
              image_height=""
              image_url={
                data?.conversationDetails.is_group == true
                  ? data?.conversationDetails.group_profile_image
                  : data?.conversationDetails.ConversationsUsers[0].User
                      .profile_image!
              }
              image_width=""
            />
          </div>

          <span className="text-lg font-semibold">
            {data?.conversationDetails.is_group
              ? data?.conversationDetails.group_name
              : data?.conversationDetails.ConversationsUsers[0].User.user_name!}
          </span>

          <span className="flex items-center justify-center gap-2 font-sans text-sm font-medium text-[#808080]">
            {data?.conversationDetails.is_group ? (
              <>
                Group <GoDotFill />{" "}
                {data?.conversationDetails.ConversationsUsers.length} Members
              </>
            ) : (
              <>
                {
                  data?.conversationDetails.ConversationsUsers[0].User
                    .country_code
                }{" "}
                {
                  data?.conversationDetails.ConversationsUsers[0].User
                    .phone_number
                }
              </>
            )}
          </span>
        </div>
      </div>
      <div className="h-full space-y-3">
        {/* About */}

        {!data?.conversationDetails.is_group && (
          <div className="flex flex-col border border-borderColor bg-otherProfileSidebar px-10 py-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <div className="text-sm text-[#959595]">About</div>
            <div className="font-medium">
              {data?.conversationDetails.ConversationsUsers[0].User.bio}
            </div>
          </div>
        )}

        {/* Links And Media */}
        <div className="flex flex-col border border-borderColor bg-otherProfileSidebar px-10 py-2 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
          <div
            onClick={() => {
              dispatch(updateViewState({ showMediaDocLinks: true }));
            }}
            className="flex cursor-pointer items-center justify-between text-sm text-[#959595]"
          >
            <span>
              <TextTranslate text="Media, links and docs" />
            </span>
            <div className="flex items-center gap-1">
              <span>{data?.mediaData.length}</span> <span></span>
              <FaAngleRight />
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1 md:grid-cols-3">
            {data?.mediaData.slice(0, 3).map((message, index) => {
              return (
                <>
                  {message.message_type == "image" ? (
                    <div
                      className="h-24 w-full"
                      onClick={() => {
                        dispatch(
                          setViewImage({
                            show_image: true,
                            image_src: image_urls,
                            currentIndex: index,
                          }),
                        );
                      }}
                    >
                      <LoadingSkeletonImageDynamic
                        radius=""
                        className="h-24 w-full cursor-pointer object-cover"
                        image_height="100%"
                        image_url={
                          message.message_type == "image"
                            ? message.url
                            : message.thumbnail
                        }
                        image_width=""
                      />
                    </div>
                  ) : (
                    // <div
                    //   onClick={() => {
                    //     dispatch(
                    //       setViewImage({
                    //         show_image: true,
                    //         image_src: image_urls,
                    //         currentIndex: index,
                    //       }),
                    //     );
                    //   }}
                    //   className="relative cursor-pointer"
                    // >
                    //   <div className="absolute grid h-full w-full place-content-center">
                    //     <FaPlay className="h-11 w-11 rounded-full bg-[#0000008F] p-3" />
                    //   </div>
                    //   <img
                    //     className="h-24 w-full cursor-pointer object-cover"
                    //     src={
                    //       message.message_type == "video"
                    //         ? message.thumbnail
                    //         : message.url
                    //     }
                    //     alt=""
                    //   />
                    // </div>
                    <div
                      onClick={() => {
                        dispatch(
                          setViewImage({
                            show_image: true,
                            image_src: image_urls,
                            currentIndex: index,
                          }),
                        );
                      }}
                      className="h-24 w-full cursor-pointer object-cover"
                    >
                      <div className="absolute grid h-full w-full place-content-center">
                        <FaPlay className="h-11 w-11 rounded-full bg-[#0000008F] p-3 text-white" />
                      </div>
                      <LoadingSkeletonImageDynamic
                        radius=""
                        className="h-24 w-full cursor-pointer object-cover"
                        image_height="100%"
                        image_url={message.thumbnail}
                        image_width=""
                      />
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>

        {/* Star Message */}
        <div className="flex cursor-pointer items-center justify-between border border-borderColor bg-otherProfileSidebar px-10 py-2 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] 2xl:py-3">
          <div className="flex items-center gap-3 text-sm">
            <CiStar className="text-lg" />
            <div className="text-darkText">Starred Message</div>
          </div>

          <FaAngleRight />
        </div>

        {/* Group Members */}
        {data?.conversationDetails.is_group && (
          <div className="cursor-pointer items-center space-y-3 border border-borderColor bg-otherProfileSidebar px-8 py-4 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <div className="text-sm text-darkText">
              <TextTranslate text="Group Members" />
            </div>

            {data?.conversationDetails.ConversationsUsers.map((member) => {
              return (
                <>
                  <div className="flex">
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
                          className="absolute bottom-0 right-0 z-30 h-4 w-4"
                          src="/Home/Online_Green_dot.png"
                          alt=""
                        />
                      )}
                    </div>
                    <div className="w-full">
                      <div className="text-base font-medium capitalize text-darkText">
                        {member.User.user_id == userData.user_id
                          ? "You"
                          : member.User.user_name}
                      </div>
                      <div className="flex justify-between">
                        <div className="font-SourceSansPro line-clamp-1 items-center gap-x-1 text-sm text-[#959595]">
                          {member.User.bio}
                        </div>
                        {member.is_admin && (
                          <div className="font-SourceSansPro line-clamp-1 items-center gap-x-1 rounded-lg bg-[#FEF4D1] px-2 text-sm text-[#717171]">
                            Group Admin
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}

        {/* Other Options */}
        {!data?.conversationDetails.is_group && (
          <div className="flex cursor-pointer items-center border border-borderColor bg-otherProfileSidebar px-10 py-2 2xl:py-3">
            <div className="flex items-center gap-3 text-sm text-[#FF2525]">
              <RiUserForbidLine className="text-lg" />
              <div className="">Unblock Alena Lubin</div>
            </div>
          </div>
        )}
        <div className="flex cursor-pointer items-center border border-borderColor bg-otherProfileSidebar px-10 py-2 2xl:py-3">
          <div className="flex items-center gap-3 text-sm text-[#FF2525]">
            <TbMessageReport className="text-lg" />
            <div className="">Report Alena Lubin</div>
          </div>
        </div>
        <div className="flex cursor-pointer items-center border border-borderColor bg-otherProfileSidebar px-10 py-2 2xl:py-3">
          <div className="flex items-center gap-3 text-sm text-[#FF2525]">
            <RiDeleteBin6Line className="text-lg" />
            <div className="">Delete Group</div>
          </div>
        </div>
      </div>
    </div>
  );
}
