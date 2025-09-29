import React, { useEffect } from "react";
import { socketInstance } from "../socket/socket";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { updateMessageOptions } from "../store/Slices/MessageOptionsSlice";
import { useNavigate } from "react-router-dom";

export default function LoadInitialData() {
  const dispatch = useAppDispatch();
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );
  const userData = useAppSelector((state) => state.userData);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      userData.user_id >= 1 &&
      (userData.first_name == "" || userData.last_name == "")
    ) {
      navigate("/user-details");
    } else if (
      userData.user_id >= 1 &&
      (userData.profile_image == "" ||
        userData.profile_image.includes("/not-found-images/")) &&
      location.pathname != "/user-details"
    ) {
      navigate("/select-profile");
    }
  }, [userData]);

  useEffect(() => {
    socketInstance().emit("ChatList", {});
  }, []);

  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    socketInstance().emit("messageReceived", {
      conversation_id: currentConversationData.conversation_id,
      user_timezone: timeZone,
    });
    dispatch(
      updateMessageOptions({
        isMessageLoading: true,
      }),
    );
  }, [currentConversationData.conversation_id]);

  return <></>;
}
