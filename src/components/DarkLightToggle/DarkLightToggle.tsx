import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../providers/ThemeProvider";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from 'next-themes'; 

import "./DarkLightToggle.css";
type Props = {};

const DarkLightToggle = (props: Props) => {
  // const { theme, setTheme } = useContext(ThemeContext);
  // const toggleTheme = () => {
  //   setTheme && setTheme(isDark ? "light" : "dark");
  // };

  const [ mounted, setMounted ] = useState(false);
  // const [ toggle, setToggle ] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => { 
    setMounted(true);
  }, []);

  const toggleTheme = () => { 
      setTheme(isDark ? 'light' : 'dark')   
  }

  return (
    // <div className="flex flex-row gap-4 justify-content items-center">
    //   <div>
    //     <span className="text-gray-600 dark:text-gray-300">
    //       <MdLightMode size={20} />
    //     </span>
    //   </div>
    //   <div className="toggle">
    //     <input
    //       readOnly
    //       type="checkbox"
    //       id="toggle"
    //       value="dark"
    //       checked={isDark}
    //       onClick={() => setTheme && setTheme(isDark ? "light" : "dark")}
    //     />
    //     <label htmlFor="toggle"></label>
    //   </div>
    //   <div>
    //     <span className="text-gray-600 dark:text-gray-300">
    //       <MdDarkMode size={20} />
    //     </span>
    //   </div>
    // </div>
    
    <div className="flex flex-row gap-4">
      <button className="text-default-800" onClick={toggleTheme}>
        {isDark ? <MdLightMode size={30} /> : <MdDarkMode size={30} />}
      </button>
    </div>
  );
};

export default DarkLightToggle;
