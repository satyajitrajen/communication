import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { BsCameraVideo } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoImageOutline, IoLocationOutline } from "react-icons/io5";
import { updateNavigateToSpesificMessage } from "../../../../store/Slices/NavigateToSpesificMessageSlice";
import { MdOutlineGifBox } from "react-icons/md";
import { RiContactsLine } from "react-icons/ri";

export default function ShowReplyMessage({ reply_id }: { reply_id: number }) {
  const MessageListArray = useAppSelector((state) => state.MessageList);
  const userData = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();
  let repliedMessage = MessageListArray.find(
    (message) => message.message_id == reply_id,
  );
  // console.log(repliedMessage, "repliedMessage");

  return (
    <div
      onClick={() => {
        dispatch(
          updateNavigateToSpesificMessage({
            conversation_id: repliedMessage?.conversation_id,
            navigate_to_message: true,
            message_id: repliedMessage?.message_id,
          }),
        );
        // scrollToMessage(repliedMessage?.reply_id!);
      }}
      className="my-1 flex min-w-52 lg:min-w-72 cursor-pointer flex-col rounded-xl bg-primary px-3 py-2 text-darkText"
    >
      <div className="text-[13px] font-medium">
        {repliedMessage?.senderData.user_id == userData.user_id
          ? "You"
          : repliedMessage?.senderData.first_name +
            " " +
            repliedMessage?.senderData.last_name}
      </div>
      <div className="line-clamp-1">
        {repliedMessage?.message_type == "text" ? (
          <div className="gap-1">{repliedMessage.message}</div>
        ) : repliedMessage?.message_type == "image" ? (
          <div className="flex gap-1">
            {/* <IoImageOutline className="fa fa-solid fa-image w-5 text-xl text-gray-500" />{" "} */}
            📸
            <div>Image</div>
          </div>
        ) : repliedMessage?.message_type == "gif" ? (
          <div className="flex gap-1">
            {/* <MdOutlineGifBox className="fa fa-solid fa-image h-full w-6 text-xl text-gray-500" />{" "} */}
            😈
            <div>Gif</div>
          </div>
        ) : repliedMessage?.message_type == "video" ? (
          <div className="flex gap-1">
            {/* <BsCameraVideo className="fa fa-solid fa-image w-5 text-lg text-gray-500" /> */}
            📽️
            <div>Video</div>
          </div>
        ) : repliedMessage?.message_type == "document" ? (
          <div className="flex gap-1">
            <HiOutlineDocumentText className="fa fa-solid fa-image w-5 text-lg text-gray-500" />
            <div>Document</div>
          </div>
        ) : repliedMessage?.message_type == "location" ? (
          <div className="flex gap-1">
            {/* <IoLocationOutline className="fa fa-solid fa-image w-5 text-lg text-gray-500" /> */}
            📌
            <div>Location</div>
          </div>
        ) : repliedMessage?.message_type == "audio" ? (
          <div className="flex gap-1">
            {/* <IoLocationOutline className="fa fa-solid fa-image w-5 text-lg text-gray-500" /> */}
            🎤
            <div>Audio</div>
          </div>
        ) : repliedMessage?.message_type == "link" ? (
          <div className="line-clamp-1 flex gap-1">
            <span>🔗</span>
            <div className="">{repliedMessage.message}</div>
          </div>
        ) : repliedMessage?.message_type == "contact" ? (
          <div className="flex items-center gap-2">
            <RiContactsLine />
            <span className="line-clamp-1">Contact</span>
          </div>
        ) : (
          repliedMessage?.message
        )}
      </div>
    </div>
  );
}
