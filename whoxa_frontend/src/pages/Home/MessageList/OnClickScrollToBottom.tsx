import { FaArrowDown } from "react-icons/fa6";
import scrollToMessage from "../../../utils/scrollToMessage";
import { useAppSelector } from "../../../utils/hooks";
import { useEffect, useState } from "react";

export default function OnClickScrollToBottom() {
  const [isLastElementVisible, setIsLastElementVisible] = useState(true);
  const MessageList = useAppSelector((state) => state.MessageList);

  useEffect(() => {
    if (!MessageList.length) return;

    const lastId = String(
      MessageList[MessageList.length - 1].message_id,
    );

    const lastElement = document.getElementById(lastId);
    if (!lastElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsLastElementVisible(entries[0].isIntersecting);
      },
      { threshold: 0.5 }, // adjust threshold for sensitivity
    );

    observer.observe(lastElement);

    return () => {
      observer.disconnect();
    };
  }, [MessageList]);

  return (
    <>
      {!isLastElementVisible && (
        <div
          onClick={() => {
            scrollToMessage(
              MessageList[MessageList.length - 1].message_id,
              false,
              true,
            );
          }}
          className="absolute bottom-[4.5rem] right-5 z-10 grid h-7 w-7 cursor-pointer place-content-center rounded-full bg-otherMessageBg lg:bottom-7"
        >
          <FaArrowDown />
        </div>
      )}
    </>
  );
}
