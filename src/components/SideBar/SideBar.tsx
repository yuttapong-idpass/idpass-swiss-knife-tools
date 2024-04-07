import { createContext, useContext, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DarkLightToggle from "../DarkLightToggle/DarkLightToggle";

import Tools from "../../assets/images/tools.png";
import "./SideBar.css";

type Props = {
  children: any;
};

type SidebarProps = {
  icon: any;
  text: string;
  link?: any;
  active?: boolean;
  alert?: boolean;
};

const SidebarContext = createContext(false);

export default function Sidebar({ children }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <aside className="h-screen test-sticky bg-secondary">
        <nav className="h-full flex flex-col shadow-sm border-r dark:border-primary">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              title="logo"
              src={Tools}
              className={`overflow-hidden transition-all ${
                expanded ? "w-12" : "w-0"
              }`}
            />

            {expanded ? (
              <span className="text-primary dark:text-warning font-bold">
                IDPASS TOOLS
              </span>
            ) : null}

            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>

          <SidebarContext.Provider value={expanded}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t dark:border-primary flex p-3">
            {/* <img
              title="profile"
              src={profile}
              className="w-10 h-10 rounded-md"
            /> */}
            <div
              className={`flex justify-center items-center overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              } `}
            >
              <div className="leading-4">
                {/* <h4 className="font-semibold">constGenius</h4>
                <span className="text-xs text-gray-600">
                  constgenius@gmail.com
                </span> */}
                <DarkLightToggle />
              </div>
              {/* <MoreVertical size={20} /> */}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export function SidebarItem({ icon, text, active, alert, link }: SidebarProps) {
  const expanded = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-gray-800"
          : "hover:bg-primary text-primary"
      }`}
    >
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-1" : "w-0"
        }`}
      >
        <div className="flex flex-row justify-between">
          <span className="self-start">{icon}</span>
          <span>{expanded ? text : ""}</span>
          <span>
            <svg
              sidebar-toggle-item
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
        </div>
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-gray-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
