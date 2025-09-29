import { useQuery } from "react-query";
import axios from "axios";

import { useAppSelector } from "../../utils/hooks";
import Cookies from "js-cookie";
import { PinMessageListRes } from "../../types/ResType";

export const usePinMessageList = () => {
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  const token = Cookies.get("whoxa_auth_token");

  return useQuery<PinMessageListRes, Error>(
    ["pin-message-list", currentConversationData.conversation_id],
    async () => {
      const response = await axios.post<PinMessageListRes>(
        `${import.meta.env.VITE_API_URL}/pin-message-list`,
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
      enabled: currentConversationData.conversation_id >= 1,
      select: (data) => ({
        ...data,
        PinMessageList: data.PinMessageList ?? [],
      }),
    },
  );
};
