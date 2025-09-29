import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useTheme } from "../../../context/ThemeProvider";
import ConversationList from "./ConversationList";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { FiPlusSquare } from "react-icons/fi";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import ArchiveConversationList from "./ArchiveConversationList";
import { MdArrowBackIos } from "react-icons/md";

import TextTranslate from "../../../utils/TextTranslate";
import { useTranslateText } from "../../../hooks/useTranslateText";
import { updateCreateGroupData } from "../../../store/Slices/CreateGroupSlice";

export default function Chat() {
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const userData = useAppSelector((state) => state.userData);
  const ViewManager = useAppSelector((state) => state.ViewManager);
  const dispatch = useAppDispatch();
  const [searchUser, setsearchUser] = useState("");
  const navigate = useNavigate();
  const translate = useTranslateText();
  const archiveList = useAppSelector((state) => state.archiveList);

  // @ts-ignore
  const { theme } = useTheme();

  return (
    <>
      <div className="relative flex h-screen w-full min-w-[21rem] flex-col bg-secondary pb-14 pt-6 shadow-inner lg:max-w-md lg:pb-0 lg:pt-16 2xl:min-w-[22rem]">
        <div className="w-full px-4">
          <h4 className="mb-5 text-lg font-semibold lg:mb-10">
            {userData.user_name}
          </h4>

          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">
              <TextTranslate text="Chat" />
            </h4>

            <div
              onClick={() => {
                dispatch(updateCreateGroupData({ createNewGroup: true }));
                navigate("/add-member-to-group");
              }}
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-[#FAE390] px-2 py-1 text-sm text-black"
            >
              <FiPlusSquare />
              <span>
                <TextTranslate text="New Group" />
              </span>
            </div>
          </div>
          <div className="relative mt-4 h-fit">
            <IoSearchOutline className="absolute left-3 top-2 text-2xl text-lightText" />
            <input
              value={searchUser}
              onChange={(e) => {
                setsearchUser(e.target.value);
              }}
              className={` ${
                theme == "dark" ? "bg-transparent" : "bg-[#F2F2F2]"
              } w-full rounded-xl border border-borderColor py-2 pl-11 placeholder-lightText outline-none`}
              type="text"
              placeholder={translate("Search User")}
            />
          </div>
          <div
            onClick={() => {
              ViewManager.showArchiveList
                ? dispatch(updateViewState({ showArchiveList: false }))
                : dispatch(updateViewState({ showArchiveList: true }));
            }}
            className="my-4 ml-4 flex cursor-pointer items-center gap-3"
          >
            {ViewManager.showArchiveList ? (
              <MdArrowBackIos />
            ) : (
              <img className="h-6 w-6" src="/Home/archive_chat.png" alt="" />
            )}
            <div className="flex w-full justify-between">
              <TextTranslate
                text={ViewManager.showArchiveList ? "Back to chat" : "Archived"}
              />
              {archiveList.length > 0 && (
                <div className="primary-gradient z-10 grid h-5 w-5 place-content-center rounded-full text-xs text-white">
                  {archiveList?.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {ViewManager.showArchiveList ? (
          <ArchiveConversationList searchUser={searchUser} />
        ) : (
          <ConversationList searchUser={searchUser} />
        )}
      </div>
    </>
  );
}
