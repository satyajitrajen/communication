import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { RxCross2 } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import { useTheme } from "../../../context/ThemeProvider";
import ReportTypesList from "./ReportTypesList";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";

const ReportUserModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchUser, setsearchUser] = useState("");
  // @ts-ignore
  const { theme } = useTheme();
  const handleCloseModal = () => {
    dispatch(
      updateMessageOptions({
        showModal: false,
        selectMessage: false,
        delete_message: false,
        delete_only_from_me: false,
        message_list: [],
        modalName: "",
      }),
    );
  };

  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  return (
    <Dialog
      open={MessageOptions.modalName == "report_user"}
      onClose={handleCloseModal}
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
                <span className="">Report</span>
              </div>
            </DialogTitle>
            <ReportTypesList />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ReportUserModal;
