import { useState } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateSendMessageData } from "../../../../store/Slices/SendMessageSlice";
import { CiFaceSmile } from "react-icons/ci";
import OnClickOutside from "../../../../utils/OnClickOutSide";
import { useTheme } from "../../../../context/ThemeProvider";

export default function EmojiPickerCompo() {
  const dispatch = useAppDispatch();
  const SendMessageData = useAppSelector((state) => state.SendMessageData);
  const { theme } = useTheme();

  const [isOpen, setIsOpen] = useState(false); // 👈 local state

  function handleEmojiClick(emoji: EmojiClickData) {
    dispatch(
      updateSendMessageData({
        message: (SendMessageData.message || "") + emoji.emoji,
        message_type: "text",
      }),
    );
  }

  function closeEmojiPicker() {
    setIsOpen(false);
  }

  return (
    <OnClickOutside className="my-auto" onClickOutside={closeEmojiPicker}>
      <CiFaceSmile
        onClick={() => setIsOpen((prev) => !prev)}
        className="my-auto ml-3 text-darkText cursor-pointer text-2xl"
      />
      <div
        className={` ${
          isOpen
            ? "visible translate-y-3"
            : "invisible translate-y-20 opacity-0"
        } absolute -left-28 bottom-16 z-10 transition duration-500 sm:-left-0`}
      >
        <EmojiPicker
          theme={theme == "dark" ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={handleEmojiClick}
        />
      </div>
    </OnClickOutside>
  );
}
