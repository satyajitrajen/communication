import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeProvider";
import { useAppDispatch } from "../../utils/hooks";
import { useWebsiteSettings } from "../../store/api/useWebsiteSettings";
import { updateViewState } from "../../store/Slices/ViewManagerSlice";
import { resetCurrentConversation } from "../../store/Slices/CurrentConversationSlice";

export default function Bottombar() {
  // @ts-ignore
  const { theme } = useTheme();
  let dispatch = useAppDispatch();
  let location = useLocation();

  let { data: websiteSettings } = useWebsiteSettings();
  return (
    <div
      onClick={() => {
        dispatch(updateViewState({ show_chats_sidebar: true }));
        dispatch(resetCurrentConversation());
      }}
      className="bgGradient fixed bottom-0 z-50 flex w-full items-center justify-evenly bg-primary py-3 lg:hidden"
    >
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
            src={`${theme === "dark" ? "/DarkIcons" : "/LightIcons"}/chat.png`}
            alt=""
          />
        )}
      </NavLink>
      {/* <NavLink to={"/status"} className="cursor-pointer">
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
              </NavLink> */}
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
            src={`${theme === "dark" ? "/DarkIcons" : "/LightIcons"}/call.png`}
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
  );
}
