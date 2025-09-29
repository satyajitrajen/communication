import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeProvider";
import ReusableProfileCard from "./Profile/ReusableProfileCard";
import { FaAngleRight } from "react-icons/fa6";

const ThemeToggleFromSettings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-lg border border-borderColor px-5 py-2 2xl:py-3"
      onClick={() => {
        toggleTheme();
      }}
    >
      <div className="flex items-center gap-3">
        {theme === "light" ? (
          <img className="h-6" src="/LightIcons/moon.png" alt="" />
        ) : (
          <img className="h-6" src="/DarkIcons/sun.png" alt="" />
        )}
        <div>{theme === "light" ? "Dark" : "Light"}</div>
      </div>

      <FaAngleRight className="text-lg" />
    </div>
  );
};

export default ThemeToggleFromSettings;
