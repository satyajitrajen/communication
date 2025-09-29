import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { StatusListRes } from "../../types/StatusTypes";
import { useAppDispatch } from "../../utils/hooks";
import { updateStatusListRes } from "../../store/Slices/StatusSlice";

export const useStatusList = () => {
  const token = Cookies.get("whoxa_auth_token");
  const dispatch = useAppDispatch();

  return useQuery<StatusListRes, Error>(
    ["status-list"],
    async () => {
      const response = await axios.post<StatusListRes>(
        `${import.meta.env.VITE_API_URL}status-list`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(updateStatusListRes(response.data));
      return response.data;
    },
    {
      // Set cache time to prevent re-fetching on route changes
      staleTime: Infinity, // Data will never be considered stale
      cacheTime: Infinity, // Data will never be removed from cache
    },
  );
};
