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
    <div className="w-full">
      <div className="flex flex-row">
        <div className="basis-1/6 border-4">
          <div className="flex flex-col">
            <div className="h-screen">
              <div>
                {menu.map((item) => (
                  <button
                    key={item.name}
                    className={
                      item.disabled
                        ? "button-66 button-66-disabled"
                        : active === item.name
                        ? "button-66 button-66-active"
                        : "button-66"
                    }
                    role="button"
                    disabled={item.disabled}
                    onClick={() => {
                      activeButton(item.name);
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="basis-full border-4">{renderComponent(active)}</div>
      </div>
    </div>
  );
};

export default Home;
