import { GrPin } from "react-icons/gr";

import { MessageList } from "../../../../types/MessageListType";
import {
  updateMessageOptions,
  addMessage,
} from "../../../../store/Slices/MessageOptionsSlice";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import toast from "react-hot-toast";
import useApiPost from "../../../../hooks/PostData";
import { Chat } from "../../../../types/ResType";
import PinIcon from "/MessageListIcons/pin_outline.png";
import PinDarkIcon from "/MessageListIcons/pin_icon_outline_dark.png";
import UnPinIcon from "/MessageListIcons/unpin_icon.png";
import UnPinDarkIcon from "/MessageListIcons/unpin_icon_outline_dark.png";
import { useTheme } from "../../../../context/ThemeProvider";
import { socketInstance } from "../../../../socket/socket";
interface Props {
  messageData: MessageList;
}

const PinMessageButton = ({ messageData }: Props) => {
  const dispatch = useAppDispatch();
  const PinMessagesData = useAppSelector((state) => state.PinMessages);
  const { postData } = useApiPost();
  // @ts-ignore
  const { theme } = useTheme();

  // Check if the message is already pinned
  const isPinned = PinMessagesData?.PinMessageList.some(
    (pin) => pin.message_id === messageData.message_id,
  );

  async function unpinMessage() {
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
  return (
    <button
      onClick={() => {
        if (isPinned) {
          unpinMessage();
        } else {
          dispatch(updateMessageOptions({ show_pin_message_modal: true }));
          dispatch(addMessage(messageData));
        }
      }}
      className="group flex w-full items-center justify-between gap-2 px-4 py-1.5 data-[focus]:bg-dropdownOptionHover"
    >
      <span>{isPinned ? "Unpin" : "Pin"}</span>
      <img
        className={`h-5 w-5`}
        src={
          theme == "dark"
            ? isPinned
              ? UnPinDarkIcon
              : PinDarkIcon
            : isPinned
              ? UnPinIcon
              : PinIcon
        }
        alt=""
      />
    </button>
  );
};

export default PinMessageButton;
