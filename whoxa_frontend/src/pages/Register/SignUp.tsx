import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
// import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from "/Home/Zeroe_Logo.png";
// import DefaultLayout from '../../layout/DefaultLayout';
// import useApiPost from '../../hooks/PostData';
// import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/high-res.css";
import PhoneInput from "react-phone-input-2";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import Button from "../../components/Button";
import useApiPost from "../../hooks/PostData.jsx";

export default function SignUp() {
  //   let navigate = useNavigate();
  //   const { loading, postData } = useApiPost();
  const [email_id, setEmail_id] = useState("");
  const [password, setPassword] = useState("");
  const [showpassword, setshowPassword] = useState(false);
  const [phone, setPhone] = useState(0);
  const { loading, error, data, postData } = useApiPost();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
    user_role: "user",
    login_type: "",
    country_code: "",
    country_flag: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let response = await postData("register_new", formData);
      // console.log("response", response);

      // Handle successful registration
      toast.success("Registration successful");
    } catch (error) {
      // Handle error
      console.error("Registration error:", error);
      if (error.response) {
        const responseData = error.response.data;
        if (responseData && responseData.message === "Error validation") {
          const errors = responseData.data;
          let singleError = Object.values(errors);
          console.log(singleError[0][0]);

          toast.error(singleError[0][0]);
        } else {
          toast.error("Registration failed");
        }
      } else {
        toast.error("Registration failed");
      }
    }
  };

  // console.log(formData);

  return (
    <>
      {/* <DefaultLayout> */}
      {/* <Breadcrumb pageName="Sign In" /> */}
      <div className="min-h-screen   dark:bg-boxdark grid place-content-center overflow-y-auto 2xl:overflow-y-hidden  overflow-x-hidden">
        <div className="overflow-y-auto w-screen flex rounded-lg   shadow-default  dark:bg-boxdark">
          {/* <div className="flex flex-wrap items-center"> */}

          {/* image ====================================================================================*/}
          <div className="hidden w-full xl:block xl:w-1/2 min-h-screen">
            <img
              src="/handyman/signin_image.jpg"
              className="h-full w-full object-cover object-top"
              alt=""
            />
          </div>

          <div className="min-w-80 w-full sm:w-[65%] lg:w-[60%]  xl:w-[35%] my-auto mx-auto px-5 py-6 lg:px-10 ">
            <div className="space-y-4 mb-5">
              <div className="text-3xl text-blueTextColor">
                Welcome To Handyman
              </div>
              <div className="flex gap-x-3 items-center">
                <h1 className="font-bold font-Poppins text-3xl text-blueTextColor">
                  Hey, Hello
                </h1>
                <img
                  src="/LightIcons/hii.png"
                  className="h-10 w-10"
                  alt=""
                />
              </div>
              <div className="font-Poppins">
                Enter your information below to sign up
              </div>
            </div>

            {/* Login Form ====================================================================================*/}
            <div className="w-full  ">
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                  // navigate('/users');
                }}
              >
                <div className="mb-4">
                  <label className="mb-2.5 block font-Poppins font-semibold text-darkTextColor ">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      value={formData.firstname}
                      onChange={(e) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          firstname: e.target.value,
                        }));
                      }}
                      type="text"
                      placeholder=""
                      className="w-full rounded-lg border-2 border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark bg-[#0F172A] dark:focus:border-primary"
                    />
                    <span className="absolute right-4 top-4"></span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-Poppins font-semibold text-darkTextColor ">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      value={formData.lastname}
                      onChange={(e) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          lastname: e.target.value,
                        }));
                      }}
                      type="text"
                      placeholder=""
                      className="w-full rounded-lg border-2 border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark bg-[#0F172A] dark:focus:border-primary"
                    />
                    <span className="absolute right-4 top-4"></span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-Poppins font-semibold text-darkTextColor ">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      value={formData.email}
                      onChange={(e) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          email: e.target.value,
                        }));
                      }}
                      type="email"
                      placeholder=""
                      className="w-full rounded-lg border-2 border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark bg-[#0F172A] dark:focus:border-primary"
                    />
                    <span className="absolute right-4 top-4"></span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-Poppins font-semibold text-darkTextColor">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      value={formData.password}
                      onChange={(e) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          password: e.target.value,
                        }));
                      }}
                      type={showpassword ? "text" : "password"}
                      placeholder=""
                      className="w-full rounded-lg border-2 border-stroke bg-transparent py-3 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark bg-[#0F172A] dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4 cursor-pointer">
                      {showpassword ? (
                        <AiOutlineEyeInvisible
                          onClick={() => {
                            setshowPassword(false);
                          }}
                          className="text-2xl"
                        />
                      ) : (
                        <AiOutlineEye
                          onClick={() => {
                            setshowPassword(true);
                          }}
                          className="text-2xl"
                        />
                      )}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-Poppins font-semibold text-darkTextColor ">
                    Contact Number
                  </label>
                  <div className="relative">
                    <PhoneInput
                      className=" py-2  rounded-xl px-4 w-full border-2"
                      placeholder=""
                      value={phone}
                      onChange={(value: string, data) => {
                        // console.log("data", data);
                        // console.log("value", value);
                        setPhone(value);
                        setFormData((prevData) => ({
                          ...prevData,
                          mobile: value.substring(data?.dialCode?.length),
                          country_flag: data.countryCode,
                          country_code: `+${data.dialCode}`,
                        }));
                      }}
                      // defaultCountry="US"
                      country={"us"}
                      enableSearch
                    />
                    <span className="absolute right-4 top-4"></span>
                  </div>
                </div>

                <div className="my-5 mb-10 flex justify-between font-Poppins">
                  <div className="flex gap-x-2 items-center select-none">
                    <input
                      type="checkbox"
                      name="aggree_terms"
                      id="aggree_terms"
                      className="accent-blueTextColor h-4 w-4"
                    />
                    <label htmlFor="aggree_terms" className=" text-sm">
                      I agree to the{" "}
                      <span className="text-blueTextColor">
                        Terms of Service & Privacy Policy
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mb-5">
                  {/* <button
                    type="submit"
                    className="w-full cursor-pointer rounded-lg  bg-secondary  p-4 text-white transition hover:bg-opacity-90"
                  >
                    Sign In
                  </button> */}
                  {loading ? (
                    <div className="w-full flex justify-center">
                      <ClipLoader color="black" size={20} />
                    </div>
                  ) : (
                    <Button className={"w-full"} text={"Sign Up"} />
                  )}
                </div>
              </form>

              <div className="w-full text-center font-Poppins">
                Already a member?{" "}
                <Link to={"/signin"} className="text-NewYellow hover:underline">
                  SIGN IN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//  SignIn;
