import { createContext, useContext, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";
import DarkLightToggle from "../DarkLightToggle/DarkLightToggle";

import Tools from "../../assets/images/tools.png";
import "./SideBar.css";

type Props = {
  children: any;
};

type SidebarProps = {
  // icon: any;
  // text: string;
  // link?: any;
  // active?: boolean;
  // alert?: boolean;
  title: string;
  active: boolean;
  menuLists: any;
  indexItem?: number;
  onHandlerActive?: any;
};

type ItemProps = {};

const SidebarContext = createContext(false);

export default function Sidebar({ children }: Props) {
  const [expanded, setExpanded] = useState(false);




  return (
    <>
      <aside className="h-screen test-sticky bg-secondary">
        <nav className="h-full flex flex-col shadow-sm border-r dark:border-primary overflow-y-auto">
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
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export function SidebarItem(props: SidebarProps) {
  const expanded = useContext(SidebarContext);



  const onCollapse = (activeStatus: any, idx: any) => {
    
    props.onHandlerActive(activeStatus = !activeStatus, idx);
  }

  return (
    <li
      // className={`relative flex flex-col items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
      //   active
      //     ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-gray-800"
      //     : ""
      // }`}
      className={`relative flex flex-col items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group`}
    >
      {/* <span className="text-primary">{props.indexItem}</span> */}
      {/* <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-1" : "w-0"
        }`}
      >
        <div className="flex flex-row justify-between">
          <span className="self-start">{icon}</span>
          <span>{expanded ? text : ""}</span>
          <span>
          </span>
        </div>
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )} */}

      {/* {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-gray-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )} */}

      <button
        title="Button"
        type="button"
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-1" : "w-0"
        } flex items-center`}
        onClick={() => onCollapse(props.active, props.indexItem)}
      >
        <div className="flex-shrink-0">
          <span className="text-gray-500 dark:text-gray-300 text-xs">
            {props.title} {JSON.stringify(props.active)}
          </span>
        </div>
        <span className="flex-1 ml-3"></span>
        <div className="flex-shrink-0">
          {props.active ? (
            <FaAngleDown
              className="text-gray-500 dark:text-gray-300"
              size={20}
            />
          ) : (
            <FaAngleUp className="text-gray-500 dark:text-gray-300" size={20} />
          )}
        </div>
      </button>
      {expanded ? (
        <div>
          {props.active ? (
            <ul
              id="example-dropdown"
              className={`overflow-hidden transition-all ${
                expanded ? "w-52 ml-1" : "w-0"
              } flex flex-row justify-items-center w-full rounded-md text-primary`}
            >
              {props.menuLists.map((item: any, index: any) => (
                <div className="flex flex-row p-2 hover:bg-primary w-full" key={index}>
                  <li className="flex-shrink-0">{item.icon}</li>
                  <li className="ml-5">{expanded ? item.name : ""}</li>
                </div>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
