import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { ReportTypeRes } from "../../types/ResType";

export const useReportTypeList = () => {
  const token = Cookies.get("whoxa_auth_token");

  return useQuery<ReportTypeRes, Error>(
    ["Report-type-list"],
    async () => {
      const response = await axios.post<ReportTypeRes>(
        `${import.meta.env.VITE_API_URL}Report-type-list`,
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
