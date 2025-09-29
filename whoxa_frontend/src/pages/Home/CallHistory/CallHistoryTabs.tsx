import { useState } from "react";

import MessageBody from "../MessageList/MessageBody";
import { useAppSelector } from "../../../utils/hooks";
import AllCallsHIstory from "./AllCallsHIstory";
import { useTheme } from "../../../context/ThemeProvider";
import MissedCallHIstory from "./MissedCallHIstory";

export default function CallHistoryTabs() {
  const [selectedTab, setSelectedTab] = useState(0);
  const ConnectedUser = useAppSelector((state) => state.ConnectedUser);
  const { theme } = useTheme();

  return (
    <div className="max-h-[90dvh] w-full">
      <div className="mb-3 flex w-full flex-col items-center gap-4 sm:mb-10 sm:justify-between">
        <div className="mt-2 flex w-full justify-center gap-4 bg-secondary px-2 py-2 lg:gap-6">
          <div
            onClick={() => {
              setSelectedTab(0);
            }}
            className={`p-2 ${
              selectedTab == 0 ? "primary-gradient" : ""
            } flex w-40 cursor-pointer items-center justify-center gap-2 rounded-lg text-center text-sm font-medium`}
          >
            <img
              className="h-5"
              src={`${
                selectedTab == 0
                  ? "/LightIcons"
                  : theme == "dark"
                    ? "/DarkIcons"
                    : "/LightIcons"
              }/call.png`}
              alt=""
            />
            <span className="w-fit">All Calls</span>
          </div>
          <div
            onClick={() => {
              setSelectedTab(1);
            }}
            className={`p-2 ${
              selectedTab == 1 ? "primary-gradient" : ""
            } flex w-40 cursor-pointer items-center justify-center gap-2 rounded-lg text-center text-sm font-medium`}
          >
            <img
              className="h-5"
              src={`${
                selectedTab == 1
                  ? "/LightIcons"
                  : theme == "dark"
                    ? "/DarkIcons"
                    : "/LightIcons"
              }/call.png`}
              alt=""
            />
            <span className="w-fit">Missed Call</span>
          </div>
        </div>

        {selectedTab == 0 && <AllCallsHIstory />}

        {selectedTab == 1 && <MissedCallHIstory />}
      </div>
    </div>
  );
}
