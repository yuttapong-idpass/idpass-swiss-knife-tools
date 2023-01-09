import React, { useState } from "react";
import JsonPretty from "../JsonPretty/JsonPretty";
import FromBase64 from "../FromBase64/FromBase64";
import JWTEncodeDecode from "../JWTEncodeDecode/JWTEncodeDecode";

import "./Home.css";

type Props = {};

const Home = (props: Props) => {
  const menu = [
    {
      name: "JSON PRETTY",
      disabled: false,
    },
    {
      name: "BASE 64 IMAGE",
      disabled: false,
    },
    {
      name: "JWT ENCODE/DECODE",
      disabled: true,
    },
  ];

  const [active, setActive] = useState("JSON PRETTY");

  const activeButton = (item: any) => {
    setActive(item);
  };

  const renderComponent = (name: string): any => {
    switch (name) {
      case "JSON PRETTY":
        return <JsonPretty />;
      case "BASE 64 IMAGE":
        return <FromBase64 />;
      case "JWT ENCODE/DECODE":
        return <JWTEncodeDecode />;

      default:
        <h1>Page not found</h1>;
    }
  };

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

    <div className="grid place-items-center h-screen p-4">
      <div className="flex flex-row">
        <div className="p-4">
          <div className="grid grid-rows-4 grid-flow-col gap-4">
            <div >
              <div className="max-w-sm w-72 p-2 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-100 dark:border-gray-700">
                <svg
                  className="w-10 h-10 mb-2 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                    clip-rule="evenodd"
                  ></path>
                  <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"></path>
                </svg>
                <a href="#">
                  <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-800">
                    Need a help in Claim?
                  </h5>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
