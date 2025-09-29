import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import SelectAvtar from "./SelectAvtar";
import SelectImageFromGallery from "./SelectImageFromGallery";
import { ClipLoader } from "react-spinners";
import useApiPost from "../../../hooks/PostData";
import { updateUserData } from "../../../store/Slices/UserSlice";
import { useFile } from "../../../context/FileProvider";
import TextTranslate from "../../../utils/TextTranslate";

export default function ChangeProfileImageModal() {
  let navigate = useNavigate();
  let dispatch = useAppDispatch();
  let ViewManager = useAppSelector((state) => state.ViewManager);
  let userData = useAppSelector((state) => state.userData);
  const { loading, postData } = useApiPost();
  const { selectedFile, setSelectedFile } = useFile();

  function close() {
    dispatch(updateViewState({ showChangeProfileModal: false }));
  }

  async function updateUserDetails() {
    try {
      // console.log(dataToSend, "dataToSend");
      let userDetailsFormData = new FormData();
      if (userData.avatar_id != 0) {
        userDetailsFormData.append("avatar_id", String(userData.avatar_id));
      } else if (selectedFile) {
        userDetailsFormData.append("files", selectedFile!);
      } else {
        userDetailsFormData.append("dummy", "dummy");
      }
      // Make the API call with the constructed FormData
      let updateGroupProfile = await postData(
        "user-details",
        userDetailsFormData,
        "multipart/form-data",
      );

      dispatch(updateViewState({ showChangeProfileModal: false }));

      dispatch(updateUserData(updateGroupProfile.resData));
      // toast.success("Profile Updated", { position: "bottom-left" });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Dialog
        open={ViewManager.showChangeProfileModal}
        as="div"
        className="relative z-10"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-modalBg p-6 shadow-[rgba(17,_17,_26,_0.3)_0px_0px_16px] backdrop-blur-md transition-all duration-300 ease-in-out data-[closed]:opacity-0"
            >
              <div className="flex flex-col gap-y-4">
                <h4 className="mr-3 text-center text-xl font-semibold">
                  <TextTranslate text="Pick your Avtar or select photo" />
                </h4>
                <SelectAvtar />

                <div className="flex items-center justify-center space-x-4">
                  <div className="h-0.5 w-28 bg-gradient-to-r from-[#FCC604] to-[#FCC604]"></div>
                  <span className="font-medium">OR</span>
                  <div className="h-0.5 w-28 bg-gradient-to-r from-[#FCC604] to-[#FCC604]"></div>
                </div>

                <SelectImageFromGallery />
              </div>

              <div className="mx-auto mt-4 max-w-sm">
                <button
                  onClick={() => {
                    updateUserDetails();
                  }}
                  className={`primary-gradient relative h-11 w-full overflow-hidden rounded-lg px-4 text-base font-medium outline-none lg:px-9 lg:text-lg`}
                >
                  {loading ? (
                    <div className="px-5">
                      <ClipLoader color="black" size={23} />
                    </div>
                  ) : (
                    <span className="">
                      <TextTranslate text="Submit" />
                    </span>
                  )}
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
