import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";

import { AllPublicGroupRes } from "../../types/ResType";

export const usePublicGroupList = ({ group_name }: { group_name?: string }) => {
  const token = Cookies.get("whoxa_auth_token");

  return useQuery<AllPublicGroupRes, Error>(
    ["get-public-groups", group_name],
    async () => {
      const response = await axios.post<AllPublicGroupRes>(
        `${import.meta.env.VITE_API_URL}get-public-groups`,
        { group_name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // dispatch(updateContactListRes(response.data));

      return response.data;
    },
    {
      // Set cache time to prevent re-fetching on route changes
      staleTime: Infinity, // Data will never be considered stale
      cacheTime: Infinity, // Data will never be removed from cache
    },
  );
};
