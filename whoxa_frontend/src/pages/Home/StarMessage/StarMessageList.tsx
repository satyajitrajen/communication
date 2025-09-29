import { useStarMessageList } from "../../../store/api/useStarMessageList";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import LinkPreview from "../../../components/LinkPreview";
// @ts-ignore
import { AudioPlayer } from "react-audio-player-component";
import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { FaPlay } from "react-icons/fa6";
import { useTheme } from "../../../context/ThemeProvider";
import CallInMessageList from "../MessageList/CallInMessageList";
import GoogleMapReact from "google-map-react";
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { formatTimeOnly } from "../../../utils/formatUTCtoLocalDate";
import { MdArrowLeft, MdArrowRight, MdLocationPin } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import {
  setViewImage,
  updateViewState,
} from "../../../store/Slices/ViewManagerSlice";
import { updateCurrentConversation } from "../../../store/Slices/CurrentConversationSlice";
import { removeMessageList } from "../../../store/Slices/MessageListSlice";
import { updateSearchMessageResult } from "../../../store/Slices/SearchMessageSlice";
import { socketInstance } from "../../../socket/socket";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";
import type { StarMessageList } from "../../../types/StarMessageListTypes";
import { updateNavigateToSpesificMessage } from "../../../store/Slices/NavigateToSpesificMessageSlice";
import { useEffect } from "react";
import TextTranslate from "../../../utils/TextTranslate";

export default function StarMessageList() {
  let { data, isLoading } = useStarMessageList();
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();
  const CurrentConversation = useAppSelector(
    (state) => state.CurrentConversation,
  );

  // @ts-ignore
  const { theme } = useTheme();

  const handleImageClick = (imageIndex: number) => {
    dispatch(
      setViewImage({
        show_image: true,
        image_src: image_urls,
        currentIndex: imageIndex,
      }),
    );
  };

  const urls = data?.StarMessageList?.filter((message) => {
    return (
      (message.Chat.message_type === "image" ||
        message.Chat.message_type === "video") &&
      message.Chat.message_type
    );
  });

  const image_urls = urls?.map((message) =>
    message.Chat.url.replace(/\\/g, "/"),
  );

  function navigateToThatChat(starMessage: StarMessageList) {
    if (CurrentConversation.conversation_id != starMessage.conversation_id) {
      dispatch(
        updateCurrentConversation({
          conversation_id: starMessage.conversation_id,
          createdAt: "",
          group_name: starMessage.Chat.Conversation.group_name,
          group_profile_image:
            starMessage.Chat.Conversation.group_profile_image,
          is_block: false,
          is_group: starMessage.Chat.Conversation.is_group,
          last_message: "",
          last_message_type: "",
          phone_number: starMessage?.otherUserDetails[0]?.phone_number,
          profile_image: starMessage?.otherUserDetails[0]?.profile_image,
          updatedAt: "",
          user_id: starMessage.otherUserDetails[0]?.user_id,
          user_name: starMessage.otherUserDetails[0]?.user_name,
        }),
      );
      dispatch(removeMessageList());
      dispatch(updateSearchMessageResult([]));
      dispatch(updateViewState({ showSearchMessage: false }));
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      socketInstance().emit("messageReceived", {
        conversation_id: starMessage.conversation_id,
        user_timezone: timeZone,
        // message_id: starMessage.message_id! + 5,
      });
      dispatch(
        updateMessageOptions({
          isMessageLoading: true,
        }),
      );
    }

    dispatch(
      updateNavigateToSpesificMessage({
        conversation_id: starMessage.conversation_id,
        navigate_to_message: true,
        message_id: starMessage.Chat.message_id,
      }),
    );
  }
  useEffect(() => {
    console.log(data, "star message data +++++++++++++++++");
  }, [data]);

  return (
    <div className="flex h-full max-h-[88vh] flex-col gap-y-2 overflow-y-auto px-4 py-5">
      {isLoading ? (
        <div className="grid h-96 place-content-center">
          <ClipLoader
            className=""
            color={theme == "dark" ? "white" : "black"}
            size={22}
          />
        </div>
      ) : (
        <>
          {data?.StarMessageList?.length == 0 ||
          data?.StarMessageList?.length == undefined ? (
            <div className="grid h-96 place-content-center gap-5">
              <img
                className="mx-auto h-16 w-16"
                src="/LightIcons/no_search_result_found.png"
                alt=""
              />
              <div>
                <TextTranslate text="No Star Message Found" />
              </div>
            </div>
          ) : (
            // Filter out the delted messages
            data?.StarMessageList.filter(
              (starMessage) =>
                starMessage.Chat.delete_from_everyone == false && // Exclude messages deleted for everyone
                !starMessage.Chat.delete_for_me.includes(
                  userData.user_id.toString(),
                ), // Exclude messages deleted for the current user
            ).map((starMessage) => {
              const imageIndex = image_urls?.indexOf(
                starMessage.Chat.url.replace(/\\/g, "/"),
              );

              return (
                <>
                  <div className={`my-2 flex flex-col rounded-lg`}>
                    <div className="flex items-end justify-end">
                      <div
                        onClick={() => {
                          navigateToThatChat(starMessage);
                        }}
                        className={`mx-2 flex w-full cursor-pointer flex-col space-y-2 ${starMessage.Chat.senderId == userData.user_id ? "order-1 items-end" : "order-2"}`}
                      >
                        <div>
                          <div
                            onClick={() => {
                              // navigateToThatChat(starMessage);
                            }}
                            className={`flex cursor-pointer items-center ${starMessage.Chat.senderId == userData.user_id ? "flex-row-reverse" : "flex-row"} gap-2`}
                          >
                            <img
                              src={starMessage.Chat.User?.profile_image}
                              alt="My profile"
                              className={`mb-2 h-7 w-7 rounded-full object-cover`}
                            />

                            <div className={``}>
                              {starMessage.Chat.User.user_id == userData.user_id
                                ? "You"
                                : `${
                                    starMessage.Chat.Conversation.is_group
                                      ? starMessage.Chat.Conversation.group_name
                                      : starMessage.Chat.User.first_name +
                                        " " +
                                        starMessage.Chat.User.last_name
                                  }`}
                            </div>

                            {starMessage.Chat.User.user_id ==
                            userData.user_id ? (
                              <MdArrowLeft className="text-xl" />
                            ) : (
                              <MdArrowRight className="text-xl" />
                            )}

                            <div className={``}>
                              {/* This means if current user is not sender then he/she is receiver ==========================*/}
                              {starMessage?.Chat.senderId !== userData.user_id
                                ? "You"
                                : `${
                                    starMessage.Chat.Conversation.is_group
                                      ? starMessage.Chat.Conversation.group_name
                                      : starMessage.otherUserDetails[0]
                                          .first_name +
                                        " " +
                                        starMessage.otherUserDetails[0]
                                          .last_name
                                  }`}
                            </div>
                          </div>
                          <div
                            className={`${
                              !["text", "video_call", "audio_call"].includes(
                                starMessage.Chat.message_type!,
                              )
                                ? ""
                                : starMessage.Chat.senderId == userData.user_id
                                  ? "primary-gradient ml-auto rounded-br-none"
                                  : "rounded-bl-none bg-otherMessageBg"
                            } ${starMessage.Chat.message_type == "text" && "px-2"} group relative flex w-fit min-w-[1rem] max-w-[90%] rounded-lg py-1 text-sm`}
                          >
                            {starMessage.Chat.message_type === "text" ? (
                              <div>{starMessage.Chat.message}</div>
                            ) : starMessage.Chat.message_type === "link" ? (
                              <div
                                className={`w-[90%] ${
                                  starMessage.Chat.senderId == userData.user_id
                                    ? "ml-auto"
                                    : "rounded-bl-none bg-otherMessageBg"
                                } `}
                              >
                                <LinkPreview
                                  right={
                                    starMessage.Chat.senderId ==
                                    userData.user_id
                                  }
                                  url={starMessage.Chat.message}
                                />
                              </div>
                            ) : starMessage.Chat.message_type === "image" ? (
                              <div
                              // onClick={() => {
                              //   handleImageClick(imageIndex!);
                              // }}
                              >
                                <LoadingSkeletonImageDynamic
                                  radius=""
                                  className={` ${
                                    starMessage.Chat.senderId ==
                                    userData.user_id
                                      ? "rounded-br-none"
                                      : "rounded-bl-none"
                                  } h-32 w-56 cursor-pointer select-none rounded-lg object-cover transition-all duration-300 lg:h-36 lg:w-60`}
                                  image_height=""
                                  image_url={starMessage.Chat.url}
                                  image_width=""
                                />
                              </div>
                            ) : starMessage.Chat.message_type === "video" ? (
                              <div
                                // onClick={() => {
                                //   handleImageClick(imageIndex!);
                                // }}
                                className={` ${
                                  starMessage.Chat.senderId == userData.user_id
                                    ? "rounded-br-none"
                                    : "rounded-bl-none"
                                } relative h-36 w-60 cursor-pointer overflow-hidden rounded-lg`}
                              >
                                <div className="absolute grid h-full w-full place-content-center">
                                  <FaPlay className="h-11 w-11 rounded-full bg-[#0000008F] p-3 text-white" />
                                </div>
                                <LoadingSkeletonImageDynamic
                                  radius=""
                                  className={`h-36 w-60 select-none object-cover`}
                                  image_height="100%"
                                  image_url={starMessage.Chat.thumbnail}
                                  image_width="100%"
                                />
                              </div>
                            ) : starMessage.Chat.message_type === "document" ? (
                              <div
                                className={`w-full max-w-72 rounded-[9px] ${starMessage.Chat.senderId == userData.user_id ? "primary-gradient rounded-br-none" : "rounded-bl-none bg-pdfBg"} min-w-72 px-1 pb-3 pt-1`}
                              >
                                <div
                                  className={`flex items-center justify-between gap-2 rounded-[7px] p-4 px-6 text-sm ${theme == "dark" ? "bg-[#1D1D1D]" : "bg-[#FAFAFA]"}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <img
                                      className="h-10 w-10 object-cover"
                                      src="/DarkIcons/pdf_icons.png"
                                      alt=""
                                    />
                                    <div
                                      className={`w-full ${theme == "dark" ? "text-white" : "text-black"} max-w-56 overflow-hidden`}
                                    >
                                      {starMessage?.Chat?.url
                                        ?.split("/")
                                        .pop()
                                        ?.split("-")
                                        .slice(1)
                                        .join("-") || ""}
                                    </div>
                                  </div>
                                  <img
                                    src="/DarkIcons/Download_icon.png"
                                    className="h-8 w-8 cursor-pointer"
                                    alt=""
                                  />
                                </div>
                              </div>
                            ) : starMessage.Chat.message_type === "audio" ? (
                              // <audio controls>
                              //   <source src={starMessage.Chat.url} type="audio/ogg" />
                              //   <source src={starMessage.Chat.url} type="audio/mpeg" />
                              //   Your browser does not support the audio element.
                              // </audio>
                              <AudioPlayer
                                src={starMessage.Chat.url}
                                minimal={true}
                                width={300}
                                trackHeight={50}
                                barWidth={3}
                                gap={1}
                                visualise={true}
                                backgroundColor={
                                  starMessage.Chat.senderId == userData.user_id
                                    ? theme == "dark"
                                      ? "#FFEDAB"
                                      : "#FFEDAB"
                                    : theme == "dark"
                                      ? "#787878"
                                      : "#DDDDDD"
                                }
                                barColor="#CCCCCC"
                                barPlayedColor="#000"
                                skipDuration={2}
                                seekBarColor="black"
                                // volumeControlColor="blue"
                                hideSeekBar={true}
                                hideTrackKnobWhenPlaying={true}
                              />
                            ) : starMessage.Chat.message_type === "location" ? (
                              <div
                                className={`h-36 w-56 max-w-80 rounded-[9px] lg:h-48 lg:w-[16rem] ${starMessage.Chat.senderId == userData.user_id ? "primary-gradient rounded-br-none" : "rounded-bl-none bg-pdfBg"} px-1 pt-1`}
                              >
                                <div className="mx-auto mt-1 h-32 w-56 lg:h-36 lg:w-60">
                                  <GoogleMapReact
                                    bootstrapURLKeys={{
                                      key: "AIzaSyAMZ4GbRFYSevy7tMaiH5s0JmMBBXc0qBA",
                                    }}
                                    defaultCenter={{
                                      lat: Number(starMessage.Chat.latitude),
                                      lng: Number(starMessage.Chat.longitude),
                                    }}
                                    defaultZoom={13}
                                    draggable={false}
                                  >
                                    <MdLocationPin className="text-3xl text-black" />
                                  </GoogleMapReact>
                                </div>
                                <div className="grid place-content-center">
                                  <a
                                    target="_blank"
                                    href={`http://maps.google.com/maps?z=12&t=m&q=loc:${starMessage.Chat.latitude}+${starMessage.Chat.longitude}`}
                                    className="mt-2 w-full cursor-pointer font-medium"
                                  >
                                    View Location
                                  </a>
                                </div>
                              </div>
                            ) : starMessage.Chat.message_type ===
                                "video_call" ||
                              starMessage.Chat.message_type === "audio_call" ? (
                              // @ts-ignore
                              <CallInMessageList
                                // @ts-ignore
                                messageData={starMessage.Chat}
                              />
                            ) : (
                              starMessage.Chat.message_type
                            )}

                            {/* {starMessage.Chat.message_type == "audio_call" ||
                          starMessage.Chat.message_type == "video_call" ? (
                            ""
                          ) : (
                            <div
                              className={`pl-2 opacity-0 ${(starMessage.Chat.message_type == "image" || starMessage.Chat.message_type == "video") && "absolute right-3 top-3"} ${MessageOptions.selectMessage ? "" : "group-hover:opacity-100"}`}
                            >
                              <SelectedMessageOption
                                messageData={messageData}
                              />
                            </div>
                          )} */}
                          </div>

                          <div
                            className={`flex ${starMessage.Chat.senderId == userData.user_id ? "justify-end" : "justify-start"} mt-1 items-center gap-x-2`}
                          >
                            <div className="text-xs text-lightText">
                              {formatTimeOnly(starMessage.Chat.createdAt)}
                            </div>
                            {/* {starMessage.Chat.senderId == userData.user_id && (
                            <LiaCheckDoubleSolid
                              title={
                                starMessage.Chat.message_read == 1
                                  ? "Seen"
                                  : "Unseen"
                              }
                              className={`h-5 w-5 ${
                                starMessage.Chat.message_read == 1
                                  ? "text-[#9997EE]"
                                  : "text-gray-400"
                              } `}
                            />
                          )} */}
                            {true && (
                              <img
                                className="h-3 w-3"
                                src="/Home/Star - Iconly Pro.png"
                                alt=""
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      {/* 
                      <img
                        src={starMessage.Chat.User?.profile_image}
                        alt="My profile"
                        className={`h-7 w-7 rounded-full object-cover ${
                          starMessage.Chat.senderId == userData.user_id
                            ? "order-2"
                            : "order-1"
                        } mt-auto ${
                          ["video", "image"].includes(
                            starMessage.Chat.message_type!,
                          )
                            ? "mb-7"
                            : "mb-5"
                        }`}
                      /> */}
                    </div>
                  </div>
                </>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
