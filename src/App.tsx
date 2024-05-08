import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import Home from "./container/Home/Home";
import Menu from "./container/Menu/Menu";
import IdCardGenerator from "./container/Generator/RandomThaiIdCard/RandomThaiIdCard";
import Sidebar, { SidebarItem } from "./components/SideBar/SideBar";

import { FaBarcode } from "react-icons/fa";
import { TbJson } from "react-icons/tb";
import {
  BsImage,
  BsPersonVcard,
  BsKey,
  BsFileEarmarkDiff,
} from "react-icons/bs";
import { TbNetwork } from "react-icons/tb";
import { PiBracketsCurly } from "react-icons/pi";
import { PiBracketsAngleBold } from "react-icons/pi";

import BarCodeGenerator from "./container/Generator/BarCodeGenerator/BarCodeGenerator";
import JsonPretty from "./container/Development/JsonPretty/JsonPretty";
import Base64Image from "./container/Convertor/Base64Image/Base64Image";
import JsonWebToken from "./container/Crypto/JsonWebToken/JsonWebToken";
// import MockIdCard from "./container/Development/MockIdCard/MockIdCard";
import Differ from "./container/Development/Differ/Differ";
import PublicIP from "./container/Network/PublicIP";
import XMLJson from "./container/Development/XMLJson/XMLJson";
import XMLPretty from "./container/Development/XMLPretty/XMLPretty";

function App() {
  let menuList = [
    {
      id: 1,
      title: "Development",
      active: true,
      menuLists: [
        {
          name: "Json Pretty",
          icon: <TbJson size={20} />,
          active: true,
          link: "/json-pretty",
        },
        {
          name: "Differ",
          icon: <BsFileEarmarkDiff size={20} />,
          active: true,
          link: "/differ",
        },
        {
          name: "XML To Json",
          icon: <PiBracketsCurly size={20} />,
          active: true,
          link: "/xml-to-json",
        },
        {
          name: 'XML Pretty',
          icon: <PiBracketsAngleBold size={20} />,
          active: true,
          link: '/xml-pretty'
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
          name: "Base64 Image",
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
          name: "Random Id Card",
          icon: <BsPersonVcard size={20} />,
          link: "/id-card-random",
        },
        {
          name: "Barcode",
          icon: <FaBarcode size={20} />,
          active: true,
          link: "/barcode-generator",
        },
      ],
    },
    {
      id: 5,
      title: "Network",
      active: true,
      menuLists: [
        {
          name: "My IP Address",
          icon: <TbNetwork size={20} />,
          active: true,
          link: "/public-ip",
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
    console.log("link ->", link);
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
                key={index}
              />
            ))}
          </Sidebar>
          <Routes>
            <Route path="/" element={<JsonPretty />} />
            <Route path="/json-pretty" element={<JsonPretty />} />
            <Route path="/differ" element={<Differ />} />
            <Route path="/xml-to-json" element={<XMLJson />} />
            <Route path="/xml-pretty" element={<XMLPretty />} />
            <Route path="/base64Image" element={<Base64Image />} />
            <Route path="/jwt" element={<JsonWebToken />} />
            <Route path="/id-card-random" element={<IdCardGenerator />} />
            {/* <Route path="/mock-up" element={<MockIdCard />} /> */}
            <Route path="/barcode-generator" element={<BarCodeGenerator />} />
            <Route path="/public-ip" element={<PublicIP />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
