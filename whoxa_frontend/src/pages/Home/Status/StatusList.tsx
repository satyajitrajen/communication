import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useTheme } from "../../../context/ThemeProvider";
// import ConversationList from "./ConversationList";
import NotViewedStatusList from "./NotViewedStatusList";
import ViewedStatusList from "./ViewedStatusList";
import { useStatusList } from "../../../store/api/useStatusList";
import MyStatus from "./MyStatus/MyStatus";
import { useAppSelector } from "../../../utils/hooks";
import { formatRelativeTime } from "../../../utils/formatUTCtoLocalDate";

export default function StatusList() {
  // @ts-ignore
  const { theme } = useTheme();
  const [tab, setTab] = useState<"not_viewed" | "viewed">("not_viewed");
  const userData = useAppSelector((state) => state.userData);
  // Fetch status list
  const { data } = useStatusList();
  return (
    <>
      <div className="flex h-screen min-w-80 flex-col bg-secondary pb-0 pt-16 shadow-inner 2xl:min-w-96">
        <div className="w-full px-4">
          <h4 className="mb-5 text-lg font-semibold">{userData.user_name}</h4>

          <MyStatus
            name="My Status"
            time={data?.myStatus?.Statuses[0]?.status_id ? `${formatRelativeTime(data?.myStatus?.Statuses[0]?.updatedAt)}` : "No Updates"}
            currentStatusId={data?.myStatus?.Statuses[0]?.status_id || 0}
          />
        </div>

        {/* <h4 className="text-lg font-semibold px-4">Status</h4> */}
        {/* Tabs */}
        <div className="mx-5 mb-3 mt-4 grid min-h-10 grid-cols-2 overflow-hidden rounded-lg border border-borderColor text-center">
          <div
            className={`cursor-pointer px-4 py-2 ${tab == "not_viewed" ? "primary-gradient" : "bg-primary"}`}
            onClick={() => {
              setTab("not_viewed");
            }}
          >
            Recent
          </div>
          <div
            className={`cursor-pointer px-4 py-2 ${tab == "viewed" ? "primary-gradient" : "bg-primary"}`}
            onClick={() => {
              setTab("viewed");
            }}
          >
            Viewed
          </div>
        </div>

        {/* <Seen Status /> */}
        {tab == "not_viewed" ? <NotViewedStatusList /> : <ViewedStatusList />}

        {/* Viewed Status /> */}
        {/* <h4 className="text-lg font-semibold px-4">Viewed</h4>
        <ViewedStatusList /> */}
      </div>
    </>
  );
}
