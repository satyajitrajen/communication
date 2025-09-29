import { useQuery } from "react-query";
import axios from "axios";
import { LanguageTextListRes } from "../../types/LanguageTextList";
import Cookies from "js-cookie";
import { useAppDispatch } from "../../utils/hooks";
import { updateLanguageTextList } from "../Slices/LanguageTextListSlice";

export const useFetchLanguageTextList = () => {
  let updatedFields = {};
  // let status_id = localStorage.getItem("status_id");
  let status_id = Cookies.get("status_id");
  let dispatch = useAppDispatch();
  if (status_id) {
    updatedFields.status_id = status_id;
  }

  return useQuery<LanguageTextListRes, Error>(
    ["fetch-default-language"],
    async () => {
      const response = await axios.post<LanguageTextListRes>(
        `${import.meta.env.VITE_API_URL}fetch-default-language`,
        updatedFields,
      );
      dispatch(updateLanguageTextList(response.data));
      return response.data;
    },
    {
      // Set cache time to prevent re-fetching on route changes
      staleTime: Infinity, // Data will never be considered stale
      cacheTime: Infinity, // Data will never be removed from cache
    },
  );
};
