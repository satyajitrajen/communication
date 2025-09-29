import { useTheme } from "../../../context/ThemeProvider";
// import ConversationList from "./ConversationList";
import { FaChevronLeft, FaPlus, FaRegUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { IoCallOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import ReusableProfileCard from "./ReusableProfileCard"; // Adjust the import path accordingly
import { useAppDispatch, useAppSelector } from "../../../utils/hooks";
import { useEffect, useState } from "react";
import {
  updateSpesificUserData,
  updateUserData,
} from "../../../store/Slices/UserSlice";
import useApiPost from "../../../hooks/PostData";
import Button from "../../../components/Button";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { MdOutlineEdit, MdOutlineMailOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { updateViewState } from "../../../store/Slices/ViewManagerSlice";
import TextTranslate from "../../../utils/TextTranslate";

export default function Profile() {
  // @ts-ignore
  const { theme } = useTheme();
  let navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.userData);
  const { loading, postData } = useApiPost();
  const [isValueChanged, setIsValueChanged] = useState(false);

  async function updateUserDetails() {
    let userDetails = await postData("user-details", userData);
    dispatch(updateUserData(userDetails.resData));
    toast.success("Profile Updated", { position: "bottom-left" });
    setIsValueChanged(false);
  }

  useEffect(() => {
    console.log(userData.user_name);
  }, [userData]);

  return (
    <>
      <div className="relative flex h-screen w-full min-w-96 max-w-md flex-col overflow-y-auto bg-secondary shadow-inner lg:min-w-80 2xl:min-w-96">
        <div
          style={{
            backgroundSize: "100%",
          }}
          className="w-full space-y-5 bg-[url('/Home/profile_bg.png')] bg-no-repeat px-4 xl:space-y-5"
        >
          <div className="flex items-center gap-3 pt-6 font-semibold text-black lg:pt-16 2xl:pt-16">
            <FaChevronLeft
              className="cursor-pointer"
              onClick={() => {
                navigate(-1);
              }}
            />
            <span className="">
              <TextTranslate text="Profile" />
            </span>
          </div>

          {/* Profile Image */}
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
            <span className="text-xl capitalize font-semibold">
              {userData.first_name} {userData.last_name}
            </span>
            <div className="mx-auto flex w-fit items-center justify-center gap-2 rounded-xl bg-primary px-2 py-1 shadow-2xl">
              <GoDotFill className="text-[#2AAC7A]" />
              Online
            </div>
          </div>
        </div>
        <div className="mt-10 space-y-3 px-2 pb-20">
          {/* User name, first name, last name */}
          <div className="flex flex-col gap-4">
            <ReusableProfileCard
              icon={<FaRegUser className="text-lg" />}
              right_icon={<MdOutlineEdit />}
              value={userData.first_name}
              onChange={(newValue: string) => {
                dispatch(updateSpesificUserData({ first_name: newValue }));
                if (!isValueChanged) {
                  setIsValueChanged(true);
                }
              }}
            />
            <ReusableProfileCard
              icon={<FaRegUser className="text-lg" />}
              value={userData.last_name}
              right_icon={<MdOutlineEdit />}
              onChange={(newValue: string) => {
                dispatch(updateSpesificUserData({ last_name: newValue }));
                if (!isValueChanged) {
                  setIsValueChanged(true);
                }
              }}
            />
          </div>

          {/* Gender */}
          <div>
            <h4>
              <TextTranslate text="Gender" />
            </h4>
            <div className="ml-3 flex gap-10">
              <div className="inline-flex items-center">
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="male"
                >
                  <input
                    checked={userData.gender === "male"}
                    value={"male"}
                    name="type"
                    type="radio"
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-darkText transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-10 before:w-10 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-darkText before:opacity-0 before:transition-opacity checked:border-darkText checked:before:bg-darkText hover:before:opacity-10"
                    id="male"
                    onChange={() => {
                      dispatch(updateSpesificUserData({ gender: "male" }));
                      if (!isValueChanged) {
                        setIsValueChanged(true);
                      }
                    }}
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label
                  className="mt-px cursor-pointer select-none"
                  htmlFor="male"
                >
                  <TextTranslate text="Male" />
                </label>
              </div>
              <div className="inline-flex items-center">
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="female"
                >
                  <input
                    checked={userData.gender === "female"}
                    value={"female"}
                    name="type"
                    type="radio"
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-darkText transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-10 before:w-10 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-darkText before:opacity-0 before:transition-opacity checked:border-darkText checked:before:bg-darkText hover:before:opacity-10"
                    id="female"
                    onChange={() => {
                      dispatch(updateSpesificUserData({ gender: "female" }));
                      if (!isValueChanged) {
                        setIsValueChanged(true);
                      }
                    }}
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label
                  className="mt-px cursor-pointer select-none"
                  htmlFor="female"
                >
                  <TextTranslate text="Female" />
                </label>
              </div>
            </div>
          </div>

          {/* Phone and Country */}
          {/* <div className="flex flex-col gap-4">
            <ReusableProfileCard
              icon={<IoCallOutline className="text-2xl" />}
              right_icon={<FaCheckCircle className="text-green-400" />}
              value={userData.country_code + " " + userData.phone_number}
              onChange={() => {}}
              isDisabled={true}
            />
            <ReusableProfileCard
              icon={<SlLocationPin className="text-2xl" />}
              right_icon={<FaCheckCircle className="text-green-400" />}
              value={userData.country}
              onChange={() => {}}
              isDisabled={true}
            />
            <ReusableProfileCard
              isDisabled={true}
              icon={<FaRegUser className="text-lg" />}
              right_icon={<FaCheckCircle className="text-green-400" />}
              value={userData.user_name}
            />
          </div> */}
          {/* Phone and Country */}
          <div className="flex flex-col rounded-lg bg-otherProfileSidebar px-4 py-4">
            <div className="ml-3 flex items-center">
              <div className="text-lg font-semibold">
                <TextTranslate text="Contact Details" />
              </div>
              <div className="text-xs font-medium text-red-500">
                (<TextTranslate text="Non Changeable" />)
              </div>
            </div>
            {userData.email_id && (
              <div className="m-3 rounded-lg">
                <ReusableProfileCard
                  icon={<MdOutlineMailOutline className="text-2xl" />}
                  right_icon={
                    <BsFillPatchCheckFill className="text-green-400" />
                  }
                  value={userData.email_id}
                  onChange={() => {}}
                  isDisabled={true}
                />
              </div>
            )}

            {userData.phone_number && (
              <div className="m-3 rounded-lg">
                <ReusableProfileCard
                  icon={<IoCallOutline className="text-2xl" />}
                  right_icon={
                    <BsFillPatchCheckFill className="text-green-400" />
                  }
                  value={userData.country_code + " " + userData.phone_number}
                  onChange={() => {}}
                  isDisabled={true}
                />
              </div>
            )}

            <div className="m-3 rounded-lg">
              <ReusableProfileCard
                icon={<SlLocationPin className="text-2xl" />}
                right_icon={<BsFillPatchCheckFill className="text-green-400" />}
                value={userData.country_full_name}
                onChange={() => {}}
                isDisabled={true}
              />
            </div>
            <div className="m-3 rounded-lg">
              <ReusableProfileCard
                isDisabled={true}
                icon={<FaRegUser className="text-lg" />}
                right_icon={<BsFillPatchCheckFill className="text-green-400" />}
                value={userData.user_name}
              />
            </div>
          </div>

          {isValueChanged && (
            <div className="absolute bottom-4 grid w-full place-content-center">
              {loading ? (
                <div className="grid h-full place-content-center">
                  <ClipLoader
                    size={23}
                    color={theme == "dark" ? "white" : "black"}
                  />
                </div>
              ) : (
                <Button
                  onClickFunc={() => {
                    updateUserDetails();
                  }}
                  className={"!h-10 !w-fit bg-white"}
                  text={<TextTranslate text="Update" />}
                  // text={"Update"}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
