import React, {
  useState,
  useRef,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";

interface OtpInputFieldProps {
  setotpPerant: (otp: string) => void;
  checkOtp: () => void;
  externalOtp: string; // <-- New prop
}

const OtpInputField: React.FC<OtpInputFieldProps> = ({
  setotpPerant,
  checkOtp,
  externalOtp,
}) => {
  const dispatch = useDispatch();
  const [text, setText] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null),
  );

  useEffect(() => {
    if (/^\d{6}$/.test(externalOtp)) {
      const newOtp = externalOtp.split("");
      setOtp(newOtp);
      setotpPerant(externalOtp);
      inputRefs[5].current?.focus();
    }
  }, [externalOtp]);
  
  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits or empty

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus();
    }

    if (newOtp.every((val) => val !== "")) {
      const enteredOtp = newOtp.join("");
      setText(enteredOtp);
      setotpPerant(enteredOtp);
    }
  };

  const handleInputBackspace = (index: number, value: string) => {
    if (value === "" && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      setText(pastedData);
      setotpPerant(pastedData);
      inputRefs[5].current?.focus(); // Focus last field
      e.preventDefault(); // Prevent default paste behavior
    }
  };

  return (
    <div className="mx-auto flex w-fit space-x-2 lg:space-x-4">
      {otp.map((value, index) => (
        <input
          key={index}
          ref={inputRefs[index]}
          type="text"
          maxLength={1}
          className="focus:border-yellow h-10 w-10 rounded border-2 border-[#BDBDBD] bg-transparent text-center text-2xl outline-none lg:h-14 lg:w-14"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(index, e.target.value)
          }
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Backspace") {
              handleInputBackspace(index, value);
            }
            if (e.key === "Enter") {
              checkOtp();
            }
          }}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OtpInputField;
