import React from "react";

interface StatusProfileProps {
  profile_url: string;
  time: string;
  name: string;
  classes?: string;
}

export default function StatusProfile({
  name,
  profile_url,
  time,
  classes,
}: StatusProfileProps) {
  return (
    <div
      onClick={() => {
        // handleAddChat(e);
        // dispatch(setShowChatSidebar(false));
      }}
      //   key={e.id}
      className=" flex items-center cursor-pointer px-3 py-4"
    >
      <img
        src={profile_url}
        className={`h-10 w-10 2xl:h-14 2xl:w-14 rounded-full object-cover mr-3 border-2 p-1 ${classes}`}
        alt=""
      />
      <div>
        <div className="capitalize text-base font-medium text-darkText">
          {name}
        </div>

        <div className="flex gap-x-1 items-center">
          {/* <LiaCheckDoubleSolid className="text-lg text-primary" /> */}
          <div className="text-lightText line-clamp-1 text-[13px] w-full max-w-[12.5rem] flex gap-x-1 ">
            <span className="w-full line-clamp-1">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
