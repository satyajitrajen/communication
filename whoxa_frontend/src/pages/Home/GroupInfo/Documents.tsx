import { useTheme } from "../../../context/ThemeProvider";
import { useConversationInfo } from "../../../store/api/useConversationInfo";
import { useAppSelector } from "../../../utils/hooks";
import chatSidebarTime from "../../../utils/chatSidebarTime";
import TextTranslate from "../../../utils/TextTranslate";

export default function Documents() {
  // @ts-ignore
  const { theme } = useTheme();
  let { data, isLoading } = useConversationInfo();
  const userData = useAppSelector((state) => state.userData);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {data?.documentData.length == 0 ||
        data?.documentData.length == undefined ? (
          <div className="grid h-96 place-content-center gap-5">
            <img
              className="mx-auto h-16 w-16"
              src="/LightIcons/no_search_result_found.png"
              alt=""
            />
            <div>
              <TextTranslate text="No Document Found" />
            </div>
          </div>
        ) : (
          data?.documentData.map((message, index) => {
            return (
              <>
                {message.senderId == userData.user_id ? (
                  <div className="ml-auto w-[90%]">
                    <div className="w-full rounded-[9px] rounded-br-none bg-[#FFEDAB] px-1 pb-3 pt-1">
                      <a
                        href={message.url}
                        target="_blank"
                        className={`flex items-center justify-between gap-2 rounded-[7px] p-4 text-sm ${theme == "dark" ? "bg-[#1D1D1D]" : "bg-[#FAFAFA]"}`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            className="h-10 w-10 object-cover"
                            src="/DarkIcons/pdf_icons.png"
                            alt=""
                          />
                          <div className="line-clamp-2 max-w-48">
                            {message?.url
                              ?.split("/")
                              .pop()
                              ?.split("-")
                              .slice(1)
                              .join("-") || ""}
                          </div>
                        </div>
                        <img
                          src="/DarkIcons/Download_icon.png"
                          className="h-8 w-8 cursor-pointer"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="mt-2 text-right text-sm opacity-60">
                      {chatSidebarTime(message.createdAt)}
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div className="w-[90%] rounded-[9px] rounded-bl-none bg-pdfBg px-1 pb-3 pt-1">
                      <a
                        href={message.url}
                        target="_blank"
                        className={`flex items-center justify-between gap-2 rounded-[7px] p-4 px-6 text-sm ${theme == "dark" ? "bg-[#1D1D1D]" : "bg-[#FAFAFA]"}`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            className="h-10 w-10 object-cover"
                            src="/DarkIcons/pdf_icons.png"
                            alt=""
                          />
                          <div>
                            {message?.url
                              ?.split("/")
                              .pop()
                              ?.split("-")
                              .slice(1)
                              .join("-") || ""}
                          </div>
                        </div>
                        <img
                          src="/DarkIcons/Download_icon.png"
                          className="h-8 w-8 cursor-pointer"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="mt-2 text-sm opacity-60">
                      {chatSidebarTime(message.createdAt)}
                    </div>
                  </div>
                )}
              </>
            );
          })
        )}
      </div>

      {/* <div className="space-y-3">
        <div className="text-sm capitalize">This Month</div>
        
        <div className="ml-auto w-[90%]">
          <div className="w-full rounded-[9px] rounded-br-none bg-[#FFEDAB] px-1 pb-3 pt-1">
            <div
              className={`flex items-center justify-between gap-2 rounded-[7px] p-4 px-6 text-sm ${theme == "dark" ? "bg-[#1D1D1D]" : "bg-[#FAFAFA]"}`}
            >
              <div className="flex items-center gap-2">
                <img
                  className="h-10 w-10 object-cover"
                  src="/DarkIcons/pdf_icons.png"
                  alt=""
                />
                <div>Card.pdf</div>
              </div>
              <img
                src="/DarkIcons/Download_icon.png"
                className="h-8 w-8 cursor-pointer"
                alt=""
              />
            </div>
          </div>
          <div className="mt-2 text-right text-sm opacity-60">12:15PM</div>
        </div>

        // My Message 
        <div className="">
          <div className="bg-pdfBg w-[90%] rounded-[9px] rounded-bl-none px-1 pb-3 pt-1">
            <div
              className={`flex items-center justify-between gap-2 rounded-[7px] p-4 px-6 text-sm ${theme == "dark" ? "bg-[#1D1D1D]" : "bg-[#FAFAFA]"}`}
            >
              <div className="flex items-center gap-2">
                <img
                  className="h-10 w-10 object-cover"
                  src="/DarkIcons/pdf_icons.png"
                  alt=""
                />
                <div>Card.pdf</div>
              </div>
              <img
                src="/DarkIcons/Download_icon.png"
                className="h-8 w-8 cursor-pointer"
                alt=""
              />
            </div>
          </div>
          <div className="mt-2 text-sm opacity-60">12:15PM</div>
        </div>
      </div> */}
    </div>
  );
}
