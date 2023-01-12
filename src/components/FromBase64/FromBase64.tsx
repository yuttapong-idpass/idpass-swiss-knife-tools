import React, { useState } from "react";
import FloppyDiskImage from "../../assets/images/floppy-disk.png";
import FullScreenImage from "../../assets/images/full-screen.png";
import ExitFullScreenImage from "../../assets/images/exit-fullscreen.png";
import CopyToClipboardImage from "../../assets/images/copy-to-clipboard.png";
import Photo from "../../assets/images/photo.png";
import Upload from "../../assets/images/photo.png";
import "./FromBase64.css";
import { useSelector } from "react-redux";
import { base64Selector, base64 } from "../../store/slice/Base64Slice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppDispatch } from "../../store/store";

type Props = {};

interface IDescriptionImg {
  width: number;
  height: number;
}

const FromBase64 = (props: Props) => {
  const base64Reducer = useSelector(base64Selector);
  const dispatch = useAppDispatch();

  const options = [
    { value: "base64", text: "Image to base 64" },
    { value: "image", text: "Base64 to image" },
  ];

  let descriptionImg: IDescriptionImg = {
    width: 0,
    height: 0,
  };

  return (
    <div className="p-4 place-items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-12">
        <div className="col-span-12 h-screen">
          <nav className="flex items-center justify-between flex-wrap bg-gray-400 p-1">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
              {/* <img
                      src={FloppyDiskImage}
                      className="fill-current h-8 w-8 mr-2 p-1 cursor"
                      width={"50%"}
                      height={"50%"}
                    /> */}
              {/* <img className="fill-current h-8 w-8 mr-2 p-1 cursor" /> */}

              <div className="p-2">
                <h1 className="font-bold">
                  MODE :{" "}
                  <select className="inline-block text-sm px-3 py-2 leading-none border rounded text-black border-white  hover:bg-white mt-4 lg:mt-0">
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.text}
                      </option>
                    ))}
                  </select>
                </h1>
              </div>
            </div>
          </nav>
          <div className="p-2 h-24 m-6 border-dashed border-2 border-gray-300 rounded-2xl grow">
            <span className="grid place-items-center h-full">
              <button
                type="button"
                className="text-white bg-neutral-400 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2"
              >
                <img className="w-10 h-10 mr-2 -ml-1" src={Photo} />
                Upload image
              </button>
            </span>
          </div>
          <div className="m-6">
          <div className="col-span-6 p-2 border-dashed border-2 border-gray-300 rounded-2xl h-32">xxxx</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FromBase64;
