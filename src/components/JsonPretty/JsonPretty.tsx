import React, { useState } from "react";
import FloppyDisk from "../../assets/images/floppy-disk.png";
import FullScreen from "../../assets/images/full-screen.png";
import RawData from "../../assets/images/raw-extension.png";
import Json from "../../assets/images/code.png";

import { JSONTree } from "react-json-tree";
import { useSelector } from "react-redux";
import {
  jsonPrettySelector,
  inputJson,
} from "./../../store/slice/JsonPrettySlice";
import { counterSelector, increase } from "../../store/slice/counterSlice";
import { useAppDispatch } from "../../store/store";

import "./JsonPretty.css";

type Props = {
  isTreeView: boolean;
};

const theme = {
  scheme: "monokai",
  author: "wimer hazenberg (http://www.monokai.nl)",
  base00: "#272822",
  base01: "#383830",
  base02: "#49483e",
  base03: "#75715e",
  base04: "#a59f85",
  base05: "#f8f8f2",
  base06: "#f5f4f1",
  base07: "#f9f8f5",
  base08: "#f92672",
  base09: "#fd971f",
  base0A: "#f4bf75",
  base0B: "#a6e22e",
  base0C: "#a1efe4",
  base0D: "#66d9ef",
  base0E: "#ae81ff",
  base0F: "#cc6633",
};

const JsonPretty = (props: Props) => {
  const jsonPrettyReducer = useSelector(jsonPrettySelector);
  const counterReducer = useSelector(counterSelector);
  const dispatch = useAppDispatch();

  const [jsonArea, setJsonArea] = useState({});
  const [isTreeView, setTreeView] = useState(true);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");

  const handleValue = (event$: any) => {
    try {
      let setting = JSON.parse(event$.target.value);
      setJsonArea(setting);
      setIsError(false);
    } catch (error: any) {
      setIsError(true);
      setMessageError(String(error));
      setJsonArea({});
    }
  };

  const handleClick = () => {
    const data: any = jsonArea;
    if (isError) {
      dispatch(
        inputJson({ item: {}, isError: true, messageError: messageError })
      );
    } else {
      dispatch(inputJson({ item: data, isError: false, messageError: "" }));
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="h-screen">
          <div className="" style={{ height: "6%" }}>
            <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-1">
              <div className="flex items-center flex-shrink-0 text-white mr-6">
                {/* <svg
                  className="fill-current h-8 w-8 mr-2"
                  width="54"
                  height="54"
                  viewBox="0 0 54 54"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
                </svg>
                <span className="font-semibold text-xl tracking-tight">
                  Tailwind CSS
                </span> */}
                <img
                  src={FloppyDisk}
                  className="fill-current h-6 w-6 mr-2  cursor"
                  width={"50%"}
                  height={"50%"}
                />
                <img
                  src={FullScreen}
                  className="fill-current h-6 w-6 mr-2  cursor"
                  width={"50%"}
                  height={"50%"}
                />
              </div>
              <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow"></div>
                <div>
                  <input type="text" className="inline-block text-sm px-4 py-2 leading-none border rounded text-teal-500 border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0 mr-6" />
                  <a
                    href="#"
                    className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                  >
                    Download
                  </a>
                </div>
              </div>
            </nav>
          </div>
          <div className="" style={{ height: "41%" }}>
            <textarea
              className="w-full h-full resize-none p-2"
              placeholder="Input here ..."
              onChange={handleValue}
            ></textarea>
          </div>

          <div className="border" style={{ height: "6%" }}>
            <div className="flex flex-col items-center">
              <button
                className="justify-self-end bg-blue-500 hover:bg-blue-400 text-white font-bold mt-1 py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                onClick={handleClick}
              >
                Pretty
              </button>
            </div>
          </div>

          <div className="bg-gray-900" style={{ height: "6%" }}>
            <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
              <div className="flex items-center flex-shrink-0 text-white mr-6">
                <img
                  src={FloppyDisk}
                  className="fill-current h-8 w-8 mr-2 p-1 cursor"
                />
                <img
                  src={FullScreen}
                  className="fill-current h-8 w-8 mr-2 p-1 cursor"
                />
                <img
                  src={isTreeView ? RawData : Json}
                  className="fill-current h-8 w-8 mr-2 p-1 cursor"
                  onClick={() => {
                    setTreeView(!isTreeView);
                  }}
                />
              </div>
            </nav>
          </div>
          <div className="border text-output p-3" style={{ height: "42%" }}>
            {/* { props.isJsonPretty ? <JsonPretty isTreeView={false} /> : null} */}

            {jsonPrettyReducer.isError ? (
              <pre style={{ color: "red" }}>
                {jsonPrettyReducer.messageError}
              </pre>
            ) : (
              <div>
                {isTreeView ? (
                  <JSONTree data={jsonPrettyReducer.item} theme={theme} />
                ) : (
                  <pre id="jsonArea">
                    {JSON.stringify(jsonPrettyReducer.item, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonPretty;
