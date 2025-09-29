// import ConversationList from "./ConversationList";
import { FaChevronLeft, FaPlus } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import ReusableProfileCard from "../Profile/ReusableProfileCard"; // Adjust the import path accordingly
import { BsInfoCircle } from "react-icons/bs";
import {
  MdOutlinePrivacyTip,
  MdOutlineStarBorderPurple500,
} from "react-icons/md";
import { RxShare2 } from "react-icons/rx";
import { RiExchangeDollarFill, RiUserUnfollowLine } from "react-icons/ri";
import { HiOutlineLogout } from "react-icons/hi";
import LogoutModal from "./LogOutModal";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import BlockUserListModal from "./BlockUserListModal";
import { SiGnuprivacyguard } from "react-icons/si";
import { RWebShare } from "react-web-share";
import { CiLock } from "react-icons/ci";
import TextTranslate from "../../../utils/TextTranslate";
import { useTranslateText } from "../../../hooks/useTranslateText";
import { HiLanguage } from "react-icons/hi2";
import ThemeToggleFromSettings from "../ThemeToggleFromSettings";

export default function Setting() {
  const navigate = useNavigate();
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const userData = useAppSelector((state) => state.userData);
  const location = useLocation();
  const translate = useTranslateText();

  let dispatch = useAppDispatch();
  const handleValueChange = (newValue: string) => {
    // Handle the updated value here
    console.log(newValue);
  };

  let LanguageTextList = useAppSelector((state) => state.LanguageTextList);

  function translateTextFunc(text: string) {
    if (!LanguageTextList || !LanguageTextList.results) {
      return <>{text}</>; // Return the original text if no translations are available
    }

    const results = LanguageTextList.results;
    const translation = results.find((element: any) => element.key === text);
    if (translation) {
      return translation.Translation;
    } else {
      return text;
    }
  }

  return (
    <>
      <BlockUserListModal />
      <div className="flex h-screen w-full min-w-80 max-w-md flex-col overflow-auto bg-secondary shadow-inner 2xl:min-w-96">
        <div
          style={{
            backgroundSize: "100%",
          }}
          className="h-full w-full space-y-5 bg-[url('/Home/profile_bg.png')] bg-no-repeat px-4 xl:space-y-7"
        >
          <div className="flex items-center gap-3 pt-6 font-semibold text-black lg:pt-16 2xl:pt-16">
            <FaChevronLeft
              className="cursor-pointer"
              onClick={() => {
                navigate(-1);
              }}
            />
            <span className="">
              <TextTranslate text="Settings" />
            </span>
          </div>

          {/* Profile Image */}
          {/* <div>
            <img
              src={userData.profile_image}
              className={`mx-auto h-20 w-20 rounded-full bg-secondary object-cover p-2 2xl:h-32 2xl:w-32`}
              alt=""
            />
          </div> */}
          {/* Profile Image */}
          {/* <div className="relative mx-auto pt-16 lg:pt-3 h-fit w-fit"> */}

          <div className="relative mx-auto h-fit w-fit pt-16 lg:pt-3">
            <img
              src={userData.profile_image}
              className={`mx-auto h-32 w-32 rounded-full bg-secondary object-cover p-2`}
              alt=""
            />
            <div
              onClick={() => {
                dispatch(updateViewState({ showChangeProfileModal: true }));
              }}
              className="absolute bottom-1 right-2 z-10 grid h-8 w-8 cursor-pointer place-content-center rounded-full bg-primary"
            >
              <FaPlus className="primary-gradient rounded-full p-1 text-xl" />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <span className="text-xl font-semibold">
              {userData.first_name} {userData.last_name}
            </span>
            <div className="mx-auto flex w-fit items-center justify-center gap-2 rounded-xl bg-primary px-2 py-1 shadow-2xl">
              <GoDotFill className="text-[#2AAC7A]" />
              Online
            </div>
          </div>
        </div>

        {/* Starred messages,blocked contacts */}

        <div className="mt-10 flex flex-col gap-4 space-y-3 px-4">
          {/* User Bio ====================================================================================*/}
          <ReusableProfileCard
            onClick={() => {
              dispatch(
                updateMessageOptions({
                  show_select_about_modal: true,
                }),
              );
            }}
            icon={<BsInfoCircle className="text-lg" />}
            value={userData.bio}
            onChange={handleValueChange}
            isDisabled={true}
          />

          {/* Starred Messages ====================================================================================*/}
          <div
            onClick={() => {
              dispatch(updateMessageOptions({ show_all_star_messages: true }));
              navigate("/star-messages");
            }}
          >
            <ReusableProfileCard
              icon={<MdOutlineStarBorderPurple500 className="text-xl" />}
              value={translate("Starred Messages")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </div>

          {/* Block Contacts ====================================================================================*/}
          <div
            onClick={() => {
              dispatch(updateViewState({ showBlockUserList: true }));
            }}
          >
            <ReusableProfileCard
              icon={<RiUserUnfollowLine className="text-xl" />}
              value={translate("Block Contacts")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </div>

          {/* Privacy Policy ====================================================================================*/}
          <div
            onClick={() => {
              dispatch(
                updateViewState({
                  showPrivacyPolicy: true,
                  showTermsAndCondition: false,
                }),
              );
            }}
          >
            <ReusableProfileCard
              icon={<CiLock className="text-2xl" />}
              value={translate("Privacy Policy")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </div>

          {/* Terms & Condition ====================================================================================*/}
          <div
            onClick={() => {
              dispatch(
                updateViewState({
                  showTermsAndCondition: true,
                  showPrivacyPolicy: false,
                }),
              );
            }}
          >
            <ReusableProfileCard
              icon={<MdOutlinePrivacyTip className="text-xl" />}
              value={translate("Terms & Condition")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </div>

          {/* Share a link ====================================================================================*/}
          <RWebShare
            data={{
              text: "Whoxa Chat",
              url: `${window.location.origin}`,
              title: "Whoxa Chat",
            }}
          >
            <ReusableProfileCard
              icon={<RxShare2 className="text-lg" />}
              value={translate("Share a link")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </RWebShare>

          {/* Language ====================================================================================*/}
          <div
            onClick={() => {
              dispatch(
                updateViewState({
                  show_select_language_modal: true,
                }),
              );
            }}
          >
            <ReusableProfileCard
              icon={<HiLanguage className="text-xl" />}
              value={translate("Language")}
              onChange={handleValueChange}
              isDisabled={true}
            />
          </div>
          {/* toggle form settings  ===================================================================================*/}
          <ThemeToggleFromSettings />

          {/* Logout ====================================================================================*/}
          <div
            onClick={() => {
              setShowLogOutModal(true);
            }}
            className="text-[#FF2525]"
          >
            <ReusableProfileCard
              icon={<HiOutlineLogout className="rotate-180 text-xl" />}
              value={translateTextFunc("Logout")}
              onChange={handleValueChange}
              hideRightArrow={true}
              isDisabled={true}
            />

            <LogoutModal
              isOpen={showLogOutModal}
              setIsOpen={setShowLogOutModal}
            />
          </div>
        </div>

        <div className="my-4 pb-16 text-center font-semibold lg:pb-0">
          <TextTranslate text="Version" /> 1.0.10
        </div>
        {/* <DeleteAccountModal
          isOpen={showDeleteModal}
          setIsOpen={setShowDeleteModal}
        />
        <button
          onClick={() => {
            setShowDeleteModal(true);
          }}
          className="primary-gradient mx-auto mb-10 mt-auto w-[90%] rounded-xl py-2 font-medium shadow-xl"
        >
          Delete Account
        </button> */}
      </div>
    </>
  );
}
