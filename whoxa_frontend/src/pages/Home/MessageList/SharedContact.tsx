import React from "react";
import { MessageList } from "../../../types/MessageListType";
import { IoCallOutline } from "react-icons/io5";
import { useAppSelector } from "../../../utils/hooks";

// Define the props interface
interface SharedContactProps {
  messageData: MessageList;
}

// Define the functional component with the proper type
export default function SharedContact({ messageData }: SharedContactProps) {
  const userData = useAppSelector((state) => state.userData);

  return (
    <div className="">
      <div
        className={
          "mx-auto flex h-[70px] w-56 items-center justify-center gap-3 rounded-lg bg-secondary p-1 text-darkText"
        }
      >
        <img
          src={`${messageData.shared_contact_profile_image || "/Profile_iamge/profile_image.png"}`}
          className="h-11 w-11 rounded-full"
          alt=""
        />

        <div className="flex flex-col gap-1">
          <div className="text-base">{messageData.shared_contact_name}</div>
          <div className="text-xs">{messageData.shared_contact_number}</div>
        </div>
      </div>
      {/* <div className="grid place-content-center min-h-8 font-medium">View Contact</div> */}
    </div>
  );
}
