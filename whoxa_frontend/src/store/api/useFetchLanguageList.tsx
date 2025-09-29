import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { LanguageListRes } from "../../types/ResType";

export const useFetchLanguageList = () => {
  const token = Cookies.get("whoxa_auth_token");

  return useQuery<LanguageListRes, Error>(
    ["List-Language"],
    async () => {
      const response = await axios.post<LanguageListRes>(
        `${import.meta.env.VITE_API_URL}List-Language`,
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
