import React from "react";
import FloppyDisk from "../../assets/images/floppy-disk.png";
import FullScreen from "../../assets/images/full-screen.png";

import "./OperatorPage.css";

type Props = {};

const OperatorPage = (props: Props) => {
  return (
    <div>
      <div className="flex flex-col">
        <div className="h-screen">
          <div className=" bg-gray-900" style={{ height: "6%" }}>
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
          <div className="" style={{ height: "40%" }}>
            <textarea
              className="w-full h-full resize-none p-2"
              placeholder="Input here ..."
            ></textarea>
          </div>

          <div className="border" style={{ height: "7%" }}>
            Action Button
          </div>

          <div className="border bg-gray-900" style={{ height: "6%" }}>
            <div className=" bg-gray-900" style={{ height: "6%" }}>
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
          </div>
          <div className="border" style={{ height: "40%" }}>
            Output content
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorPage;
