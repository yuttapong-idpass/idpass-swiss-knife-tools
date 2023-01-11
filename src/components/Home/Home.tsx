import React, { useState } from "react";
import JsonPretty from "../JsonPretty/JsonPretty";
import FromBase64 from "../FromBase64/FromBase64";
import JWTEncodeDecode from "../JWTEncodeDecode/JWTEncodeDecode";

import JSONImage from "../../assets/images/json.png";
import Base64Image from "../../assets/images/base-64.png";
import JwtImage from "../../assets/images/jwt.png";

import "./Home.css";
import { Link } from "react-router-dom";

type Props = {};

const Home = (props: Props) => {
  const menu = [
    {
      name: "JSON EDITOR",
      disabled: false,
      image: JSONImage,
      link: '/json-editor'
    },
    {
      name: "BASE 64 IMAGE",
      disabled: false,
      image: Base64Image,
      link: '/base64'
    },
    {
      name: "JSON WEB TOKEN",
      disabled: true,
      image: JwtImage,
      link: ''
    },
  ];

  const [active, setActive] = useState("JSON PRETTY");

  const activeButton = (item: any) => {
    setActive(item);
  };

  // const renderComponent = (name: string): any => {
  //   switch (name) {
  //     case "JSON PRETTY":
  //       return <JsonPretty />;
  //     case "BASE 64 IMAGE":
  //       return <FromBase64 />;
  //     case "JWT ENCODE/DECODE":
  //       return <JWTEncodeDecode />;

  //     default:
  //       <h1>Page not found</h1>;
  //   }
  // };

  return (
    // <div className="w-full">
    //   <div className="flex flex-row">
    //     <div className="basis-1/6 border-4">
    //       <div className="flex flex-col">
    //         <div className="h-screen">
    //           <div>
    //             {menu.map((item) => (
    //               <button
    //                 key={item.name}
    //                 className={
    //                   item.disabled
    //                     ? "button-66 button-66-disabled"
    //                     : active === item.name
    //                     ? "button-66 button-66-active"
    //                     : "button-66"
    //                 }
    //                 role="button"
    //                 disabled={item.disabled}
    //                 onClick={() => {
    //                   activeButton(item.name);
    //                 }}
    //               >
    //                 {item.name}
    //               </button>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="basis-full border-4">{renderComponent(active)}</div>
    //   </div>
    // </div>

    <div className="grid place-items-center h-screen">
      <div className="flex flex-row">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {menu.map((item) => (
              <Link to={item.link}>
                <div>
                <button
                  type="button"
                  className="font-bold text-neutral-700 text-white w-72 h-32 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2 bg-gray-300"
                >
                  <img className="w-14 h-14 mr-2 -ml-1" src={item.image} />
                  <span className="text-2xl">{item.name}</span>
                </button>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
