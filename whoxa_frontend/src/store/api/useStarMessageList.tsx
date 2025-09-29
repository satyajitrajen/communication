import { useQuery } from "react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

import { StarMessageListRes } from "../../types/StarMessageListTypes";
import { useAppSelector } from "../../utils/hooks";
import { useLocation } from "react-router-dom";

export const useStarMessageList = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("whoxa_auth_token");
  let CurrentConversation = useAppSelector(
    (state) => state.CurrentConversation,
  );
  let location = useLocation();
  let MessageOptions = useAppSelector((state) => state.MessageOptions);
  let userData = useAppSelector((state) => state.userData);

  let updatedFields = {};

  // if (!MessageOptions.show_all_star_messages) {
  //   alert(MessageOptions.show_all_star_messages);
  //   updatedFields.conversation_id = CurrentConversation.conversation_id;
  // }
  let api_name = [];

  if (location.pathname != "/star-messages") {
    updatedFields.conversation_id = CurrentConversation.conversation_id;
    api_name = ["star-message-list", CurrentConversation.conversation_id];
  } else {
    api_name = ["star-message-list"];
  }
  // console.log(
  //   CurrentConversation.conversation_id,
  //   "CurrentConversation.conversation_id",
  // );

  return useQuery<StarMessageListRes, Error>(
    // ["star-message-list", CurrentConversation.conversation_id],
    api_name,
    async () => {
      let response = await axios.post<StarMessageListRes>(
        `${import.meta.env.VITE_API_URL}star-message-list`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // // Filter out messages that are either deleted for everyone or for the current user
      // response.data.StarMessageList = response.data.StarMessageList.filter(
      //   (starMessage) =>
      //     starMessage.Chat.delete_from_everyone == false && // Exclude messages deleted for everyone
      //     !starMessage.Chat.delete_for_me.includes(userData.user_id.toString()), // Exclude messages deleted for the current user
      // );
      return response.data;
    },
    {
      // Set cache time to prevent re-fetching on route changes
      staleTime: Infinity, // Data will never be considered stale
      cacheTime: Infinity, // Data will never be removed from cache
    },
  );
};
