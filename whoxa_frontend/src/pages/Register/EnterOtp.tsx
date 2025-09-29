import { useState } from "react";
import "react-phone-input-2/lib/high-res.css";
import OtpInputField from "./OtpInputField";
import { useNavigate } from "react-router-dom";
import useApiPost from "../../hooks/PostData";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../utils/hooks";
import { OtpRes } from "../../types/ResType";
import Cookies from "js-cookie";
import { updateUserData } from "../../store/Slices/UserSlice";
import { ClipLoader } from "react-spinners";
import Countdown from "../../utils/Countdown";
import LoginLeftSections from "./LoginLeftSections";
import { useWebsiteSettings } from "../../store/api/useWebsiteSettings";
import { TbCopy } from "react-icons/tb";

export default function EnterOtp() {
  const navigate = useNavigate();
  // @ts-ignore
  const dataToSend = JSON.parse(sessionStorage.getItem("dataToSend"));
  const { loading, postData } = useApiPost();
  const [otp, setotp] = useState("");
  const dispatch = useAppDispatch();
  const { data: websiteSettings } = useWebsiteSettings();
  const [rememberMe, setRememberMe] = useState(false);

  async function checkOtp() {
    if (otp.length != 6) {
      toast.error("Please Enter Otp");
      return;
    }
    console.log(otp);

    try {
      // Verify Firebase OTP
      // const user = await verifyFirebaseOtp(otp);
      let res: OtpRes;
      if (dataToSend?.email_id) {
        res = await postData("verify-email-otp", {
          country_code: dataToSend.country_code,
          email_id: dataToSend.email_id,
          otp: otp,
        });
      } else {
        res = await postData("verify-phone-otp", {
          country_code: dataToSend.country_code,
          phone_number: dataToSend.phone_number,
          otp: otp,
        });
      }

      if (res.success == true) {
        if (rememberMe) {
          // Store token permanently (e.g., for 30 days)
          Cookies.set("whoxa_auth_token", res.token, { expires: 30 });
        } else {
          // Store token for the current session only
          Cookies.set("whoxa_auth_token", res.token);
        }

        dispatch(updateUserData(res.resData));
        toast.success("Otp Verified");
        if (
          res.resData.first_name == "" ||
          res.resData.last_name == "" ||
          res.resData.user_name == "" ||
          res.resData.gender == ""
        ) {
          navigate("/user-details");
          // return;
        } else if (res.resData.profile_image == "") {
          navigate("/select-profile");
        } else {
          window.location.pathname = "/chat";
        }

        // navigate("/chat");
        // checkWichFieldIsEmpty(res.data, navigate);
        // let field = checkWichFieldIsEmpty(data.data);
        // console.log(field);
        // }
      } else {
        toast.error("Invalid Otp!");
      }
    } catch (error) {
      console.warn(error);
      toast.error(error.response.data.message);
    }
  }
  // async function verifyFirebaseOtp(code: string) {
  //   try {
  //     const result: ConfirmationResult = await (
  //       window as any
  //     ).confirmationResult.confirm(code);

  //     const user = result.user;
  //     return user;
  //   } catch (error: any) {
  //     console.error("Invalid code", error);
  //     toast.error("Invalid OTP");
  //   }

  // }
  const handleReset = () => {
    console.log("OTP Resend triggered");
    // Add your resend OTP logic here
  };

  return (
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
            <h4 className="mr-3 text-xl font-medium lg:text-3xl">Welcome </h4>
            <img className="h-8 w-8" src="/LightIcons/hii.png" alt="" />
          </div>
          <div className="text-lg lg:text-2xl">
            Hello welcome to {websiteSettings?.settings[0].website_name}
          </div>

          <div className="text-[#3A3A3A]">
            Enter the 6-digit OTP sent to{" "}
            <div className="flex gap-2">
              {dataToSend?.email_id ? (
                <div className="font-bold"> {dataToSend.email_id}</div>
              ) : (
                <>
                  <div className="font-bold">
                    {" "}
                    {dataToSend.country_code} {dataToSend.phone_number}
                  </div>
                  <div
                    onClick={() => {
                      navigate(-1);
                    }}
                    className="cursor-pointer text-[#FBCA16] underline"
                  >
                    Change Number
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Enter Otp ====================================================================================*/}
          <div className="space-y-5">
            <OtpInputField
              checkOtp={checkOtp}
              setotpPerant={setotp}
              externalOtp={otp}
            />
            {/* <div className="ml-auto mr-3 w-fit cursor-pointer text-[#FBCA16]">
              Resend OTP
            </div>
            <div className="text-center text-secondary">
              <Countdown time={120} onReset={handleReset} />
              </div> */}
            <Countdown time={120} onReset={handleReset} />
            {/* Remember me */}
            <div>
              <label className="flex items-center">
                <input
                  className="h-4 w-4 accent-[#FCC604]"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="select-none pl-2 text-sm">Remember Me</span>
              </label>
            </div>
          </div>

          <button
            onClick={() => {
              checkOtp();
            }}
            className={`primary-gradient relative h-12 w-full overflow-hidden rounded-lg px-4 py-2 text-base font-medium outline-none lg:px-9 lg:text-lg`}
          >
            {loading ? (
              <div className="px-5">
                <ClipLoader color="black" size={23} />
              </div>
            ) : (
              <span className="">{"Login"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
