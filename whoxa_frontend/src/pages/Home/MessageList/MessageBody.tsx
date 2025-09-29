import MyMessage from "./MyMessage";
import { formatUTCtoLocalDate } from "../../../utils/formatUTCtoLocalDate";
import ScrollToBottom, { useScrollToBottom } from "react-scroll-to-bottom";

import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import LoadMoreMessages from "./LoadMoreMessages";
import OnClickScrollToBottom from "./OnClickScrollToBottom";
import { useEffect, useRef, useState } from "react";
import scrollToMessage from "../../../utils/scrollToMessage";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";

export default function MessageBody() {
  const MessageListArray = useAppSelector((state) => state.MessageList);
  // const userData = useAppSelector((state) => state.userData);
  const NavigateTospesificMessage = useAppSelector(
    (state) => state.NavigateToSpesificMessage,
  );
  const messageListDetails = useAppSelector((state) => state.MessageOptions);
  const [isIOS, setIsIOS] = useState(false);
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
  }, []);
  // Create a reference for the top of the message list
  const topTriggerRef = useRef(null);
  let dispatch = useAppDispatch();
  // const urls = MessageListArray?.filter((message) => {
  //   return (
  //     (message.message_type === "image" || message.message_type === "video") &&
  //     message.url
  //   );
  // });
  const urls = MessageListArray?.filter((message) => {
    return (
      ["image", "video", "gif"].includes(message.message_type!) && message.url
    );
  });

  // Observe when the top element becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Top of the message list is visible, load more messages
          // console.log("Top of the message list is visible");
          // Trigger the load more logic (perhaps via a Redux action)
          dispatch(updateMessageOptions({ messageListAtTop: true }));
        }
      },
      { threshold: 1.0 }, // Trigger when 100% of the element is visible
    );

    if (topTriggerRef.current) {
      observer.observe(topTriggerRef.current);
    }

    return () => {
      if (topTriggerRef.current) {
        observer.unobserve(topTriggerRef.current);
      }
    };
  }, [topTriggerRef, dispatch]);

  useEffect(() => {
    if (
      MessageListArray.length != 0 &&
      NavigateTospesificMessage.navigate_to_message == false
    ) {
      if (
        messageListDetails.currentPage == "1" ||
        messageListDetails.currentPage == ""
      ) {
        scrollToMessage(
          MessageListArray[MessageListArray.length - 1].message_id,
          false,
          false,
        );
      }
    }
  }, []);

  const image_urls = urls.map((message) => message.url.replace(/\\/g, "/"));

  return (
    <div
      id="messageListDiv"
      className={`flex ${location.pathname != "/video-call" ? "h-[83dvh]":"h-[78dvh] lg:h-[76dvh]"}  flex-col gap-y-2 overflow-y-auto ${location.pathname != "/video-call" && "sm:px-14"} px-5 ${isIOS ? "pb-20" : "pb-14"} lg:py-6`}
    >
      {/* Invisible trigger element at the top */}
      <div ref={topTriggerRef} style={{ height: "1px" }}></div>

      <OnClickScrollToBottom />
      <LoadMoreMessages />
      {/* <PinMessages /> */}
      {MessageListArray.map((e) => {
        return (
          <>
            {/* First Check if the message type is date or not if date then show date ====================================*/}
            {e.message_type == "date" ? (
              <div
                id={String(e.message_id)}
                className="mx-auto my-3 w-fit rounded-full bg-messageHead px-5 py-1 text-center text-sm font-medium text-darkText shadow-sm"
              >
                {formatUTCtoLocalDate(e.message)}
              </div>
            ) : e.message_type == "member_added" ||
              e.message_type == "member_removed" ? (
              <div
                id={String(e.message_id)}
                className="mx-auto my-3 w-fit rounded-full bg-primary px-5 py-1 text-center text-sm font-medium text-darkText shadow-sm"
              >
                {e.message}
              </div>
            ) : (
              <>
                {/* {!e.delete_for_me
                  .split(",")
                  .includes(userData.user_id.toString()) && ( */}
                <MyMessage messageData={e} image_urls={image_urls} />
                {/* )} */}
              </>
            )}
          </>
        );
      })}
    </div>
  );
}
