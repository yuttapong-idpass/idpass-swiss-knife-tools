import "./App.css";
import React, { useEffect } from "react";
import { Routes, Route, Link, BrowserRouter, Navigate } from "react-router-dom";
import { setupFirebase } from "./utils/firebase";
import Home from "./components/Home/Home";
import Menu from "./components/Menu/Menu";
import JsonPretty from "./components/JsonPretty/JsonPretty";
import FromBase64 from "./components/FromBase64/FromBase64";
import JsonWebToken from "./components/JsonWebToken/JsonWebToken";
import IdCardGenerator from "./components/IdCardGenerator/IdCardGenerator";
import MockIdCard from "./components/MockIdCard/MockIdCard";
import Sidebar, { SidebarItem } from "./components/SideBar/SideBar";

import { FaHome } from "react-icons/fa";
import { TbJson } from "react-icons/tb";
import { BsImage, BsPersonVcard, BsKey } from "react-icons/bs";
import { MdOutlineSecurity } from "react-icons/md";

import JsonWebTokenIcon from "./assets/images/svg/json-web-token.svg";

function App() {
  const menuList = [
    {
      name: "Json pretty",
      active: false,
      icon: <TbJson size={20} />,
      link: "/json-editor",
    },
    {
      name: "Base64 to image",
      active: false,
      icon: <BsImage size={20} />,
      link: "/base64Image",
    },
    {
      name: "JWT",
      active: false,
      icon: <BsKey size={20} />,
      link: "/jwt",
    },
    {
      name: "Thai id card random",
      active: false,
      icon: <BsPersonVcard size={20} />,
      link: "/id-card-random",
    },
  ];

  useEffect(() => {
    setupFirebase();
  }, []);

  return (
    <>
      <div className="flex">
        <BrowserRouter>
          <Sidebar>
            {/* <hr className="my-3" /> */}
            {menuList.map((item, index) => (
              <Link to={item.link} key={index}>
                <SidebarItem icon={item.icon} text={item.name} />
              </Link>
            ))}
          </Sidebar>
          <Routes>
            <Route path="/" element={<JsonPretty />} />
            <Route path="/json-editor" element={<JsonPretty />} />
            <Route path="/base64Image" element={<FromBase64 />} />
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
