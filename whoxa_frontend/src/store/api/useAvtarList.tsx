import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { AvatarListRes } from "../../types/ResType";

export const useAvtarList = () => {
  const token = Cookies.get("whoxa_auth_token");
  return useQuery<AvatarListRes, Error>(
    ["list-all-avtars"],
    async () => {
      const response = await axios.post<AvatarListRes>(
        `${import.meta.env.VITE_API_URL}list-all-avtars`,
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
