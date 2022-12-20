import React from "react";
import FloppyDisk from "../../assets/images/floppy-disk.png";
import FullScreen from "../../assets/images/full-screen.png";

import JsonPretty from "../JsonPretty/JsonPretty";


import "./Operator.css";
import { useSelector } from "react-redux";
import { jsonPrettySelector, inputJson } from './../../store/slice/JsonPrettySlice';
import { counterSelector, increase } from "../../store/slice/counterSlice";
import { useAppDispatch } from "../../store/store";

type Props = {
  isJsonPretty: boolean;
};


const Operator = (props: Props) => {
  const jsonPrettyReducer = useSelector(jsonPrettySelector);
  const counterReducer = useSelector(counterSelector);

  const dispatch = useAppDispatch();


  const handleValue = (event$: any) => { 
      console.log('$event -->', event$.target.value);
      try { 

      } catch (error) { 

      }
  }


  const handleClick = () => { 

  }



  return (
    <div>
      {/* <div className="flex flex-col">
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
            { counterReducer.counter }
            { props.isJsonPretty ? <JsonPretty isTreeView={false}/> : null}
          </div>
        </div>
      </div> */}

      <JsonPretty isTreeView={false} />

    </div>
  );
};

export default Operator;
