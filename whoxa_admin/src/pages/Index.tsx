import React, { useEffect } from "react";
import Dropdown from "../components/Dropdown";
import IconHorizontalDots from "../components/Icon/IconHorizontalDots";
import IconEye from "../components/Icon/IconEye";
import TotalUserBox from "../components/Dashboard/TotalUserBox";
import TotalGroupBox from "../components/Dashboard/TotalGroupBox.";
import TotalAudioCall from "../components/Dashboard/TotalAudioCall";
import TotalVideoCall from "../components/Dashboard/ToatalVideoCall";
import NewUsersList from "../components/Dashboard/NewUsers";
import NewGroupList from "../components/Dashboard/NewGroup";
import WeeklyNewUserComponent from "../components/Dashboard/WeeklUser";
import CountryWiseUserData from "../components/Dashboard/CountryWiseUserData";
import MonthlyDataComponent from "../components/Dashboard/MonthlyDataComponent";
import CallChart from "../components/Dashboard/CallChart";
import ActiveUser from "../components/Dashboard/ActiveUserChart";
import { useWebsiteSettings } from "../store/api/useWebsiteSettings";
import changeFavicon from "../utils/changeFavicon";
import { Helmet } from "react-helmet";
import LoginTypeChart from "../components/Dashboard/LoginTypeChart";
import PlatformActivityChart from "../components/Dashboard/PlatformLoginChart";
import Last30hourUser from "../components/Dashboard/Last30hourUser";

function Index() {
  let { data: websiteSettings } = useWebsiteSettings();
  // To Set the favicon ==================================================================================
  useEffect(() => {
    if (!websiteSettings?.settings) {
      return;
    }
    changeFavicon(websiteSettings?.settings[0].website_logo);
  }, [websiteSettings]);

  return (
    <div>
      <Helmet>
        <title>
          {websiteSettings?.settings ? websiteSettings.settings[0].website_name : ""} | Admin
        </title>
      </Helmet>
      <div className=" text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 col-span-4 gap-6 mb-6">

          <TotalUserBox />
          <TotalGroupBox />
          <TotalAudioCall />
          <TotalVideoCall />
        </div>
        <MonthlyDataComponent />
        <div className="grid grid-cols-1 sm:grid-cols-4  col-span-4 gap-6 mb-6">
          {/* <LoginTypeChart className="col-span-2 panel my-3" /> */}
          <Last30hourUser />
          <PlatformActivityChart />


        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4  col-span-4 gap-6 mb-6">

          <NewGroupList />
          <NewUsersList className="" />


        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4  col-span-4 gap-6 mb-6">
          <ActiveUser />

        </div>
      
        <div className="grid grid-cols-1 sm:grid-cols-4  col-span-4 gap-6 mb-6">

          <WeeklyNewUserComponent />
          <CountryWiseUserData />
        </div>
        <CallChart />
      </div>
    </div>
  );
}

export default Index;
