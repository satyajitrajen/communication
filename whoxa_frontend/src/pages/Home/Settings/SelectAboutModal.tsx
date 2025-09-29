import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { RxCross2, RxRadiobutton } from "react-icons/rx";
import { IoSearchOutline } from "react-icons/io5";
import { useTheme } from "../../../context/ThemeProvider";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateMessageOptions } from "../../../store/Slices/MessageOptionsSlice";
import ReusableProfileCard from "../Profile/ReusableProfileCard";
import { FaRegUser } from "react-icons/fa6";
import { MdCheck, MdOutlineEdit } from "react-icons/md";
import { updateSpesificUserData } from "../../../store/Slices/UserSlice";
import { BsInfoCircle } from "react-icons/bs";
import useApiPost from "../../../hooks/PostData";
import toast from "react-hot-toast";
import TextTranslate from "../../../utils/TextTranslate";
import { ClipLoader } from "react-spinners";

const SelectAboutModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector((state) => state.userData);
  const { loading, postData } = useApiPost();
  const [about, setAbout] = useState(userDetails.bio);
  // @ts-ignore
  const { theme } = useTheme();
  useEffect(() => {
    setAbout(userDetails.bio);
  }, [userDetails.bio]);
  const handleCloseModal = () => {
    dispatch(
      updateMessageOptions({
        show_select_about_modal: false,
      }),
    );
  };

  async function updateUserAbout() {
    let userDetails = await postData("user-details", { bio: about });
    toast.success("Profile Updated", { position: "bottom-left" });
    dispatch(updateSpesificUserData({ bio: about }));
    handleCloseModal();
  }

  const MessageOptions = useAppSelector((state) => state.MessageOptions);
  let aboutOption = [
    "At Work",
    "Available",
    "At Office",
    "Battery about to die",
    "In a meeting",
    "At the gym",
    "Sleeping",
  ];
  return (
    <Dialog
      open={MessageOptions.show_select_about_modal}
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
              <div className="flex items-center gap-3 py-7 font-semibold text-black">
                <RxCross2
                  onClick={handleCloseModal}
                  className="cursor-pointer text-2xl"
                />
                <span className="">
                  <TextTranslate text="About" />
                </span>
              </div>
            </DialogTitle>
            <div className="relative mx-4 mt-4 h-fit">
              <div className="flex justify-between">
                <div>
                  <TextTranslate text="Currently set to" />
                </div>
                {/* <div
                  onClick={() => {
                    updateUserAbout();
                  }}
                >
                  <MdCheck className="cursor-pointer text-xl" />
                </div> */}
              </div>
              <div className="py-3">
                <ReusableProfileCard
                  icon={<BsInfoCircle className="text-lg" />}
                  right_icon={<MdOutlineEdit />}
                  value={about}
                  onChange={(newValue: string) => {
                    setAbout(newValue);
                  }}
                />
              </div>
            </div>
            <div className="relative mx-4 mt-2 h-fit pb-5">
              <div className="flex justify-between pb-2">
                <div>
                  <TextTranslate text="Select your about" />
                </div>
              </div>
              <div className="max-h-96 divide-y divide-borderColor overflow-auto rounded-lg border border-borderColor">
                {aboutOption.map((e) => {
                  return (
                    <>
                      <div
                        onClick={() => {
                          setAbout(e);
                        }}
                        className="flex cursor-pointer items-center px-4"
                      >
                        {e == about ? (
                          <div className="w-3">
                            <RxRadiobutton className="text-lg text-[#FDCF29]" />
                          </div>
                        ) : (
                          <div className="w-3"></div>
                        )}
                        <div className="cursor-pointer px-5 py-3">{e}</div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
            <div className="flex pb-5">
              <button
                onClick={() => {
                  updateUserAbout();
                }}
                className={`primary-gradient relative mx-auto h-9 w-44 rounded-lg px-4 py-2 text-base font-medium outline-none lg:px-9`}
              >
                <span className="">
                  {loading ? <ClipLoader size={20} /> : "Save"}
                </span>
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default SelectAboutModal;
