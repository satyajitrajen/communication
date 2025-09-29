import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import LinkPreview from "../../../components/LinkPreview";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { useAppSelector } from "../../../utils/hooks";
import chatSidebarTime from "../../../utils/chatSidebarTime";
import TextTranslate from "../../../utils/TextTranslate";

export default function Links() {
  // @ts-ignore
  const { theme } = useTheme();
  let { data, isLoading } = useConversationInfo();
  const userData = useAppSelector((state) => state.userData);

  return (
    <div className="space-y-4">
      {data?.linkData?.length == 0 || data?.linkData?.length == undefined ? (
        <div className="grid h-96 place-content-center gap-5">
          <img
            className="mx-auto h-16 w-16"
            src="/LightIcons/no_search_result_found.png"
            alt=""
          />
          <div>
            <TextTranslate text="No Links Found" />
          </div>
        </div>
      ) : (
        data?.linkData.map((message, index) => {
          return (
            <>
              <div
                className={` ${message.senderId == userData.user_id && "ml-auto mr-0"} w-[93%]`}
              >
                <LinkPreview
                  right={message.senderId == userData.user_id}
                  url={message.message}
                />
                <div className="mt-2 text-sm opacity-60">
                  {chatSidebarTime(message.createdAt)}
                </div>
              </div>
            </>
          );
        })
      )}

      {/* <div className="space-y-3">
        <div className="text-sm capitalize">This Month</div>

        <div className={` ${false && "ml-auto mr-0"} w-[93%]`}>
          <LinkPreview
            right={false}
            url="https://dev.to/rahulj9a/how-to-build-simple-link-preview-without-any-library-in-js-2j84"
          />
          <div className="mt-2 text-sm opacity-60">12:15PM</div>
        </div>

        <div className={` ${true && "ml-auto mr-0"} w-[93%]`}>
          <LinkPreview
            right={true}
            url="https://dev.to/rahulj9a/how-to-build-simple-link-preview-without-any-library-in-js-2j84"
          />
          <div className="mt-2 text-right text-sm opacity-60">12:15PM</div>
        </div>
      </div> */}
    </div>
  );
}
