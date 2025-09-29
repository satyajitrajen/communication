import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { UserDataRes } from "../../types/UserDataType";
import { updateUserData } from "../Slices/UserSlice";

export const useUserProfile = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("whoxa_auth_token"); // or "whoxa_web_token" depending on what you use

  return useQuery<UserDataRes, AxiosError>(
    ["user-details"],
    async () => {
      try {
        const response = await axios.post<UserDataRes>(
          `${import.meta.env.VITE_API_URL}user-details`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-custom-header": "Web",
            },
          },
        );

        // Check if account deleted
        if (
          response.data.resData?.is_account_deleted ||
          !response.data.resData
        ) {
          Cookies.remove("whoxa_auth_token"); // clear token
          localStorage.clear();
          sessionStorage.clear();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        // Dispatch user data into Redux
        dispatch(updateUserData(response.data.resData));

        return response.data;
      } catch (error) {
        // Handle unauthorized (expired/invalid token)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          Cookies.remove("whoxa_auth_token");
          localStorage.clear();
          sessionStorage.clear();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
        throw error; // rethrow so React Query can handle error states
      }
    },
    {
      staleTime: Infinity, // never stale
      cacheTime: Infinity, // never garbage collected
    },
  );
};
