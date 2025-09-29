import LoadingSkeletonImageDynamic from "../../../components/LoadingSkeletonImageDynamic";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { ClipLoader } from "react-spinners";
import { useTheme } from "../../../context/ThemeProvider";
import { useCallHistory } from "../../../store/api/useCallHistory";
import CallInCallHistory from "./CallInCallHistory";
import { formatDate, formatTime } from "../../../utils/formatUTCtoLocalDate";

export default function AllCallsHIstory() {
  let { data: callHistory, isLoading } = useCallHistory();

  // @ts-ignore
  const { theme } = useTheme();

  return (
    <div className="my-5 flex h-[75vh] w-full max-w-full flex-col overflow-y-auto overflow-x-hidden pb-20">
      {isLoading ? (
        <div className="grid h-full place-content-center">
          <ClipLoader size={23} color={theme == "dark" ? "white" : "black"} />
        </div>
      ) : callHistory?.callList?.length == 0 ? (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>No Calls found</div>
        </div>
      ) : callHistory?.callList.length == 0 ? (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>No Calls Found</div>
        </div>
      ) : (
        callHistory?.callList.map((e) => {
          return (
            <>
              <div
                onClick={() => {}}
                onContextMenu={() => {}}
                //   key={e.id}
                className={`flex cursor-pointer items-center px-3 py-4 hover:bg-selectedChat ${false && "bg-selectedChat"}`}
              >
                <div className="relative mr-3 h-14 w-14 2xl:h-12 2xl:w-12">
                  <LoadingSkeletonImageDynamic
                    radius=""
                    className="min-h-12 min-w-12 rounded-full object-cover 2xl:h-12 2xl:w-12"
                    image_height="100%"
                    image_url={
                      e?.Conversation.is_group
                        ? e?.Conversation.group_profile_image
                        : e.User.profile_image
                    }
                    image_width=""
                  />
                </div>
                <div className="flex w-full items-center justify-between">
                  <div>
                    <div className="text-base font-medium capitalize text-darkText">
                      {e?.Conversation.is_group
                        ? e?.Conversation.group_name
                        : e.User.first_name + " " + e.User.first_name}
                    </div>
                    <CallInCallHistory callData={e} />
                  </div>
                  <div className="space-y-1 text-end text-sm text-lightText">
                    <div>{formatDate(e.createdAt)}</div>
                    <div className="text-xs">{formatTime(e.createdAt)}</div>
                  </div>
                </div>
              </div>
              <hr className="border-t border-borderColor" />
            </>
          );
        })
      )}
    </div>
  );
}
