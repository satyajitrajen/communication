import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";

import { updateCreateGroupData } from "../../../../store/Slices/CreateGroupSlice";

import { IoSearchOutline } from "react-icons/io5";
import { useTheme } from "../../../../context/ThemeProvider";
import ForwardMessageConversationsList from "./ForwardMessageConversationsList";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks";
import { updateMessageOptions } from "../../../../store/Slices/MessageOptionsSlice";
import { clearnForwardedList } from "../../../../store/Slices/ForwardMessageSlice";
import { useTranslateText } from "../../../../hooks/useTranslateText";

const ForwardMessageModal: React.FC = () => {
  const CreateGroup = useAppSelector((state) => state.CreateGroup);
  const dispatch = useAppDispatch();
  const [searchUser, setsearchUser] = useState("");
  // @ts-ignore
  const { theme } = useTheme();

  const translate = useTranslateText();
  const handleCloseModal = () => {
    dispatch(clearnForwardedList());
    dispatch(
      updateMessageOptions({
        show_forward_message_modal: false,
        selectMessage: false,
        forward_message: false,
        message_list: [],
        delete_from_every_one: false,
      }),
    );
  };
  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  return (
    <Dialog
      open={MessageOptions.show_forward_message_modal}
      onClose={() => {}}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/35 backdrop-blur-sm">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative max-h-[80vh] w-full max-w-sm overflow-hidden rounded-xl bg-primary transition-transform duration-300 ease-out">
            <DialogTitle
              as="h3"
              style={{
                backgroundSize: "100%",
              }}
              className="w-full space-y-5 bg-[url('/Home/add_member_bg.png')] bg-no-repeat px-4 xl:space-y-7"
            >
              <div className="flex items-center gap-3 py-10 font-semibold text-black">
                <RxCross2
                  onClick={handleCloseModal}
                  className="cursor-pointer text-2xl"
                />
                <span className="">Forward To</span>
              </div>
            </DialogTitle>
            <div className="relative mx-4 mt-4 h-fit">
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
            <ForwardMessageConversationsList searchUser={searchUser} />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ForwardMessageModal;
