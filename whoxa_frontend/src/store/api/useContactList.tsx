import { useQuery } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";

import { ContactListRes } from "../../types/SendMessageType";
import { updateContactListRes } from "../Slices/ContactListSlice";
import { useAppDispatch } from "../../utils/hooks";

export const useContactList = ({ full_name }: { full_name?: string }) => {
  const token = Cookies.get("whoxa_auth_token");
  let dispatch = useAppDispatch();
  return useQuery<ContactListRes, Error>(
    ["my-contacts", full_name],
    async () => {
      const response = await axios.post<ContactListRes>(
        `${import.meta.env.VITE_API_URL}my-contacts`,
        { full_name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      dispatch(updateContactListRes(response.data));

      return response.data;
    },
    {
      // Set cache time to prevent re-fetching on route changes
      staleTime: Infinity, // Data will never be considered stale
      cacheTime: Infinity, // Data will never be removed from cache
    },
  );
};
