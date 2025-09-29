import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const useApiPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0); // Add progress state

  const postData = async (
    url: any,
    bodyData: any,
    contentType = "application/json",
  ) => {
    let token = Cookies.get("whoxa_auth_token");
    try {
      setLoading(true);
      setError(null);
      setProgress(0); // Reset progress at the start of each upload

      const headers = {
        "Content-Type": contentType,
        Authorization: `Bearer ${token}`,
        "x-custom-header": "Web",
      };

      const response = await axios.post(
        import.meta.env.VITE_API_URL + url,
        bodyData,
        {
          headers,
          onUploadProgress: (progressEvent) => {
            // Calculate the upload progress as a percentage
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!,
            );
            setProgress(percentCompleted); // Update progress state
          },
        },
      );

      setData(response.data);
      return response.data; // Return the response data
    } catch (err) {
      setError(err);
      console.error("Error during API call:", err);
      throw err; // Re-throw the error for the caller to handle
    } finally {
      setLoading(false);
      setProgress(0); // Reset progress after upload completes
    }
  };

  return { loading, error, data, progress, postData };
};

export default useApiPost;
