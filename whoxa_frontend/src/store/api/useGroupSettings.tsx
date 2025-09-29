import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { GroupSettingsRes } from "../../types/ResType";

export const useGroupSettings = () => {
  const token = Cookies.get("whoxa_auth_token");

  return useQuery<GroupSettingsRes, Error>(
    ["get-Group-settings"],
    async () => {
      const response = await axios.post<GroupSettingsRes>(
        `${import.meta.env.VITE_API_URL}get-Group-settings`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
    {
      // Set cache time to prevent re-fetching on route changes
      staleTime: Infinity, // Data will never be considered stale
      cacheTime: Infinity, // Data will never be removed from cache
    },
  );
};
