import React, { useContext } from "react";
import { MdDarkMode } from "react-icons/md";
import { ThemeContext } from "../../providers/ThemeProvider";

import "./DarkLightToggle.css";
type Props = {};

const DarkLightToggle = (props: Props) => {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  return (
    <div className="flex flex-row gap-4 justify-content items-center">
      <div>
        <span className="text-gray-600 dark:text-gray-300">Light</span>
      </div>
      <div className="toggle">
        <input
          type="checkbox"
          id="toggle"
          value="dark"
          checked={isDark}
          onClick={() => setTheme && setTheme(isDark ? "light" : "dark")}
        />
        <label htmlFor="toggle"></label>
      </div>
      <div>
        <span className="text-gray-600 dark:text-gray-300">Dark</span>
      </div>
    </div>
  );
};

export default DarkLightToggle;
