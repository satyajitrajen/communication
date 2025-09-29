import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { useTheme } from "../../../../context/ThemeProvider";
import { useFile } from "../../../../context/FileProvider";
import { RxCross2 } from "react-icons/rx";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import ShowReplyMessage from "./ShowReplyMessage";

export default function SelectedReplyMessage() {
  const dispatch = useAppDispatch();
  const messageData = useAppSelector((state) => state.SendMessageData);
  const MessageListArray = useAppSelector((state) => state.MessageList);
  const SendMessageData = useAppSelector((state) => state.SendMessageData);
  const { selectedFile, setSelectedFile } = useFile();

  // @ts-ignore
  const { theme } = useTheme();
  let repliedMessage = MessageListArray.find(
    (message) => message.message_id == messageData.reply_id,
  );
  // console.log(thumbnail, "thumbnail");

  return (
    <>
      <div
        className={` ${
          messageData.reply_id != 0
            ? "visible translate-y-3"
            : "invisible translate-y-20 opacity-0"
        } absolute -left-28 ${["image", "video", "gif", "document"].includes(SendMessageData.message_type!) && selectedFile ? "bottom-64" : "bottom-16"} z-10 border ${theme === "dark" ? "border-[#EEEEEE14]" : ""} w-full rounded-xl bg-primary transition-all duration-500 sm:-left-0`}
      >
        <div className="relative border-l-4 border-[#FCCA16]">
          <RxCross2
            onClick={() => {
              dispatch(
                updateSendMessageData({
                  reply_id: 0,
                }),
              );
            }}
            className="absolute right-2 top-2 h-8 w-8 cursor-pointer rounded-full bg-secondary p-2"
          />
          {/* <div className="">{repliedMessage?.message}</div> */}
          <ShowReplyMessage reply_id={messageData.reply_id!} />
        </div>
      </div>
    </>
  );
}
