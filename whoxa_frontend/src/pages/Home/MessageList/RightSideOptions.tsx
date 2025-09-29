import { FiChevronDown, FiSearch } from "react-icons/fi";
import { TiVideo } from "react-icons/ti";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { FaCalendarAlt } from "react-icons/fa";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";
import ReusableModal from "./ReusableModal";
import {
  toggleProfileView,
  updateViewState,
} from "../../../store/Slices/ViewManagerSlice";
import TextTranslate from "../../../utils/TextTranslate";
import { useNavigate } from "react-router-dom";
import useApiPost from "../../../hooks/PostData";
import { CallUserRes } from "../../../types/ResType";
import { updatePeerData } from "../../../store/Slices/PeerJsSlice";
import {
  MeetingScheduleModal,
  useMeetingSchedule,
} from "../../../components/MeetingSchedule";
import { useState } from "react";

export default function RightSideOptions() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const { postData } = useApiPost();
  const { openModal } = useMeetingSchedule();
  const [showAllOptions, setShowAllOptions] = useState(false);

  const toggleOptions = () => setShowAllOptions(!showAllOptions);

  async function callUser(call_type: "video_call" | "audio_call") {
    try {
      const resData: CallUserRes = await postData("call-user", {
        conversation_id: currentConversationData.conversation_id,
        call_type,
      });

      sessionStorage.setItem("call_type", call_type);
      dispatch(updatePeerData({ room_id: resData.room_id }));
      localStorage.setItem("room_id", resData.room_id);
      navigate("/video-call");
    } catch (error) {
      console.error("Error initiating call:", error);
    }
  }

  return (
    <>
      <ReusableModal />
      <MeetingScheduleModal />
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Schedule Meeting Button */}
        {/* <div   onClick={openModal} className="cursor-pointer rounded-xl border border-[#FEE383] bg-yellow-500 bg-opacity-10 px-3 py-1">
          Schedule Meeting
        </div> */}
        {/* Video Call Button */}
        <div className="flex cursor-pointer items-center">
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 text-sm/6 font-semibold shadow-2xl focus:outline-none data-[focus]:outline-1 lg:px-3">
              {/* <PiDotsThreeVerticalBold
                onClick={() => {
                  setShowAllOptions(true);
                }}
                className="cursor-pointer text-2xl"
              /> */}
              <TiVideo className="text-xl sm:text-2xl" />

              <FiChevronDown className="hidden w-fit lg:flex" />
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom end"
              className="z-20 w-52 origin-top-right rounded-xl border border-borderColor bg-modalBg p-1 text-sm/6 transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <MenuItem>
                <div
                  onClick={() => {
                    callUser("video_call");
                  }}
                  className="group flex w-full cursor-pointer items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
                >
                  <TextTranslate text="Video Call" />
                  {/* {currentConversationData.is_group
                    ? "Group Info"
                    : "Contact Info"} */}
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  onClick={() => {
                    callUser("audio_call");
                  }}
                  className="group flex w-full cursor-pointer items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
                >
                  <TextTranslate text="Audio Call" />
                  {/* {currentConversationData.is_group
                    ? "Group Info"
                    : "Contact Info"} */}
                </div>
              </MenuItem>
              {/* <MenuItem>
                <div
                  onClick={() => {
                    navigate("/video-call");
                  }}
                  className="group  flex w-full items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
                >
                  <TextTranslate text="Coming Soon" />

                </div>
              </MenuItem> */}
            </MenuItems>
          </Menu>

          {/* text-lightText */}
        </div>

        {/* Search Button */}
        <FiSearch
          onClick={() => dispatch(updateViewState({ showSearchMessage: true }))}
          className="cursor-pointer text-xl lg:text-2xl"
        />

        {/* Options Menu */}
        <Menu>
          <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 text-sm/6 font-semibold shadow-2xl focus:outline-none data-[focus]:outline-1 lg:px-3">
            <PiDotsThreeVerticalBold
              onClick={toggleOptions}
              className="cursor-pointer text-2xl"
            />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="z-20 w-52 origin-top-right rounded-xl border border-borderColor bg-modalBg p-1 text-sm/6 transition duration-200 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              <button
                onClick={() => dispatch(toggleProfileView(true))}
                className="group flex w-full cursor-pointer items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
              >
                <TextTranslate text="View Profile" />
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => {
                  dispatch(updateViewState({ showMediaDocLinks: true }));
                  dispatch(toggleProfileView(true));
                }}
                className="group flex w-full cursor-pointer items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
              >
                <TextTranslate text="Media, Links, and docs" />
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => {
                  dispatch(
                    updateMessageOptions({
                      showModal: true,
                      title: "Are you sure you want to clear this chat?",
                      description: "This action cannot be undone.",
                      modalName: "clear_chat",
                    }),
                  );
                }}
                className="group flex w-full cursor-pointer items-center gap-2 rounded-lg py-1.5 pl-6 data-[focus]:bg-dropdownOptionHover"
              >
                <TextTranslate text="Clear Chat" />
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </>
  );
}
