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
import PublicGroupList from "./PublicGroupList";

export default function PublicGroup() {
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
            <TextTranslate text="Public Groups" />
          </span>
        </div>

        <div className="relative my-4 h-fit">
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
      </div>

      <PublicGroupList searchUser={searchUser} />
    </div>
  );
}
