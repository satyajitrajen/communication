import { useState } from "react";

import { IoSearchOutline } from "react-icons/io5";
import { useTheme } from "../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";

import { FaChevronLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import SelectedContact from "../Contacts/SelectedContact";
import ContactList from "../Contacts/ContactList";
import TextTranslate from "../../../utils/TextTranslate";
import { useTranslateText } from "../../../hooks/useTranslateText";
import Button from "../../../components/Button";
import { updateCreateGroupData } from "../../../store/Slices/CreateGroupSlice";

export default function AddMemberToGroup() {
  const [searchUser, setsearchUser] = useState("");
  const translate = useTranslateText();

  // @ts-ignore
  const { theme } = useTheme();
  const userData = useAppSelector((state) => state.userData);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  let CreateGroup = useAppSelector((state) => state.CreateGroup);

  return (
    <div className="relative flex h-[100dvh] min-w-80 flex-col bg-secondary pb-0 pt-6 shadow-inner lg:pt-16 2xl:min-w-96 max-w-md">
      <div className="w-full px-4">
        <div className="mb-10 flex items-center gap-3 font-semibold lg:pt-16 2xl:pt-16">
          <FaChevronLeft
            className="cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          />
          <span className="text-lg font-semibold">
            <TextTranslate text="Add Group Members" />
          </span>
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
      </div>
      <SelectedContact />
      <ContactList searchUser={searchUser} />
    </div>
  );
}
