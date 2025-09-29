import React from "react";
import { useAppSelector } from "../../../../utils/hooks";

export default function IfGropIsBlockedByAdmin() {
  const currentConversationData = useAppSelector(
    (state) => state.CurrentConversation,
  );

  return (
    <div className="grid h-14 w-full place-content-center bg-messageHead">
      <div> Group is Blocked by Admin </div>
    </div>
  );
}
