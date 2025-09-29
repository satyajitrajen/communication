import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";

// WebsiteSettingsRes ==================================================================================
export interface WebsiteSettingsRes {
  success: boolean;
  message: string;
  settings: Setting[];
}

export interface Setting {
  website_logo: string;
  setting_id: number;
  website_name: string;
  website_email: string;
  website_text: string;
  website_color_primary: string;
  website_color_secondary: string;
  website_link: string;
  ios_link: string;
  android_link: string;
  tell_a_friend_link: string;
  baseUrl: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_FROM_NUMBER: string;
  JWT_SECRET_KEY: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useWebsiteSettings = () => {
  const token = Cookies.get("adminToken");

  return useQuery<WebsiteSettingsRes, Error>(
    ["get-website-settings"],
    async () => {
      const response = await axios.post<WebsiteSettingsRes>(
        `${import.meta.env.VITE_API_URL}get-website-settings`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    {
      // Set cache time to prevent re-fetching on route changes
      staleTime: Infinity, // Data will never be considered stale
      cacheTime: Infinity, // Data will never be removed from cache
    }
  );
};
