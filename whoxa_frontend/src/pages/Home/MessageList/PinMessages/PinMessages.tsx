import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import { RiContactsLine } from "react-icons/ri";
import { Chat } from "../../../../types/ResType";
import useApiPost from "../../../../hooks/PostData";
import OnClickOutside from "../../../../utils/OnClickOutSide";
import toast from "react-hot-toast";
import ChatIcon from "/MessageListIcons/message.png";
import UnPinIcon from "/MessageListIcons/unpin_icon.png";
import PinIcon from "/MessageListIcons/pin 1.png";
import PinDarkIcon from "/MessageListIcons/pin_dark.png";
import UnPinDarkIcon from "/MessageListIcons/unpin_icon_dark.png";
import ChatDarkIcon from "/MessageListIcons/message_dark.png";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateNavigateToSpesificMessage } from "../../../../store/Slices/NavigateToSpesificMessageSlice";
import { useTheme } from "../../../../context/ThemeProvider";
import { AiOutlineAudio } from "react-icons/ai";
import { socketInstance } from "../../../../socket/socket";

export default function PinMessages() {
  const [showPinMessageList, setshowPinMessageList] = useState(false);
  const { loading, postData } = useApiPost();
  const dispatch = useAppDispatch();
  const PinMessagesData = useAppSelector((state) => state.PinMessages);
  // @ts-ignore
  const { theme } = useTheme();

  async function unpinMessage(messageData: Chat) {
    await postData("add-to-pin-message", {
      message_id: messageData.message_id,
      conversation_id: messageData.conversation_id,
      remove_from_pin: "true",
    });
    toast.success("Message Removed from Pin");
    // refetch pin messagelist
    // socketInstance().emit("pinMessageList", {
    //   conversation_id: messageData.conversation_id,
    // });
  }

  function navigateToThatChat(messageData: Chat) {
    setshowPinMessageList(false);
    dispatch(
      updateNavigateToSpesificMessage({
        conversation_id: messageData.conversation_id,
        navigate_to_message: true,
        message_id: messageData.message_id,
      }),
    );
  }

  return (
    <>
      {PinMessagesData?.PinMessageList?.length && PinMessagesData?.PinMessageList?.length >= 1 ? (
        <div className="absolute z-10 flex w-full select-none -translate-x-2 flex-col items-center justify-center 2xl:left-2">
          <OnClickOutside
            className="my-auto w-full 2xl:w-[100%]"
            onClickOutside={() => {
              setshowPinMessageList(false);
            }}
          >
            <div
              onClick={() => {
                setshowPinMessageList(!showPinMessageList);
              }}
              className="flex w-full cursor-pointer justify-between bg-pinMessageListHeader p-3 px-4"
            >
              <div className="flex items-center gap-2">
                {/* <BsFillPinAngleFill className="text-xl" /> */}
                <img
                  className="h-5 w-5"
                  src={theme == "dark" ? PinDarkIcon : PinIcon}
                  alt=""
                />
                <DisplayPinMessages
                  messageData={PinMessagesData?.PinMessageList[0].Chat}
                />
              </div>
              <div className="flex min-w-fit items-center gap-2">
                {PinMessagesData?.PinMessageList?.length >= 2 && (
                  <div>{PinMessagesData?.PinMessageList.length} Messages </div>
                )}
                <FaChevronDown
                  className={`my-auto ${showPinMessageList ? "rotate-180" : ""} transition-all duration-300`}
                />
              </div>
            </div>

            <div
              className={`mt-1 w-full ${showPinMessageList ? "block translate-y-0 opacity-100" : "hidden -translate-y-6 opacity-0"} transition-all duration-300`}
            >
              {PinMessagesData?.PinMessageList.map((messageData) => {
                return (
                  <>
                    <div className="flex w-full justify-between bg-pinMessageList p-2 px-4">
                      <div
                        onClick={() => {
                          navigateToThatChat(messageData.Chat);
                        }}
                        className="flex cursor-pointer w-full items-center gap-2"
                      >
                        <DisplayPinMessages messageData={messageData.Chat} />
                      </div>
                      <div className="flex items-center gap-4">
                        <div
                          onClick={() => {
                            unpinMessage(messageData);
                          }}
                          className={`grid h-10 w-10 cursor-pointer place-content-center rounded-full ${theme == "dark" ? "bg-[#3E3E3E]" : "bg-white"}`}
                        >
                          {/* <RiUnpinLine className="text-2xl text-black" /> */}
                          <img
                            className="h-5 w-5"
                            src={theme == "dark" ? UnPinDarkIcon : UnPinIcon}
                            alt=""
                          />
                        </div>
                        <div
                          onClick={() => {
                            navigateToThatChat(messageData.Chat);
                          }}
                          className={`grid h-10 w-10 cursor-pointer place-content-center rounded-full ${theme == "dark" ? "bg-[#3E3E3E]" : "bg-white"}`}
                        >
                          <img
                            className="h-5 w-5"
                            src={theme == "dark" ? ChatDarkIcon : ChatIcon}
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <hr className="border-t border-borderColor" />
                  </>
                );
              })}
            </div>
          </OnClickOutside>
        </div>
      ):<div></div>}
    </>
  );
}

function DisplayPinMessages({ messageData }: { messageData: Chat }) {
  return (
    <>
      <div>
        {messageData?.message_type == "text"}

        <div className="flex items-center gap-2">
          {messageData?.message_type == "image" ? (
            <>
              {/* <IoImageOutline className="fa fa-solid fa-image w-5 text-xl text-gray-500" />{" "} */}
              <img
                src={messageData?.url}
                className="h-7 w-7 rounded-md object-cover"
                alt=""
              />
              Image
            </>
          ) : messageData?.message_type == "gif" ? (
            <>
              <img
                src={messageData?.url}
                className="h-7 w-7 rounded-md object-cover"
                alt=""
              />
              <div>Gif</div>
            </>
          ) : messageData?.message_type == "video" ? (
            <>
              <img
                src={messageData?.thumbnail}
                className="h-7 w-7 rounded-md object-cover"
                alt=""
              />
              Video
            </>
          ) : messageData?.message_type == "audio" ? (
            <>
              <AiOutlineAudio className="fa fa-solid fa-image w-5 text-lg" />
              Audio
            </>
          ) : messageData?.message_type == "document" ? (
            <>
              <HiOutlineDocumentText className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
              Document
            </>
          ) : messageData?.message_type == "location" ? (
            <>
              <IoLocationOutline className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
              Location
            </>
          ) : messageData?.message_type == "text" ? (
            <span className="line-clamp-1 w-full">
              {/* {truncateSentence(
                                                "lorem impus kkks kdj ks good morning good evening",
                                                28,
                                              )} */}
              {messageData?.message}
            </span>
          ) : messageData?.message_type == "link" ? (
            <>
              <span>🔗</span>
              <span className="line-clamp-1 w-full">
                {messageData?.message}
              </span>
            </>
          ) : messageData?.message_type == "contact" ? (
            <>
              <RiContactsLine />
              <span className="line-clamp-1">Contact</span>
            </>
          ) : (
            <div className="line-clamp-1 w-full">{messageData?.message}</div>
          )}
        </div>
      </div>
    </>
  );
}
