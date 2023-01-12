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
          <div className="p-2  m-6 border-dashed border-2 border-gray-300 rounded-2xl grow">
            <span className="grid place-items-center h-full">
              <button
                type="button"
                className="text-white bg-neutral-400 hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2"
              >
                <img className="w-10 h-10 mr-2 -ml-1" src={Photo} />
                Upload image
              </button>
              <div>
                <span className="text-lg">Preview image</span>
              </div>
              <div><img src={Photo} className="h-32 w-32" /></div>
            </span>
          </div>
          <div className="m-6">
            <div className="col-span-6 rounded-2xl h-32">
              <nav className="p-3">
                <div className="container flex flex-wrap items-center justify-between mx-auto">
                  <a href="#" className="flex items-center">
                  <span className="self-center text-xl font-bold whitespace-nowrap dark:text-gray-800 ">OUTPUT</span>
                  </a>
                  <button
                    data-collapse-toggle="navbar-solid-bg"
                    type="button"
                    className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-solid-bg"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                  <div
                    className="hidden w-full md:block md:w-auto"
                    id="navbar-solid-bg"
                  >
                    <ul className="flex flex-col mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                      <li>
                        <a
                          href="#"
                          className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white dark:bg-blue-600 md:dark:bg-transparent"
                          aria-current="page"
                        >
                          Home
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>

              <textarea
                id="message"
                rows={4}
                className="
                  block 
                  p-2.5 
                  w-full 
                  text-sm 
                  text-gray-900 
                  bg-gray-50 
                  rounded-lg 
                  border 
                  border-gray-300 
                  border-dashed border-2 border-gray-300
                  h-96"
                placeholder="Write your thoughts here..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FromBase64;
