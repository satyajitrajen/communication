import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeProvider";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="flex items-center gap-2" onClick={toggleTheme}>
      {theme === "light" ? (
        <img className="h-7" src="/LightIcons/moon.png" alt="" />
      ) : (
        <img className="h-7" src="/DarkIcons/sun.png" alt="" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
