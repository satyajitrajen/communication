import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { BlockUserListRes } from "../../types/BlockUserListType";

export const useBlockUserList = () => {
  const token = Cookies.get("whoxa_auth_token");
  return useQuery<BlockUserListRes, Error>(
    ["block-user-list"],
    async () => {
      const response = await axios.post<BlockUserListRes>(
        `${import.meta.env.VITE_API_URL}block-user-list`,
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
