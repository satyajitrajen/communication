import React, { useEffect, useState } from "react";
import useApiPost from "../hooks/PostData";
import toast from "react-hot-toast";

interface CountdownProps {
  time: number; // Initial countdown time in seconds
  onReset: () => void; // Function to call when the countdown ends or resets
}

const Countdown: React.FC<CountdownProps> = ({ time, onReset }) => {
  const [seconds, setSeconds] = useState<number>(time);
  const [isActive, setIsActive] = useState<boolean>(true);
  const { loading, postData } = useApiPost();

  // Convert seconds into MM:SS format and handle NaN cases
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00"; // Fallback if secs is invalid
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      onReset();
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [seconds, isActive, onReset]);

  const handleReset = () => {
    setSeconds(time); // Reset the countdown to the initial time
    setIsActive(true); // Restart the countdown
  };
  let dataToSend = JSON.parse(sessionStorage.getItem("dataToSend")!);

  async function resendOtp() {
    try {
      // console.log(dataToSend, "dataToSend");
      let registerPhoneRes = await postData("register-phone", {
        country_code: dataToSend.country_code,
        phone_number: dataToSend.phone_number,
      });
      handleReset();
    } catch (error) {
      console.log(error);
    }

    // addUserPhone(formData.phone);
  }

  return (
    <>
      <div
        onClick={() => {
          if (isActive) {
            toast.error("You can resend otp after 2 minutes");
            return;
          }
          resendOtp();
        }}
        className={`ml-auto mr-3 w-fit cursor-pointer ${isActive ? "text-[#D8D8D8]" : "text-[#FBCA16]"}`}
      >
        Resend OTP
      </div>
      <div className="text-center text-black">
        <p>Resend OTP in {formatTime(seconds)}</p>
      </div>
    </>
  );
};

export default Countdown;
