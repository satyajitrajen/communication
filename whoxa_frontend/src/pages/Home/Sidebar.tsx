// @ts-nocheck

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ThemeToggleButton from "./ThemeToggle";
import { useTheme } from "../../context/ThemeProvider";
import { useState } from "react";
import LogoutModal from "./Settings/LogOutModal";
import { removeMessageList } from "../../store/Slices/MessageListSlice";
import { useAppDispatch } from "../../utils/hooks";
import { useWebsiteSettings } from "../../store/api/useWebsiteSettings";

export default function Sidebar() {
  const { theme } = useTheme();
  let dispatch = useAppDispatch();
  let location = useLocation();
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  let { data: websiteSettings } = useWebsiteSettings();

  return (
    <>
      <div className="fixed hidden h-screen min-w-24 flex-col justify-between bg-primary py-10 text-darkText shadow-xl lg:flex 2xl:min-w-28">
        <div className="bgGradient flex flex-col items-center gap-7">
          <img
            src={`${websiteSettings?.settings[0].website_logo}`}
            className="mb-10 h-14 w-14 object-contain"
            alt=""
          />
          <NavLink to={"/profile"} className="cursor-pointer">
            {location.pathname === "/profile" ? (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/profile_selected.png`}
                alt=""
              />
            ) : (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/profile.png`}
                alt=""
              />
            )}
          </NavLink>
          <NavLink
            onClick={() => {
              // To clear the previous conversation messages
              if (location.pathname != "/chat") {
                // This was causing the unexpected issues ======================================================================
                // dispatch(removeMessageList());
              }
            }}
            to={"/chat"}
            className="cursor-pointer"
          >
            {location.pathname === "/chat" ? (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/chat_selected.png`}
                // src="/LightIcons/chat_selected.png"
                alt=""
              />
            ) : (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/chat.png`}
                alt=""
              />
            )}
          </NavLink>
          <NavLink to={"/status"} className="cursor-pointer">
            {location.pathname === "/status" ? (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/status_selected.png`}
                alt=""
              />
            ) : (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/status.png`}
                alt=""
              />
            )}
          </NavLink>
          <NavLink to={"/contact-list"} className="cursor-pointer">
            {location.pathname === "/contact-list" ? (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/contact_selected.png`}
                alt=""
              />
            ) : (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/contact.png`}
                alt=""
              />
            )}
          </NavLink>
          <NavLink to={"/call-history"} className="cursor-pointer">
            {location.pathname === "/call-history" ? (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/call_selected.png`}
                alt=""
              />
            ) : (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/call.png`}
                alt=""
              />
            )}
          </NavLink>
          <NavLink to={"/setting"} className="cursor-pointer">
            {location.pathname === "/setting" ? (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/setting_selected.png`}
                alt=""
              />
            ) : (
              <img
                className="h-7"
                src={`${
                  theme === "dark" ? "/DarkIcons" : "/LightIcons"
                }/setting.png`}
                alt=""
              />
            )}
          </NavLink>
        </div>
        <div className="flex flex-col items-center gap-7">
          <ThemeToggleButton />
          <LogoutModal
            isOpen={showLogOutModal}
            setIsOpen={setShowLogOutModal}
          />
          <button
            onClick={() => {
              setShowLogOutModal(true);
            }}
          >
            <img
              className="h-7"
              src={`${
                theme === "dark" ? "/DarkIcons" : "/LightIcons"
              }/logout.png`}
              alt=""
            />
          </button>
        </div>
      </div>
      <div className="hidden min-w-24 lg:flex 2xl:min-w-28"></div>
    </>
  );
}
