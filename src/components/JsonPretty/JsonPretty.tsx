import React from "react";
import FloppyDisk from "../../assets/images/floppy-disk.png";
import FullScreen from "../../assets/images/full-screen.png";

import { JSONTree } from 'react-json-tree';
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

const json = { hello: "world", Test: ["hello"] };

const test = JSON.stringify(json, undefined, 4);

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

  const handleValue = (event$: any) => {
    console.log("$event -->", event$.target.value);
    try {
    } catch (error) {}
  };

  const handleClick = () => {};

  return (
    <div>
      <div className="flex flex-col">
        <div className="h-screen">
          <div className=" bg-gray-900" style={{ height: "5%" }}>
            <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
              <div className="flex items-center flex-shrink-0 text-white mr-6">
                <img
                  src={FloppyDisk}
                  className="fill-current h-8 w-8 mr-2 p-1"
                />
                <img
                  src={FullScreen}
                  className="fill-current h-8 w-8 mr-2 p-1"
                />
              </div>
            </nav>
          </div>
          <div className="" style={{ height: "42%" }}>
            <textarea
              className="w-full h-full resize-none p-2"
              placeholder="Input here ..."
              onChange={handleValue}
            ></textarea>
          </div>

          <div className="border" style={{ height: "6%" }}>
            <button onClick={() => {
                dispatch((increase()))
              }}>Count</button>
          </div>

          <div className="bg-gray-900" style={{ height: "6%" }}>
            <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
              <div className="flex items-center flex-shrink-0 text-white mr-6">
                <img
                  src={FloppyDisk}
                  className="fill-current h-8 w-8 mr-2 p-1"
                />
                <img
                  src={FullScreen}
                  className="fill-current h-8 w-8 mr-2 p-1"
                />
              </div>
            </nav>
          </div>
          <div className="text-output" style={{ height: "42%" }}>
            {counterReducer.counter}
            {/* { props.isJsonPretty ? <JsonPretty isTreeView={false} /> : null} */}
            { props.isTreeView ? <JSONTree data={json} theme={theme} /> : <pre>{JSON.stringify(json, null, 2)}</pre> }
            {}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonPretty;
