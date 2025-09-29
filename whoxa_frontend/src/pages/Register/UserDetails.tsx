import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/high-res.css";
import PhoneInput from "react-phone-input-2";
import PhoneInputField from "./PhoneInputField";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import useApiPost from "../../hooks/PostData";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import LoginLeftSections from "./LoginLeftSections";
import {
  updateSpesificUserData,
  updateUserData,
} from "../../store/Slices/UserSlice";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import ReusableProfileCard from "../Home/Profile/ReusableProfileCard";
import { FaCheckCircle, FaRegUser } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";
import { RxCross1, RxCrossCircled } from "react-icons/rx";
import TextTranslate from "../../utils/TextTranslate";
import { useUserProfile } from "../../store/api/useUserProfile";

export default function UserDetails() {
  let navigate = useNavigate();
  const { loading, postData } = useApiPost();
  const { loading: checkUserNameLoading, postData: checkUserName } =
    useApiPost();
  const dispatch = useAppDispatch();
  let userData = useAppSelector((state) => state.userData);
  const [user_name_available, setUser_name_available] = useState(true);
  let country = sessionStorage.getItem("country");
  let country_full_name = sessionStorage.getItem("country_full_name");

  let { refetch } = useUserProfile();
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    dispatch(
      updateSpesificUserData({
        country: country!,
        country_full_name: country_full_name!,
      }),
    );
  }, [country]);

  async function updateUserDetails() {
    try {
      // Remove country code from phone number

      if (!user_name_available || userData.user_name == "") {
        toast.error("User name allready used!");
        return;
      }
      if (userData.first_name == "") {
        toast.error("First Name is required!");
        return;
      }
      if (userData.last_name == "") {
        toast.error("Last Name is required!");
        return;
      }
      if (userData.gender == "") {
        toast.error("Gender is required!");
        return;
      }

      let userDetailsRes = await postData("user-details", userData);
      dispatch(updateUserData(userDetailsRes.resData));
      navigate("/select-profile");

      // toast.success("Profile Updated", { position: "bottom-left" });
    } catch (error) {
      console.log(error);
    }

    // addUserPhone(formData.phone);
  }

  interface CheckUserNameRes {
    message: string;
    success: boolean;
  }

  async function checkUserNameApiCall(user_name: string) {
    let checkUserNameRes: CheckUserNameRes = await checkUserName(
      "check-user-name",
      { user_name: user_name },
    );
    setUser_name_available(checkUserNameRes.success);
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
        <div className="mx-auto w-[90%] max-w-[35rem] space-y-7 rounded-2xl p-8 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] 2xl:max-w-[40rem] 2xl:p-12">
          <div className="flex flex-col gap-y-4">
            <h4 className="mr-3 text-xl font-semibold">
              Fill up the details to proceed further
            </h4>
            <div className="flex flex-col gap-y-2">
              <div>User Name</div>
              <div className="relative">
                <input
                  value={userData.user_name}
                  onChange={(e) => {
                    dispatch(
                      updateSpesificUserData({ user_name: e.target.value }),
                    );
                    checkUserNameApiCall(e.target.value);
                  }}
                  placeholder="User Name"
                  type="text"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                />
                <div className="absolute right-3 top-0 grid h-full place-content-center">
                  {checkUserNameLoading ? (
                    <ClipLoader size={24} color={"#FBCA18"} />
                  ) : user_name_available && userData.user_name != "" ? (
                    <FaCircleCheck className="text-lg text-green-500" />
                  ) : (
                    <RxCrossCircled className="text-xl text-red-500" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <div>First Name</div>
              <div>
                <input
                  value={userData.first_name}
                  onChange={(e) => {
                    dispatch(
                      updateSpesificUserData({ first_name: e.target.value }),
                    );
                  }}
                  placeholder="First Name"
                  type="text"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <div>Last Name</div>
              <div>
                <input
                  value={userData.last_name}
                  onChange={(e) => {
                    dispatch(
                      updateSpesificUserData({ last_name: e.target.value }),
                    );
                  }}
                  placeholder="Last Name"
                  type="text"
                  className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <h4>Gender</h4>
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
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#9E9E9E] transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-10 before:w-10 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-[#9E9E9E] before:opacity-0 before:transition-opacity checked:border-[#9E9E9E] checked:before:bg-[#9E9E9E] hover:before:opacity-10"
                      id="male"
                      onChange={() => {
                        dispatch(updateSpesificUserData({ gender: "male" }));
                      }}
                    />
                    <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 opacity-0 transition-opacity peer-checked:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <circle
                          data-name="ellipse"
                          cx="8"
                          cy="8"
                          r="8"
                        ></circle>
                      </svg>
                    </span>
                  </label>
                  <label
                    className="mt-px cursor-pointer select-none"
                    htmlFor="male"
                  >
                    Male
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
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#9E9E9E] transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-10 before:w-10 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-[#9E9E9E] before:opacity-0 before:transition-opacity checked:border-[#9E9E9E] checked:before:bg-[#9E9E9E] hover:before:opacity-10"
                      id="female"
                      onChange={() => {
                        dispatch(updateSpesificUserData({ gender: "female" }));
                      }}
                    />
                    <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 opacity-0 transition-opacity peer-checked:opacity-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <circle
                          data-name="ellipse"
                          cx="8"
                          cy="8"
                          r="8"
                        ></circle>
                      </svg>
                    </span>
                  </label>
                  <label
                    className="mt-px cursor-pointer select-none"
                    htmlFor="female"
                  >
                    Female
                  </label>
                </div>
              </div>
            </div>

            {/* Phone and Country */}
            <div className="flex flex-col rounded-lg bg-[#f1eeee] px-4 py-4">
              <div className="ml-3 flex items-center">
                <div className="text-lg font-semibold text-[#3A3333]">
                  <TextTranslate text="Contact Details" />
                </div>
                <div className="text-xs font-medium text-red-500">
                  (<TextTranslate text="Non Changeable" />)
                </div>
              </div>
              <div className="m-3 rounded-lg bg-white">
                <ReusableProfileCard
                  icon={<IoCallOutline className="text-2xl" />}
                  right_icon={
                    <BsFillPatchCheckFill className="text-green-400" />
                  }
                  value={
                    userData.email_id
                      ? userData.email_id
                      : userData.country_code + " " + userData.phone_number
                  }
                  onChange={() => {}}
                  isDisabled={true}
                />
              </div>
              <div className="m-3 rounded-lg bg-white">
                <ReusableProfileCard
                  icon={<SlLocationPin className="text-2xl" />}
                  right_icon={
                    <BsFillPatchCheckFill className="text-green-400" />
                  }
                  value={userData.country_full_name || country_full_name}
                  onChange={() => {}}
                  isDisabled={true}
                />
              </div>
            </div>
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
                <span className="">
                  <TextTranslate text="Next" />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
