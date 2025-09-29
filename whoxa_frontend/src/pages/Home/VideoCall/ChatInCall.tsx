import React from "react";
import MessageBody from "../MessageList/MessageBody";
import SendMessage from "../MessageList/SendMessage/SendMessage";

export default function ChatInCall() {
  return (
    <div className="w-full max-w-[95%]">
      <div className="h-full lg:max-h-[80dvh]">
        <MessageBody />
      </div>
      <SendMessage />
    </div>
  );
}
