import React, { useState } from "react";
import FloppyDiskImage from "../../assets/images/floppy-disk.png";
import FullScreenImage from "../../assets/images/full-screen.png";
import ExitFullScreenImage from "../../assets/images/exit-fullscreen.png";
import CopyToClipboardImage from "../../assets/images/copy-to-clipboard.png";
import { useSelector } from "react-redux";
import {
  jsonPrettySelector,
  inputJson,
} from "./../../store/slice/JsonPrettySlice";
import { counterSelector, increase } from "../../store/slice/counterSlice";
import { useAppDispatch } from "../../store/store";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Highlighter from "react-highlight-words";
import "./JsonPretty.css";
import ReactJson from "react-json-view";

type Props = {
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

  const options = [
    { value: "tree", text: "tree" },
    { value: "text", text: "text" },
  ];

  const [jsonArea, setJsonArea] = useState({});
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [clickSearch, setClickSearch] = useState("");
  const [inputToggleFullScreen, setInputToggleFullScreen] = useState(false);
  const [outputToggleFullScreen, setOutputToggleFullScreen] = useState(false);
  const [selected, setSelected] = useState(options[0].value);

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

  const handleSearchClick = () => {
    setClickSearch(searchText);
  };

  const handleValueSearch = ($event: any) => {
    const getTextSearch = $event.target.value;
    setSearchText(getTextSearch);
  };

  const handleSelectOption = ($event: any) => {
    setSelected($event.target.value);
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="h-screen">
          <div className="border" style={{ height: "47%" }}>
            <div
              className={`flex flex-col h-full ${
                inputToggleFullScreen ? "myModal" : ""
              }`}
            >
              <div className="border">
                <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
                  <div className="flex items-center flex-shrink-0 text-white mr-6">
                    {/* <img
                      src={FloppyDiskImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      width={"50%"}
                      height={"50%"}
                    /> */}
                    <img
                      src={
                        inputToggleFullScreen
                          ? ExitFullScreenImage
                          : FullScreenImage
                      }
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      onClick={() => {
                        setInputToggleFullScreen(!inputToggleFullScreen);
                      }}
                    />
                  </div>
                </nav>
              </div>
              <div className="border grow">
                <textarea
                  id="inputText"
                  className="w-full h-full resize-none p-2"
                  placeholder="Input here ..."
                  onChange={handleValue}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="border" style={{ height: "6%" }}>
            <div className="flex flex-col items-center">
              <button
                className="justify-self-end bg-blue-500 hover:bg-blue-400 text-white font-bold mt-1 py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                onClick={handleClick}
              >
                PRETTY
              </button>
            </div>
          </div>
          <div className="border" style={{ height: "47%" }}>
            <div
              className={`flex flex-col h-full ${
                outputToggleFullScreen ? "myModal" : ""
              }`}
            >
              <div className="border">
                <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
                  <div className="flex items-center flex-shrink-0 text-white mr-6">
                    {/* <img
                      src={FloppyDiskImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                    /> */}
                    <img
                      src={
                        outputToggleFullScreen
                          ? ExitFullScreenImage
                          : FullScreenImage
                      }
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      onClick={() => {
                        setOutputToggleFullScreen(!outputToggleFullScreen);
                      }}
                    />

                    {selected !== "tree" ? (
                      <CopyToClipboard
                        text={JSON.stringify(jsonPrettyReducer.item, null, 2)}
                        onCopy={() => {}}
                      >
                        <img
                          src={CopyToClipboardImage}
                          className="fill-current h-8 w-8 mr-2 p-1 cursor"
                        />
                      </CopyToClipboard>
                    ) : null}

                    <select
                      className="inline-block text-sm px-3 py-1 leading-none border rounded text-black border-white  hover:bg-white mt-4 lg:mt-0"
                      value={selected}
                      onChange={handleSelectOption}
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.text}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selected !== "tree" ? (
                    <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                      <div className="text-sm lg:flex-grow"></div>
                      <div>
                        <input
                          type="text"
                          className="inline-block text-sm px-3 py-1 leading-none border rounded text-black-500 border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0 mr-6"
                          placeholder="Search..."
                          onChange={handleValueSearch}
                        />

                        <a
                          href="#"
                          className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                          onClick={handleSearchClick}
                        >
                          Search
                        </a>
                      </div>
                    </div>
                  ) : null}
                </nav>
              </div>
              <div className="border grow text-output">
                <div className="p-3">
                  {jsonPrettyReducer.isError ? (
                    <pre style={{ color: "red" }}>
                      {jsonPrettyReducer.messageError}
                    </pre>
                  ) : (
                    <div>
                      {selected === "tree" ? (
                        <div>
                          {!inputToggleFullScreen ? (
                            <ReactJson
                              src={jsonPrettyReducer.item}
                              collapsed={3}
                            />
                          ) : null}
                        </div>
                      ) : (
                        <div>
                          <pre>
                            <Highlighter
                              searchWords={[clickSearch]}
                              autoEscape={true}
                              textToHighlight={JSON.stringify(
                                jsonPrettyReducer.item,
                                null,
                                2
                              )}
                            />
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonPretty;
