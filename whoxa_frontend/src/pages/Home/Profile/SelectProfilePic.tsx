import "react-phone-input-2/lib/high-res.css";
import useApiPost from "../../../hooks/PostData";
import { ClipLoader } from "react-spinners";
import LoginLeftSections from "../../Register/LoginLeftSections";
import { updateUserData } from "../../../store/Slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useNavigate } from "react-router-dom";
import SelectAvtar from "./SelectAvtar";
import SelectImageFromGallery from "./SelectImageFromGallery";
import { useFile } from "../../../context/FileProvider";
import TextTranslate from "../../../utils/TextTranslate";

export default function SelectProfilePic() {
  let navigate = useNavigate();
  const { loading, postData } = useApiPost();
  const dispatch = useAppDispatch();
  let userData = useAppSelector((state) => state.userData);
  const { selectedFile, setSelectedFile } = useFile();

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

      window.location.href = "/chat";
      dispatch(updateUserData(updateGroupProfile.resData));
      // toast.success("Profile Updated", { position: "bottom-left" });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="grid min-h-screen w-screen grid-cols-2 bg-white text-black">
      {/* User Details in Left side ====================================================================================*/}
      <LoginLeftSections />

      {/* User Details in Right side ====================================================================================*/}
      <div
        className="relative col-span-1 flex h-full w-full items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${"/Home/Login_page.jpg"})`,
        }}
      >
        <div className="mx-auto w-[90%] max-w-[35rem] space-y-7 rounded-2xl p-8 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] 2xl:max-w-[40rem] 2xl:p-10">
          <div className="flex flex-col gap-y-4">
            <h4 className="mr-3 text-center text-xl font-semibold">
              <TextTranslate text="Pick your Avtar or select photo" />
            </h4>
            <SelectAvtar />

            <div className="flex items-center justify-center space-x-4">
              <div className="h-0.5 w-28 bg-gradient-to-r from-[#FCC604] to-[#FCC604]"></div>
              <span className="font-medium text-black">
                <TextTranslate text="OR" />
              </span>
              <div className="h-0.5 w-28 bg-gradient-to-r from-[#FCC604] to-[#FCC604]"></div>
            </div>

            <SelectImageFromGallery />
          </div>

          <div className="mx-auto max-w-sm">
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
                <span className="">{"Submit"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
