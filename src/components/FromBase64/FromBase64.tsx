import React, { useState } from "react";
import FloppyDiskImage from "../../assets/images/floppy-disk.png";
import FullScreenImage from "../../assets/images/full-screen.png";
import ExitFullScreenImage from "../../assets/images/exit-fullscreen.png";
import CopyToClipboardImage from "../../assets/images/copy-to-clipboard.png";
import Upload from '../../assets/images/photo.png';
import "./FromBase64.css";

type Props = {};

const FromBase64 = (props: Props) => {
  const options = [
    { value: "image", text: "to image" },
    { value: "string", text: "to string" },
  ];

  const [selected, setSelected] = useState(options[0].value);

  const handleSelectOption = ($event: any) => {
    setSelected($event.target.value);
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="h-screen">
          <div className="border" style={{ height: "47%" }}>
            <div className={`flex flex-col h-full`}>
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
                      src={FullScreenImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      onClick={() => {}}
                    />
                    <img 
                        src={Upload}
                        className="fill-current h-8 w-8 mr-2 p-1 cursor"
                        onClick={() => {}}
                    />
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
                </nav>
              </div>
              <div className="border grow">
                <textarea
                  id="inputText"
                  className="w-full h-full resize-none p-2"
                  placeholder="Input here ..."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="border" style={{ height: "6%" }}>
            <div className="flex flex-col items-center">
              <button className="justify-self-end bg-blue-500 hover:bg-blue-400 text-white font-bold mt-1 py-1 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                RESULT
              </button>
            </div>
          </div>
          <div className="border" style={{ height: "47%" }}>
            <div className={`flex flex-col h-full`}>
              <div className="border">
                <nav className="flex items-center justify-between flex-wrap bg-gray-900 p-1">
                  <div className="flex items-center flex-shrink-0 text-white mr-6">
                    {/* <img
                      src={FloppyDiskImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                    /> */}
                    <img
                      src={FullScreenImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      onClick={() => {}}
                    />
                  </div>
                </nav>
              </div>
              <div className="border grow text-output">
                <div className="p-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FromBase64;
