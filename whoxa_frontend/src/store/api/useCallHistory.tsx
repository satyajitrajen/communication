import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { AvatarListRes, CallListRes } from "../../types/ResType";

export const useCallHistory = () => {
  const token = Cookies.get("whoxa_auth_token");
  return useQuery<CallListRes, Error>(
    ["call-list"],
    async () => {
      const response = await axios.post<CallListRes>(
        `${import.meta.env.VITE_API_URL}call-list`,
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
