import { createContext, useContext, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDown,
  FaAngleUp,
} from "react-icons/fa";
import DarkLightToggle from "../DarkLightToggle/DarkLightToggle";
import { Link } from "react-router-dom";

import Tools from "../../assets/images/tools.png";
import BeeTools from "../../assets/images/bee.png";
import "./SideBar.css";

type Props = {
  children: any;
};

type SidebarProps = {
  title: string;
  active: boolean;
  menuLists: any;
  keyNumber: number;
  onHandlerActive?: any;
  onLink?: any;
};

const SidebarContext = createContext(false);

export default function Sidebar({ children }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <>
      <aside className="h-screen test-sticky bg-content2">
        <nav className="h-full flex flex-col shadow-xs border-rd border-default-100 overflow-y-auto">
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              title="logo"
              src={BeeTools}
              className={`overflow-hidden transition-all ${
                expanded ? "w-12" : "w-0"
              }`}
            />

            {expanded ? (
              <div>
                <span className="text-default-800 dark:text-warning text-lg font-extrabold">
                  Buzz Tools
                </span>
                <p className="text-default-800 text-sm">
                  tools for developer
                </p>
              </div>
            ) : null}

            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-content4"
            >
              {expanded ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>

          <SidebarContext.Provider value={expanded}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          <div className="border-t dark:border-default-100 flex p-3">
            <div
              className={`flex justify-center items-center overflow-hidden transition-all ${
                expanded ? "w-52 ml-3" : "w-0"
              } `}
            >
              <div className="flex flex-row leading-4 gap-4 justify-center place-items-center">
                <div>
                  <span className="text-md  text-default-800">
                    v.1.5.1-beta.1
                  </span>
                </div>
                <div >
                  <DarkLightToggle />
                </div>
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

  const onCollapse = (idx: any) => {
    props.onHandlerActive(idx);
  };

  const onClickLink = (link: string) => {
    props.onLink(link);
  };

  return (
    <li
      className={`relative flex flex-col items-center py-1 px-1 my-1 font-medium rounded-md cursor-pointer transition-colors group`}
    >
      <button
        title="Button"
        type="button"
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-1" : "w-0"
        } flex items-center`}
        onClick={() => onCollapse(props.keyNumber)}
      >
        <div className="shrink-0">
          <span className="text-gray-600 dark:text-gray-400 text-xs">
            {props.title}
          </span>
        </div>
        <span className="flex-1 ml-3"></span>
        <div className="shrink-0">
          {props.active ? (
            <FaAngleDown
              className="text-gray-600 dark:text-gray-400"
              size={20}
            />
          ) : (
            <FaAngleUp className="text-gray-500 dark:text-gray-300" size={20} />
          )}
        </div>
      </button>
      {expanded ? (
        <>
          {props.active ? (
            <div className={`w-full`}>
              {props.menuLists.map((item: any, index: any) => (
                <Link to={item.link} key={index}>
                  <div className="flex flex-row p-2 text-default-800 rounded-md">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="ml-3 text-sm">
                      {expanded ? item.name : ""}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </li>
  );
}
