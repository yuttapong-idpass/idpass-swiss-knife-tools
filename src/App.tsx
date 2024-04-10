import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
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
import { BsImage, BsPersonVcard, BsKey, BsFileEarmarkDiff } from "react-icons/bs";
import { MdOutlineSecurity } from "react-icons/md";

import JsonWebTokenIcon from "./assets/images/svg/json-web-token.svg";
import JsonDiff from "./container/JsonDiff/JsonDiff";

function App() {
  let menuList = [
    {
      id: 1,
      title: "Development",
      active: true,
      menuLists: [
        {
          name: "JSON EDITOR",
          icon: <TbJson size={20} />,
          active: true,
          link: "/json-editor",
        },
        { 
          name: 'JSON DIFF',
          icon: <BsFileEarmarkDiff size={20} />,
          active: true,
          link: '/json-diff'
        }
      ],
    },
    {
      id: 2,
      title: "Crypto",
      active: true,
      menuLists: [
        {
          name: "JWT Parser",
          icon: <BsKey size={20} />,
          active: true,
          link: "/jwt",
        },
      ],
    },
    {
      id: 3,
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
      id: 4,
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

  const [items, setItems] = useState(menuList);

  useEffect(() => {
    // setupFirebase();
  }, []);

  const onActiveMenu = (idxItem: number) => {
    console.log("idxItem", idxItem);
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === idxItem ? { ...item, active: !item.active } : item
      )
    );
  };

  const onLinks = (link: string) => {
    // <Link to={link}></Link>;
    console.log('link ->', link);
  };

  return (
    <>
      <div className="flex dark:bg-dark-bg">
        <BrowserRouter>
          <Sidebar>
            {items.map((item, index) => (
              // deepcode ignore ReactMissingArrayKeys: <please specify a reason of ignoring this>
              <SidebarItem
                title={item.title}
                active={item.active}
                menuLists={item.menuLists}
                keyNumber={item.id}
                onLink={onLinks}
                onHandlerActive={onActiveMenu}
              />
            ))}
          </Sidebar>
          <Routes>
            <Route path="/" element={<JsonPretty />} />
            <Route path="/json-editor" element={<JsonPretty />} />
            <Route path="/json-diff" element={<JsonDiff />} />
            <Route path="/base64Image" element={<Base64Image />} />
            <Route path="/jwt" element={<JsonWebToken />} />
            <Route path="/id-card-random" element={<IdCardGenerator />} />
            <Route path="/mock-up" element={<MockIdCard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
