import React from "react";
import { useAppSelector } from "../utils/hooks";
import { useWebsiteSettings } from "../store/api/useWebsiteSettings";

export default function AdminBlockedYou() {
  let { data: websiteSettings } = useWebsiteSettings();

  return (
    <div className="grid h-screen w-full place-content-center text-center">
      <img
        src={`${websiteSettings?.settings[0].website_logo}`}
        className="mx-auto mb-10 h-24 w-24 object-contain"
        alt=""
      />
      <div className="text-2xl">
        You are blocked by {websiteSettings?.settings[0].website_name} Admin.
      </div>
    </div>
  );
}
