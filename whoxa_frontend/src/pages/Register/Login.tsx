import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/high-res.css";
import PhoneInput from "react-phone-input-2";
import PhoneInputField from "./PhoneInputField";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import useApiPost from "../../hooks/PostData";
import { ClipLoader } from "react-spinners";
import LoginLeftSections from "./LoginLeftSections";
import toast from "react-hot-toast";
import { useWebsiteSettings } from "../../store/api/useWebsiteSettings";
import { TbCopy } from "react-icons/tb";
import EmailInputField from "./EmailInputField";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, setupRecaptcha } from "../../firebase/setup";

export default function Login() {
  const navigate = useNavigate();
  const { loading, postData } = useApiPost();
  const { data: websiteSettings } = useWebsiteSettings();

  const [formData, setFormData] = useState({
    country_code: "",
    phone_number: "",
    country: "",
    country_full_name: "",
    email_id: "",
  });

  const [currentLoginField, setCurrentLoginField] = useState<"email" | "phone">(
    "phone",
  );
  const [bothLoginEnabled, setBothLoginEnabled] = useState(false);
  useEffect(() => {
    if (
      websiteSettings?.settings[0].email_auth &&
      websiteSettings?.settings[0].phone_auth
    ) {
      setBothLoginEnabled(true);
    } else if (websiteSettings?.settings[0].phone_auth) {
      setCurrentLoginField("phone");
      setBothLoginEnabled(false);
    } else if (websiteSettings?.settings[0].email_auth) {
      setCurrentLoginField("email");
    }
  }, [websiteSettings?.settings]);

  // useEffect(() => {
  //   if (!window.recaptchaVerifier) {
  //     window.recaptchaVerifier = new RecaptchaVerifier(
  //       auth,
  //       "recaptcha-container",
  //       {
  //         size: "invisible",
  //       },
  //     );
  //     window.recaptchaVerifier.render();
  //   }
  // }, []);

  async function postPhoneNumber() {
    if (!formData.phone_number) {
      toast.error("Please Enter Phone Number", { position: "bottom-center" });
      return;
    }
    console.log(formData.phone_number, "formData.phone_number");
    sessionStorage.setItem("country", formData.country.toUpperCase());
    sessionStorage.setItem("country_full_name", formData.country_full_name);

    try {
      // Prepare full phone number with country code
      const phone_number = formData.phone_number.replace(
        formData.country_code,
        "",
      );
      const dataToSend = {
        ...formData,
        phone_number,
      };

      // Send OTP
      // const confirmationResult = await signInWithPhoneNumber(
      //   auth,
      //   formData.phone_number,
      //   window.recaptchaVerifier,
      // );

      // console.log(dataToSend, "dataToSend");
      let registerPhoneRes = await postData("register-phone", dataToSend);

      // Save confirmationResult in session/local storage for OTP verification step

      // window.confirmationResult = confirmationResult;

      toast.success("OTP sent successfully!");
      // console.log(dataToSend, "dataToSend");
      // console.log(registerPhoneRes.success == true);

      sessionStorage.setItem("dataToSend", JSON.stringify(dataToSend));
      navigate("/otp-verification");
    } catch (error: any) {
      console.error("SMS not sent", error);
      toast.error(error.message || "Failed to send OTP");
    }
  }

  async function postEmailId() {
    if (formData.email_id == "" || formData.email_id == undefined) {
      toast.error("Please Enter Email Number", { position: "bottom-center" });
      return;
    }
    const dataToSend = {
      ...formData,
      email_id: formData.email_id,
    };

    try {
      // console.log(dataToSend, "dataToSend");
      let registerEmailRes = await postData("register-email", {
        email_id: formData.email_id,
      });
      // console.log(registerEmailRes.success == true);
      if (registerEmailRes.success == true) {
        sessionStorage.setItem("dataToSend", JSON.stringify(dataToSend));
        navigate("/otp-verification");
      } else {
        toast.error(registerEmailRes.message);
        return;
        // toast.error(registerPhoneRes.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }

    // addUserPhone(formData.phone);
  }
  return (
    <>
      <div id="recaptcha-container"></div>
      <div className="grid min-h-screen w-screen bg-white text-black lg:grid-cols-2">
        {/* Sign in Left side ====================================================================================*/}
        <LoginLeftSections />

        {/* Sign in Right side ====================================================================================*/}
        <div
          className="relative col-span-1 flex h-full w-full flex-col items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${"/Home/Login_page.jpg"})`,
          }}
        >
          <img
            className="absolute right-5 top-5 w-20 xl:w-28"
            src={websiteSettings?.settings[0].website_logo}
            alt=""
          />
          <div className="mx-auto w-[90%] max-w-[30rem] space-y-7 rounded-2xl p-5 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] lg:p-10 2xl:max-w-[35rem] 2xl:p-16">
            <div className="flex">
              <h4 className="mr-3 text-3xl font-medium">Welcome</h4>
              <img className="h-8 w-8" src="/LightIcons/hii.png" alt="" />
            </div>
            <div className="text-lg lg:text-2xl">
              Hello welcome to {websiteSettings?.settings[0].website_name}
            </div>
            <div>
              {bothLoginEnabled && (
                <div className="grid grid-cols-2 text-center">
                  <div
                    onClick={() => {
                      setCurrentLoginField("phone");
                    }}
                    className={`flex h-12 cursor-pointer items-center justify-center gap-2 ${currentLoginField == "phone" ? "primary-gradient" : "border"} rounded-t-lg py-3`}
                  >
                    <span className="hidden lg:block"> Continue with </span>{" "}
                    <span>Phone</span>
                  </div>
                  <div
                    onClick={() => {
                      setCurrentLoginField("email");
                    }}
                    className={`flex h-12 cursor-pointer items-center justify-center gap-2 ${currentLoginField == "email" ? "primary-gradient" : "border"} rounded-t-lg py-3`}
                  >
                    <span className="hidden lg:block"> Continue with</span>{" "}
                    <span>Email</span>
                  </div>
                </div>
              )}

              <div>
                {currentLoginField == "phone" ? (
                  <PhoneInputField
                    postPhoneNumber={postPhoneNumber}
                    formData={formData}
                    setFormData={setFormData}
                  />
                ) : (
                  <EmailInputField
                    postEmailId={postEmailId}
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (currentLoginField == "email") {
                  postEmailId();
                } else {
                  postPhoneNumber();
                }
              }}
              className={`primary-gradient relative h-12 w-full overflow-hidden rounded-lg px-4 py-2 text-base font-medium outline-none lg:px-9 lg:text-lg`}
            >
              {loading ? (
                <div className="px-5">
                  <ClipLoader color="black" size={23} />
                </div>
              ) : (
                <span className="">{"Send OTP"}</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
