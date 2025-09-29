import { IoSearchOutline } from "react-icons/io5";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { RxCross1 } from "react-icons/rx";
import { useTheme } from "../../../context/ThemeProvider";
import LinkPreview from "../../../components/LinkPreview";
import { useEffect, useState } from "react";
import useApiPost from "../../../hooks/PostData";
import { SearchMessageRes, SearchResult } from "../../../types/MessageListType";
import { updateSearchMessageResult } from "../../../store/Slices/SearchMessageSlice";
import { ClipLoader } from "react-spinners";
import { updateNavigateToSpesificMessage } from "../../../store/Slices/NavigateToSpesificMessageSlice";
import { useTranslateText } from "../../../hooks/useTranslateText";

export default function SearchMessage() {
  let dispatch = useAppDispatch();
  let currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  let SearchMessageData = useAppSelector((state) => state.SearchMessage);
  let userData = useAppSelector((state) => state.userData);
  const [searchText, setSearchText] = useState("");
  const { loading, postData } = useApiPost();
  const viewImageSlice = useAppSelector((state) => state.ViewManager);
  const translate = useTranslateText();

  useEffect(() => {
    if (viewImageSlice?.showSearchMessage == false) {
      setSearchText("");
    }
  }, [viewImageSlice?.showSearchMessage]);

  // @ts-ignore
  const { theme } = useTheme();

  const handleSelectMessageClick = () => {
    // if (MessageOptions.selectMessage) {
    //   isMessageSelected
    //     ? dispatch(removeMessage(messageData.message_id))
    //     : dispatch(addMessage(messageData));
    // }
  };

  async function searchMessageApiCall(e: string) {
    let searchMessageResponse: SearchMessageRes = await postData(
      "search-message",
      {
        search_text: e,
        conversation_id: currentConversationData.conversation_id,
      },
    );
    dispatch(updateSearchMessageResult(searchMessageResponse.searchResults));
  }

  function navigateToThatChat(SearchResult: SearchResult) {
    dispatch(
      updateNavigateToSpesificMessage({
        conversation_id: SearchResult.conversation_id,
        navigate_to_message: true,
        message_id: SearchResult.message_id,
      }),
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 bg-otherProfileSidebar px-4 py-10">
        <RxCross1
          className="ml-2 cursor-pointer text-xl"
          onClick={() => {
            dispatch(updateViewState({ showSearchMessage: false }));
            dispatch(updateSearchMessageResult([]));
          }}
        />
        <span className="">{translate("Search Messages")}</span>
      </div>
      <div className="my-5 flex flex-col gap-y-4">
        <div className="relative mx-4 mt-4 h-fit">
          <IoSearchOutline className="absolute left-3 top-2 text-2xl text-lightText" />
          <input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value == "") {
                dispatch(updateSearchMessageResult([]));
                return;
              }
              searchMessageApiCall(e.target.value);
            }}
            className={` ${
              theme == "dark" ? "bg-transparent" : "bg-[#F2F2F2]"
            } w-full rounded-xl border border-borderColor py-2 pl-11 placeholder-lightText outline-none`}
            type="text"
            placeholder={translate("Search Messages")}
          />
          {loading && (
            <ClipLoader
              className="absolute right-3 top-2"
              color={theme == "dark" ? "white" : "black"}
              size={22}
            />
          )}
        </div>

        {/* Search Results ====================================================================================*/}
        {SearchMessageData.filter(
          (starMessage) =>
            starMessage.delete_from_everyone == false && // Exclude messages deleted for everyone
            !starMessage.delete_for_me.includes(userData.user_id.toString()), // Exclude messages deleted for the current user
        ).length == 0 ? (
          <div className="grid h-96 place-content-center gap-5">
            <img
              className="mx-auto h-16 w-16"
              src="/LightIcons/no_search_result_found.png"
              alt=""
            />
            <div>{translate("No Such Message Found")}</div>
          </div>
        ) : (
          // <div className="my-6 text-center text-sm text-lightText">
          //   Search for messages of{" "}
          //   {currentConversationData.is_group
          //     ? currentConversationData.group_name
          //     : currentConversationData.user_name}
          // </div>
          <div>
            {SearchMessageData.filter(
              (starMessage) =>
                starMessage.delete_from_everyone == false && // Exclude messages deleted for everyone
                !starMessage.delete_for_me.includes(
                  userData.user_id.toString(),
                ), // Exclude messages deleted for the current user
            ).map((message) => {
              return (
                <>
                  <div
                    onClick={() => {
                      navigateToThatChat(message);
                    }}
                    className={`my-2 flex cursor-pointer flex-col rounded-lg`}
                  >
                    <div className="flex items-end justify-end">
                      <div
                        onClick={handleSelectMessageClick}
                        className={`cursor-pointer" : "" mx-2 flex w-full flex-col space-y-2 ${message.senderId == userData.user_id ? "order-1 items-end" : "order-2"}`}
                      >
                        <div className="flex items-start gap-1">
                          <div
                            className={`${
                              message.senderId == userData.user_id
                                ? "primary-gradient order-1 rounded-br-none"
                                : "order-2 rounded-bl-none bg-otherMessageBg"
                            } relative inline-block h-fit min-w-[1rem] max-w-[17rem] rounded-lg px-2 py-1 text-sm sm:max-w-xl 2xl:max-w-3xl`}
                          >
                            {message.message_type === "text" ? (
                              message.message
                            ) : message.message_type === "link" ? (
                              <LinkPreview
                                right={message.senderId == userData.user_id}
                                url={message.message}
                              />
                            ) : (
                              message.message
                            )}
                          </div>
                          <img
                            src={message.User?.profile_image}
                            alt="My profile"
                            className={`h-7 w-7 rounded-full object-cover ${
                              message.senderId == userData.user_id
                                ? "order-2"
                                : "order-1"
                            } mt-auto ${
                              ["video", "image"].includes(message.message_type!)
                                ? "mb-7"
                                : "mb-5"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
