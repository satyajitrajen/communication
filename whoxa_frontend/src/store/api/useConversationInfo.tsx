import { useQuery } from "react-query";
import axios from "axios";
import { ConversationInfoRes } from "../../types/ConversationInfoType";
import { useAppSelector } from "../../utils/hooks";
import Cookies from "js-cookie";

export const useConversationInfo = () => {
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  const token = Cookies.get("whoxa_auth_token");

  return useQuery<ConversationInfoRes, Error>(
    ["group-info", currentConversationData.conversation_id],
    async () => {
      const response = await axios.post<ConversationInfoRes>(
        `${import.meta.env.VITE_API_URL}/get-one-to-one-media`,
        { conversation_id: currentConversationData.conversation_id },
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
