import React from "react";
import "react-phone-input-2/lib/high-res.css";
import PhoneInput from "react-phone-input-2";
import { useTheme } from "../../context/ThemeProvider";

export default function EmailInputField({
  postEmailId,
  formData,
  setFormData,
}) {
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    postEmailId(); // Call your function
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="h-12 w-full bg-gray-50 text-black">
        <input
          value={formData.email_id}
          onChange={(e) => {
            setFormData((prevData) => ({
              ...prevData,
              email_id: e.target.value,
            }));
          }}
          className={`${
            theme === "dark" ? "bg-transparent" : "bg-[#F2F2F2]"
          } w-full rounded-b-lg border py-3 pl-5 placeholder-lightText outline-none`}
          type="text"
          placeholder={"Enter Your Email *"}
        />
      </div>
      <button type="submit" className="hidden" aria-hidden="true" />
    </form>
  );
}
