import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, BrowserRouter, Navigate } from "react-router-dom";
import { setupFirebase } from "./utils/firebase";
import Home from "./container/Home/Home";
import Menu from "./container/Menu/Menu";
import JsonPretty from "./container/JsonPretty/JsonPretty";
import Base64Image from "./container/Base64Image/Base64Image";
import JsonWebToken from "./container/JsonWebToken/JsonWebToken";
import IdCardGenerator from "./container/RandomThaiIdCard/RandomThaiIdCard";
import MockIdCard from "./container/MockIdCard/MockIdCard";
import Sidebar, { SidebarItem } from "./components/SideBar/SideBar";

import { FaHome } from "react-icons/fa";
import { TbJson } from "react-icons/tb";
import { BsImage, BsPersonVcard, BsKey } from "react-icons/bs";
import { MdOutlineSecurity } from "react-icons/md";

import JsonWebTokenIcon from "./assets/images/svg/json-web-token.svg";

function App() {
  const [indexItem, setIndexItem] = useState(0);
  const [activeItem, setActiveItem] = useState(false);
  let menuList = [
    {
      title: "Crypto",
      active: true,
      menuLists: [
        {
          name: "JWT Parser",
          icon: <BsKey size={20} />,
          active: true,
          link: "/json-editor",
        },
      ],
    },
    {
      title: "Development",
      active: true,
      menuLists: [
        {
          name: "JSON EDITOR",
          icon: <TbJson size={20} />,
          active: true,
          link: "/json-editor",
        },
      ],
    },
    {
      title: "Convertor",
      active: true,
      menuLists: [
        {
          name: "BASE64 IMAGE",
          icon: <BsImage size={20} />,
          active: true,
          link: "/base64Image",
        },
      ],
    },
    {
      title: "Generator",
      active: true,
      menuLists: [
        {
          name: "RANDOM ID CARD",
          icon: <BsPersonVcard size={20} />,
          link: "/id-card-random",
        },
      ],
    },
  ];

  useEffect(() => {
    // setupFirebase();
  }, [activeItem, indexItem]);

  const onActiveMenu = (active: boolean, idxItem: number) => {
    setActiveItem(active);
    setIndexItem(idxItem);
    menuList[idxItem].active = active;
    console.log(menuList);
  };
  return (
    <>
      <div className="flex dark:bg-dark-bg">
        {/* <BrowserRouter>
          <Sidebar>
            {menuList.map((item, index) => (
              <Link to={item.link} key={index}>
                <SidebarItem icon={item.icon} text={item.name} />
              </Link>
            ))}
          </Sidebar>
          <Routes>
            <Route path="/" element={<JsonPretty />} />
            <Route path="/json-editor" element={<JsonPretty />} />
            <Route path="/base64Image" element={<Base64Image />} />
            <Route path="/jwt" element={<JsonWebToken />} />
            <Route path="/id-card-random" element={<IdCardGenerator />} />
            <Route path="/mock-up" element={<MockIdCard />} />
          </Routes>
        </BrowserRouter> */}
        <BrowserRouter>
          <Sidebar>
            {menuList.map((item, index) => (
              <Link to={""} key={index}>
                <SidebarItem
                  title={item.title}
                  active={item.active}
                  menuLists={item.menuLists}
                  indexItem={index}
                  // onClick={onActiveMenu(index)}
                  onHandlerActive={onActiveMenu}
                />
              </Link>
            ))}
          </Sidebar>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
