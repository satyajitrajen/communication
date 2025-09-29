import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { useTheme } from "../../context/ThemeProvider";
import EmptyChatScreen from "./Chat/EmptyChatScreen";
import MessageList from "./MessageList/MessageList";
import OnClickOutside from "../../utils/OnClickOutSide";
import Bottombar from "./Bottombar";
import { useEffect } from "react";
import { updateCurrentConversation } from "../../store/Slices/CurrentConversationSlice";
import { updateViewState } from "../../store/Slices/ViewManagerSlice";

export default function Home() {
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const ViewManager = useAppSelector((state) => state.ViewManager);

  // @ts-ignore
  const { theme } = useTheme();
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   let conversationData =
  //     JSON.parse(sessionStorage.getItem("currentConversation")!) || {};

  //   // console.log(conversationData, "conversationData");

  //   dispatch(updateCurrentConversation(conversationData));
  //   if (Object.keys(conversationData).length > 0) {
  //     dispatch(
  //       updateViewState({
  //         show_chats_sidebar: false,
  //       }),
  //     );
  //   }
  // }, []);

  return (
    <>
      {/* <div>Home</div> */}
      <div className="relative flex w-screen">
        <Sidebar />
        <div
          className={`fixed left-0 z-10 w-full min-w-[25rem] transition-all duration-500 lg:relative lg:min-h-max lg:w-fit lg:max-w-fit lg:transition-none ${ViewManager.show_chats_sidebar ? "translate-x-0" : "-translate-x-[100%] lg:translate-x-0"}`}
        >
          <Outlet />
        </div>
        <div
          className="grid h-[100dvh] w-full pb-12 lg:pb-0"
          style={{
            backgroundImage: `url(${"/Home/chat_background_image.png"})`,
          }}
        >
          <div
            className={`${
              theme == "dark" ? "bg-[#1D1D1D]" : "bg-[#FAFAFA]"
            } relative h-full bg-opacity-[0.98]`}
          >
            <OnClickOutside
              className="h-full"
              onClickOutside={() => {
                // dispatch(updateMessageOptions({ selectMessage: false }));
              }}
            >
              {currentConversationData.conversation_id == -1 ? (
                <EmptyChatScreen />
              ) : (
                <MessageList />
              )}
            </OnClickOutside>
          </div>
        </div>
      </div>
      <Bottombar />
    </>
  );
}
