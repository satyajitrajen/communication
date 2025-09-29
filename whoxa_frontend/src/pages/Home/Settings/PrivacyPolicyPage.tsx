import React from "react";
import PrivacyPolicy from "./PrivacyPolicy";

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="">
        <div className="bg-white absolute py-5 w-full text-center text-xl font-semibold text-black">
          Privacy Policy
        </div>
        <PrivacyPolicy />
      </div>
    </>
  );
}
