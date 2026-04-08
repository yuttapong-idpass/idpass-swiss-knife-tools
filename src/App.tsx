import "./App.css";
import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import Home from "./container/Home/Home";
import Menu from "./container/Menu/Menu";
import IdCardGenerator from "./container/Generator/RandomThaiIdCard/RandomThaiIdCard";
// import Sidebar, { SidebarItem } from "./components/SideBar/SideBar";

import { FaBarcode } from "react-icons/fa";
import { TbJson } from "react-icons/tb";
import {
  BsImage,
  BsPersonVcard,
  BsKey,
  BsFileEarmarkDiff,
} from "react-icons/bs";
import { PiBracketsCurly } from "react-icons/pi";
import { PiBracketsAngleBold } from "react-icons/pi";
import { LuBinary } from "react-icons/lu";
import { SidebarProvider } from "./components/ui/sidebar";
import SideBarMenu from "./components/SidebarMenu/SideBarMenu";
import TextCompare from "@/features/formatter/components/TextCompare/TextCompare";
import XMLToJson from "@/container/Formatter/XmlToJson/XMLJson";
import JsonFormatter from "@/features/formatter/components/JsonFormatter/JsonFormatter";
import ResultCompare from "./features/formatter/components/TextCompare/ResultCompare";
import Differ from "./features/formatter/components/TextCompare/Differ";
import XMLToJSON from "./features/formatter/components/XmlTojson/XmlTojson";
import XMLFormatter from "./features/formatter/components/XmlFormatter/XmlFormatter";
import EncodedDecodedURI from "./features/encoding/components/EncodedDecodedURI";
import KibanaLogExtractor from "./features/utilities/components/KibanaLogExtractor";
import JWTDecoder from "./features/encoding/components/jwt";

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
          name: "XML Pretty",
          icon: <PiBracketsAngleBold size={20} />,
          active: true,
          link: "/xml-pretty",
        },
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
          link: "/jwt-decoder",
        },
        {
          name: "Encode/Decoded",
          icon: <LuBinary size={20} />,
          active: true,
          link: "/encoded-decoded",
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
          link: "/barcode",
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
        item.id === idxItem ? { ...item, active: !item.active } : item,
      ),
    );
  };

  const onLinks = (link: string) => {
    // <Link to={link}></Link>;
    console.log("link ->", link);
  };

  return (
    <>
      <div className="flex flex-row dark:bg-dark-bg">
        <BrowserRouter>
          {/* <Sidebar>
            {items.map((item, index) => (
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
          </Sidebar> */}
          <SidebarProvider>
            <SideBarMenu />
            <Routes>
              <Route path="/" element={<JsonFormatter />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
              <Route path="/text-compare" element={<TextCompare />}>
                <Route index element={<Differ />} />
                <Route path="differ" element={<Differ />} />
                <Route path="result-compare" element={<ResultCompare />} />
              </Route>
              <Route path="/xml-to-json" element={<XMLToJSON />} />
              <Route path="/xml-formatter" element={<XMLFormatter />} />
              <Route path="/jwt-decoder" element={<JWTDecoder />} />
              <Route
                path="/encoded-decoded-url"
                element={<EncodedDecodedURI />}
              />
              <Route
                path="/kibana-log-extractor"
                element={<KibanaLogExtractor />}
              />
              {/* <Route path="/base64Image" element={<Base64Image />} />
              <Route path="/jwt" element={<JsonWebToken />} />
              <Route path="/id-card-random" element={<IdCardGenerator />} />
              <Route path="/barcode" element={<BarCodeGenerator />} />
              <Route path="/encoded-decoded" element={<EncodedDecoded />} /> */}
              {/* <Route path="/mock-up" element={<MockIdCard />} /> */}
            </Routes>
          </SidebarProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
