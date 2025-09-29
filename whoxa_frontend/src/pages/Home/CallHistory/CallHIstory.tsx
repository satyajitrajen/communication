import React, { useState } from "react";
import { FiPlusSquare } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { useTheme } from "../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { PiUsersThree } from "react-icons/pi";
import { updateCreateGroupData } from "../../../store/Slices/CreateGroupSlice";
import { useWebsiteSettings } from "../../../store/api/useWebsiteSettings";
import TextTranslate from "../../../utils/TextTranslate";
import { useTranslateText } from "../../../hooks/useTranslateText";
import PublicGroupList from "./AllCallsHIstory";
import CallHistoryTabs from "./CallHistoryTabs";

export default function CallHIstory() {
  const [searchUser, setsearchUser] = useState("");
  // @ts-ignore
  const { theme } = useTheme();
  const userData = useAppSelector((state) => state.userData);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let { data: websiteSettings } = useWebsiteSettings();
  const translate = useTranslateText();

  return (
    // <div className="relative flex h-screen min-w-96 flex-col bg-secondary pb-0 pt-16 shadow-inner 2xl:min-w-96">
    <div className="relative flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden bg-primary pb-6 shadow-inner lg:max-w-md">
      <div className="w-full px-4">
        <div className="mb-10 flex items-center gap-3 pt-10 font-semibold">
          <FaChevronLeft
            className="cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          />
          <span className="text-lg font-semibold">
            <TextTranslate text="Call History" />
          </span>
        </div>
      </div>
      <CallHistoryTabs />

    </div>
  );
}
