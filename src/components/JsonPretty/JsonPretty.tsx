import React, { createRef, useEffect, useState } from "react";
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
// import ReactJson from "react-json-view";

import JsonEditorInput from "./JSONEditor/JsonEditorInput";
import JsonEditorOutput from "./JSONEditor/JsonEditorOutput";

type Props = {};

const JsonPretty = (props: Props) => {
  const jsonPrettyReducer = useSelector(jsonPrettySelector);
  const dispatch = useAppDispatch();

  let containerInput: any = createRef<HTMLElement>();
  let containerOutput: any = createRef<HTMLElement>();

  let [resultInput, setResultInput] = useState(null);
  let [resultOutput, setResultOutput] = useState(null);
  let [errorsJson, setErrorJson ] = useState(null);

  const handleJsonInput = (event: any) => {
    // let inputJson = JSON.parse(event);
    // setResultInput(inputJson);
    console.log('event', event);
  };

  const handleJsonOutput = (event: any) => {
    setResultOutput(event);
  };

  const handleError = ($event: any)  => { 
    console.log('error', $event)
  }


  // const onClickPretty = () => {
  //   const data: any = resultInput;
  //   try {
  //     dispatch(inputJson({ item: data, isError: false, messageError: "" }));
  //   } catch (error: any) {
  //     dispatch(inputJson({ item: {}, isError: true, messageError: error }));
  //   }
  // };

  return (
    // <div className="p-2">
    //   <div className="max-w-8xl mx-auto grid grid-cols-12">
    //     <div className="col-span-5 h-screen">
    //       <JsonEditorInput
    //         options={{}}
    //         json={jsonPrettyReducer.item}
    //         onChangeJSON={handleJsonInput}
    //       />
    //     </div>
    //     <div className="col-span-2">
    //       <div className="grid place-items-center h-screen">
    //         <div>
    //           <button
    //             type="button"
    //             className=" justify-self-end
    //             bg-blue-500
    //             hover:bg-blue-400
    //             text-white
    //             font-bold
    //             mt-1
    //             py-1
    //             px-4
    //             border-b-4
    //             border-blue-700
    //             hover:border-blue-500
    //             rounded
    //             w-full"
    //             onClick={onClickPretty}
    //           >
    //             Pretty
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="col-span-5">
    //       <JsonEditorOutput
    //         options={{}}
    //         json={jsonPrettyReducer.item}
    //         onChangeJSON={handleJsonOutput}
    //       />
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-row w-full gap-4">
      <div className="flex-initial w-full">
        <JsonEditorInput
          json={jsonPrettyReducer.item}
          onError={handleError}
          onChangeJSON={handleJsonInput}
          container={containerInput}
        />
      </div>
      <div className="flex-initial w-80">
        <div className="grid place-items-center h-[98vh]">
          <div>
            <a
              href="#_"
              className="inline-flex w-full items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-green-600 border rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              data-rounded="rounded-md"
              data-primary="blue-600"
              data-primary-reset="{}"
            >
              Pretty
            </a>
    
            <a
              href="#_"
              className="inline-flex mt-6 w-full items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-sky-600 border rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              data-rounded="rounded-md"
              data-primary="blue-600"
              data-primary-reset="{}"
            >
              Compare
            </a>
          </div>
        </div>
      </div>
      <div className="flex-initial w-full">
        <JsonEditorOutput
          options={{}}
          json={jsonPrettyReducer.item}
          onChangeJSON={handleJsonInput}
        />
      </div>
    </div>
  );
};

export default JsonPretty;
