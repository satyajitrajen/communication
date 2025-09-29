import React from "react";
// import "react-phone-number-input/style.css";
// import PhoneInput from "react-phone-number-input";
// import "/src/assets/css/PhoneInputField.css";
import "react-phone-input-2/lib/high-res.css";
import PhoneInput from "react-phone-input-2";

export default function PhoneInputField({
  postPhoneNumber,
  formData,
  setFormData,
}) {
  return (
    <div>
      {/* <div className="pl-1 text-sm">Mobile Number</div> */}
      <div className="w-full rounded-xl bg-gray-50 text-black">
        <PhoneInput
          placeholder="Enter phone number"
          value={formData.phone_number}
          onEnterKeyPress={postPhoneNumber}
          onChange={(value, data) => {
            setFormData((prevData) => ({
              ...prevData, // Keep existing formData properties
              country_code: `+${data.dialCode}`,
              phone_number: `+${value}`,
              country: data.countryCode,
              country_full_name: data.name,
            }));
          }}
          country={"us"}
          enableSearch
        />
      </div>
      {/* <div className="mt-1 pl-1 text-sm text-gray-600">
        We will send you 6 digit code on the given phone number
      </div> */}
    </div>
  );
}
