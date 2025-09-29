import { useAppSelector } from "../../../utils/hooks";
import StarMessage from "../StarMessage/StarMessage";
import GroupInfo from "./GroupInfo";
import MediaLinksDocsTabs from "./MediaLinksDocsTabs";

export default function ConversationInfoDrawer() {
  const viewImageSlice = useAppSelector((state) => state.ViewManager);

  return (
    <div
      className={`h-full w-full lg:w-96 max-w-[100vw] xl:w-[24rem] ${
        viewImageSlice?.showOtherProfile
          ? "translate-x-0"
          : "translate-x-full"
      } scrolling-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-[#EAEFF5] scrollbar-thumb-rounded-full fixed right-0 top-0 z-20 mx-auto flex h-screen min-h-[40rem] max-w-[100vw] snap-x snap-mandatory flex-col overflow-auto overflow-y-auto overflow-x-hidden bg-secondary transition-all duration-500`}
    >
      {viewImageSlice.showStarMessageList ? (
        <StarMessage />
      ) : viewImageSlice.showMediaDocLinks ? (
        <MediaLinksDocsTabs />
      ) : (
        <>
          <GroupInfo />
        </>
      )}
    </div>
  );
}
